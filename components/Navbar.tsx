'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();
  const links = [
    { href: '/', label: 'Home' },
    { href: '/upload', label: 'Upload' },
    { href: '/chat', label: 'Chat' },
  ];

  return (
    <nav style={{
      borderBottom: '1px solid rgba(255,255,255,0.06)',
      background: '#0D0D14',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: 56,
    }}>
      <Link href="/" style={{ textDecoration: 'none' }}>
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 14,
          color: '#00C896',
          letterSpacing: '0.12em',
          fontWeight: 700,
        }}>
          DOCUMIND
        </span>
      </Link>
      <div style={{ display: 'flex', gap: 4 }}>
        {links.map(({ href, label }) => (
          <Link key={href} href={href} style={{
            padding: '6px 14px',
            borderRadius: 6,
            fontSize: 13,
            textDecoration: 'none',
            color: pathname === href ? '#00C896' : '#6B7280',
            background: pathname === href ? 'rgba(0,200,150,0.08)' : 'transparent',
            border: pathname === href ? '1px solid rgba(0,200,150,0.2)' : '1px solid transparent',
            fontFamily: "'Courier New', monospace",
          }}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}