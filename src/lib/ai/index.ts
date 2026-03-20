// AI Provider Adapter — troque o provider via env AI_PROVIDER
// Suporta: gemini (padrão, grátis), claude (futuro), groq (futuro)

import type { AIProvider } from '@/types'

export async function getAIProvider(): Promise<AIProvider> {
  const provider = process.env.AI_PROVIDER || 'gemini'

  switch (provider) {
    case 'gemini': {
      const { geminiProvider } = await import('./gemini')
      return geminiProvider
    }
    // Futuro: adicionar ClaudeProvider, GroqProvider
    default: {
      const { geminiProvider } = await import('./gemini')
      return geminiProvider
    }
  }
}
