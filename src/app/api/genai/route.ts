import { NextResponse } from 'next/server'
import { chatFlow } from '@/ai/flows/chatFlow'

export async function POST(request: Request) {
  // Ensure an API key is present in the environment. The Genkit/google plugin will typically
  // read its own env var, but we surface a clear error here to avoid silent failures.
  const apiKey = process.env.GENKIT_API_KEY || process.env.GOOGLE_API_KEY || process.env.GOOGLE_API_KEY_ALT
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing AI API key in server environment (set GENKIT_API_KEY or GOOGLE_API_KEY).' }, { status: 500 })
  }

  let body: any
  try {
    body = await request.json()
  } catch (err) {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const message = body?.message
  if (!message || typeof message !== 'string') {
    return NextResponse.json({ error: '`message` string is required in the request body' }, { status: 400 })
  }

  try {
    const result = await chatFlow({ message })
    const reply = result?.reply ?? ''
    return NextResponse.json({ reply })
  } catch (err) {
    // Log server-side for debugging, but return a generic error to the client
    console.error('genai route error', err)
    return NextResponse.json({ error: 'AI request failed' }, { status: 500 })
  }
}
