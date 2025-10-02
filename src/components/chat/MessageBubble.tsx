import React from 'react';
import { Bot, User, Code, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Message } from '../../../worker/types';
import { Badge } from '../ui/badge';
interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
  searchQuery?: string;
}
const HighlightedText = ({ text, highlight }: { text: string; highlight: string }) => {
  if (!highlight.trim()) {
    return <>{text}</>;
  }
  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-400 text-black px-0.5 rounded-sm">
            {part}
          </mark>
        ) : (
          part
        )
      )}
    </>
  );
};
export function MessageBubble({ message, isStreaming = false, searchQuery = '' }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const renderContent = (content: string) => {
    return content.split('```').map((part, index) => {
      if (index % 2 === 1) {
        const [lang, ...codeLines] = part.split('\n');
        const code = codeLines.join('\n').trim();
        return (
          <pre key={index} className="bg-background/50 p-3 rounded-lg my-2 overflow-x-auto">
            <div className="flex justify-between items-center text-xs text-muted-foreground mb-2">
              <span>{lang || 'code'}</span>
              <button onClick={() => navigator.clipboard.writeText(code)} className="hover:text-foreground">Copy</button>
            </div>
            <code><HighlightedText text={code} highlight={searchQuery} /></code>
          </pre>
        );
      }
      return (
        <p key={index} className="whitespace-pre-wrap">
          <HighlightedText text={part} highlight={searchQuery} />
          {isStreaming && index === content.split('```').length - 1 ? <span className="animate-pulse">|</span> : ''}
        </p>
      );
    });
  };
  return (
    <div className={cn('flex items-start space-x-4', isUser ? 'justify-end' : 'justify-start')}>
      {!isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-5 w-5 text-primary" />
        </div>
      )}
      <div
        className={cn(
          'max-w-lg lg:max-w-2xl rounded-2xl px-4 py-3',
          isUser ? 'bg-primary text-primary-foreground rounded-br-none' : 'bg-card rounded-bl-none'
        )}
      >
        <div className="prose prose-sm prose-invert max-w-none text-foreground">
          {renderContent(message.content)}
        </div>
        {Array.isArray(message.toolCalls) && message.toolCalls.length > 0 && (
          <div className="mt-2 pt-2 border-t border-current/20">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Wrench className="h-3 w-3" />
              <span>Tools used:</span>
            </div>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {message.toolCalls.map((tool, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  <Code className="h-3 w-3 mr-1" />
                  {tool.name}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
      {isUser && (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-secondary flex items-center justify-center">
          <User className="h-5 w-5 text-secondary-foreground" />
        </div>
      )}
    </div>
  );
}