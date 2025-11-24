import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

type Profile = {
  name: string
  email: string
  avatar?: string | null
}

const DATA_PATH = path.join(process.cwd(), 'data', 'profile.json')

function writeProfile(data: Profile) {
  fs.mkdirSync(path.dirname(DATA_PATH), { recursive: true })
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf-8')
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, avatar } = body
    if (!name || !email) return NextResponse.json({ error: 'name and email required' }, { status: 400 })

    const profile: Profile = { name, email, avatar: avatar ?? null }
    writeProfile(profile)
    return NextResponse.json(profile)
  } catch (e) {
    console.error('profile save error', e)
    return NextResponse.json({ error: 'failed' }, { status: 500 })
  }
}
