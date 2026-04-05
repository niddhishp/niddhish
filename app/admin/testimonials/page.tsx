'use client'
import { useState, useEffect } from 'react'
interface T { id:string; quote:string; name:string; title:string; company:string; sort_order:number; published:boolean }
const EMPTY: Omit<T,'id'> = { quote:'', name:'', title:'', company:'', sort_order:99, published:true }
export default function AdminTestimonials() {
  const [items, setItems] = useState<T[]>([]); const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list'|'edit'|'new'>('list'); const [editing, setEditing] = useState<Partial<T>>({})
  const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [del, setDel] = useState<string|null>(null)
  useEffect(()=>{fetch('/api/admin/testimonials').then(r=>r.json()).then(d=>{if(d.testimonials)setItems(d.testimonials)}).finally(()=>setLoading(false))},[])
  const save = async () => {
    if(!editing.quote||!editing.name)return; setSaving(true); setError('')
    try {
      const isNew=view==='new'
      const res = isNew
        ? await fetch('/api/admin/testimonials',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...editing})})
        : await fetch(`/api/admin/testimonials/${editing.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(editing)})
      if(!res.ok)throw new Error((await res.json()).error)
      const d=await fetch('/api/admin/testimonials').then(r=>r.json()); setItems(d.testimonials||[]); setView('list')
    } catch(e){setError(e instanceof Error?e.message:'Failed')} finally{setSaving(false)}
  }
  const upd=(k:keyof T)=>(e:React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>setEditing(p=>({...p,[k]:e.target.value}))
  if(view!=='list') return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'2rem'}}>
        <button onClick={()=>setView('list')} style={backBtn}>← Back</button>
        <h1 style={h1}>{view==='new'?'New Testimonial':`Edit Testimonial`}</h1>
      </div>
      {error&&<div style={errBox}>{error}</div>}
      <div style={{display:'flex',flexDirection:'column',gap:'1.25rem',maxWidth:640}}>
        <div><label style={lbl}>Quote *</label><textarea value={editing.quote||''} onChange={upd('quote')} rows={4} style={{...inp,resize:'vertical' as const}} placeholder='"Working with Niddhish changes how you think..."'/></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
          <div><label style={lbl}>Name *</label><input value={editing.name||''} onChange={upd('name')} style={inp} placeholder="Jane Smith"/></div>
          <div><label style={lbl}>Title / Role</label><input value={editing.title||''} onChange={upd('title')} style={inp} placeholder="Creative Director"/></div>
          <div><label style={lbl}>Company</label><input value={editing.company||''} onChange={upd('company')} style={inp} placeholder="Global Agency, Mumbai"/></div>
          <div><label style={lbl}>Sort Order</label><input type="number" value={editing.sort_order||99} onChange={e=>setEditing(p=>({...p,sort_order:+e.target.value}))} style={inp}/></div>
        </div>
        <label style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:13,color:'var(--color-text-secondary)',cursor:'pointer'}}>
          <input type="checkbox" checked={!!editing.published} onChange={e=>setEditing(p=>({...p,published:e.target.checked}))}/>Published (visible on site)
        </label>
        <button onClick={save} disabled={saving} className="btn-primary" style={{alignSelf:'flex-start',opacity:saving?0.6:1}}>
          {saving?'Saving…':view==='new'?'Add Testimonial':'Save Changes'}
        </button>
      </div>
    </div>
  )
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2.5rem',flexWrap:'wrap',gap:'1rem'}}>
        <div><h1 style={h1}>Testimonials</h1><p style={{fontSize:14,color:'var(--color-text-secondary)'}}>{loading?'Loading…':`${items.length} testimonials · SCENE 05 — THE CRITICS`}</p></div>
        <button onClick={()=>{setEditing({...EMPTY});setView('new')}} className="btn-primary">+ Add Testimonial</button>
      </div>
      {error&&<div style={{...errBox,marginBottom:'1.5rem'}}>{error}</div>}
      {loading?<div style={{padding:'3rem',textAlign:'center',color:'var(--color-text-tertiary)'}}>Loading…</div>:(
        <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
          {items.map(t=>(
            <div key={t.id} style={{border:'0.5px solid var(--color-border)',padding:'1.5rem',background:'var(--color-surface-1)',position:'relative',opacity:t.published?1:0.5}}>
              <p style={{fontFamily:'var(--font-playfair,serif)',fontStyle:'italic',fontSize:16,color:'var(--color-text-primary)',marginBottom:'1rem',lineHeight:1.6}}>&ldquo;{t.quote}&rdquo;</p>
              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div>
                  <p style={{fontSize:13,color:'var(--color-text-primary)',fontWeight:500}}>{t.name}</p>
                  <p style={{fontSize:12,color:'var(--color-text-tertiary)'}}>{t.title}{t.company?` · ${t.company}`:''}</p>
                </div>
                <div style={{display:'flex',gap:'0.75rem'}}>
                  <button onClick={()=>{setEditing({...t});setView('edit')}} style={{background:'none',border:'none',color:'var(--color-accent)',cursor:'pointer',fontSize:12}}>Edit</button>
                  <button onClick={()=>setDel(t.id)} style={{background:'none',border:'none',color:'rgba(255,80,80,0.6)',cursor:'pointer',fontSize:12}}>Delete</button>
                </div>
              </div>
            </div>
          ))}
          {items.length===0&&<div style={{padding:'3rem',border:'0.5px solid var(--color-border)',textAlign:'center'}}><p style={{fontSize:14,color:'var(--color-text-tertiary)',marginBottom:'1rem'}}>No testimonials yet.</p><button onClick={()=>{setEditing({...EMPTY});setView('new')}} className="btn-primary">Add First Testimonial</button></div>}
        </div>
      )}
      {del&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}}><div style={{background:'#111',border:'0.5px solid var(--color-border)',padding:'2rem',maxWidth:360,width:'90%'}}><p style={{fontSize:15,color:'var(--color-text-primary)',marginBottom:'1.5rem'}}>Delete this testimonial?</p><div style={{display:'flex',gap:'0.75rem'}}><button onClick={async()=>{await fetch(`/api/admin/testimonials/${del}`,{method:'DELETE'});setItems(i=>i.filter(x=>x.id!==del));setDel(null)}} style={{background:'rgba(255,80,80,0.15)',border:'0.5px solid rgba(255,80,80,0.4)',color:'#ff6060',padding:'0.625rem 1.25rem',cursor:'pointer',fontSize:13,fontFamily:'inherit'}}>Delete</button><button onClick={()=>setDel(null)} className="btn-ghost" style={{fontSize:13}}>Cancel</button></div></div></div>}
    </div>
  )
}
const inp:React.CSSProperties={width:'100%',background:'var(--color-surface-1)',border:'0.5px solid var(--color-border-mid)',padding:'0.625rem 0.875rem',fontSize:13,color:'var(--color-text-primary)',fontFamily:'inherit',outline:'none',boxSizing:'border-box'}
const lbl:React.CSSProperties={display:'block',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--color-text-tertiary)',marginBottom:4}
const h1:React.CSSProperties={fontFamily:'var(--font-playfair,serif)',fontSize:28,fontWeight:400,color:'var(--color-text-primary)',letterSpacing:'-0.02em'}
const backBtn:React.CSSProperties={background:'none',border:'0.5px solid var(--color-border)',color:'var(--color-text-secondary)',padding:'0.5rem 1rem',cursor:'pointer',fontSize:13,fontFamily:'inherit'}
const errBox:React.CSSProperties={padding:'0.75rem 1rem',background:'rgba(255,80,80,0.08)',border:'0.5px solid rgba(255,80,80,0.3)',color:'#ff6060',fontSize:13}
