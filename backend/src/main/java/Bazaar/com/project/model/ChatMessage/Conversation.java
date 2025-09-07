package Bazaar.com.project.model.ChatMessage;

import java.util.UUID;

import Bazaar.com.project.model.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "conversations")
@Getter
@Setter
public class Conversation extends BaseEntity {
    private UUID userAId;
    private UUID userBId;
}
