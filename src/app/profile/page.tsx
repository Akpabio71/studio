import fs from 'fs'
import path from 'path'
import ProfileForm from '@/components/profile/ProfileForm'

export const metadata = {
  title: 'Profile',
}

function readProfile() {
  try {
    const p = path.join(process.cwd(), 'data', 'profile.json')
    const raw = fs.readFileSync(p, 'utf-8')
    return JSON.parse(raw)
  } catch (e) {
    return { name: 'Your Name', email: 'you@example.com', avatar: null }
  }
}

export default function ProfilePage() {
  const profile = readProfile()
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <p className="text-sm text-muted-foreground mb-6">Update your profile details and avatar.</p>

      <ProfileForm initial={profile} />
    </div>
  )
}
