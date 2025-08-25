import { useState, useEffect } from 'react';
import type { PromptStep, Selections } from './types';
import { PromptBuilder } from './components/PromptBuilder';
import { PromptOutput } from './components/PromptOutput';

const App = () => {
  const [promptSteps, setPromptSteps] = useState<PromptStep[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selections, setSelections] = useState<Selections>({});
  const [stringPrompt, setStringPrompt] = useState('');
  const [jsonPrompt, setJsonPrompt] = useState('');

  useEffect(() => {
    fetch('./data/options.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to load prompt options.');
        return response.json();
      })
      .then(data => {
        setPromptSteps(data);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!promptSteps.length) return;

    const promptOrder = promptSteps.map(step => step.id);
    
    const promptParts = promptOrder
      .map(id => selections[id])
      .filter(value => value && (Array.isArray(value) ? value.length > 0 : true));
      
    const finalString = promptParts.flat().join(' ');
    setStringPrompt(finalString);
    
    const finalJson = promptOrder.reduce((acc, id) => {
        const value = selections[id];
        if (value && (Array.isArray(value) ? value.length > 0 : true)) {
            acc[id] = value;
        }
        return acc;
    }, {} as Record<string, string | string[]>);

    setJsonPrompt(JSON.stringify(finalJson, null, 2));

  }, [selections, promptSteps]);

  const handleSelect = (stepId: string, value: string) => {
    setSelections(prev => ({ ...prev, [stepId]: value }));
  };

  const handleMultiSelect = (stepId: string, value: string) => {
    setSelections(prev => {
        const currentValues = (prev[stepId] as string[]) || [];
        const newValues = currentValues.includes(value)
            ? currentValues.filter(v => v !== value)
            : [...currentValues, value];
        return { ...prev, [stepId]: newValues };
    });
  };

  const handleTextChange = (stepId: string, value: string) => {
    setSelections(prev => ({ ...prev, [stepId]: value }));
  };
  
  const handleReset = () => {
    setSelections({});
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center py-10 text-brand-text-secondary">Loading options...</div>;
    }
    if (error) {
      return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    }
    return (
      <div className="flex flex-col lg:flex-row">
        <PromptBuilder 
            steps={promptSteps}
            selections={selections}
            onSelect={handleSelect}
            onMultiSelect={handleMultiSelect}
            onTextChange={handleTextChange}
        />
        <PromptOutput 
            stringPrompt={stringPrompt}
            jsonPrompt={jsonPrompt}
            onReset={handleReset}
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary font-sans">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-brand-primary to-brand-secondary text-transparent bg-clip-text">
              Veo3 Prompt Guru
            </span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-brand-text-secondary">
            Craft the perfect video prompt, step by step. Your selections will instantly build your prompt below.
          </p>
        </header>
        
        {renderContent()}

      </main>
    </div>
  );
};

export default App;