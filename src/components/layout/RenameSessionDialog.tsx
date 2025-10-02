import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChatStore } from '@/hooks/useChatStore';
export function RenameSessionDialog() {
  const sessions = useChatStore((state) => state.sessions);
  const sessionToRename = useChatStore((state) => state.sessionToRename);
  const closeRenameDialog = useChatStore((state) => state.closeRenameDialog);
  const renameSession = useChatStore((state) => state.renameSession);
  const [title, setTitle] = useState('');
  const isOpen = !!sessionToRename;
  useEffect(() => {
    if (sessionToRename) {
      const session = sessions.find(s => s.id === sessionToRename);
      setTitle(session?.title || '');
    }
  }, [sessionToRename, sessions]);
  const handleSave = () => {
    if (title.trim()) {
      renameSession(title.trim());
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeRenameDialog()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Rename Session</DialogTitle>
          <DialogDescription>
            Enter a new name for this chat session.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={closeRenameDialog}>Cancel</Button>
          <Button type="submit" onClick={handleSave}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}