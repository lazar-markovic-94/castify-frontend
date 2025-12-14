import { apiClient } from '../apiClient';
import { Conversation, Message } from '../../domain/entities';
import { CreateConversationRequest, SendMessageRequest } from '../../domain/dtos';

class MessagingRepository {
  async createConversation(request: CreateConversationRequest): Promise<Conversation> {
    const response = await apiClient.post<Conversation>('/api/conversations', request);
    return response.data;
  }

  async getConversations(): Promise<Conversation[]> {
    const response = await apiClient.get<Conversation[]>('/api/conversations');
    return response.data;
  }

  async getMessages(conversationId: string): Promise<Message[]> {
    const response = await apiClient.get<Message[]>(`/api/conversations/${conversationId}/messages`);
    return response.data;
  }

  async sendMessage(conversationId: string, request: SendMessageRequest): Promise<Message> {
    const response = await apiClient.post<Message>(
      `/api/conversations/${conversationId}/messages`,
      request
    );
    return response.data;
  }

  async markMessageAsRead(conversationId: string, messageId: string): Promise<void> {
    await apiClient.put(`/api/conversations/${conversationId}/messages/${messageId}/read`);
  }
}

export const messagingRepository = new MessagingRepository();
