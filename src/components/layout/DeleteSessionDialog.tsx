import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useChatStore } from '@/hooks/useChatStore';
export function DeleteSessionDialog() {
  const sessionToDelete = useChatStore((state) => state.sessionToDelete);
  const closeDeleteDialog = useChatStore((state) => state.closeDeleteDialog);
  const deleteSession = useChatStore((state) => state.deleteSession);
  const isOpen = !!sessionToDelete;
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && closeDeleteDialog()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this chat session and all of its messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={closeDeleteDialog}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={deleteSession}>Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}