'use client';

import { AdminManagerIntro } from "./AdminManagerIntro";
import { EditorUserIntro } from "./EditorUserIntro";

export default function Intro({ role }: { role: string }) {
  const isHigherRole = role === 'admin' || role === 'manager';
  return isHigherRole ? <AdminManagerIntro /> : <EditorUserIntro />;
}
