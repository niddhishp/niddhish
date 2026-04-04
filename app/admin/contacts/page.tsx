'use client'

import { useState, useEffect } from 'react'

interface Contact {
  id: string
  project_type: string
  name: string
  email: string
  brief: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

const STATUS_COLORS = {
  new:     { bg: 'rgba(232,104,58,0.12)', text: '#e8683a', border: 'rgba(232,104,58,0.4)' },
  read:    { bg: 'rgba(100,140,220,0.1)',  text: '#84a8e8', border: 'rgba(100,140,220,0.3)' },
  replied: { bg: 'rgba(80,200,120,0.1)',   text: '#50c878', border: 'rgba(80,200,120,0.3)' },
}

export default function ContactsAdmin() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [selected, setSelected] = useState<Contact | null>(null)
  const [filter, setFilter]     = useState<'all' | 'new' | 'read' | 'replied'>('all')

  useEffect(() => { fetchContacts() }, [])

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/contacts')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch { setError('Could not load contacts. Check Supabase env vars in Vercel settings.') }
    finally { setLoading(false) }
  }

  const updateStatus = async (id: string, status: Contact['status']) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, { method:'PATCH', headers:{ 'Content-Type':'application/json' }, body: JSON.stringify({ status }) })
      setContacts(cs => cs.map(c => c.id === id ? { ...c, status } : c))
      if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
    } catch { setError('Could not update status.') }
  }

  const filtered = filter === 'all' ? contacts : contacts.filter(c => c.status === filter)
  const counts = { all: contacts.length, new: contacts.filter(c=>c.status==='new').length, read: contacts.filter(c=>c.status==='read').length, replied: contacts.filter(c=>c.status==='replied').length }

  return (
    <div>
      <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.5rem', letterSpacing:'-0.02em' }}>
        Project Briefs
      </h1>
      <p style={{ fontSize:14, color:'var(--color-text-secondary)', marginBottom:'2rem' }}>
        Contact form submissions from the website
      </p>

      <div style={{ display:'flex', gap:0, borderBottom:'0.5px solid var(--color-border)', marginBottom:'2rem' }}>
        {(['all','new','read','replied'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontSize:12, padding:'0.75rem 1.25rem',
            background:'transparent', border:'none',
            borderBottom: filter===f ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
            color: filter===f ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.04em', textTransform:'capitalize',
          }}>{f} ({counts[f]})</button>
        ))}
      </div>

      {error && (
        <div style={{ padding:'1rem 1.5rem', border:'0.5px solid rgba(255,80,80,0.3)', background:'rgba(255,80,80,0.05)', marginBottom:'1.5rem', fontSize:13, color:'#ff6060' }}>
          {error}<br/>
          <small style={{ opacity:0.7 }}>
            Set NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY + SUPABASE_SERVICE_ROLE_KEY in Vercel → Project Settings → Environment Variables, then redeploy.
          </small>
        </div>
      )}

      {loading ? (
        <div style={{ fontSize:14, color:'var(--color-text-tertiary)', padding:'3rem 0', textAlign:'center' }}>Loading…</div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap:'2rem' }}>
          <div>
            {filtered.length === 0 ? (
              <div style={{ fontSize:14, color:'var(--color-text-tertiary)', padding:'3rem 0', textAlign:'center' }}>
                {contacts.length === 0 ? 'No submissions yet. The contact form will populate this table.' : 'No contacts match this filter.'}
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column' }}>
                {filtered.map(c => {
                  const sc = STATUS_COLORS[c.status]
                  return (
                    <button key={c.id} onClick={() => { setSelected(c); updateStatus(c.id, 'read') }}
                      style={{
                        display:'grid', gridTemplateColumns:'1fr auto', alignItems:'start', gap:'1.5rem',
                        padding:'1.25rem', borderBottom:'0.5px solid var(--color-border)',
                        background: selected?.id===c.id ? 'var(--color-surface-1)' : 'transparent',
                        border:'none', cursor:'pointer', textAlign:'left', width:'100%', transition:'background 0.2s',
                      }}>
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.3rem', flexWrap:'wrap' }}>
                          <span style={{ fontSize:14, fontWeight:500, color:'var(--color-text-primary)' }}>{c.name}</span>
                          <span style={{ fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:sc.text, background:sc.bg, border:`0.5px solid ${sc.border}`, padding:'1px 7px', borderRadius:1 }}>{c.status}</span>
                        </div>
                        <p style={{ fontSize:13, color:'var(--color-text-tertiary)', marginBottom:'0.25rem' }}>{c.email} · {c.project_type}</p>
                        <p style={{ fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.4, overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' as const }}>{c.brief}</p>
                      </div>
                      <span style={{ fontSize:11, color:'var(--color-text-tertiary)', whiteSpace:'nowrap', paddingTop:2 }}>
                        {new Date(c.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {selected && (
            <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem', background:'var(--color-surface-1)', height:'fit-content', position:'sticky', top:'1rem' }}>
              <div style={{ display:'flex', alignItems:'start', justifyContent:'space-between', marginBottom:'1.5rem', gap:'1rem' }}>
                <div>
                  <h3 style={{ fontSize:18, fontWeight:400, fontFamily:'var(--font-playfair,serif)', color:'var(--color-text-primary)', marginBottom:'0.25rem' }}>{selected.name}</h3>
                  <a href={`mailto:${selected.email}`} style={{ fontSize:13, color:'var(--color-accent)', textDecoration:'none' }}>{selected.email}</a>
                </div>
                <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-tertiary)', fontSize:18, lineHeight:1, padding:'0 4px' }}>×</button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem', marginBottom:'2rem' }}>
                <div>
                  <span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', display:'block', marginBottom:'0.3rem' }}>Project Type</span>
                  <span style={{ fontSize:14, color:'var(--color-text-primary)' }}>{selected.project_type || '—'}</span>
                </div>
                <div>
                  <span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', display:'block', marginBottom:'0.3rem' }}>Received</span>
                  <span style={{ fontSize:14, color:'var(--color-text-primary)' }}>{new Date(selected.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}</span>
                </div>
                <div>
                  <span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', display:'block', marginBottom:'0.5rem' }}>Brief</span>
                  <p style={{ fontSize:14, color:'var(--color-text-secondary)', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{selected.brief}</p>
                </div>
              </div>

              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.project_type || 'Your Brief'} — Niddhish Puuzhakkal`} className="btn-primary" style={{ fontSize:12, padding:'0.625rem 1.25rem', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:6 }}>
                  Reply via Email
                </a>
                {selected.status !== 'replied' && (
                  <button onClick={() => updateStatus(selected.id, 'replied')} className="btn-ghost" style={{ fontSize:12, padding:'0.625rem 1.25rem' }}>
                    Mark Replied
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
