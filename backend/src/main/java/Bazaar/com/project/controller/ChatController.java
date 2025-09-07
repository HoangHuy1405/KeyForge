package Bazaar.com.project.controller;

import java.security.Principal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;

import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
// import org.springframework.messaging.handler.annotation.SendTo;
// import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import Bazaar.com.project.model.ChatMessage.ChatMessageDto;
import Bazaar.com.project.service.ConversationService;
import lombok.RequiredArgsConstructor;

@Controller
@RequiredArgsConstructor
public class ChatController {
        private final SimpMessagingTemplate template;
        private final ConversationService conversationService;

        @MessageMapping("/chat/{conversationId}/send")
        public void send(@DestinationVariable UUID conversationId,
                        @Payload ChatMessageDto inbound,
                        Principal principal) {
                UUID senderId = UUID.fromString(principal.getName());
                UUID inboundRecipient = inbound.getRecipientId();

                // 1) Security: validate participants & normalize payload
                UUID recipientId = conversationService.ensureAndGetRecipient(conversationId, senderId,
                                inboundRecipient);

                // 2) Persist (returns canonical saved message)
                ChatMessageDto saved = conversationService.persistMessage(
                                conversationId,
                                senderId,
                                recipientId,
                                inbound.getClientMsgId(), // still String, unless you changed to UUID
                                inbound.getContent());

                // 3) Private fan-out to both ends via /user prefix
                String dest = "/queue/chat.conv." + conversationId;
                template.convertAndSendToUser(recipientId.toString(), dest, saved);
                template.convertAndSendToUser(senderId.toString(), dest, saved);
        }

        @MessageMapping("/chat/{conversationId}/read")
        public void read(@DestinationVariable UUID conversationId, // now UUID
                        @Payload Map<String, String> payload,
                        Principal principal) {

                UUID userId = UUID.fromString(principal.getName());
                UUID lastMsgId = UUID.fromString(payload.get("lastMsgId"));

                UUID other = conversationService.markReadAndGetOther(conversationId, userId, lastMsgId);

                var receipt = Map.of(
                                "type", "READ",
                                "conversationId", conversationId.toString(),
                                "userId", userId.toString(),
                                "lastMsgId", lastMsgId.toString(),
                                "time", Instant.now().toString());

                template.convertAndSendToUser(other.toString(), "/queue/chat.conv." + conversationId, receipt);
        }
}
