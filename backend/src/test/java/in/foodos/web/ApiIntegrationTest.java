package in.foodos.web;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = {
        "spring.datasource.url=jdbc:h2:mem:foodos;DB_CLOSE_DELAY=-1",
        "spring.datasource.username=sa",
        "spring.datasource.password=",
        "spring.datasource.driver-class-name=org.h2.Driver",
        "spring.jpa.hibernate.ddl-auto=create-drop",
        "foodos.notifications.enabled=false",
        "foodos.security.admin-email=admin@test.in",
        "foodos.security.admin-password=Secret123!",
        "foodos.security.jwt-secret=test-secret-test-secret-test-secret-123"
})
@AutoConfigureMockMvc
class ApiIntegrationTest {

    @Autowired MockMvc mvc;
    @Autowired ObjectMapper json;

    @Test
    void demoBookingIsStoredAndVisibleToAdminOnly() throws Exception {
        String body = """
                {"name":"Rahul","whatsapp":"+91 98765 43210","restaurantName":"Spice Route",
                 "businessType":"QSR","outletCount":"2–5","currentPos":"Petpooja"}""";

        mvc.perform(post("/api/demo-bookings").contentType(MediaType.APPLICATION_JSON).content(body))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists());

        // No token -> rejected
        mvc.perform(get("/api/admin/leads")).andExpect(status().isUnauthorized());

        String token = login("admin@test.in", "Secret123!");
        // Filter by type so enquiries created by other tests cannot affect the result.
        mvc.perform(get("/api/admin/leads?type=DEMO").header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.items[0].type", is("DEMO")))
                .andExpect(jsonPath("$.items[0].restaurantName", is("Spice Route")))
                .andExpect(jsonPath("$.items[0].status", is("NEW")));
    }

    @Test
    void adminCanUpdateStatusAndDelete() throws Exception {
        String created = mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON).content("""
                {"email":"owner@cafe.in","businessType":"Bakery","outletCount":"1","message":"Pricing?"}"""))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString();
        long id = json.readTree(created).get("id").asLong();
        String token = login("admin@test.in", "Secret123!");

        mvc.perform(patch("/api/admin/leads/" + id + "/status").header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON).content("{\"status\":\"CONTACTED\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("CONTACTED")));

        mvc.perform(delete("/api/admin/leads/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isNoContent());
        mvc.perform(delete("/api/admin/leads/" + id).header("Authorization", "Bearer " + token))
                .andExpect(status().isNotFound());
    }

    @Test
    void rejectsLeadWithoutContactMethodOrRequiredFields() throws Exception {
        mvc.perform(post("/api/demo-bookings").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"businessType\":\"QSR\",\"outletCount\":\"1\"}"))
                .andExpect(status().isBadRequest());

        mvc.perform(post("/api/contact").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"a@b.in\"}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fields.businessType").exists());
    }

    @Test
    void loginRejectsWrongPassword() throws Exception {
        mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"admin@test.in\",\"password\":\"nope\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void savingsEndpointIsPublic() throws Exception {
        mvc.perform(post("/api/savings/calculate").contentType(MediaType.APPLICATION_JSON).content("""
                {"provider":"Petpooja","outlets":1,"annualPosCostPerOutlet":30000,"otherSoftwareCostsPerYear":0}"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.annualSavings", is(18012)));
    }

    @Test
    void unknownRoutesAreDenied() throws Exception {
        mvc.perform(get("/api/anything")).andExpect(status().isUnauthorized());
        mvc.perform(get("/actuator/health")).andExpect(status().isOk());
    }

    private String login(String email, String password) throws Exception {
        String res = mvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content("{\"email\":\"" + email + "\",\"password\":\"" + password + "\"}"))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString();
        JsonNode node = json.readTree(res);
        return node.get("token").asText();
    }
}
