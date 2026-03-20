import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIBreakdownResult, AIProvider, Task } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL || 'gemini-1.5-flash' })

export const geminiProvider: AIProvider = {
  async breakdownTask(title: string, description?: string): Promise<AIBreakdownResult> {
    const prompt = `Você é um assistente de produtividade especializado em TDAH.

Quebre a seguinte tarefa em micro-passos acionáveis e específicos.
Cada passo deve ser pequeno o suficiente para ser iniciado imediatamente, sem necessidade de planejar mais.
Use linguagem direta, ativa e em português brasileiro.
NÃO use verbos no infinitivo. Use imperativo (ex: "Abra o email", não "Abrir o email").

Tarefa: "${title}"
${description ? `Contexto: "${description}"` : ''}

Responda APENAS com JSON válido no seguinte formato:
{
  "steps": ["passo 1", "passo 2", ...],
  "estimated_minutes": número_inteiro
}

Regras:
- Entre 3 e 7 passos (máximo)
- Cada passo: máximo 10 palavras
- estimated_minutes: estimativa realista em minutos (TDAH tende a subestimar, então adicione 30% extra)
- Foque em ações físicas concretas, não em estados mentais`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    // Extrair JSON da resposta
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('Resposta da IA em formato inválido')
    }

    const parsed = JSON.parse(jsonMatch[0]) as AIBreakdownResult
    return parsed
  },

  async suggestTopThree(tasks: Task[], energyLevel: number): Promise<string[]> {
    if (tasks.length === 0) return []

    const energyDescription = {
      1: 'muito baixa (só tarefas automáticas)',
      2: 'baixa (tarefas simples e conhecidas)',
      3: 'média (tarefas normais)',
      4: 'boa (pode fazer coisas desafiadoras)',
      5: 'ótima (máxima capacidade cognitiva)',
    }[energyLevel] || 'média'

    const taskList = tasks
      .filter(t => t.status !== 'completed')
      .slice(0, 10) // limitar para não gastar tokens
      .map(t => `- ID: ${t.id} | Prioridade: ${t.priority} | Título: ${t.title}`)
      .join('\n')

    const prompt = `Você é um assistente de produtividade para TDAH.

Energia atual do usuário: ${energyDescription}

Tarefas disponíveis:
${taskList}

Selecione as 3 tarefas mais importantes para hoje, considerando:
1. Prioridade da tarefa
2. Nível de energia atual (energia baixa = tarefas mais simples)
3. Equilíbrio entre urgente e importante

Responda APENAS com JSON:
{"ids": ["id1", "id2", "id3"]}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return tasks.slice(0, 3).map(t => t.id)

    const parsed = JSON.parse(jsonMatch[0]) as { ids: string[] }
    return parsed.ids.slice(0, 3)
  },
}
