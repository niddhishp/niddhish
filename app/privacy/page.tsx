import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Privacy Policy' }
export default function PrivacyPage() {
  return (
    <div style={{ minHeight:'100dvh', background:'var(--color-bg)', paddingTop:'9rem', padding:'9rem clamp(1.25rem,5vw,3.5rem) 6rem' }}>
      <div style={{ maxWidth:680 }}>
        <span className="text-label" style={{ display:'block', marginBottom:'1rem' }}>Legal</span>
        <h1 className="text-display-sm" style={{ color:'var(--color-text-primary)', marginBottom:'2rem' }}>Privacy Policy</h1>
        <p style={{ fontSize:15, lineHeight:1.78, color:'var(--color-text-secondary)' }}>
          This website collects only the information you voluntarily provide through the contact form — your name, email, and project brief. This information is used solely to respond to your inquiry and is never sold, shared, or used for marketing purposes without your consent.
        </p>
        <p style={{ fontSize:15, lineHeight:1.78, color:'var(--color-text-secondary)', marginTop:'1.5rem' }}>
          For any privacy-related questions, contact niddhish@lightseekermedia.com.
        </p>
      </div>
    </div>
  )
}
