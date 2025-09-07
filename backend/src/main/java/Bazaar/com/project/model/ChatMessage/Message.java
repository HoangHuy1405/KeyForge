package Bazaar.com.project.model.ChatMessage;

import java.time.Instant;
import java.util.UUID;

import Bazaar.com.project.model.BaseEntity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "messages")
@Getter
@Setter
public class Message extends BaseEntity {
    private UUID conversationId;
    private UUID senderId;
    private UUID recipientId;
    private UUID clientMsgId;
    private Instant readAt;
    @Column(columnDefinition = "text")
    private String content;
}
