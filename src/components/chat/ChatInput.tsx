import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ArrowUp, Wand2 } from 'lucide-react';
import { useChatStore } from '@/hooks/useChatStore';
export function ChatInput() {
  const [input, setInput] = useState('');
  const sendMessage = useChatStore((state) => state.sendMessage);
  const isProcessing = useChatStore((state) => state.isProcessing);
  const togglePromptBuilder = useChatStore((state) => state.togglePromptBuilder);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const handleSend = () => {
    if (input.trim() && !isProcessing) {
      sendMessage(input.trim());
      setInput('');
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${scrollHeight}px`;
    }
  }, [input]);
  return (
    <div className="relative flex items-end gap-2">
      <Textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask anything... (Press ⌘+K for shortcuts)"
        className="w-full resize-none pr-24 py-3 pl-4 min-h-[52px] max-h-48 rounded-2xl"
        rows={1}
        disabled={isProcessing}
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="h-8 w-8 rounded-full"
          onClick={togglePromptBuilder}
          disabled={isProcessing}
          aria-label="AI Prompt Builder"
        >
          <Wand2 className="h-4 w-4" />
        </Button>
        <Button
          type="submit"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={handleSend}
          disabled={!input.trim() || isProcessing}
          aria-label="Send Message"
        >
          <ArrowUp className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}