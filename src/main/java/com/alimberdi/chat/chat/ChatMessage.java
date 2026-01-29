package com.alimberdi.chat.chat;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ChatMessage {
	private String sender;
	private String content;
	private MessageType type;
}
