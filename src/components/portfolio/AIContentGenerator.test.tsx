import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AIContentGenerator from './AIContentGenerator';
import { useAIContentGeneration } from '@/hooks/useAIContentGeneration';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { toast } from 'sonner';

// Mock dependencies
jest.mock('@/hooks/useAIContentGeneration');
jest.mock('@/contexts/SubscriptionContext');
jest.mock('sonner');
jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode, href: string }) => {
    return <a href={href}>{children}</a>;
  };
});
// Mock Progress component if it's simple enough or provide a basic stub
jest.mock('@/components/ui/progress', () => ({
  Progress: ({ value }: { value: number }) => <div data-testid="progress-bar" style={{ width: `${value}%` }} />
}));


const mockUseAIContentGeneration = useAIContentGeneration as jest.Mock;
const mockUseSubscription = useSubscription as jest.Mock;
const mockToastError = toast.error as jest.Mock;

// Default mock return values
const defaultMockAI = {
  generateContent: jest.fn().mockResolvedValue("Generated content"),
  isGenerating: false,
};

const defaultMockSubscription = {
  subscription: {
    plan: { name: 'Pro', max_ai_generations: -1, features: { ai_content: true } }, // Unlimited by default
  },
  usage: { ai_generations_count: 0 },
  canUseAI: true,
  loading: false,
};

