import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { messagingRepository } from '../data/repositories';
import { CreateConversationRequest, SendMessageRequest } from '../domain/dtos';

export const useConversations = () => {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: () => messagingRepository.getConversations(),
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
    mutationFn: (request: SendMessageRequest) =>
      messagingRepository.sendMessage(conversationId, request),
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
