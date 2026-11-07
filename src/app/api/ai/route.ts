import { GoogleGenerativeAI } from '@google/generative-ai'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    let messages = body.messages

    if (!messages && body.message) {
      messages = [{ role: 'user', content: body.message }]
    }

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid messages payload' }, { status: 400 })
    }

    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY

    if (!apiKey || apiKey === 'your_gemini_api_key') {
      // Provide an intelligent simulated mock reply when no valid key is provided
      const userMessage = messages[messages.length - 1]?.parts || messages[messages.length - 1]?.content || 'Hello'
      return NextResponse.json({
        reply: `Hello! I am Nexus AI. I received your message: "${userMessage}". To enable real-time Gemini intelligence, please set a valid GEMINI_API_KEY in your .env.local file. How else can I assist you with your chats today?`,
      })
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction:
        'You are Nexus AI, an intelligent, helpful, and friendly chat companion integrated into the Nexus Chat application. Format responses clearly with markdown, code snippets, or bullet points where appropriate.',
    })

    const contents = messages.map((m: { role: string; parts?: string; content?: string }) => ({
      role: m.role === 'ai' || m.role === 'model' ? 'model' : 'user',
      parts: [{ text: m.parts || m.content || '' }],
    }))

    const result = await model.generateContent({
      contents,
    })

    const text = result.response.text()

    return NextResponse.json({ reply: text })
  } catch (error: unknown) {
    console.error('Gemini AI Error:', error)
    const message = error instanceof Error ? error.message : 'AI generation error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
