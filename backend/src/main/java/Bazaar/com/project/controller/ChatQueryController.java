package Bazaar.com.project.controller;

import lombok.RequiredArgsConstructor;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.ObjectMapper;

import Bazaar.com.project.model.ChatMessage.ChatMessageDto;
import Bazaar.com.project.model.ChatMessage.Message;
import Bazaar.com.project.model.ChatMessage.MessageType;
import Bazaar.com.project.repository.MessageRepository;
import Bazaar.com.project.service.ConversationService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chat")
public class ChatQueryController {
    private final MessageRepository msgRepo;
    private final ConversationService svc;

    @GetMapping("/conversations/{id}/messages")
    public List<ChatMessageDto> last50(@PathVariable UUID id) {
        List<Message> rows = msgRepo.findTop50ByConversationIdOrderByCreatedAtDesc(id);
        Collections.reverse(rows);
        return rows.stream().map(m -> ChatMessageDto.builder()
                .id(m.getId())
                .clientMsgId(m.getClientMsgId())
                .conversationId(m.getConversationId())
                .senderId(m.getSenderId())
                .recipientId(m.getRecipientId())
                .content(m.getContent())
                .type(MessageType.CHAT)
                .timeStamp(m.getCreatedAt())
                .build()).collect(Collectors.toList());
    }

    @PostMapping("/conversations/find-or-create")
    public Map<String, UUID> findOrCreate(@RequestBody Map<String, String> body,
            ObjectMapper om) {
        UUID u1 = UUID.fromString(body.get("user1"));
        UUID u2 = UUID.fromString(body.get("user2"));
        UUID id = svc.findOrCreate(u1, u2);
        return Map.of("conversationId", id);
    }
}
