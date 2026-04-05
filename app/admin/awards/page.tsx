'use client'
import { useState, useEffect } from 'react'
import ImageUpload from '@/components/ImageUpload'
interface Award { id:string; name:string; festival:string; year:string; logo_url:string; sort_order:number; published:boolean }
const EMPTY: Omit<Award,'id'> = { name:'', festival:'', year:'', logo_url:'', sort_order:99, published:true }
export default function AdminAwards() {
  const [items, setItems] = useState<Award[]>([]); const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'list'|'edit'|'new'>('list'); const [editing, setEditing] = useState<Partial<Award>>({})
  const [saving, setSaving] = useState(false); const [error, setError] = useState(''); const [del, setDel] = useState<string|null>(null)
  useEffect(()=>{fetch('/api/admin/awards').then(r=>r.json()).then(d=>{if(d.awards)setItems(d.awards)}).finally(()=>setLoading(false))},[])
  const save = async () => {
    if(!editing.name)return; setSaving(true); setError('')
    try {
      const isNew=view==='new'
      const res = isNew
        ? await fetch('/api/admin/awards',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...editing})})
        : await fetch(`/api/admin/awards/${editing.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(editing)})
      if(!res.ok)throw new Error((await res.json()).error)
      const d=await fetch('/api/admin/awards').then(r=>r.json()); setItems(d.awards||[]); setView('list')
    } catch(e){setError(e instanceof Error?e.message:'Failed')} finally{setSaving(false)}
  }
  const upd=(k:keyof Award)=>(e:React.ChangeEvent<HTMLInputElement>)=>setEditing(p=>({...p,[k]:e.target.value}))
  if(view!=='list') return (
    <div>
      <div style={{display:'flex',alignItems:'center',gap:'1rem',marginBottom:'2rem'}}>
        <button onClick={()=>setView('list')} style={backBtn}>← Back</button>
        <h1 style={h1}>{view==='new'?'New Award':'Edit Award'}</h1>
      </div>
      {error&&<div style={errBox}>{error}</div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 220px',gap:'2.5rem',alignItems:'start'}}>
        <div style={{display:'flex',flexDirection:'column',gap:'1.25rem'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            <div><label style={lbl}>Award Name *</label><input value={editing.name||''} onChange={upd('name')} style={inp} placeholder="Best Director"/></div>
            <div><label style={lbl}>Festival / Award Body</label><input value={editing.festival||''} onChange={upd('festival')} style={inp} placeholder="GIFF, Filmfare..."/></div>
            <div><label style={lbl}>Year</label><input value={editing.year||''} onChange={upd('year')} style={inp} placeholder="2024"/></div>
            <div><label style={lbl}>Sort Order</label><input type="number" value={editing.sort_order||99} onChange={e=>setEditing(p=>({...p,sort_order:+e.target.value}))} style={inp}/></div>
          </div>
          <ImageUpload value={editing.logo_url||''} onChange={v=>setEditing(p=>({...p,logo_url:v}))} label="Award Logo / Badge" hint="Upload the festival or award logo. PNG with transparent background works best." aspect="3/2" bucket="awards"/>
          <label style={{display:'flex',alignItems:'center',gap:'0.5rem',fontSize:13,color:'var(--color-text-secondary)',cursor:'pointer'}}>
            <input type="checkbox" checked={!!editing.published} onChange={e=>setEditing(p=>({...p,published:e.target.checked}))}/>Published (visible on site)
          </label>
          <button onClick={save} disabled={saving} className="btn-primary" style={{alignSelf:'flex-start',opacity:saving?0.6:1}}>
            {saving?'Saving…':view==='new'?'Add Award':'Save Changes'}
          </button>
        </div>
        <div style={{position:'sticky',top:'1rem'}}>
          <p style={{fontSize:9,letterSpacing:'0.1em',textTransform:'uppercase',color:'var(--color-text-tertiary)',marginBottom:'0.75rem'}}>Preview</p>
          <div style={{border:'0.5px solid var(--color-border)',padding:'1.5rem',textAlign:'center',background:'var(--color-surface-1)'}}>
            {editing.logo_url?<img src={editing.logo_url} alt="logo" style={{width:80,height:80,objectFit:'contain',margin:'0 auto 0.75rem',display:'block'}}/>:<div style={{width:80,height:80,background:'var(--color-bg)',border:'0.5px dashed var(--color-border)',margin:'0 auto 0.75rem',display:'flex',alignItems:'center',justifyContent:'center'}}><span style={{fontSize:9,color:'var(--color-text-tertiary)'}}>Logo</span></div>}
            <p style={{fontSize:14,color:'var(--color-text-primary)',fontFamily:'var(--font-playfair,serif)',marginBottom:'0.2rem'}}>{editing.name||'Award Name'}</p>
            <p style={{fontSize:11,color:'var(--color-text-tertiary)'}}>{editing.festival||'Festival'} · {editing.year||'Year'}</p>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    <div>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2.5rem',flexWrap:'wrap',gap:'1rem'}}>
        <div><h1 style={h1}>Awards</h1><p style={{fontSize:14,color:'var(--color-text-secondary)'}}>{loading?'Loading…':`${items.length} awards · Displayed on site`}</p></div>
        <button onClick={()=>{setEditing({...EMPTY});setView('new')}} className="btn-primary">+ Add Award</button>
      </div>
      {loading?<div style={{padding:'3rem',textAlign:'center',color:'var(--color-text-tertiary)'}}>Loading…</div>:(
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:'1rem'}}>
          {items.map(a=>(
            <div key={a.id} style={{border:'0.5px solid var(--color-border)',padding:'1.25rem',background:'var(--color-surface-1)',textAlign:'center',opacity:a.published?1:0.5}}>
              {a.logo_url?<img src={a.logo_url} alt={a.name} style={{width:60,height:60,objectFit:'contain',margin:'0 auto 0.75rem',display:'block'}}/>:<div style={{width:60,height:60,background:'var(--color-bg)',margin:'0 auto 0.75rem',display:'flex',alignItems:'center',justifyContent:'center',border:'0.5px dashed var(--color-border)'}}><span style={{fontSize:8,color:'var(--color-text-tertiary)'}}>No logo</span></div>}
              <p style={{fontSize:13,color:'var(--color-text-primary)',fontFamily:'var(--font-playfair,serif)',marginBottom:'0.2rem'}}>{a.name}</p>
              <p style={{fontSize:11,color:'var(--color-text-tertiary)',marginBottom:'0.875rem'}}>{a.festival} · {a.year}</p>
              <div style={{display:'flex',gap:'0.5rem',justifyContent:'center'}}>
                <button onClick={()=>{setEditing({...a});setView('edit')}} style={{background:'none',border:'0.5px solid var(--color-border)',color:'var(--color-accent)',padding:'0.3rem 0.75rem',fontSize:11,cursor:'pointer',fontFamily:'inherit'}}>Edit</button>
                <button onClick={()=>setDel(a.id)} style={{background:'none',border:'none',color:'rgba(255,80,80,0.6)',fontSize:11,cursor:'pointer'}}>Del</button>
              </div>
            </div>
          ))}
          {items.length===0&&<div style={{gridColumn:'1/-1',padding:'3rem',border:'0.5px solid var(--color-border)',textAlign:'center'}}><p style={{fontSize:14,color:'var(--color-text-tertiary)',marginBottom:'1rem'}}>No awards yet. Add festival recognitions and accolades.</p><button onClick={()=>{setEditing({...EMPTY});setView('new')}} className="btn-primary">Add First Award</button></div>}
        </div>
      )}
      {del&&<div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200}}><div style={{background:'#111',border:'0.5px solid var(--color-border)',padding:'2rem',maxWidth:360,width:'90%'}}><p style={{fontSize:15,color:'var(--color-text-primary)',marginBottom:'1.5rem'}}>Delete this award?</p><div style={{display:'flex',gap:'0.75rem'}}><button onClick={async()=>{await fetch(`/api/admin/awards/${del}`,{method:'DELETE'});setItems(i=>i.filter(x=>x.id!==del));setDel(null)}} style={{background:'rgba(255,80,80,0.15)',border:'0.5px solid rgba(255,80,80,0.4)',color:'#ff6060',padding:'0.625rem 1.25rem',cursor:'pointer',fontSize:13,fontFamily:'inherit'}}>Delete</button><button onClick={()=>setDel(null)} className="btn-ghost" style={{fontSize:13}}>Cancel</button></div></div></div>}
    </div>
  )
}
const inp:React.CSSProperties={width:'100%',background:'var(--color-surface-1)',border:'0.5px solid var(--color-border-mid)',padding:'0.625rem 0.875rem',fontSize:13,color:'var(--color-text-primary)',fontFamily:'inherit',outline:'none',boxSizing:'border-box'}
const lbl:React.CSSProperties={display:'block',fontSize:10,letterSpacing:'0.08em',textTransform:'uppercase',color:'var(--color-text-tertiary)',marginBottom:4}
const h1:React.CSSProperties={fontFamily:'var(--font-playfair,serif)',fontSize:28,fontWeight:400,color:'var(--color-text-primary)',letterSpacing:'-0.02em'}
const backBtn:React.CSSProperties={background:'none',border:'0.5px solid var(--color-border)',color:'var(--color-text-secondary)',padding:'0.5rem 1rem',cursor:'pointer',fontSize:13,fontFamily:'inherit'}
const errBox:React.CSSProperties={padding:'0.75rem 1rem',background:'rgba(255,80,80,0.08)',border:'0.5px solid rgba(255,80,80,0.3)',color:'#ff6060',fontSize:13}
