'use client'

import { useState, useEffect } from 'react'
import type { Contact } from '@/lib/supabase'

const STATUS_COLORS = {
  new:     { bg: 'rgba(232,104,58,0.12)', text: '#e8683a', border: 'rgba(232,104,58,0.4)' },
  read:    { bg: 'rgba(100,140,220,0.1)',  text: '#84a8e8', border: 'rgba(100,140,220,0.3)' },
  replied: { bg: 'rgba(80,200,120,0.1)',   text: '#50c878', border: 'rgba(80,200,120,0.3)' },
}

export default function ContactsAdmin() {
  const [contacts, setContacts]   = useState<Contact[]>([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [selected, setSelected]   = useState<Contact | null>(null)
  const [filter, setFilter]       = useState<'all' | 'new' | 'read' | 'replied'>('all')

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/contacts')
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()
      setContacts(data.contacts || [])
    } catch (e) {
      setError('Could not load contacts. Check your Supabase configuration.')
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, status: Contact['status']) => {
    try {
      await fetch(`/api/admin/contacts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      setContacts(cs => cs.map(c => c.id === id ? { ...c, status } : c))
      if (selected?.id === id) setSelected(s => s ? { ...s, status } : s)
    } catch {
      setError('Could not update status.')
    }
  }

  const filtered = filter === 'all' ? contacts : contacts.filter(c => c.status === filter)
  const counts   = {
    all:     contacts.length,
    new:     contacts.filter(c => c.status === 'new').length,
    read:    contacts.filter(c => c.status === 'read').length,
    replied: contacts.filter(c => c.status === 'replied').length,
  }

  return (
    <div>
      <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', marginBottom:'0.5rem', letterSpacing:'-0.02em' }}>
        Project Briefs
      </h1>
      <p style={{ fontSize:14, color:'var(--color-text-secondary)', marginBottom:'2rem' }}>
        Contact form submissions from the website
      </p>

      {/* Filter tabs */}
      <div style={{ display:'flex', gap:0, borderBottom:'0.5px solid var(--color-border)', marginBottom:'2rem' }}>
        {(['all','new','read','replied'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            fontSize:12, padding:'0.75rem 1.25rem',
            background:'transparent', border:'none',
            borderBottom: filter===f ? '1.5px solid var(--color-accent)' : '1.5px solid transparent',
            color: filter===f ? 'var(--color-accent)' : 'var(--color-text-secondary)',
            cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.04em',
            textTransform:'capitalize',
          }}>
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      {error && (
        <div style={{ padding:'1.5rem', border:'0.5px solid rgba(255,80,80,0.3)', background:'rgba(255,80,80,0.05)', marginBottom:'2rem', fontSize:14, color:'#ff5050' }}>
          {error}
          <br/><small style={{ opacity:0.7 }}>Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in Vercel environment variables, and the contacts table has been created.</small>
        </div>
      )}

      {loading ? (
        <div style={{ fontSize:14, color:'var(--color-text-tertiary)', padding:'3rem 0', textAlign:'center' }}>
          Loading contacts...
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns: selected ? '1fr 380px' : '1fr', gap:'2rem' }}>
          {/* List */}
          <div>
            {filtered.length === 0 ? (
              <div style={{ fontSize:14, color:'var(--color-text-tertiary)', padding:'3rem 0', textAlign:'center' }}>
                {contacts.length === 0 ? 'No submissions yet.' : 'No contacts match this filter.'}
              </div>
            ) : (
              <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
                {filtered.map(contact => {
                  const sc = STATUS_COLORS[contact.status]
                  return (
                    <button
                      key={contact.id}
                      onClick={() => { setSelected(contact); updateStatus(contact.id, 'read') }}
                      style={{
                        display:'grid', gridTemplateColumns:'1fr auto',
                        alignItems:'start', gap:'1.5rem',
                        padding:'1.25rem',
                        borderBottom:'0.5px solid var(--color-border)',
                        background: selected?.id===contact.id ? 'var(--color-surface-1)' : 'transparent',
                        border:'none', cursor:'pointer', textAlign:'left', width:'100%',
                        transition:'background 0.2s',
                      }}
                    >
                      <div>
                        <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.3rem', flexWrap:'wrap' }}>
                          <span style={{ fontSize:14, fontWeight:500, color:'var(--color-text-primary)' }}>{contact.name}</span>
                          <span style={{ fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:sc.text, background:sc.bg, border:`0.5px solid ${sc.border}`, padding:'1px 7px', borderRadius:1 }}>
                            {contact.status}
                          </span>
                        </div>
                        <p style={{ fontSize:13, color:'var(--color-text-tertiary)', marginBottom:'0.25rem' }}>
                          {contact.email} &nbsp;·&nbsp; {contact.project_type}
                        </p>
                        <p style={{ fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.4, display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' as const, overflow:'hidden' }}>
                          {contact.brief}
                        </p>
                      </div>
                      <span style={{ fontSize:11, color:'var(--color-text-tertiary)', whiteSpace:'nowrap', paddingTop:2 }}>
                        {new Date(contact.created_at).toLocaleDateString('en-IN', { day:'2-digit', month:'short' })}
                      </span>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Detail panel */}
          {selected && (
            <div style={{
              border:'0.5px solid var(--color-border)', padding:'1.5rem',
              background:'var(--color-surface-1)', height:'fit-content',
              position:'sticky', top:'1rem',
            }}>
              <div style={{ display:'flex', alignItems:'start', justifyContent:'space-between', marginBottom:'1.5rem', gap:'1rem' }}>
                <div>
                  <h3 style={{ fontSize:18, fontWeight:400, fontFamily:'var(--font-playfair,serif)', color:'var(--color-text-primary)', marginBottom:'0.25rem' }}>
                    {selected.name}
                  </h3>
                  <a href={`mailto:${selected.email}`} style={{ fontSize:13, color:'var(--color-accent)', textDecoration:'none' }}>
                    {selected.email}
                  </a>
                </div>
                <button onClick={() => setSelected(null)} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--color-text-tertiary)', fontSize:16, padding:'0 4px' }}>×</button>
              </div>

              <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem', marginBottom:'2rem' }}>
                <div>
                  <span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', display:'block', marginBottom:'0.3rem' }}>Project Type</span>
                  <span style={{ fontSize:14, color:'var(--color-text-primary)' }}>{selected.project_type}</span>
                </div>
                <div>
                  <span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', display:'block', marginBottom:'0.3rem' }}>Received</span>
                  <span style={{ fontSize:14, color:'var(--color-text-primary)' }}>
                    {new Date(selected.created_at).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' })}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-text-tertiary)', display:'block', marginBottom:'0.5rem' }}>Brief</span>
                  <p style={{ fontSize:14, color:'var(--color-text-secondary)', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{selected.brief}</p>
                </div>
              </div>

              <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                <a href={`mailto:${selected.email}?subject=Re: ${selected.project_type} — Niddhish Puuzhakkal`} className="btn-primary" style={{ fontSize:12, padding:'0.625rem 1.25rem' }}>
                  Reply via Email
                </a>
                {selected.status !== 'replied' && (
                  <button onClick={() => updateStatus(selected.id, 'replied')} className="btn-ghost" style={{ fontSize:12, padding:'0.625rem 1.25rem' }}>
                    Mark as Replied
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
