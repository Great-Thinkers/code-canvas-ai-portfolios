import { renderHook, act } from '@testing-library/react';
import { useAIContentGeneration } from './useAIContentGeneration';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { supabase } from '@/integrations/supabase/client';
import { toast }
from 'sonner';

// Mock dependencies
jest.mock('@/contexts/SubscriptionContext');
jest.mock('@/integrations/supabase/client');
jest.mock('sonner');

const mockUseSubscription = useSubscription as jest.Mock;
const mockSupabaseInvoke = supabase.functions.invoke as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;

describe('useAIContentGeneration', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockUseSubscription.mockReset();
    mockSupabaseInvoke.mockReset();
    mockToastError.mockReset();
    mockToastSuccess.mockReset();
  });

  it('should deny content generation if canUseAI is false', async () => {
    mockUseSubscription.mockReturnValue({
      canUseAI: false,
      subscription: null,
      usage: null,
    });

    const { result } = renderHook(() => useAIContentGeneration());
    let generatedContent: string | null = null;

    await act(async () => {
      generatedContent = await result.current.generateContent({ type: 'bio', context: {} });
    });

    expect(generatedContent).toBeNull();
    expect(mockToastError).toHaveBeenCalledWith("Upgrade your plan to use AI content generation.");
    expect(mockSupabaseInvoke).not.toHaveBeenCalled();
  });

  it('should deny content generation if usage limit is reached for a specific plan', async () => {
    mockUseSubscription.mockReturnValue({
      canUseAI: true,
      subscription: { plan: { name: 'Free', max_ai_generations: 5 } },
      usage: { ai_generations_count: 5 },
    });

    const { result } = renderHook(() => useAIContentGeneration());
    let generatedContent: string | null = null;

    await act(async () => {
      generatedContent = await result.current.generateContent({ type: 'bio', context: {} });
    });

    expect(generatedContent).toBeNull();
    expect(mockToastError).toHaveBeenCalledWith("You've reached your AI generation limit for the free plan.");
    expect(mockSupabaseInvoke).not.toHaveBeenCalled();
  });

  it('should allow content generation if usage limit is not reached for a specific plan', async () => {
    mockUseSubscription.mockReturnValue({
      canUseAI: true,
      subscription: { plan: { name: 'Free', max_ai_generations: 5 } },
      usage: { ai_generations_count: 4 },
    });
    mockSupabaseInvoke.mockResolvedValue({ data: { success: true, content: 'Generated bio' }, error: null });

    const { result } = renderHook(() => useAIContentGeneration());
    let generatedContent: string | null = null;

    await act(async () => {
      generatedContent = await result.current.generateContent({ type: 'bio', context: {} });
    });

    expect(generatedContent).toBe('Generated bio');
    expect(mockToastSuccess).toHaveBeenCalledWith('Content generated successfully!');
    expect(mockSupabaseInvoke).toHaveBeenCalledTimes(1);
  });

  it('should allow content generation if plan is unlimited (max_ai_generations: -1)', async () => {
    mockUseSubscription.mockReturnValue({
      canUseAI: true,
      subscription: { plan: { name: 'Pro', max_ai_generations: -1 } }, // Unlimited
      usage: { ai_generations_count: 100 }, // High usage, but should still be allowed
    });
    mockSupabaseInvoke.mockResolvedValue({ data: { success: true, content: 'Generated project description' }, error: null });

    const { result } = renderHook(() => useAIContentGeneration());
    let generatedContent: string | null = null;

    await act(async () => {
      generatedContent = await result.current.generateProjectDescription({ name: 'Test Project' });
    });

    expect(generatedContent).toBe('Generated project description');
    expect(mockToastSuccess).toHaveBeenCalledWith('Content generated successfully!');
    expect(mockSupabaseInvoke).toHaveBeenCalledTimes(1);
  });

  it('should handle Supabase function invocation error', async () => {
    mockUseSubscription.mockReturnValue({
      canUseAI: true,
      subscription: { plan: { name: 'Pro', max_ai_generations: -1 } },
      usage: { ai_generations_count: 1 },
    });
    mockSupabaseInvoke.mockResolvedValue({ data: null, error: { message: 'Supabase error' } });

    const { result } = renderHook(() => useAIContentGeneration());
    let generatedContent: string | null = null;

    await act(async () => {
      generatedContent = await result.current.generateContent({ type: 'skill', context: { skill: 'React' } });
    });

    expect(generatedContent).toBeNull();
    expect(mockToastError).toHaveBeenCalledWith('Failed to generate content. Please try again.');
    expect(mockSupabaseInvoke).toHaveBeenCalledTimes(1);
  });

  it('should handle Supabase function invocation failure (data.success is false)', async () => {
    mockUseSubscription.mockReturnValue({
      canUseAI: true,
      subscription: { plan: { name: 'Pro', max_ai_generations: -1 } },
      usage: { ai_generations_count: 1 },
    });
    mockSupabaseInvoke.mockResolvedValue({ data: { success: false, error: 'AI failed' }, error: null });

    const { result } = renderHook(() => useAIContentGeneration());
    let generatedContent: string | null = null;

    await act(async () => {
      generatedContent = await result.current.generateContent({ type: 'experience', context: {} });
    });

    expect(generatedContent).toBeNull();
    expect(mockToastError).toHaveBeenCalledWith('AI failed');
    expect(mockSupabaseInvoke).toHaveBeenCalledTimes(1);
  });

  it('should set isGenerating state correctly', async () => {
    mockUseSubscription.mockReturnValue({
      canUseAI: true,
      subscription: { plan: { name: 'Pro', max_ai_generations: -1 } },
      usage: { ai_generations_count: 1 },
    });

    // Make invoke promise not resolve immediately to check isGenerating
    let resolvePromise: any;
    mockSupabaseInvoke.mockReturnValue(new Promise(resolve => { resolvePromise = resolve; }));

    const { result } = renderHook(() => useAIContentGeneration());

    expect(result.current.isGenerating).toBe(false);

    let promise: Promise<void>;
    act(() => {
      promise = result.current.generateContent({ type: 'bio', context: {} });
    });

    expect(result.current.isGenerating).toBe(true);

    await act(async () => {
      resolvePromise({ data: { success: true, content: 'Done' }, error: null });
      await promise;
    });

    expect(result.current.isGenerating).toBe(false);
  });

});
