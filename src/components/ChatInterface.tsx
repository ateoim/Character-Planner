import React, { useState, useRef, useEffect } from "react";
import styled from "styled-components";
import { getAIAdvice } from "../services/openai";
import { Character } from "../types/types";

interface Props {
  character: Character;
  onAddTask: (title: string, description: string, dueDate: Date) => void;
}

const MessageContainer = styled.div`
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 20px;
`;

const SendButton = styled.button`
  padding: 12px 24px;
  border: none;
  border-radius: 12px;
  background: #621b1b;
  color: ${(props) => props.theme.text};
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #8b2626;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 38, 38, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const ChatContainer = styled.div`
  margin-top: 2rem;
  background: ${(props) => props.theme.secondary}11;
  border-radius: 24px;
  padding: 24px;
  backdrop-filter: blur(12px);

  @media (max-width: 768px) {
    padding: 16px;
    margin-top: 1rem;

    ${MessageContainer} {
      max-height: 200px;
    }

    ${InputContainer} {
      flex-direction: column;
      gap: 8px;
    }

    ${SendButton} {
      width: 100%;
    }
  }
`;

const Message = styled.div<{ isUser?: boolean }>`
  margin: 10px 0;
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 80%;
  ${(props) =>
    props.isUser
      ? `
    margin-left: auto;
    background: #4a1414;
    color: ${props.theme.text};
    border: 1px solid #621b1b;
  `
      : `
    margin-right: auto;
    background: #2c0a0a;
    color: ${props.theme.text};
    border: 1px solid #4a1414;
  `}
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #621b1b;
  border-radius: 12px;
  background: #2c0a0a;
  color: ${(props) => props.theme.text};
  font-size: 1rem;

  &::placeholder {
    color: ${(props) => props.theme.text}88;
  }

  &:focus {
    outline: none;
    border-color: #8b2626;
    box-shadow: 0 0 0 2px rgba(139, 38, 38, 0.2);
  }
`;

interface Message {
  content: string;
  isUser: boolean;
}

const ChatInterface: React.FC<Props> = ({ character, onAddTask }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { content: input, isUser: true }]);

    try {
      const response = await getAIAdvice(character.id, input);

      if (typeof response === "object" && response.type === "task") {
        // Parse time
        const timeStr = response.time;
        const [hours, minutes] = timeStr
          .match(/(\d+):(\d+)/)
          ?.slice(1)
          .map(Number) || [0, 0];
        const isPM = timeStr.toLowerCase().includes("pm");

        const dueDate = new Date();
        dueDate.setHours(
          isPM && hours !== 12 ? hours + 12 : hours,
          minutes,
          0,
          0
        );

        // Create task
        onAddTask(response.task, response.comment, dueDate);

        // Add AI's response to chat
        const messageContent = `${response.comment}\nI've added "${
          response.task
        }" to your tasks for ${dueDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}.`;
        setMessages((prev) => [
          ...prev,
          { content: messageContent, isUser: false },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          { content: String(response), isUser: false },
        ]);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
    }

    setInput("");
  };

  return (
    <ChatContainer>
      <MessageContainer>
        {messages.map((msg, index) => (
          <Message key={index} isUser={msg.isUser}>
            {msg.content}
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessageContainer>

      <form onSubmit={handleSubmit}>
        <InputContainer>
          <ChatInput
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Chat with ${character.name}...`}
          />
          <SendButton type="submit">Send</SendButton>
        </InputContainer>
      </form>
    </ChatContainer>
  );
};

export default ChatInterface;
