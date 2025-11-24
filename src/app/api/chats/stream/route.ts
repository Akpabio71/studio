import { NextResponse } from 'next/server'
import { subscribe, unreadCount, getOpenChats } from '@/lib/chats'

function sseEncode(data: any) {
  const json = JSON.stringify(data)
  return `data: ${json}\n\n`
}

export async function GET(request: Request) {
  let closed = false
  let unsubscribe: (() => void) | null = null

  const stream = new ReadableStream({
    start(controller) {
      // send an initial welcome payload with unread count and current chats
      controller.enqueue(new TextEncoder().encode(sseEncode({ type: 'init', count: unreadCount(), chats: getOpenChats() })))

      const onChange = (payload: any) => {
        if (closed) return
        try {
          controller.enqueue(new TextEncoder().encode(sseEncode(payload)))
        } catch (e) {
          // ignore enqueue errors
        }
      }

      // subscribe and keep the unsubscribe function to call on cancel
      unsubscribe = subscribe(onChange)
    },
    cancel() {
      try { closed = true } catch (e) {}
      try { if (typeof unsubscribe === 'function') unsubscribe() } catch (e) {}
    }
  })

  // When the client disconnects, there's no direct hook here, but the runtime will close the stream.
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive'
    }
  })
}
