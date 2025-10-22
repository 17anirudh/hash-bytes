import './globals.css';
import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import Link from 'next/link';
 
const inter = Inter({ subsets: ['latin'] })
 
export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}
 
export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body className='text-center flex flex-col justify-center bg-neutral-900 text-neutral-50'>
        <h1>404 - Page Not Found</h1>
        <p>This page does not exist.</p>
        <Link href="/">Click here to navigate back to home page</Link>
      </body>
    </html>
  )
}