package Bazaar.com.project.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import io.swagger.v3.oas.models.servers.Server;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

/**
 * OpenAPI 3.0 (Swagger) configuration for KeyForge API.
 */
@Configuration
public class OpenAPIConfig {

        @Value("${server.port:8080}")
        private String serverPort;

        @Value("${server.servlet.context-path:}")
        private String contextPath;

        @Bean
        public OpenAPI keyForgeOpenAPI() {
                // JWT Bearer Authentication
                SecurityScheme securityScheme = new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")
                                .name("JWT Authentication");

                return new OpenAPI()
                                .info(new Info()
                                                .title("KeyForge API")
                                                .description("""
                                                                **KeyForge** - A B2C Vertical Marketplace for Mechanical Keyboards.

                                                                This API provides endpoints for:
                                                                - **Products**: CRUD operations for keyboard kits, switches, keycaps, etc.
                                                                - **Authentication**: Login, register, token refresh
                                                                - **Users**: Profile management

                                                                ## Product Categories
                                                                - `KEYBOARD_KIT` - Full keyboard build kits
                                                                - `SWITCH` - Mechanical switches (Linear, Tactile, Clicky)
                                                                - `KEYCAP` - Keycap sets
                                                                - `STABILIZER`, `PCB`, `PLATE`, `CASE`, `ACCESSORY`

                                                                ## Stock Status (Group Buy Lifecycle)
                                                                - `IN_STOCK` - Ready to ship
                                                                - `PRE_ORDER` - Production phase
                                                                - `GROUP_BUY` - Live group buy
                                                                - `INTEREST_CHECK` - Gauging demand
                                                                """)
                                                .version("1.0.0")
                                                .contact(new Contact()
                                                                .name("KeyForge Team")
                                                                .email("support@keyforge.com"))
                                                .license(new License()
                                                                .name("MIT License")
                                                                .url("https://opensource.org/licenses/MIT")))
                                .servers(List.of(
                                                new Server()
                                                                .url("http://localhost:" + serverPort + contextPath)
                                                                .description("Local Development Server")))
                                .components(new Components()
                                                .addSecuritySchemes("bearerAuth", securityScheme))
                                .addSecurityItem(new SecurityRequirement().addList("bearerAuth"));
        }
}
