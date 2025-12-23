import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useConversations, useMessages, useSendMessage, useMarkMessageAsRead } from '../../core/application/useMessaging';
import { MainLayout } from '../../app/layouts/MainLayout';
import { Card, CardContent } from '../../shared/components/ui/Card';
import { Button } from '../../shared/components/ui/Button';
import { Input } from '../../shared/components/ui/Input';
import { useCurrentUser } from '../../core/application/useAuth';
import { formatRelativeTime } from '../../shared/lib/utils';
import { useTalentProfileByUserId } from '../../core/application/useTalents';
import { useClientOrgByUserId } from '../../core/application/useClientOrg';
import { MessageSkeleton, ConversationSkeleton } from '../../shared/components/ui/SkeletonLoader';
import { messageEnter, listItem } from '../../shared/lib/animations';
import { useToast } from '../../shared/contexts/ToastContext';

// Component to fetch and display participant name
const ParticipantName = ({ conversation, currentUser }: { conversation: any; currentUser: any }) => {
  const isTalent = currentUser.userId === conversation.talentUserId;
  const otherUserId = isTalent ? conversation.clientUserId : conversation.talentUserId;

  const { data: talentProfile } = useTalentProfileByUserId(
    isTalent ? undefined : otherUserId
  );
  const { data: clientOrg } = useClientOrgByUserId(
    isTalent ? otherUserId : undefined
  );

  if (isTalent && clientOrg) {
    return <>{clientOrg.orgName}</>;
  }

  if (!isTalent && talentProfile) {
    return <>{talentProfile.fullName}</>;
  }

  return <>Loading...</>;
};

