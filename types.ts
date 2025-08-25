
export interface PromptOption {
  label: string;
  value: string;
  description?: string;
}

export interface PromptStep {
  id: string;
  title: string;
  description: string;
  type: 'single-select' | 'multi-select' | 'text';
  options?: PromptOption[];
  placeholder?: string;
}

export type Selections = Record<string, string | string[]>;
