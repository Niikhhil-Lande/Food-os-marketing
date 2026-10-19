package in.foodos.web;

import in.foodos.domain.AdminUser;
import in.foodos.dto.AuthDtos.LoginRequest;
import in.foodos.dto.AuthDtos.LoginResponse;
import in.foodos.repository.AdminUserRepository;
import in.foodos.security.JwtService;
import in.foodos.security.RateLimiter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.Duration;
import java.util.Optional;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final int MAX_FAILED_LOGINS = 5;
    private static final Duration LOGIN_WINDOW = Duration.ofMinutes(15);

    private final AdminUserRepository admins;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final RateLimiter limiter;
    /** Real BCrypt hash used so unknown emails cost the same time as wrong passwords. */
    private final String dummyHash;

    public AuthController(AdminUserRepository admins, PasswordEncoder encoder, JwtService jwt, RateLimiter limiter) {
        this.admins = admins;
        this.encoder = encoder;
        this.jwt = jwt;
        this.limiter = limiter;
        this.dummyHash = encoder.encode("not-a-real-password");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest req, HttpServletRequest http) {
        String key = "login:" + http.getRemoteAddr() + ":" + req.email().trim().toLowerCase();
        // Locked out? Refuse before checking the password, so a correct guess cannot slip through.
        limiter.assertBelowLimit(key, MAX_FAILED_LOGINS, LOGIN_WINDOW,
                "Too many failed attempts. Try again in 15 minutes.");

        Optional<AdminUser> user = admins.findByEmailIgnoreCase(req.email().trim());
        boolean ok = encoder.matches(req.password(), user.map(AdminUser::getPasswordHash).orElse(dummyHash))
                && user.isPresent();
        if (!ok) {
            limiter.record(key, LOGIN_WINDOW);
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(java.util.Map.of(
                    "status", 401, "message", "Incorrect email or password."));
        }
        limiter.reset(key);
        String email = user.get().getEmail();
        return ResponseEntity.ok(new LoginResponse(jwt.issue(email), email, jwt.expirySeconds()));
    }
}
