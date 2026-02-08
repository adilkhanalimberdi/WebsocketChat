package com.alimberdi.chat.config;

import com.alimberdi.chat.chat.ChatMessage;
import com.alimberdi.chat.chat.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Slf4j
@Component
@RequiredArgsConstructor
public class WebSocketEventListener {

	private final SimpMessagingTemplate messagingTemplate;

	@EventListener
	public void onDisconnected(SessionDisconnectEvent event) {
		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
		String username = null;

		if (headerAccessor.getSessionAttributes() != null) {
			username = (String) headerAccessor.getSessionAttributes().get("username");
		}

		if (username != null) {
			log.info("user disconnected: {}", username);

			ChatMessage chatMessage = ChatMessage.builder()
					.type(MessageType.LEAVE)
					.sender(username)
					.build();

			messagingTemplate.convertAndSend("/topic/public", chatMessage);
		}
	}

//	@EventListener
//	public void onConnected(SessionConnectedEvent event) {
//		StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
//		String username = null;
//
//		if (headerAccessor.getSessionAttributes() != null) {
//			username = (String) headerAccessor.getSessionAttributes().get("username");
//		}
//
//		if (username != null) {
//			log.info("user connected: {}", username);
//
//			ChatMessage chatMessage =
//		}
//	}

}
