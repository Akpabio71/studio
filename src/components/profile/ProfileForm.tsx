"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

type Profile = {
  name: string;
  email: string;
  avatar?: string | null;
};

export default function ProfileForm({ initial }: { initial?: Profile }) {
  const [name, setName] = useState(initial?.name ?? 'Your Name');
  const [email, setEmail] = useState(initial?.email ?? 'you@example.com');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(initial?.avatar ?? null);
  const [file, setFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      // revoke object URL when unmounting
      if (avatarUrl && avatarUrl.startsWith('blob:')) URL.revokeObjectURL(avatarUrl);
    };
  }, [avatarUrl]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setAvatarUrl(url);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      // If a file was selected, attempt a simple base64 upload in the JSON payload.
      let avatarBase64: string | undefined;
      if (file) {
        avatarBase64 = await toBase64(file);
      }

      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, avatar: avatarBase64 }),
      });
      if (!res.ok) throw new Error('Failed to save profile');
      setMessage('Saved');
    } catch (err) {
      console.error(err);
      setMessage('Error saving profile');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-full overflow-hidden bg-muted-foreground/10 flex items-center justify-center">
          {avatarUrl ? (
            // next/image requires static imports for optimization, but fallback to img for uploaded blobs
            avatarUrl.startsWith('blob:') ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={avatarUrl} alt="avatar" className="w-full h-full object-cover" />
            ) : (
              <Image src={avatarUrl} alt="avatar" width={80} height={80} className="object-cover" />
            )
          ) : (
            <div className="text-muted-foreground">No avatar</div>
          )}
        </div>

        <div className="flex-1">
          <label className="text-sm text-muted-foreground block mb-1">Upload avatar</label>
          <input type="file" accept="image/*" onChange={onFileChange} />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Name</label>
          <Input value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div>
          <label className="text-sm text-muted-foreground block mb-1">Email</label>
          <Input value={email} onChange={e => setEmail(e.target.value)} />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : 'Save'}
          </Button>
          {message && <div className="text-sm text-muted-foreground">{message}</div>}
        </div>
      </div>
    </div>
  );
}

function toBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // strip the prefix
      const idx = result.indexOf(',');
      resolve(idx >= 0 ? result.slice(idx + 1) : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
