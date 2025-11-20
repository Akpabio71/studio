'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '@/components/ui/button';
import { CategoryRole } from '@/lib/types';
import { ArrowRight } from 'lucide-react';

export function RoleSelector({ categoryId, roles }: { categoryId: string, roles: CategoryRole[] }) {
  const [selectedRole, setSelectedRole] = useState(roles[0].id);

  return (
    <div className="space-y-4">
      <Select onValueChange={setSelectedRole} defaultValue={selectedRole}>
        <SelectTrigger id={`role-select-${categoryId}`}>
          <SelectValue placeholder="Select a role" />
        </SelectTrigger>
        <SelectContent>
          {roles.map(role => (
            <SelectItem key={role.id} value={role.id}>
              {role.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button asChild className="w-full group">
        <Link href={`/chat/${categoryId}?role=${selectedRole}`}>
            Start Chat
            <ArrowRight className="w-4 h-4 ml-2 transform transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  );
}
