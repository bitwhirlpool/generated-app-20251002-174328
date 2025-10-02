import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useChatStore } from '@/hooks/useChatStore';
import { Wand2, Loader2, Sparkles } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { toast } from 'sonner';
export function AIPromptBuilderDialog() {
  const isPromptBuilderOpen = useChatStore((state) => state.isPromptBuilderOpen);
  const togglePromptBuilder = useChatStore((state) => state.togglePromptBuilder);
  const createNewSession = useChatStore((state) => state.createNewSession);
  const sendMessage = useChatStore((state) => state.sendMessage);
  const [goal, setGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setIsLoading(true);
    setError(null);
    setGeneratedPrompts([]);
    try {
      const response = await fetch('/api/generate-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate prompts. Please try again.');
      }
      const data = await response.json();
      if (data.success && data.data) {
        setGeneratedPrompts(data.data);
      } else {
        throw new Error(data.error || 'An unknown error occurred.');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  const handlePromptSelect = async (prompt: string) => {
    await createNewSession();
    sendMessage(prompt);
    togglePromptBuilder();
    setGoal('');
    setGeneratedPrompts([]);
  };
  return (
    <Dialog open={isPromptBuilderOpen} onOpenChange={togglePromptBuilder}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI-Assisted Prompt Builder</DialogTitle>
          <DialogDescription>
            Describe your goal, and we'll generate effective prompt variations for you.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Textarea
            placeholder="e.g., 'Create a marketing slogan for a new eco-friendly water bottle'"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            disabled={isLoading}
          />
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {isLoading && (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {generatedPrompts.length > 0 && (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              Generated Prompts
            </h3>
            {generatedPrompts.map((prompt, index) => (
              <div
                key={index}
                className="p-3 border rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => handlePromptSelect(prompt)}
              >
                <p className="text-sm">{prompt}</p>
              </div>
            ))}
          </div>
        )}
        <DialogFooter>
          <Button onClick={handleGenerate} disabled={!goal.trim() || isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            Generate Prompts
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}