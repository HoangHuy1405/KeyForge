package Bazaar.com.project.config.WebSocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    @Autowired
    private WsAuthChannelInterceptor interceptor;

    @Override
    public void registerStompEndpoints(@NonNull StompEndpointRegistry registry) {
        registry.addEndpoint("/ws")
                .setAllowedOrigins("http://localhost:5173")
                .withSockJS();
    }

    @Override
    public void configureMessageBroker(@NonNull MessageBrokerRegistry registry) {
        registry
                .setApplicationDestinationPrefixes("/app")
                .setUserDestinationPrefix("/user")
                .enableStompBrokerRelay("/topic", "/queue", "/exchange", "/amq/queue")
                .setRelayHost("localhost")
                .setRelayPort(61613)
                .setClientLogin("myuser")
                .setClientPasscode("mypass")
                .setSystemLogin("myuser")
                .setSystemPasscode("mypass");
    }

    @Override
    public void configureClientInboundChannel(@NonNull ChannelRegistration registration) {
        registration.interceptors(interceptor);
    }
}