describe('AIContentGenerator', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAIContentGeneration.mockReturnValue(defaultMockAI);
    mockUseSubscription.mockReturnValue(defaultMockSubscription);
  });

  const renderComponent = (props = {}) => {
    const defaultProps = {
      type: 'bio' as 'bio',
      context: {},
      value: '',
      onChange: jest.fn(),
      label: 'Test Label',
    };
    return render(<AIContentGenerator {...defaultProps} {...props} />);
  };

  it('renders label, textarea and generate buttons', () => {
    renderComponent();
    expect(screen.getByText('Test Label')).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /variations/i })).toBeInTheDocument();
  });

  it('disables generate buttons and textarea if canUseAI is false', () => {
    mockUseSubscription.mockReturnValue({
      ...defaultMockSubscription,
      canUseAI: false,
    });
    renderComponent();
    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /variations/i })).toBeDisabled();
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByText(/ai content generation is disabled/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /upgrade your plan/i })).toHaveAttribute('href', '/dashboard/settings/billing');
  });

  it('displays usage information and progress bar', () => {
    mockUseSubscription.mockReturnValue({
      ...defaultMockSubscription,
      subscription: { plan: { name: 'Basic', max_ai_generations: 10, features: { ai_content: true } } },
      usage: { ai_generations_count: 3 },
      canUseAI: true,
    });
    renderComponent();
    expect(screen.getByText(/ai generations used: 3 \/ 10/i)).toBeInTheDocument();
    expect(screen.getByTestId('progress-bar')).toBeInTheDocument();
  });
  
  it('shows "Limit reached" warning when 0 generations remaining', () => {
    mockUseSubscription.mockReturnValue({
      ...defaultMockSubscription,
      subscription: { plan: { name: 'Basic', max_ai_generations: 10, features: { ai_content: true } } },
      usage: { ai_generations_count: 10 },
      canUseAI: true,
    });
    renderComponent();
    expect(screen.getByText(/limit reached/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /variations/i })).toBeDisabled();
    expect(screen.getByRole('textbox')).toBeDisabled();
    expect(screen.getByText(/you've reached your generation limit/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /upgrade/i })).toHaveAttribute('href', '/dashboard/settings/billing');
  });

  it('shows "X remaining" warning when few generations are left', () => {
    mockUseSubscription.mockReturnValue({
      ...defaultMockSubscription,
      subscription: { plan: { name: 'Basic', max_ai_generations: 10, features: { ai_content: true } } },
      usage: { ai_generations_count: 7 }, // 3 remaining
      canUseAI: true,
    });
    renderComponent();
    expect(screen.getByText(/3 remaining/i)).toBeInTheDocument();
  });


  it('calls generateContent on "Generate" button click if allowed', async () => {
    const mockGenerate = jest.fn().mockResolvedValue("New Bio");
    mockUseAIContentGeneration.mockReturnValue({ ...defaultMockAI, generateContent: mockGenerate });
    const mockOnChange = jest.fn();
    renderComponent({ onChange: mockOnChange });

    fireEvent.click(screen.getByRole('button', { name: /generate/i }));

    await waitFor(() => expect(mockGenerate).toHaveBeenCalledTimes(1));
    expect(mockGenerate).toHaveBeenCalledWith(expect.objectContaining({ type: 'bio', tone: 'professional' }));
    await waitFor(() => expect(mockOnChange).toHaveBeenCalledWith("New Bio"));
  });

  it('does not call generateContent on "Generate" button click if limit reached', () => {
    mockUseSubscription.mockReturnValue({
      ...defaultMockSubscription,
      subscription: { plan: { name: 'Free', max_ai_generations: 5, features: { ai_content: true } } },
      usage: { ai_generations_count: 5 }, // Limit reached
      canUseAI: true,
    });
    const mockGenerate = defaultMockAI.generateContent;
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /generate/i }));
    
    expect(mockGenerate).not.toHaveBeenCalled();
    expect(mockToastError).toHaveBeenCalledWith("You've reached your generation limit.");
  });
  
  it('calls generateContent multiple times for "Variations" button click', async () => {
    const mockGenerate = jest.fn()
      .mockResolvedValueOnce("Variation 1")
      .mockResolvedValueOnce("Variation 2")
      .mockResolvedValueOnce("Variation 3");
    mockUseAIContentGeneration.mockReturnValue({ ...defaultMockAI, generateContent: mockGenerate });
    renderComponent();

    fireEvent.click(screen.getByRole('button', { name: /variations/i }));

    await waitFor(() => expect(mockGenerate).toHaveBeenCalledTimes(3));
    expect(mockGenerate).toHaveBeenCalledWith(expect.objectContaining({ type: 'bio', tone: 'professional' }));
    expect(mockGenerate).toHaveBeenCalledWith(expect.objectContaining({ type: 'bio', tone: 'casual' }));
    expect(mockGenerate).toHaveBeenCalledWith(expect.objectContaining({ type: 'bio', tone: 'creative' }));
    
    // Check if suggestions are displayed (simplified check)
    await waitFor(() => expect(screen.getByText("Variation 1")).toBeInTheDocument());
    expect(screen.getByText("Variation 2")).toBeInTheDocument();
    expect(screen.getByText("Variation 3")).toBeInTheDocument();
  });

  it('disables buttons during content generation', async () => {
    mockUseAIContentGeneration.mockReturnValue({ 
      generateContent: jest.fn(() => new Promise(resolve => setTimeout(() => resolve("Content"), 50))), // Simulates delay
      isGenerating: true, // Key part: set isGenerating to true
    });
    renderComponent();

    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /variations/i })).toBeDisabled();
    // Check for loader icon (presence of animate-spin class)
    expect(screen.getAllByText((content, element) => element?.classList.contains('animate-spin')).length).toBeGreaterThan(0);
  });
  
  it('disables buttons while subscription is loading', () => {
    mockUseSubscription.mockReturnValue({
      ...defaultMockSubscription,
      loading: true, // Key part: set loading to true
    });
    renderComponent();
    expect(screen.getByRole('button', { name: /generate/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /variations/i })).toBeDisabled();
  });

  it('applies suggestion when clicked', async () => {
    const mockGenerate = jest.fn()
      .mockResolvedValueOnce("Suggestion A")
      .mockResolvedValueOnce("Suggestion B");
    mockUseAIContentGeneration.mockReturnValue({ ...defaultMockAI, generateContent: mockGenerate });
    const mockOnChange = jest.fn();
    renderComponent({ onChange: mockOnChange });

    fireEvent.click(screen.getByRole('button', { name: /variations/i }));

    await waitFor(() => screen.getByText("Suggestion A"));
    fireEvent.click(screen.getByText("Suggestion A"));

    expect(mockOnChange).toHaveBeenCalledWith("Suggestion A");
    // Suggestions should disappear after click
    expect(screen.queryByText("Suggestion A")).not.toBeInTheDocument();
  });

});
