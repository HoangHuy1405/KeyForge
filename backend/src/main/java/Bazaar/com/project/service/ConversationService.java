package Bazaar.com.project.service;

import java.time.Instant;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import Bazaar.com.project.model.ChatMessage.ChatMessageDto;
import Bazaar.com.project.model.ChatMessage.Conversation;
import Bazaar.com.project.model.ChatMessage.Message;
import Bazaar.com.project.model.ChatMessage.MessageType;
import Bazaar.com.project.repository.ConversationRepository;
import Bazaar.com.project.repository.MessageRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ConversationService {

    private final ConversationRepository convRepo;
    private final MessageRepository msgRepo;

    /**
     * Ensure the sender belongs to the conversation and return the other
     * participant's UUID.
     *
     * @param conversationId     UUID of the conversation.
     * @param senderId           UUID of the sender (from Principal).
     * @param inboundRecipientId Optional UUID provided by the client
     *                           (sanity-checked if present).
     * @return recipient (the other participant in the conversation).
     * @throws ResponseStatusException 403 if the sender is not a participant,
     *                                 404 if the conversation doesn't exist,
     *                                 400 if inboundRecipientId conflicts with the
     *                                 actual recipient.
     */
    public UUID ensureAndGetRecipient(UUID conversationId, UUID senderId, UUID inboundRecipientId) {
        Conversation c = convRepo.findById(conversationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found"));

        // Check membership and pick the other user
        UUID other;
        if (senderId.equals(c.getUserAId()))
            other = c.getUserBId();
        else if (senderId.equals(c.getUserBId()))
            other = c.getUserAId();
        else
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Not a participant");

        // Optional safety check
        if (inboundRecipientId != null && !inboundRecipientId.equals(other)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid recipient");
        }

        return other;
    }

    /**
     * Persist a message with idempotency (clientMsgId) and return a DTO for
     * broadcasting.
     *
     * Idempotency rule:
     * - If the same (conversationId, clientMsgId, senderId) arrives again, return
     * the existing message.
     *
     * @param convId      conversation UUID
     * @param senderId    sender UUID
     * @param recipientId recipient UUID
     * @param clientMsgId optional client-generated id (string/uuid-as-string)
     * @param content     message text
     * @return ChatMessageDto canonical saved message
     */
    public ChatMessageDto persistMessage(UUID convId, UUID senderId, UUID recipientId, UUID clientMsgId,
            String content) {

        UUID clientUuid = null;
        if (clientMsgId != null) {
            Optional<Message> existing = msgRepo
                    .findByConversationIdAndClientMsgIdAndSenderId(convId, clientUuid, senderId);
            if (existing.isPresent()) {
                return toDto(existing.get());
            }
        }

        Message m = new Message();
        m.setConversationId(convId);
        m.setSenderId(senderId);
        m.setRecipientId(recipientId);
        m.setClientMsgId(clientUuid);
        m.setContent(content);
        m.setCreatedAt(Instant.now());

        msgRepo.save(m);
        return toDto(m);
    }

    /**
     * Mark messages as read (minimal version: mark the specific lastMsgId if it
     * belongs to user)
     * and return the other participant's UUID (useful to notify them).
     *
     * @param convId    conversation UUID
     * @param userId    UUID of the user marking read
     * @param lastMsgId message UUID up to which the client considers read (minimal:
     *                  exact id)
     * @return other participant's UUID
     */
    public UUID markReadAndGetOther(UUID convId, UUID userId, UUID lastMsgId) {
        Conversation c = convRepo.findById(convId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conversation not found"));

        UUID other = userId.equals(c.getUserAId()) ? c.getUserBId() : c.getUserAId();

        // Minimal implementation: mark this single message read if it was addressed to
        // 'userId'.
        msgRepo.findById(lastMsgId).ifPresent(msg -> {
            if (Objects.equals(msg.getRecipientId(), userId)) {
                msg.setReadAt(Instant.now());
                msgRepo.save(msg);
            }
        });

        return other;
    }

    // find conversation (if not found - init a new conversation between two user)
    public UUID findOrCreate(UUID user1, UUID user2) {
        if (user1.equals(user2))
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "self chat not allowed");

        return convRepo.findByParticipants(user1, user2)
                .map(Conversation::getId)
                .orElseGet(() -> {
                    Conversation c = new Conversation();
                    // store normalized ordering (min, max) to avoid duplicates
                    if (user1.compareTo(user2) < 0) {
                        c.setUserAId(user1);
                        c.setUserBId(user2);
                    } else {
                        c.setUserAId(user2);
                        c.setUserBId(user1);
                    }
                    c.setCreatedAt(Instant.now());
                    convRepo.save(c);
                    return c.getId();
                });
    }

    // --- mapping ---

    private ChatMessageDto toDto(Message m) {
        return ChatMessageDto.builder()
                .id(m.getId())
                .clientMsgId(m.getClientMsgId())
                .conversationId(m.getConversationId())
                .senderId(m.getSenderId())
                .recipientId(m.getRecipientId())
                .content(m.getContent())
                .type(MessageType.CHAT)
                .timeStamp(m.getCreatedAt())
                .build();
    }
}
