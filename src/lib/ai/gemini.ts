import { GoogleGenerativeAI } from '@google/generative-ai'
import type { AIBreakdownResult, AIProvider, ChatContext, ChatResponse, Task } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)
const model = genAI.getGenerativeModel({ model: process.env.AI_MODEL || 'gemini-1.5-flash' })

export const geminiProvider: AIProvider = {
  async breakdownTask(title: string, description?: string): Promise<AIBreakdownResult> {
    const prompt = `Você é um assistente de produtividade especializado em TDAH.

Quebre a seguinte tarefa em micro-passos acionáveis e específicos.
Cada passo deve ser pequeno o suficiente para ser iniciado imediatamente, sem necessidade de planejar mais.
Use linguagem direta, ativa e em português brasileiro.
NÃO use verbos no infinitivo. Use imperativo (ex: "Abra o email", em vez de "Abrir o email").

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
      .slice(0, 10)
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

  async chat(userMessage: string, context: ChatContext): Promise<ChatResponse> {
    const taskList = context.pendingTasks
      .slice(0, 20)
      .map(t => `- ${t.title} (id: ${t.id}, prioridade: ${t.priority})`)
      .join('\n') || 'nenhuma tarefa pendente'

    const prompt = `Você é Kairos, assistente de produtividade para adultos com TDAH e dupla excepcionalidade (2e). Responda em português brasileiro, tom editorial e direto, sem emojis, sem exageros, sem jargão motivacional.

O usuário disse: "${userMessage}"

Contexto atual:
- Data: ${context.todayDate}
- Nível de energia hoje: ${context.energyLevel ?? 'não definido'} (escala 1-5)
- Tarefas pendentes:
${taskList}

Você pode executar ações estruturadas. Escolha zero ou mais das disponíveis:

- create_task: cria uma nova tarefa. payload: { title: string, priority?: "high" | "medium" | "low", description?: string }
- breakdown_task: pede à IA para quebrar uma tarefa em micro-passos. payload: { title_or_id: string }
- suggest_top_three: pede à IA para escolher as 3 tarefas mais importantes de hoje. payload: {}
- complete_task: marca uma tarefa como concluída. payload: { title_or_id: string }
- save_context: salva onde o usuário parou numa tarefa, pausando ela. payload: { title_or_id: string, bookmark: string }
- set_energy: define o nível de energia atual. payload: { level: 1-5 }
- reply_only: apenas responde, sem executar ação. payload: {}

Regras:
- Se o usuário descreve algo a fazer (ex.: "preciso escrever o relatório"), use create_task com a prioridade inferida.
- Se pergunta "o que fazer hoje" ou "me ajuda a priorizar", use suggest_top_three.
- Se diz "terminei X" ou "fiz X", use complete_task.
- Se diz "vou pausar X porque Y", use save_context.
- Se menciona energia/cansaço/disposição, considere set_energy.
- Sempre acompanhe com um "reply" curto (máx 2 frases), confirmando o que fez.
- Se não há ação clara, use reply_only e responda brevemente.
- Linguagem: direta, sem bajulação, sem "claro!", sem "entendi!". Apenas a ação e o resultado.

Responda APENAS com JSON válido no formato:
{
  "reply": "texto curto em PT-BR",
  "actions": [
    {"type": "create_task", "payload": { "title": "...", "priority": "medium" }}
  ]
}`

    const result = await model.generateContent(prompt)
    const text = result.response.text()

    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { reply: 'Não consegui entender. Pode tentar de outro jeito?', actions: [] }
    }

    try {
      const parsed = JSON.parse(jsonMatch[0]) as ChatResponse
      return {
        reply: parsed.reply || '',
        actions: Array.isArray(parsed.actions) ? parsed.actions : [],
      }
    } catch {
      return { reply: 'Não consegui entender. Pode tentar de outro jeito?', actions: [] }
    }
  },
}
