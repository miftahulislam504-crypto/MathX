import OpenAI from 'openai'
import { TutorMessage } from '@/types'

let openaiInstance: OpenAI | null = null

// Lazily construct the client on first real use. The OpenAI SDK's constructor
// throws synchronously if no API key is present, which would otherwise crash
// Next.js during build-time page-data collection (this module is imported by
// an API route, so it gets evaluated even before any request comes in).
function getOpenAI(): OpenAI {
  if (!openaiInstance) {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        'OPENAI_API_KEY is not set. Add it to your environment variables to use the AI tutor.'
      )
    }
    openaiInstance = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  }
  return openaiInstance
}

const SYSTEM_PROMPT = `You are MathX AI Tutor — an expert mathematics teacher. 
Your role:
- Explain concepts clearly with step-by-step reasoning
- Use LaTeX notation for math: wrap inline math in \\( \\) and display math in \\[ \\]
- Give concrete examples before abstract definitions
- Ask follow-up questions to check understanding
- Suggest practice problems after explaining a concept
- Adapt to the student's level (school, college, university, research)
- Be encouraging and patient

When solving problems:
1. Identify what is given and what is asked
2. Show every step clearly
3. Explain WHY each step is taken
4. Verify the answer when possible`

export async function askTutor(
  messages: TutorMessage[],
  topicContext?: string
): Promise<string> {
  const systemContent = topicContext
    ? `${SYSTEM_PROMPT}\n\nCurrent topic: ${topicContext}`
    : SYSTEM_PROMPT

  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemContent },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ],
    temperature: 0.7,
    max_tokens: 2048,
  })

  return response.choices[0]?.message?.content ?? 'Sorry, I could not generate a response.'
}

export async function generatePracticeProblems(
  topic: string,
  level: string,
  count = 5
): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Generate ${count} practice problems on "${topic}" for ${level} level students.
Return as JSON array: [{ "id": 1, "question": "...", "hint": "...", "solution": "...", "difficulty": "BEGINNER|INTERMEDIATE|ADVANCED" }]
Use LaTeX for math expressions. Return only the JSON array, no markdown.`,
      },
    ],
    temperature: 0.8,
    max_tokens: 2000,
    response_format: { type: 'json_object' },
  })

  return response.choices[0]?.message?.content ?? '{"problems":[]}'
}

export async function explainConcept(concept: string, level: string): Promise<string> {
  const response = await getOpenAI().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      {
        role: 'user',
        content: `Explain "${concept}" for a ${level} level student. Include:
1. Intuitive definition
2. Formal definition with LaTeX
3. A concrete example
4. Common misconceptions
5. Real-world application`,
      },
    ],
    temperature: 0.6,
    max_tokens: 1500,
  })

  return response.choices[0]?.message?.content ?? ''
}
