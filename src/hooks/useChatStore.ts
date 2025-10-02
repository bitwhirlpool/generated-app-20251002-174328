import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Message, SessionInfo } from '../../worker/types';
import { chatService, MODELS } from '@/lib/chat';
import { toast } from 'sonner';
export type ChatSettings = {
  model: string;
  temperature: number;
  maxTokens: number;
};
export type ChatState = {
  sessions: SessionInfo[];
  currentSessionId: string | null;
  messages: Message[];
  streamingMessage: string;
  isProcessing: boolean;
  settings: ChatSettings;
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
  isPromptLibraryOpen: boolean;
  isPromptBuilderOpen: boolean;
  isVibeCodingMode: boolean;
  searchQuery: string;
  sessionToDelete: string | null;
  sessionToRename: string | null;
};
export type ChatActions = {
  initializeApp: () => Promise<void>;
  fetchSessions: () => Promise<void>;
  selectSession: (sessionId: string) => Promise<void>;
  createNewSession: () => Promise<string | undefined>;
  sendMessage: (message: string) => Promise<void>;
  setSettings: (settings: Partial<ChatSettings>) => void;
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  togglePromptLibrary: () => void;
  togglePromptBuilder: () => void;
  toggleVibeCodingMode: () => void;
  setSearchQuery: (query: string) => void;
  clearSearch: () => void;
  openDeleteDialog: (sessionId: string) => void;
  closeDeleteDialog: () => void;
  deleteSession: () => Promise<void>;
  openRenameDialog: (sessionId: string) => void;
  closeRenameDialog: () => void;
  renameSession: (newTitle: string) => Promise<void>;
};
const SETTINGS_STORAGE_KEY = 'cognicore-settings';
export const useChatStore = create<ChatState & ChatActions>()(
  immer((set, get) => ({
    sessions: [],
    currentSessionId: null,
    messages: [],
    streamingMessage: '',
    isProcessing: false,
    settings: {
      model: MODELS[0].id,
      temperature: 0.7,
      maxTokens: 2048,
    },
    isLeftSidebarOpen: true,
    isRightSidebarOpen: true,
    isPromptLibraryOpen: false,
    isPromptBuilderOpen: false,
    isVibeCodingMode: false,
    searchQuery: '',
    sessionToDelete: null,
    sessionToRename: null,
    initializeApp: async () => {
      const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings);
          set(state => { state.settings = { ...state.settings, ...parsedSettings }; });
        } catch (e) {
          console.error("Failed to parse saved settings", e);
        }
      }
      set({ isProcessing: true });
      const res = await chatService.listSessions();
      if (res.success && res.data) {
        set({ sessions: res.data });
        if (res.data.length > 0) {
          await get().selectSession(res.data[0].id);
        } else {
          await get().createNewSession();
        }
      } else {
        await get().createNewSession();
      }
      set({ isProcessing: false });
    },
    fetchSessions: async () => {
      const res = await chatService.listSessions();
      if (res.success && res.data) {
        set({ sessions: res.data });
      }
    },
    selectSession: async (sessionId: string) => {
      if (get().currentSessionId === sessionId) return;
      set({ isProcessing: true, messages: [], streamingMessage: '', searchQuery: '' });
      chatService.switchSession(sessionId);
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        set({
          currentSessionId: sessionId,
          messages: res.data.messages,
          settings: { ...get().settings, model: res.data.model },
        });
      }
      set({ isProcessing: false });
    },
    createNewSession: async () => {
      set({ isProcessing: true });
      chatService.newSession();
      const newSessionId = chatService.getSessionId();
      const res = await chatService.createSession('New Chat', newSessionId);
      if (res.success) {
        set({
          currentSessionId: newSessionId,
          messages: [],
          streamingMessage: '',
          searchQuery: '',
        });
        await get().fetchSessions();
        await get().selectSession(newSessionId);
        set({ isProcessing: false });
        return newSessionId;
      }
      set({ isProcessing: false });
      return undefined;
    },
    sendMessage: async (message: string) => {
      if (get().isProcessing) return;
      const userMessage: Message = {
        id: crypto.randomUUID(),
        role: 'user',
        content: message,
        timestamp: Date.now(),
      };
      set((state) => {
        state.messages.push(userMessage);
        state.isProcessing = true;
        state.streamingMessage = '';
      });
      if (get().messages.length === 1 && get().sessions.find(s => s.id === get().currentSessionId)?.title === 'New Chat') {
        const currentSessionId = get().currentSessionId;
        if (currentSessionId) {
            await chatService.updateSessionTitle(currentSessionId, message);
            await get().fetchSessions();
        }
      }
      await chatService.sendMessage(message, get().settings.model, (chunk) => {
        set((state) => {
          state.streamingMessage += chunk;
        });
      });
      const res = await chatService.getMessages();
      if (res.success && res.data) {
        set({ messages: res.data.messages });
      }
      set({ isProcessing: false, streamingMessage: '' });
    },
    setSettings: (settings) => {
      set((state) => {
        state.settings = { ...state.settings, ...settings };
      });
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(get().settings));
      if (settings.model) {
        chatService.updateModel(settings.model);
      }
    },
    toggleLeftSidebar: () => set((state) => { state.isLeftSidebarOpen = !state.isLeftSidebarOpen; }),
    toggleRightSidebar: () => set((state) => { state.isRightSidebarOpen = !state.isRightSidebarOpen; }),
    togglePromptLibrary: () => set((state) => { state.isPromptLibraryOpen = !state.isPromptLibraryOpen; }),
    togglePromptBuilder: () => set((state) => { state.isPromptBuilderOpen = !state.isPromptBuilderOpen; }),
    toggleVibeCodingMode: () => set((state) => { state.isVibeCodingMode = !state.isVibeCodingMode; }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    clearSearch: () => set({ searchQuery: '' }),
    openDeleteDialog: (sessionId: string) => {
      set({ sessionToDelete: sessionId });
    },
    closeDeleteDialog: () => {
      set({ sessionToDelete: null });
    },
    deleteSession: async () => {
      const sessionIdToDelete = get().sessionToDelete;
      if (!sessionIdToDelete) return;
      const res = await chatService.deleteSession(sessionIdToDelete);
      if (res.success) {
        toast.success('Session deleted.');
        await get().fetchSessions();
        const remainingSessions = get().sessions.filter(s => s.id !== sessionIdToDelete);
        set({ sessions: remainingSessions });
        if (get().currentSessionId === sessionIdToDelete) {
          if (remainingSessions.length > 0) {
            await get().selectSession(remainingSessions[0].id);
          } else {
            await get().createNewSession();
          }
        }
      } else {
        toast.error('Failed to delete session.');
      }
      get().closeDeleteDialog();
    },
    openRenameDialog: (sessionId: string) => {
      set({ sessionToRename: sessionId });
    },
    closeRenameDialog: () => {
      set({ sessionToRename: null });
    },
    renameSession: async (newTitle: string) => {
      const sessionIdToRename = get().sessionToRename;
      if (!sessionIdToRename || !newTitle.trim()) return;
      const res = await chatService.updateSessionTitle(sessionIdToRename, newTitle.trim());
      if (res.success) {
        toast.success('Session renamed.');
        await get().fetchSessions();
      } else {
        toast.error('Failed to rename session.');
      }
      get().closeRenameDialog();
    },
  }))
);