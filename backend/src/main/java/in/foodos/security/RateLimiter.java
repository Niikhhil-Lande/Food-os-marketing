package in.foodos.security;

import in.foodos.exception.TooManyRequestsException;
import java.time.Duration;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.stereotype.Component;

/**
 * Small in-memory sliding-window limiter. Good enough for a single instance;
 * use a shared store (Redis, API gateway) if you run several replicas.
 */
@Component
public class RateLimiter {

    private final ConcurrentHashMap<String, Deque<Long>> hits = new ConcurrentHashMap<>();

    /** Records a hit and throws when the limit within the window would be exceeded. */
    public void check(String key, int maxHits, Duration window, String message) {
        Deque<Long> deque = deque(key);
        synchronized (deque) {
            prune(deque, window);
            if (deque.size() >= maxHits) {
                throw new TooManyRequestsException(message);
            }
            deque.addLast(System.currentTimeMillis());
        }
        cleanup(window);
    }

    /** Throws if the key is already at its limit, without recording a new hit. */
    public void assertBelowLimit(String key, int maxHits, Duration window, String message) {
        Deque<Long> deque = hits.get(key);
        if (deque == null) {
            return;
        }
        synchronized (deque) {
            prune(deque, window);
            if (deque.size() >= maxHits) {
                throw new TooManyRequestsException(message);
            }
        }
    }

    /** Records a hit without checking the limit (use with {@link #assertBelowLimit}). */
    public void record(String key, Duration window) {
        Deque<Long> deque = deque(key);
        synchronized (deque) {
            deque.addLast(System.currentTimeMillis());
        }
        cleanup(window);
    }

    /** Forgets a key, e.g. after a successful login. */
    public void reset(String key) {
        hits.remove(key);
    }

    private Deque<Long> deque(String key) {
        return hits.computeIfAbsent(key, k -> new ArrayDeque<>());
    }

    private static void prune(Deque<Long> deque, Duration window) {
        long cutoff = System.currentTimeMillis() - window.toMillis();
        while (!deque.isEmpty() && deque.peekFirst() < cutoff) {
            deque.pollFirst();
        }
    }

    /** Keeps memory bounded by dropping keys with no recent hits. */
    private void cleanup(Duration window) {
        if (hits.size() <= 10_000) {
            return;
        }
        long cutoff = System.currentTimeMillis() - window.toMillis();
        hits.entrySet().removeIf(e -> {
            synchronized (e.getValue()) {
                return e.getValue().isEmpty() || e.getValue().peekLast() < cutoff;
            }
        });
    }
}
