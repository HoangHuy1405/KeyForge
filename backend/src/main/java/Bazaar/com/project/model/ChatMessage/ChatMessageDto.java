package Bazaar.com.project.model.ChatMessage;

import java.time.Instant;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessageDto {
    private UUID id; // server-generated
    private UUID clientMsgId; // from client for idempotency
    private UUID conversationId; // required
    private UUID senderId; // set by server from Principal
    private UUID recipientId; // other participant
    private String content;
    private MessageType type; // CHAT, READ, TYPING, LEAVE...
    private Instant timeStamp;
}
