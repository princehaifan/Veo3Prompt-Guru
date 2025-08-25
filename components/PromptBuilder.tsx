import type { PromptStep, Selections } from '../types';

interface StepCardProps {
  step: PromptStep;
  selection: string | string[];
  onSelect: (value: string) => void;
  onMultiSelect: (value: string) => void;
  onTextChange: (value: string) => void;
}

const StepCard = ({ step, selection, onSelect, onMultiSelect, onTextChange }: StepCardProps) => {
  const renderOptions = () => {
    if (step.type === 'text') {
      return (
        <textarea
          value={(selection as string) || ''}
          onChange={(e) => onTextChange(e.target.value)}
          placeholder={step.placeholder}
          rows={4}
          className="w-full bg-brand-surface border border-brand-border rounded-lg p-3 focus:ring-2 focus:ring-brand-primary focus:outline-none transition-shadow"
        />
      );
    }
    
    if (step.type === 'single-select') {
      return (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {step.options?.map((option) => (
            <button
              key={option.value}
              onClick={() => onSelect(option.value)}
              className={`p-4 rounded-lg text-left transition-all duration-200 ${
                selection === option.value
                  ? 'bg-brand-primary text-white ring-2 ring-offset-2 ring-offset-brand-surface ring-brand-primary'
                  : 'bg-brand-surface hover:bg-brand-border/50'
              }`}
            >
              <span className="font-semibold">{option.label}</span>
            </button>
          ))}
        </div>
      );
    }

    if (step.type === 'multi-select') {
        const currentSelections = Array.isArray(selection) ? selection : [];
        return (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {step.options?.map((option) => (
              <button
                key={option.value}
                onClick={() => onMultiSelect(option.value)}
                className={`p-4 rounded-lg text-left transition-all duration-200 ${
                    currentSelections.includes(option.value)
                    ? 'bg-brand-primary text-white ring-2 ring-offset-2 ring-offset-brand-surface ring-brand-primary'
                    : 'bg-brand-surface hover:bg-brand-border/50'
                }`}
              >
                <span className="font-semibold">{option.label}</span>
              </button>
            ))}
          </div>
        )
    }

    return null;
  };

  return (
    <div className="bg-brand-surface/50 p-6 rounded-xl border border-brand-border/30 mb-6">
      <h3 className="text-xl font-bold text-brand-secondary">{step.title}</h3>
      <p className="text-brand-text-secondary mt-1 mb-4">{step.description}</p>
      {renderOptions()}
    </div>
  );
};

interface PromptBuilderProps {
  steps: PromptStep[];
  selections: Selections;
  onSelect: (stepId: string, value: string) => void;
  onMultiSelect: (stepId: string, value: string) => void;
  onTextChange: (stepId: string, value: string) => void;
}

export const PromptBuilder = ({ steps, selections, onSelect, onMultiSelect, onTextChange }: PromptBuilderProps) => {
  return (
    <div className="w-full lg:w-1/2 lg:pr-8">
      {steps.map((step) => (
        <StepCard
          key={step.id}
          step={step}
          selection={selections[step.id]}
          onSelect={(value) => onSelect(step.id, value)}
          onMultiSelect={(value) => onMultiSelect(step.id, value)}
          onTextChange={(value) => onTextChange(step.id, value)}
        />
      ))}
    </div>
  );
};