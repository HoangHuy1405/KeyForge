package Bazaar.com.project.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import Bazaar.com.project.model.ChatMessage.Conversation;

public interface ConversationRepository extends JpaRepository<Conversation, UUID> {
    // unordered pair lookup
    Optional<Conversation> findByUserAIdAndUserBId(UUID a, UUID b);

    Optional<Conversation> findByUserBIdAndUserAId(UUID a, UUID b);

    default Optional<Conversation> findByParticipants(UUID u1, UUID u2) {
        return findByUserAIdAndUserBId(u1, u2).or(() -> findByUserBIdAndUserAId(u1, u2));
    }
}