export const MessagesPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const { showError } = useToast();

  const { data: user } = useCurrentUser();
  const { data: conversations, isLoading: conversationsLoading } = useConversations();
  const { data: messages, isLoading: messagesLoading } = useMessages(
    selectedConversationId || undefined
  );
  const sendMessage = useSendMessage(selectedConversationId || '');
  const markAsRead = useMarkMessageAsRead(selectedConversationId || '');

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission);
        });
      }
    }
  }, []);

  // Auto-select conversation from URL query parameter
  useEffect(() => {
    const conversationId = searchParams.get('conversationId');
    if (conversationId) {
      setSelectedConversationId(conversationId);
    }
  }, [searchParams]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mark messages as read and show notifications
  useEffect(() => {
    if (!messages || messages.length === 0 || !user || !selectedConversationId) return;

    const unreadMessages = messages.filter(m =>
      !m.isRead &&
      m.senderUserId !== user.userId &&
      !m.messageId.startsWith('temp-') // Skip temporary optimistic messages
    );

    if (unreadMessages.length === 0) return;

    // Mark all unread messages as read (silently, don't trigger revalidation immediately)
    unreadMessages.forEach(message => {
      markAsRead.mutate(message.messageId, {
        onSuccess: () => {
          // Success - message marked as read
        },
        onError: (error) => {
          console.error('Failed to mark message as read:', error);
        }
      });
    });

    // Show notification for the last unread message if allowed
    if (notificationPermission === 'granted') {
      const lastMessage = unreadMessages[unreadMessages.length - 1];
      const conversation = conversations?.find(c => c.conversationId === selectedConversationId);

      // Use simple role-based name for notifications since we can't use hooks here
      const isTalent = user.userId === conversation?.talentUserId;
      const participantName = isTalent ? 'Client' : 'Talent';

      new Notification(`New message from ${participantName}`, {
        body: lastMessage.content,
        icon: '/favicon.ico',
        tag: lastMessage.messageId,
      });
    }
  }, [selectedConversationId, messages?.length]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversationId) return;

    const messageContent = messageText.trim();

    sendMessage.mutate(
      { content: messageContent },
      {
        onSuccess: () => {
          setMessageText('');
        },
        onError: (error: any) => {
          const errorMessage = error.response?.data?.message || error.message || 'Failed to send message';
          showError(`Message failed to send: ${errorMessage}. Please try again.`);
          console.error('Send message error:', error);
        },
      }
    );
  };

  const getUnreadCount = (conversationId: string) => {
    if (!messages || selectedConversationId !== conversationId) {
      // Would need to track unread per conversation - for now return 0
      return 0;
    }
    return messages.filter(m => !m.isRead && m.senderUserId !== user?.userId).length;
  };

  return (
    <MainLayout>
      <div className="h-[calc(100vh-200px)] grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                  </svg>
                  Messages
                </h2>
                {notificationPermission === 'granted' && (
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                )}
              </div>

              {conversationsLoading && (
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <ConversationSkeleton key={i} />
                  ))}
                </div>
              )}

              {conversations && conversations.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-slate-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-sm text-slate-500">No conversations yet</p>
                  <p className="text-xs text-slate-400 mt-1">Start browsing talents to connect</p>
                </div>
              )}

              <div className="space-y-2">
                {conversations?.map((conv) => {
                  const unreadCount = getUnreadCount(conv.conversationId);

                  return (
                    <button
                      key={conv.conversationId}
                      onClick={() => setSelectedConversationId(conv.conversationId)}
                      className={`w-full text-left p-3 rounded-lg transition-all relative ${
                        selectedConversationId === conv.conversationId
                          ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md'
                          : 'hover:bg-blue-50 border border-slate-200'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className={`text-sm font-semibold flex items-center gap-2 ${selectedConversationId === conv.conversationId ? 'text-white' : 'text-slate-900'}`}>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {user && <ParticipantName conversation={conv} currentUser={user} />}
                          </div>
                          <div className={`text-xs mt-1 ${selectedConversationId === conv.conversationId ? 'text-white/80' : 'text-slate-500'}`}>
                            {formatRelativeTime(conv.lastMessageAt)}
                          </div>
                        </div>
                        {unreadCount > 0 && (
                          <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-bold rounded-full">
                            {unreadCount}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="h-full flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            {!selectedConversationId ? (
              <div className="flex-1 flex flex-col items-center justify-center p-12">
                <svg className="w-24 h-24 text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-slate-600 text-lg font-medium">Select a conversation to start messaging</p>
                <p className="text-slate-400 text-sm mt-1">Your messages will appear here</p>
              </div>
            ) : (
              <>
                <CardContent className="flex-1 p-6 overflow-y-auto">
                  {messagesLoading && (
                    <div className="space-y-4">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <MessageSkeleton key={i} align={i % 2 === 0 ? 'left' : 'right'} />
                      ))}
                    </div>
                  )}

                  <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                      {messages?.map((message) => {
                        const isMyMessage = message.senderUserId === user?.userId;
                        return (
                          <motion.div
                            key={message.messageId}
                            className={`flex flex-col ${isMyMessage ? 'items-end' : 'items-start'}`}
                            variants={messageEnter}
                            initial="hidden"
                            animate="visible"
                            exit="hidden"
                            layout
                          >
                          <div
                            className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                              isMyMessage
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                                : 'bg-slate-100 text-slate-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p
                                className={`text-xs ${
                                  isMyMessage ? 'text-white/70' : 'text-slate-500'
                                }`}
                              >
                                {formatRelativeTime(message.sentAt)}
                              </p>
                              {isMyMessage && (
                                <span className="text-xs">
                                  {message.isRead ? (
                                    <svg className="w-4 h-4 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      <path fillRule="evenodd" d="M10.293 12.707a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414l-6 6a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                    </svg>
                                  ) : (
                                    <svg className="w-4 h-4 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          </motion.div>
                        );
                      })}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>

                <div className="p-4 border-t border-slate-200">
                  <form onSubmit={handleSendMessage} className="flex gap-3">
                    <Input
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      placeholder="Type your message..."
                      className="flex-1 h-12 border-slate-300 focus:border-blue-500 focus:ring-blue-500"
                      autoFocus
                    />
                    <Button
                      type="submit"
                      disabled={!messageText.trim() || sendMessage.isPending}
                      className="h-12 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                    >
                      {sendMessage.isPending ? (
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <span className="flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                          </svg>
                          Send
                        </span>
                      )}
                    </Button>
                  </form>
                </div>
              </>
            )}
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};
