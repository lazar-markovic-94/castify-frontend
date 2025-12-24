/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagingRepository } from '../data/repositories';
import { CreateConversationRequest, SendMessageRequest } from '../domain/dtos';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagingRepository.getConversations(),
    refetchInterval: 10000, // Poll every 10 seconds for new conversations and unread counts
  });
};

export const useMessages = (conversationId: string | undefined) => {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => messagingRepository.getMessages(conversationId!),
    enabled: !!conversationId,
    refetchInterval: 5000, // Poll every 5 seconds for new messages
  });
};

export const useCreateConversation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: CreateConversationRequest) =>
      messagingRepository.createConversation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useSendMessage = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: SendMessageRequest) => {
      console.log('=== SENDING MESSAGE ===');
      console.log('Conversation ID:', conversationId);
      console.log('Request payload:', JSON.stringify(request, null, 2));
      console.log('URL:', `/api/conversations/${conversationId}/messages`);
      console.log('=====================');
      return messagingRepository.sendMessage(conversationId, request);
    },
    // Optimistic update for instant UI feedback
    onMutate: async (newMessage) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['messages', conversationId] });

      // Snapshot the previous value
      const previousMessages = queryClient.getQueryData(['messages', conversationId]);

      // Optimistically update to the new value
      queryClient.setQueryData(['messages', conversationId], (old: any) => {
        if (!old) return old;
        return [
          ...old,
          {
            messageId: `temp-${Date.now()}`,
            content: newMessage.content,
            senderUserId: 'current-user',
            sentAt: new Date().toISOString(),
            isRead: false,
          },
        ];
      });

      // Return context for rollback
      return { previousMessages };
    },
    // On error, rollback to previous state
    onError: (err: any, newMessage, context: any) => {
      console.error('Failed to send message:', err);
      console.error('Error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      if (context?.previousMessages) {
        queryClient.setQueryData(['messages', conversationId], context.previousMessages);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};

export const useMarkMessageAsRead = (conversationId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) =>
      messagingRepository.markMessageAsRead(conversationId, messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
  });
};
