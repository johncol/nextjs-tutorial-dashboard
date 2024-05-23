import '@/app/ui/global.css';

import { inter } from '@/app/fonts';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Next.js Tutorial',
    template: '%s | Next.js Tutorial'
  },
  description: 'The official Next.js Course Dashboard, built with App Router.',
  metadataBase: new URL('https://nextjs-tutorial-dashboard-ivory.vercel.app'),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}
