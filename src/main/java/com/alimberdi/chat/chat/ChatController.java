package com.alimberdi.chat.chat;

import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Slf4j
@Controller
public class ChatController {

	@MessageMapping("/chat.sendMessage")
	@SendTo("/topic/public")
	public ChatMessage sendMessage(@Payload ChatMessage message) {
		return message;
	}

	@MessageMapping("/chat.addUser")
	@SendTo("/topic/public")
	public ChatMessage addUser(
			@Payload ChatMessage message,
			SimpMessageHeaderAccessor headerAccessor
	) {
		if (headerAccessor.getSessionAttributes() != null) {
			headerAccessor.getSessionAttributes().put("username", message.getSender());
		}

		log.info("user joined: {}", message.getSender());
		return message;
	}

}
