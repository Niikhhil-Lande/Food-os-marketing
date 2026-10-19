package in.foodos.security;

import in.foodos.config.AppProperties;
import in.foodos.domain.AdminUser;
import in.foodos.repository.AdminUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Creates the first admin account from configuration if the admin table is empty. */
@Component
public class AdminBootstrap implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminBootstrap.class);

    private final AdminUserRepository admins;
    private final PasswordEncoder encoder;
    private final AppProperties props;

    public AdminBootstrap(AdminUserRepository admins, PasswordEncoder encoder, AppProperties props) {
        this.admins = admins;
        this.encoder = encoder;
        this.props = props;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (admins.count() > 0) {
            return;
        }
        String email = props.getSecurity().getAdminEmail();
        String password = props.getSecurity().getAdminPassword();
        if (email == null || email.isBlank() || password == null || password.isBlank()) {
            log.warn("No admin exists and ADMIN_EMAIL / ADMIN_PASSWORD are not set; admin login is disabled.");
            return;
        }
        admins.save(new AdminUser(email.trim().toLowerCase(), encoder.encode(password)));
        log.info("Created initial admin account {}. Change the password before going live.", email);
    }
}
