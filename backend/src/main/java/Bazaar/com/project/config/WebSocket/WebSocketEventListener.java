package Bazaar.com.project.config.WebSocket;

import java.time.Instant;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import Bazaar.com.project.model.ChatMessage.ChatMessage;
import Bazaar.com.project.model.ChatMessage.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Component
@RequiredArgsConstructor
@Slf4j // used for logging (log info when user leave the chat)
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messageTemplate;

    // event listener (disconnect: after a user disconnect => inform all the user
    // from that session)
    @EventListener
    public void handleWebSocketDisconnectListener(
            SessionDisconnectEvent event) { // listen on this disconnect event
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        if (username != null) {
            log.info("User disconnected : {}", username);
            var chatMessage = ChatMessage.builder()
                    .type(MessageType.LEAVE)
                    .sender(username)
                    .timeStamp(Instant.now())
                    .build();
            messageTemplate.convertAndSend("/topic/public", chatMessage);
        }
    }
}
