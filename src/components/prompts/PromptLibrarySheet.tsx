import React, { useState, useMemo } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { useChatStore } from '@/hooks/useChatStore';
import { PROMPT_LIBRARY, PromptCategory } from '@/lib/prompts';
import * as LucideIcons from 'lucide-react';

const Icon = ({ name }: { name: string }) => {
  const LucideIcon = (LucideIcons as any)[name];
  if (!LucideIcon) return <LucideIcons.HelpCircle className="h-4 w-4" />;
  return <LucideIcon className="h-4 w-4" />;
};

export function PromptLibrarySheet() {
  const isPromptLibraryOpen = useChatStore((state) => state.isPromptLibraryOpen);
  const togglePromptLibrary = useChatStore((state) => state.togglePromptLibrary);
  const createNewSession = useChatStore((state) => state.createNewSession);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const [searchTerm, setSearchTerm] = useState('');
  const filteredLibrary = useMemo(() => {
    if (!searchTerm) return PROMPT_LIBRARY;
    const lowercasedFilter = searchTerm.toLowerCase();
    return PROMPT_LIBRARY.map((category) => {
      const filteredPrompts = category.prompts.filter(
        (prompt) =>
          prompt.title.toLowerCase().includes(lowercasedFilter) ||
          prompt.prompt.toLowerCase().includes(lowercasedFilter)
      );
      return { ...category, prompts: filteredPrompts };
    }).filter((category) => category.prompts.length > 0);
  }, [searchTerm]);
  const handlePromptSelect = async (prompt: string) => {
    await createNewSession();
    sendMessage(prompt);
    togglePromptLibrary();
  };
  return (
    <Sheet open={isPromptLibraryOpen} onOpenChange={togglePromptLibrary}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle>Prompt Library</SheetTitle>
          <SheetDescription>
            Browse curated prompts to kickstart your conversations.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <ScrollArea className="flex-1 -mx-6">
          <div className="px-6">
            <Accordion type="multiple" className="w-full">
              {filteredLibrary.map((category: PromptCategory) => (
                <AccordionItem value={category.category} key={category.category}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-2">
                      <Icon name={category.icon} />
                      <span>{category.category}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {category.prompts.map((prompt) => (
                        <Button
                          key={prompt.title}
                          variant="ghost"
                          className="w-full h-auto text-left justify-start flex flex-col items-start p-2"
                          onClick={() => handlePromptSelect(prompt.prompt)}
                        >
                          <p className="font-semibold text-sm">{prompt.title}</p>
                          <p className="text-xs text-muted-foreground font-normal truncate max-w-full">
                            {prompt.prompt}
                          </p>
                        </Button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}