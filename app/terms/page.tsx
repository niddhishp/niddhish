import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Use',
  description: 'Terms of use for niddhish.com and Light Seeker Films.',
}

const SECTIONS = [
  { title:'1. Acceptance of Terms', body:'By accessing and using niddhish.com, you accept and agree to be bound by these Terms of Use. If you do not agree, please do not use this website.' },
  { title:'2. Intellectual Property', body:'All content on this website — including films, photographs, writing, design elements, and brand materials — is the intellectual property of Niddhish Puuzhakkal and Light Seeker Films unless otherwise attributed. You may not reproduce, distribute, or use any content without prior written permission.' },
  { title:'3. Use of Content', body:'Content on this site is for informational and promotional purposes. You may share links to this site freely. You may not reproduce substantial portions of written content, film footage, or imagery without explicit written permission from Light Seeker Films.' },
  { title:'4. Contact Form and Communications', body:'When you submit a project brief through the contact form, you are providing information voluntarily. We will use this information solely to respond to your inquiry. We do not sell, share, or use contact information for unsolicited marketing.' },
  { title:'5. Film and Portfolio Content', body:'Films and commercial work featured on this site may include content owned by third-party brands, agencies, and production partners. All trademarks and brand identities belong to their respective owners.' },
  { title:'6. No Warranty', body:'This website is provided "as is." While we make every effort to ensure accuracy, we make no warranties regarding the completeness, reliability, or accuracy of information on this site.' },
  { title:'7. Limitation of Liability', body:'Light Seeker Films and Niddhish Puuzhakkal shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use of or inability to use this website.' },
  { title:'8. External Links', body:'This site may contain links to third-party websites including Vimeo, LinkedIn, and other platforms. We are not responsible for the content or privacy practices of those sites.' },
  { title:'9. Changes to Terms', body:'We reserve the right to modify these terms at any time. Continued use of the site following changes constitutes acceptance of the revised terms.' },
  { title:'10. Governing Law', body:'These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Mumbai, Maharashtra.' },
  { title:'11. Contact', body:'For questions about these terms, contact niddhish@lightseekermedia.com.' },
]

export default function TermsPage() {
  return (
    <div style={{ minHeight:'100dvh', background:'var(--color-bg)', paddingTop:'9rem', paddingBottom:'6rem' }}>
      <div style={{ maxWidth:760, padding:'0 clamp(1.25rem,5vw,3.5rem)' }}>
        <span className="text-label" style={{ display:'block', marginBottom:'1rem' }}>Legal</span>
        <h1 className="text-display-sm" style={{ color:'var(--color-text-primary)', marginBottom:'0.75rem' }}>Terms of Use</h1>
        <p style={{ fontSize:13, color:'var(--color-text-tertiary)', marginBottom:'4rem' }}>Last updated: April 2025 · Light Seeker Films, Mumbai</p>
        <div style={{ display:'flex', flexDirection:'column', gap:'2.5rem' }}>
          {SECTIONS.map(s=>(
            <div key={s.title}>
              <h2 style={{ fontSize:15, fontWeight:500, color:'var(--color-text-primary)', marginBottom:'0.75rem' }}>{s.title}</h2>
              <p style={{ fontSize:15, lineHeight:1.78, color:'var(--color-text-secondary)' }}>{s.body}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop:'4rem', paddingTop:'2rem', borderTop:'0.5px solid var(--color-border)', display:'flex', gap:'2rem', flexWrap:'wrap' }}>
          <Link href="/privacy" style={{ fontSize:13, color:'var(--color-text-tertiary)', textDecoration:'none' }}>Privacy Policy</Link>
          <Link href="/collaborate" style={{ fontSize:13, color:'var(--color-text-tertiary)', textDecoration:'none' }}>Contact</Link>
        </div>
      </div>
    </div>
  )
}
