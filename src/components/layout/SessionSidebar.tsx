import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bot, PlusCircle, BookOpen, MessageSquare, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { useChatStore } from '@/hooks/useChatStore';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
export function SessionSidebar() {
  const sessions = useChatStore((state) => state.sessions);
  const currentSessionId = useChatStore((state) => state.currentSessionId);
  const selectSession = useChatStore((state) => state.selectSession);
  const createNewSession = useChatStore((state) => state.createNewSession);
  const togglePromptLibrary = useChatStore((state) => state.togglePromptLibrary);
  const openDeleteDialog = useChatStore((state) => state.openDeleteDialog);
  const openRenameDialog = useChatStore((state) => state.openRenameDialog);
  return (
    <div className="flex h-full flex-col bg-card p-4">
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          <Bot className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold tracking-tight">CogniCore</h1>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={createNewSession}>
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="py-4">
        <Button variant="outline" className="w-full justify-start gap-2" onClick={togglePromptLibrary}>
          <BookOpen className="h-4 w-4" />
          Prompt Library
        </Button>
      </div>
      <ScrollArea className="flex-1 -mx-4">
        <div className="px-4 space-y-1">
          <h2 className="text-xs font-semibold uppercase text-muted-foreground px-2 mb-2">Recent Chats</h2>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center px-2 py-4">No recent chats.</p>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="relative group">
                <Button
                  variant={currentSessionId === session.id ? 'secondary' : 'ghost'}
                  className="w-full justify-start gap-2 h-auto py-2 pr-8"
                  onClick={() => selectSession(session.id)}
                >
                  <MessageSquare className="h-4 w-4 flex-shrink-0" />
                  <div className="flex flex-col items-start text-left overflow-hidden">
                    <span className="truncate text-sm font-medium">{session.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}
                    </span>
                  </div>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openRenameDialog(session.id)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Rename</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openDeleteDialog(session.id)} className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Delete</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      <div className="pt-4 border-t">
        <p className="text-xs text-muted-foreground text-center">
          Built with ❤️ at Cloudflare
        </p>
      </div>
    </div>
  );
}