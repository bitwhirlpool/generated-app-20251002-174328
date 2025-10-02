import React, { useMemo } from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import { useChatStore } from '@/hooks/useChatStore';
import { Code2 } from 'lucide-react';
export function VibeCodingView() {
  const messages = useChatStore((state) => state.messages);
  const streamingMessage = useChatStore((state) => state.streamingMessage);
  const isProcessing = useChatStore((state) => state.isProcessing);
  const searchQuery = useChatStore((state) => state.searchQuery);
  const allCodeBlocks = useMemo(() => {
    const codeRegex = /```(\w+)?\n([\s\S]*?)```/g;
    let blocks: { lang: string; code: string }[] = [];
    const extractBlocks = (content: string) => {
      let match;
      while ((match = codeRegex.exec(content)) !== null) {
        blocks.push({ lang: match[1] || 'plaintext', code: match[2].trim() });
      }
    };
    messages.forEach(msg => extractBlocks(msg.content));
    if (streamingMessage) {
      extractBlocks(streamingMessage);
    }
    return blocks;
  }, [messages, streamingMessage]);
  return (
    <ResizablePanelGroup direction="horizontal" className="flex-1">
      <ResizablePanel defaultSize={50} minSize={30}>
        <ScrollArea className="h-full">
          <div className="p-4 md:p-6 space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} searchQuery={searchQuery} />
            ))}
            {streamingMessage && (
              <MessageBubble
                message={{ id: 'streaming', role: 'assistant', content: streamingMessage, timestamp: Date.now() }}
                isStreaming
              />
            )}
            {isProcessing && !streamingMessage && messages.length > 0 && (
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Code2 className="h-5 w-5 text-primary" />
                </div>
                <div className="flex items-center space-x-2 pt-1">
                  <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="h-2 w-2 bg-muted-foreground rounded-full animate-pulse"></span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50} minSize={30}>
        <ScrollArea className="h-full bg-background">
          <div className="p-4 md:p-6 space-y-4">
            {allCodeBlocks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Code2 className="h-12 w-12 mb-4" />
                <p>Code blocks from the conversation will appear here.</p>
              </div>
            ) : (
              allCodeBlocks.map((block, index) => (
                <pre key={index} className="bg-card p-3 rounded-lg overflow-x-auto">
                  <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
                    <span>{block.lang}</span>
                    <button onClick={() => navigator.clipboard.writeText(block.code)} className="hover:text-foreground">Copy</button>
                  </div>
                  <code>{block.code}</code>
                </pre>
              ))
            )}
          </div>
        </ScrollArea>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}