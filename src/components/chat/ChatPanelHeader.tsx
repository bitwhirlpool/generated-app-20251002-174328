import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, MoreVertical, FileDown, X } from 'lucide-react';
import { useChatStore } from '@/hooks/useChatStore';
import { exportToJson, exportToMarkdown, downloadFile } from '@/lib/export';
import { toast } from 'sonner';
export function ChatPanelHeader() {
  const sessions = useChatStore((state) => state.sessions);
  const currentSessionId = useChatStore((state) => state.currentSessionId);
  const messages = useChatStore((state) => state.messages);
  const searchQuery = useChatStore((state) => state.searchQuery);
  const setSearchQuery = useChatStore((state) => state.setSearchQuery);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const currentSession = sessions.find(s => s.id === currentSessionId);
  const sessionTitle = currentSession?.title || 'Chat';
  const handleExport = (format: 'json' | 'md') => {
    const titleForFile = sessionTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    try {
      if (format === 'json') {
        const content = exportToJson(messages, sessionTitle);
        downloadFile(content, `${titleForFile}.json`, 'application/json');
      } else {
        const content = exportToMarkdown(messages, sessionTitle);
        downloadFile(content, `${titleForFile}.md`, 'text/markdown');
      }
      toast.success(`Chat exported as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error('Failed to export chat.');
    }
  };
  return (
    <div className="flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      <div className="flex-1 truncate">
        {!isSearchVisible && <h2 className="truncate text-lg font-semibold">{sessionTitle}</h2>}
        {isSearchVisible && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search in conversation..."
              className="w-full bg-muted pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              autoFocus
            />
          </div>
        )}
      </div>
      <div className="flex items-center gap-2 pl-4">
        <Button variant="ghost" size="icon" onClick={() => setIsSearchVisible(!isSearchVisible)}>
          {isSearchVisible ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleExport('md')}>
              <FileDown className="mr-2 h-4 w-4" />
              <span>Export as Markdown</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('json')}>
              <FileDown className="mr-2 h-4 w-4" />
              <span>Export as JSON</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}