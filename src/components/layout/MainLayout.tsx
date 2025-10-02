import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { SessionSidebar } from './SessionSidebar';
import { SettingsSidebar } from './SettingsSidebar';
import { ChatPanel } from '../chat/ChatPanel';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { useChatStore } from '@/hooks/useChatStore';
import { Button } from '../ui/button';
import { PanelLeft, PanelRight } from 'lucide-react';
export function MainLayout() {
  const isMobile = useIsMobile();
  const isLeftSidebarOpen = useChatStore((state) => state.isLeftSidebarOpen);
  const isRightSidebarOpen = useChatStore((state) => state.isRightSidebarOpen);
  const toggleLeftSidebar = useChatStore((state) => state.toggleLeftSidebar);
  const toggleRightSidebar = useChatStore((state) => state.toggleRightSidebar);
  if (isMobile) {
    return (
      <div className="relative h-screen w-screen overflow-hidden bg-background">
        <div className="absolute top-0 left-0 z-20 p-2">
          <Button variant="ghost" size="icon" onClick={toggleLeftSidebar}>
            <PanelLeft className="h-5 w-5" />
          </Button>
        </div>
        <div className="absolute top-0 right-0 z-20 p-2">
          <Button variant="ghost" size="icon" onClick={toggleRightSidebar}>
            <PanelRight className="h-5 w-5" />
          </Button>
        </div>
        <div
          className={cn(
            "absolute top-0 left-0 h-full w-full z-10 transition-transform duration-300 ease-in-out",
            isLeftSidebarOpen ? 'translate-x-[75%]' : '',
            isRightSidebarOpen ? '-translate-x-[75%]' : ''
          )}
        >
          <ChatPanel />
        </div>
        <aside
          className={cn(
            "absolute top-0 left-0 h-full w-[75%] bg-card/80 backdrop-blur-lg z-30 transition-transform duration-300 ease-in-out",
            isLeftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <SessionSidebar />
        </aside>
        <aside
          className={cn(
            "absolute top-0 right-0 h-full w-[75%] bg-card/80 backdrop-blur-lg z-30 transition-transform duration-300 ease-in-out",
            isRightSidebarOpen ? 'translate-x-0' : 'translate-x-full'
          )}
        >
          <SettingsSidebar />
        </aside>
      </div>
    );
  }
  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen w-screen items-stretch">
      <ResizablePanel defaultSize={18} minSize={15} maxSize={25} collapsible collapsedSize={0} className={cn("transition-all duration-300", isLeftSidebarOpen ? "min-w-[280px]" : "min-w-0")}>
        <SessionSidebar />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={57} minSize={30}>
        <ChatPanel />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={25} minSize={20} maxSize={30} collapsible collapsedSize={0} className={cn("transition-all duration-300", isRightSidebarOpen ? "min-w-[320px]" : "min-w-0")}>
        <SettingsSidebar />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}