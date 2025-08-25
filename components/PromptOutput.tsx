import { useState, useCallback } from 'react';
import { CopyIcon, CheckIcon } from './icons';

interface PromptOutputProps {
  stringPrompt: string;
  jsonPrompt: string;
  onReset: () => void;
}

const OutputBlock = ({ title, content }: { title: string; content: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = useCallback(() => {
    if (!navigator.clipboard) {
      console.warn('Clipboard not supported');
      return;
    }
    navigator.clipboard.writeText(content).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [content]);

  return (
    <div className="relative bg-brand-bg rounded-lg ring-1 ring-brand-border/50">
      <div className="flex justify-between items-center px-4 py-2 border-b border-brand-border">
        <h3 className="font-semibold text-brand-text-secondary">{title}</h3>
        <button
          onClick={copyToClipboard}
          className="p-1.5 text-brand-text-secondary hover:text-brand-text-primary transition-colors rounded-md hover:bg-white/10"
          aria-label={`Copy ${title}`}
        >
          {isCopied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <CopyIcon className="w-5 h-5" />}
        </button>
      </div>
      <pre className="p-4 text-sm whitespace-pre-wrap break-words overflow-x-auto">
        <code className={title === 'JSON Prompt' ? 'text-sky-300' : 'text-brand-text-primary'}>
          {content || 'Your generated prompt will appear here...'}
        </code>
      </pre>
    </div>
  );
};

export const PromptOutput = ({ stringPrompt, jsonPrompt, onReset }: PromptOutputProps) => {
  return (
    <div className="w-full lg:w-1/2 flex flex-col space-y-6 lg:pl-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-brand-text-primary">Your Masterpiece Prompt</h2>
        <button
            onClick={onReset}
            className="px-4 py-2 text-sm font-semibold bg-brand-surface text-brand-text-secondary hover:bg-brand-border rounded-md transition-colors"
        >
            Reset
        </button>
      </div>
      <OutputBlock title="String Prompt" content={stringPrompt} />
      <OutputBlock title="JSON Prompt" content={jsonPrompt} />
    </div>
  );
};