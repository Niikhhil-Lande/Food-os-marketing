package in.foodos.config;

import java.util.Arrays;
import java.util.List;
import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "foodos")
public class AppProperties {

    private String corsAllowedOrigins = "http://localhost:5173";
    private final Security security = new Security();
    private final Notifications notifications = new Notifications();
    private final Pricing pricing = new Pricing();

    public List<String> corsOriginList() {
        return Arrays.stream(corsAllowedOrigins.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }

    public String getCorsAllowedOrigins() { return corsAllowedOrigins; }
    public void setCorsAllowedOrigins(String corsAllowedOrigins) { this.corsAllowedOrigins = corsAllowedOrigins; }
    public Security getSecurity() { return security; }
    public Notifications getNotifications() { return notifications; }
    public Pricing getPricing() { return pricing; }

    public static class Security {
        private String jwtSecret;
        private long jwtExpiryMinutes = 480;
        private String adminEmail;
        private String adminPassword;

        public String getJwtSecret() { return jwtSecret; }
        public void setJwtSecret(String jwtSecret) { this.jwtSecret = jwtSecret; }
        public long getJwtExpiryMinutes() { return jwtExpiryMinutes; }
        public void setJwtExpiryMinutes(long jwtExpiryMinutes) { this.jwtExpiryMinutes = jwtExpiryMinutes; }
        public String getAdminEmail() { return adminEmail; }
        public void setAdminEmail(String adminEmail) { this.adminEmail = adminEmail; }
        public String getAdminPassword() { return adminPassword; }
        public void setAdminPassword(String adminPassword) { this.adminPassword = adminPassword; }
    }

    public static class Notifications {
        private boolean enabled = true;
        private String from = "no-reply@foodos.in";
        private String salesTeamTo = "hello@foodos.in";

        public boolean isEnabled() { return enabled; }
        public void setEnabled(boolean enabled) { this.enabled = enabled; }
        public String getFrom() { return from; }
        public void setFrom(String from) { this.from = from; }
        public String getSalesTeamTo() { return salesTeamTo; }
        public void setSalesTeamTo(String salesTeamTo) { this.salesTeamTo = salesTeamTo; }
    }

    public static class Pricing {
        private int foodosMonthlyFee = 999;
        private int otherSoftwareOffsetPercent = 50;

        public int getFoodosMonthlyFee() { return foodosMonthlyFee; }
        public void setFoodosMonthlyFee(int foodosMonthlyFee) { this.foodosMonthlyFee = foodosMonthlyFee; }
        public int getOtherSoftwareOffsetPercent() { return otherSoftwareOffsetPercent; }
        public void setOtherSoftwareOffsetPercent(int otherSoftwareOffsetPercent) { this.otherSoftwareOffsetPercent = otherSoftwareOffsetPercent; }
    }
}
