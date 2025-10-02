import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ChatInput } from './ChatInput';
import { MessageBubble } from './MessageBubble';
import { useChatStore } from '@/hooks/useChatStore';
import { Bot } from 'lucide-react';
import { ChatPanelHeader } from './ChatPanelHeader';
import { VibeCodingView } from './VibeCodingView';
import { Skeleton } from '@/components/ui/skeleton';
export function ChatPanel() {
  const messages = useChatStore((state) => state.messages);
  const streamingMessage = useChatStore((state) => state.streamingMessage);
  const isProcessing = useChatStore((state) => state.isProcessing);
  const isVibeCodingMode = useChatStore((state) => state.isVibeCodingMode);
  const searchQuery = useChatStore((state) => state.searchQuery);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, streamingMessage]);
  return (
    <div className="flex h-full flex-col bg-muted/30">
      <ChatPanelHeader />
      <div className="flex-1 flex flex-col overflow-hidden">
        {isVibeCodingMode ? (
          <VibeCodingView />
        ) : (
          <ScrollArea className="flex-1" ref={scrollAreaRef}>
            <div className="p-4 md:p-6 space-y-6">
              {messages.length === 0 && !isProcessing && (
                <div className="flex flex-col items-center justify-center h-[calc(100vh-250px)] text-center">
                  <Bot className="h-16 w-16 text-muted-foreground/50 mb-4" />
                  <h2 className="text-2xl font-semibold">Welcome to CogniCore AI Studio</h2>
                  <p className="text-muted-foreground max-w-md mt-2">
                    Start a new conversation by typing your message below.
                    Explore models and settings in the sidebars.
                  </p>
                </div>
              )}
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} searchQuery={searchQuery} />
              ))}
              {streamingMessage && (
                <MessageBubble
                  message={{
                    id: 'streaming',
                    role: 'assistant',
                    content: streamingMessage,
                    timestamp: Date.now(),
                  }}
                  isStreaming
                />
              )}
              {isProcessing && !streamingMessage && messages.length > 0 && (
                 <div className="flex items-start space-x-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                </div>
              )}
            </div>
          </ScrollArea>
        )}
      </div>
      <div className="p-4 md:p-6 border-t bg-background">
        <ChatInput />
      </div>
    </div>
  );
}