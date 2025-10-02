import { useHotkeys } from 'react-hotkeys-hook';
import { useChatStore } from './useChatStore';
export const useKeyboardShortcuts = () => {
  const toggleLeftSidebar = useChatStore((state) => state.toggleLeftSidebar);
  const toggleRightSidebar = useChatStore((state) => state.toggleRightSidebar);
  const createNewSession = useChatStore((state) => state.createNewSession);
  const togglePromptLibrary = useChatStore((state) => state.togglePromptLibrary);
  const togglePromptBuilder = useChatStore((state) => state.togglePromptBuilder);
  useHotkeys('mod+shift+l', (e) => {
    e.preventDefault();
    toggleLeftSidebar();
  }, [toggleLeftSidebar]);
  useHotkeys('mod+shift+r', (e) => {
    e.preventDefault();
    toggleRightSidebar();
  }, [toggleRightSidebar]);
  useHotkeys('mod+n', (e) => {
    e.preventDefault();
    createNewSession();
  }, [createNewSession]);
  useHotkeys('mod+p', (e) => {
    e.preventDefault();
    togglePromptLibrary();
  }, [togglePromptLibrary]);
  useHotkeys('mod+i', (e) => {
    e.preventDefault();
    togglePromptBuilder();
  }, [togglePromptBuilder]);
};