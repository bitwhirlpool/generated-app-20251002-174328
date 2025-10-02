import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Settings, Code2 } from 'lucide-react';
import { useChatStore } from '@/hooks/useChatStore';
import { MODELS } from '@/lib/chat';
import { ApiKeyDisclaimer } from '../chat/ApiKeyDisclaimer';
import { Switch } from '../ui/switch';
export function SettingsSidebar() {
  const settings = useChatStore((state) => state.settings);
  const setSettings = useChatStore((state) => state.setSettings);
  const isVibeCodingMode = useChatStore((state) => state.isVibeCodingMode);
  const toggleVibeCodingMode = useChatStore((state) => state.toggleVibeCodingMode);
  return (
    <div className="flex h-full flex-col bg-card p-4">
      <div className="flex items-center gap-2 pb-4 border-b">
        <Settings className="h-6 w-6 text-primary" />
        <h2 className="text-xl font-semibold tracking-tight">Configuration</h2>
      </div>
      <ScrollArea className="flex-1 -mx-4">
        <div className="p-4 space-y-6">
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={settings.model} onValueChange={(value) => setSettings({ model: value })}>
              <SelectTrigger id="model">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {MODELS.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    {model.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <Label htmlFor="temperature">Temperature</Label>
              <span className="text-sm text-muted-foreground">{settings.temperature.toFixed(2)}</span>
            </div>
            <Slider
              id="temperature"
              min={0}
              max={1}
              step={0.01}
              value={[settings.temperature]}
              onValueChange={([value]) => setSettings({ temperature: value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="max-tokens">Max Tokens</Label>
            <Input
              id="max-tokens"
              type="number"
              value={settings.maxTokens}
              onChange={(e) => setSettings({ maxTokens: parseInt(e.target.value, 10) || 0 })}
            />
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-sm font-medium">View Modes</h3>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <Label htmlFor="vibe-coding-mode" className="flex items-center gap-2">
                  <Code2 className="h-4 w-4" />
                  Vibe Coding Mode
                </Label>
                <p className="text-xs text-muted-foreground">
                  Split-screen view for code-focused chats.
                </p>
              </div>
              <Switch
                id="vibe-coding-mode"
                checked={isVibeCodingMode}
                onCheckedChange={toggleVibeCodingMode}
              />
            </div>
          </div>
        </div>
      </ScrollArea>
      <div className="pt-4 border-t">
        <ApiKeyDisclaimer />
      </div>
    </div>
  );
}