import { NextResponse } from 'next/server'
import { getOpenChats, addOpenChat, updateChat, unreadCount } from '@/lib/chats'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const q = url.searchParams.get('q')
  if (q === 'unread-count') {
    return NextResponse.json({ count: unreadCount() })
  }

  return NextResponse.json(getOpenChats())
}

export async function POST(request: Request) {
  const body = await request.json()
  // expect full chat object
  const chat = addOpenChat(body)
  return NextResponse.json(chat)
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, patch } = body
  const updated = updateChat(id, patch)
  if (!updated) return new Response(null, { status: 404 })
  return NextResponse.json(updated)
}
