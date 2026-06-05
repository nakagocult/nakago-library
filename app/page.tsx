import { redirect } from 'next/navigation';

// Site temporarily simplified to the Claim hub only.
// To restore the full homepage, revert this file (see git history) and
// restore the nav links in components/layout/Header.tsx and Footer.tsx.
export default function HomePage() {
  redirect('/claim');
}
