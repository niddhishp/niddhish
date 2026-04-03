import Link from 'next/link'
import ApertureMark from '@/components/ApertureMark'

export default function NotFound() {
  return (
    <div style={{
      minHeight:'100dvh', background:'var(--color-bg)',
      display:'flex', flexDirection:'column',
      alignItems:'center', justifyContent:'center',
      textAlign:'center', gap:'1.5rem',
      padding:'2rem',
    }}>
      <ApertureMark size={48} />
      <span className="text-label">404</span>
      <h1 className="text-display-sm" style={{ color:'var(--color-text-primary)' }}>
        This frame doesn&apos;t exist.
      </h1>
      <p style={{ fontSize:15, color:'var(--color-text-secondary)', maxWidth:360 }}>
        The page you&apos;re looking for has been moved or removed.
      </p>
      <Link href="/" className="btn-ghost" style={{ marginTop:'0.5rem' }}>Back to Home</Link>
    </div>
  )
}
