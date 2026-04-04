'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'

interface ImageUploadProps {
  value?: string | null
  onChange: (url: string) => void
  label?: string
  hint?: string
  aspect?: string   // e.g. '2/3' or '16/9' or '1/1'
  bucket?: string
}

export default function ImageUpload({
  value, onChange, label = 'Image', hint, aspect = '16/9', bucket = 'uploads'
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [urlInput, setUrlInput] = useState(value || '')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    if (!file) return
    setUploading(true); setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('bucket', bucket)
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Upload failed')
      onChange(json.url)
      setUrlInput(json.url)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Upload failed')
    } finally { setUploading(false) }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const currentUrl = value || urlInput

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
      {label && (
        <label style={{ fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)' }}>
          {label}
        </label>
      )}

      {/* Drop zone / preview */}
      <div
        onDrop={handleDrop}
        onDragOver={e=>e.preventDefault()}
        onClick={()=>inputRef.current?.click()}
        style={{
          position:'relative', aspectRatio: aspect,
          background: currentUrl ? 'transparent' : 'var(--color-surface-1)',
          border:`0.5px dashed ${currentUrl ? 'var(--color-border)' : 'var(--color-border-mid)'}`,
          cursor:'pointer', overflow:'hidden',
          display:'flex', alignItems:'center', justifyContent:'center',
          transition:'border-color 0.2s',
          maxHeight: aspect === '1/1' ? 160 : aspect === '2/3' ? 280 : 200,
        }}
      >
        {currentUrl ? (
          <>
            <img
              src={currentUrl}
              alt="preview"
              style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }}
            />
            <div style={{
              position:'absolute', inset:0,
              background:'rgba(0,0,0,0)',
              transition:'background 0.2s',
              display:'flex', alignItems:'center', justifyContent:'center',
            }} className="img-hover">
              <span className="img-replace" style={{
                fontSize:11, letterSpacing:'0.1em', textTransform:'uppercase',
                color:'#fff', background:'rgba(0,0,0,0.7)', padding:'0.4rem 0.875rem',
                opacity:0, transition:'opacity 0.2s',
              }}>Replace</span>
            </div>
          </>
        ) : (
          <div style={{ textAlign:'center', padding:'1.5rem' }}>
            {uploading ? (
              <p style={{ fontSize:13, color:'var(--color-accent)' }}>Uploading…</p>
            ) : (
              <>
                <div style={{ fontSize:24, marginBottom:'0.5rem', opacity:0.4 }}>↑</div>
                <p style={{ fontSize:13, color:'var(--color-text-secondary)', marginBottom:'0.25rem' }}>
                  Drop image here or <span style={{ color:'var(--color-accent)', textDecoration:'underline' }}>browse</span>
                </p>
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>PNG, JPG, WebP, AVIF</p>
              </>
            )}
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display:'none' }}
          onChange={e=>{ const f=e.target.files?.[0]; if(f) handleFile(f) }}
        />
      </div>

      {/* URL input as alternative */}
      <div style={{ display:'flex', gap:'0.5rem', alignItems:'center' }}>
        <input
          value={urlInput}
          onChange={e=>{ setUrlInput(e.target.value); onChange(e.target.value) }}
          placeholder="Or paste image URL…"
          style={{
            flex:1, background:'var(--color-surface-1)',
            border:'0.5px solid var(--color-border-mid)',
            padding:'0.5rem 0.75rem', fontSize:12,
            color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none',
          }}
        />
        {currentUrl && (
          <button
            onClick={()=>{ setUrlInput(''); onChange('') }}
            style={{ background:'none', border:'none', color:'rgba(255,80,80,0.6)', cursor:'pointer', fontSize:16, padding:'0 4px', lineHeight:1 }}
          >×</button>
        )}
      </div>

      {error && <p style={{ fontSize:11, color:'#ff6060' }}>{error}</p>}
      {hint && <p style={{ fontSize:11, color:'var(--color-text-tertiary)', lineHeight:1.5 }}>{hint}</p>}

      <style>{`.img-hover:hover { background: rgba(0,0,0,0.4) !important; } .img-hover:hover .img-replace { opacity: 1 !important; }`}</style>
    </div>
  )
}
