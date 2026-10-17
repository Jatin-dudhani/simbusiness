import { redirect } from 'next/navigation';

export default function RootPage() {
  // Always start with login page as the primary entry point
  redirect('/login');
}