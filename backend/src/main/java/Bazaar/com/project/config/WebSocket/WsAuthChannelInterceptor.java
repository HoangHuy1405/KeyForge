package Bazaar.com.project.config.WebSocket;

import java.util.List;

import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Component;

import Bazaar.com.project.util.SecurityUtil;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WsAuthChannelInterceptor implements ChannelInterceptor {
    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        if (accessor != null && StompCommand.CONNECT.equals(accessor.getCommand())) {
            String bearer = accessor.getFirstNativeHeader("Authorization"); // "Bearer xxx"
            if (bearer != null && bearer.startsWith("Bearer ")) {
                // String token = bearer.substring(7);

                // ✅ parse token and extract userId
                String userId = SecurityUtil.getCurrentUserID().isPresent() ? SecurityUtil.getCurrentUserID().get()
                        : null;

                // make it the Principal
                accessor.setUser(new UsernamePasswordAuthenticationToken(userId, null, List.of()));
            }
        }
        return message;
    }
}
