import fs from 'fs'
import path from 'path'

const DATA_PATH = path.join(process.cwd(), 'data', 'chats.json')

export type OpenChat = {
  id: string
  name: string
  categoryId: string
  roleId: string
  updatedAt: string
  unread?: number
  lastMessageSnippet?: string
}

function readFile(): OpenChat[] {
  try {
    const raw = fs.readFileSync(DATA_PATH, 'utf-8')
    return JSON.parse(raw) as OpenChat[]
  } catch (e) {
    return []
  }
}

function writeFile(chats: OpenChat[]) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
  fs.writeFileSync(DATA_PATH, JSON.stringify(chats, null, 2), 'utf-8')
}

export function getOpenChats(): OpenChat[] {
  return readFile()
}

export function addOpenChat(chat: OpenChat) {
  const chats = readFile()
  chats.unshift(chat)
  writeFile(chats)
  // notify subscribers about new chat
  notifySubscribers({ type: 'add', chat })
  return chat
}

export function updateChat(id: string, patch: Partial<OpenChat>) {
  const chats = readFile()
  const idx = chats.findIndex(c => c.id === id)
  if (idx === -1) return null
  chats[idx] = { ...chats[idx], ...patch }
  writeFile(chats)
  // notify subscribers about update
  notifySubscribers({ type: 'update', chat: chats[idx] })
  return chats[idx]
}

export function unreadCount() {
  const chats = readFile()
  return chats.reduce((sum, c) => sum + (c.unread || 0), 0)
}

// Simple in-memory pubsub for server-sent events / websocket broadcasting
type Subscriber = (payload: any) => void
const subscribers: Subscriber[] = []

export function subscribe(fn: Subscriber) {
  subscribers.push(fn)
  return () => {
    const idx = subscribers.indexOf(fn)
    if (idx !== -1) subscribers.splice(idx, 1)
  }
}

function notifySubscribers(payload: any) {
  for (const s of subscribers) {
    try {
      s(payload)
    } catch (e) {
      // ignore
    }
  }
}
