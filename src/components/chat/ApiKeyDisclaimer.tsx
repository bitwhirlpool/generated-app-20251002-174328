import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
export function ApiKeyDisclaimer() {
  return (
    <Alert>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Demo Environment</AlertTitle>
      <AlertDescription className="text-xs">
        AI model inferencing is disabled in this live demo due to security policies regarding API keys. To enable it, please clone the repository, add your own API keys, and deploy it to your Cloudflare account.
      </AlertDescription>
    </Alert>
  );
}