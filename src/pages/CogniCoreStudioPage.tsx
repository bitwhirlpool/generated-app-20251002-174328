import React, { useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { useChatStore } from '@/hooks/useChatStore';
import { Toaster } from '@/components/ui/sonner';
import { PromptLibrarySheet } from '@/components/prompts/PromptLibrarySheet';
import { AIPromptBuilderDialog } from '@/components/prompts/AIPromptBuilderDialog';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { DeleteSessionDialog } from '@/components/layout/DeleteSessionDialog';
import { RenameSessionDialog } from '@/components/layout/RenameSessionDialog';
export function CogniCoreStudioPage() {
  const initializeApp = useChatStore((state) => state.initializeApp);
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();
  useEffect(() => {
    initializeApp();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <MainLayout />
      <PromptLibrarySheet />
      <AIPromptBuilderDialog />
      <DeleteSessionDialog />
      <RenameSessionDialog />
      <Toaster />
    </>
  );
}