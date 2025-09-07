package Bazaar.com.project.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import Bazaar.com.project.model.ChatMessage.Message;

public interface MessageRepository extends JpaRepository<Message, UUID> {
    List<Message> findTop50ByConversationIdOrderByCreatedAtDesc(UUID conversationId);

    Optional<Message> findByConversationIdAndClientMsgIdAndSenderId(UUID convId, UUID clientMsgId, UUID senderId);
}
