import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || '')

export const geminiModel = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: `You are Nexus AI, a helpful and friendly AI assistant built into the Nexus Chat application.
You help users with questions, creative tasks, coding, writing, and more.
Keep responses concise but complete. Use markdown formatting when appropriate.
You have a warm, conversational personality.`,
})

/**
 * Sends a message to the Gemini model using streaming and calls `onChunk`
 * for each text chunk received. Returns the full accumulated response text.
 *
 * @param messages - Conversation history (all roles), last entry is the latest user turn.
 * @param onChunk  - Callback invoked with each streamed text chunk.
 * @returns        - The complete response string.
 */
export async function streamGeminiResponse(
  messages: Array<{ role: 'user' | 'model'; parts: string }>,
  onChunk: (chunk: string) => void
): Promise<string> {
  const chat = geminiModel.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.parts }],
    })),
  })

  const lastMessage = messages[messages.length - 1]
  const result = await chat.sendMessageStream(lastMessage.parts)

  let fullText = ''
  for await (const chunk of result.stream) {
    const chunkText = chunk.text()
    fullText += chunkText
    onChunk(chunkText)
  }
  return fullText
}

/**
 * Sends a single (non-streaming) message to the Gemini model and returns the
 * full response text. Useful for one-off AI completions.
 */
export async function getGeminiResponse(
  messages: Array<{ role: 'user' | 'model'; parts: string }>
): Promise<string> {
  const chat = geminiModel.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role,
      parts: [{ text: m.parts }],
    })),
  })

  const lastMessage = messages[messages.length - 1]
  const result = await chat.sendMessage(lastMessage.parts)
  return result.response.text()
}
