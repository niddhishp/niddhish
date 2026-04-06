'use client'
import { useState, useEffect } from 'react'

const PAGE_META = [
  { key:'home',        label:'Home',        url:'/',            focus:'film director Mumbai behavioral psychology brand films',
    defaultTitle:'Niddhish Puuzhakkal — Film Director, Psychologist & Brand Strategist Mumbai',
    defaultDesc:'Film director, behavioral psychologist and brand strategist in Mumbai. 200+ TVCs for Nike, Harley Davidson, Maruti, Adidas. Founder, Light Seeker Films. Creativity. Applied.' },
  { key:'work',        label:'Work',        url:'/work',        focus:'TVC director Mumbai brand films advertising director India',
    defaultTitle:'200+ Brand Films & TVCs | Niddhish Puuzhakkal — Film Director Mumbai',
    defaultDesc:'200+ commercials and 3 feature films. Brand films for Nike, Harley Davidson, Adidas, Maruti Suzuki, Uber, Toyota and 80+ brands. TVC director, Mumbai.' },
  { key:'about',       label:'About',       url:'/about',       focus:'Niddhish Puuzhakkal filmmaker psychologist author Mumbai',
    defaultTitle:'About Niddhish Puuzhakkal — Film Director, MSc Psychologist, Author Mumbai',
    defaultDesc:'Niddhish Puuzhakkal — film director, MSc Psychologist, Six Sigma Black Belt, PMP, and author of 3 books on creativity. Founder, Light Seeker Films, Mumbai.' },
  { key:'films',       label:'Films',       url:'/films',       focus:'EGO film Arshad Warsi Indian feature film director',
    defaultTitle:'Feature Films — EGO, Palkon Pe, Canvas | Niddhish Puuzhakkal',
    defaultDesc:'Feature films by Niddhish Puuzhakkal. EGO starring Arshad Warsi, Juhi Chawla, Divya Dutta. Palkon Pe in post-production. Canvas in production. Mumbai filmmaker.' },
  { key:'blog',        label:'Blog',        url:'/blog',        focus:'behavioral filmmaking brand strategy creative psychology India',
    defaultTitle:'The Creativity Applied — Film, Psychology & Strategy | Niddhish Puuzhakkal',
    defaultDesc:'Essays on behavioral filmmaking, brand psychology, and creative strategy by Niddhish Puuzhakkal. Where film direction meets behavioral science.' },
  { key:'press',       label:'Press',       url:'/press',       focus:'Niddhish Puuzhakkal press coverage interview film director',
    defaultTitle:'Press & Media — Niddhish Puuzhakkal | Film Director Mumbai',
    defaultDesc:'Press coverage, podcast appearances and media features of Niddhish Puuzhakkal — film director, behavioral psychologist and brand strategist, Mumbai.' },
  { key:'collaborate', label:'Collaborate', url:'/collaborate', focus:'hire film director Mumbai TVC production brand film',
    defaultTitle:'Brief Niddhish — Hire a Film Director in Mumbai | Light Seeker Films',
    defaultDesc:'Brief Niddhish Puuzhakkal for your next TVC, brand film, feature film or brand strategy project. Mumbai-based. 200+ commercials. 80+ brands.' },
]

const KEYWORD_CLUSTERS = [
  {
    cluster: 'Core Identity — Highest Priority',
    color: '#e8683a',
    keywords: [
      { kw: 'film director Mumbai', vol: 'High', intent: 'Commercial', notes: 'Primary. Matches exact service + location.' },
      { kw: 'TVC director India', vol: 'High', intent: 'Commercial', notes: 'High buyer intent. Your main service.' },
      { kw: 'advertising film director Mumbai', vol: 'High', intent: 'Commercial', notes: 'Specific to your niche.' },
      { kw: 'brand film director India', vol: 'High', intent: 'Commercial', notes: 'Growing search category. Own it.' },
      { kw: 'Niddhish Puuzhakkal', vol: 'Med', intent: 'Navigational', notes: 'Name search. Must rank #1.' },
    ]
  },
  {
    cluster: 'Behavioral / Psychology Angle — Differentiation',
    color: '#7b8cde',
    keywords: [
      { kw: 'behavioral filmmaking', vol: 'Low', intent: 'Informational', notes: 'Ownable term. No competition. Build authority.' },
      { kw: 'psychology of advertising India', vol: 'Med', intent: 'Informational', notes: 'Links your dual identity.' },
      { kw: 'behavioral brand strategy', vol: 'Low', intent: 'Informational', notes: 'Emerging term. Write the content first.' },
      { kw: 'creative psychology filmmaker', vol: 'Low', intent: 'Informational', notes: 'Unique position. Blog-ready.' },
    ]
  },
  {
    cluster: 'Production Company — Lead Gen',
    color: '#4caf93',
    keywords: [
      { kw: 'Light Seeker Films', vol: 'Med', intent: 'Navigational', notes: 'Brand. Should rank on all engines.' },
      { kw: 'production house Mumbai TVCs', vol: 'High', intent: 'Commercial', notes: 'Direct buyer search.' },
      { kw: 'commercial film production Mumbai', vol: 'High', intent: 'Commercial', notes: 'High intent. Homepage + Collaborate.' },
      { kw: 'TVC production company India', vol: 'High', intent: 'Commercial', notes: 'Core service page.' },
      { kw: 'hire film director India brand video', vol: 'Med', intent: 'Commercial', notes: 'Long-tail. Collaborate page.' },
    ]
  },
  {
    cluster: 'Feature Films — Searchable',
    color: '#d4a843',
    keywords: [
      { kw: 'EGO film Arshad Warsi', vol: 'High', intent: 'Navigational', notes: 'The cast drives search volume. Own this.' },
      { kw: 'EGO Bollywood film 2024', vol: 'High', intent: 'Navigational', notes: 'Key release term.' },
      { kw: 'Niddhish Puuzhakkal director EGO', vol: 'Med', intent: 'Navigational', notes: 'Growing as release approaches.' },
    ]
  },
  {
    cluster: 'GEO / AI Search — Emerging',
    color: '#9c6fe0',
    keywords: [
      { kw: 'best TVC directors in India', vol: 'Med', intent: 'Informational', notes: 'AI answer box. Need list/entity mentions.' },
      { kw: 'top advertising directors Mumbai', vol: 'Med', intent: 'Informational', notes: 'GEO featured snippet target.' },
      { kw: 'Six Sigma filmmaking', vol: 'Low', intent: 'Informational', notes: 'Unique authority signal. Own the term.' },
      { kw: 'film director with psychology background', vol: 'Low', intent: 'Informational', notes: 'Perfect for AI synthesis. Rare combo.' },
    ]
  },
]

interface Settings { [key: string]: string }

export default function AdminSEO() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [tab, setTab] = useState<'pages'|'social'|'keywords'|'verification'|'technical'|'geo'>('pages')

  useEffect(() => {
    fetch('/api/admin/settings').then(r=>r.json()).then(d=>{ if(d.settings) setSettings(d.settings) })
      .catch(()=>{}).finally(()=>setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch('/api/admin/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ settings }) })
    setSaving(false); setSaved(true); setTimeout(()=>setSaved(false), 2500)
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) =>
    setSettings(p => ({ ...p, [k]: e.target.value }))

  const count = (v: string, max: number) => {
    const c = (v||'').length
    const col = c > max ? '#ff6060' : c > max * 0.88 ? '#ffaa30' : 'var(--color-text-tertiary)'
    return <span style={{ fontSize:10, color:col }}>{c}/{max}</span>
  }

  const TABS: [typeof tab, string][] = [['pages','Page Meta'],['social','Social & OG'],['keywords','Keywords & GEO'],['verification','Verification'],['technical','Technical'],['geo','AI Search']]

  if (loading) return <div style={{ padding:'3rem', color:'var(--color-text-tertiary)', fontSize:14 }}>Loading…</div>

  return (
    <div>
      <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'2rem', flexWrap:'wrap', gap:'1rem' }}>
        <div>
          <h1 style={h1}>SEO & GEO Settings</h1>
          <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>
            Optimize for Google · Bing · ChatGPT · Gemini · Perplexity · Claude
          </p>
        </div>
        <button onClick={save} disabled={saving} className="btn-primary" style={{ opacity:saving?0.6:1 }}>
          {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save All SEO Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'0.5px solid var(--color-border)', marginBottom:'2rem', gap:0, overflowX:'auto' }}>
        {TABS.map(([t,l]) => (
          <button key={t} onClick={()=>setTab(t)} style={{ fontSize:11, padding:'0.75rem 1.1rem', background:'transparent', border:'none', borderBottom:tab===t?'1.5px solid var(--color-accent)':'1.5px solid transparent', color:tab===t?'var(--color-accent)':'var(--color-text-secondary)', cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{l}</button>
        ))}
      </div>

      {/* PAGE META */}
      {tab === 'pages' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
          <div style={infoBox}>
            <strong style={{ color:'var(--color-text-primary)' }}>Title tag rules:</strong> 50–60 chars · Include primary keyword · Brand name at end. &nbsp;
            <strong style={{ color:'var(--color-text-primary)' }}>Meta description:</strong> 140–160 chars · Include keyword + CTA · No keyword stuffing.
          </div>
          {PAGE_META.map(p => (
            <div key={p.key} style={card}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'1rem' }}>
                <span style={{ fontSize:9, letterSpacing:'0.1em', textTransform:'uppercase', color:'var(--color-accent)', fontFamily:'monospace' }}>{p.url}</span>
                <span style={{ fontSize:12, color:'var(--color-text-tertiary)' }}>Focus: {p.focus}</span>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.875rem', marginBottom:'0.875rem' }}>
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                    <label style={lbl}>Title Tag</label>{count(settings[`seo_title_${p.key}`]||p.defaultTitle, 60)}
                  </div>
                  <input value={settings[`seo_title_${p.key}`]||p.defaultTitle} onChange={set(`seo_title_${p.key}`)} style={inp} placeholder={p.defaultTitle}/>
                </div>
                <div>
                  <label style={lbl}>Focus Keyword</label>
                  <input value={settings[`seo_focus_${p.key}`]||''} onChange={set(`seo_focus_${p.key}`)} style={inp} placeholder={p.focus}/>
                </div>
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                  <label style={lbl}>Meta Description</label>{count(settings[`seo_desc_${p.key}`]||p.defaultDesc, 160)}
                </div>
                <textarea value={settings[`seo_desc_${p.key}`]||p.defaultDesc} onChange={set(`seo_desc_${p.key}`)} rows={2} style={{...inp,resize:'vertical' as const}} placeholder={p.defaultDesc}/>
              </div>
              <div style={{ display:'flex', gap:'1rem', marginTop:'0.75rem', flexWrap:'wrap' }}>
                <label style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:12, color:'var(--color-text-secondary)', cursor:'pointer' }}>
                  <input type="checkbox" checked={settings[`seo_index_${p.key}`]!=='false'} onChange={e=>setSettings(s=>({...s,[`seo_index_${p.key}`]:e.target.checked?'true':'false'}))}/> Indexable
                </label>
                <label style={{ display:'flex', alignItems:'center', gap:'0.4rem', fontSize:12, color:'var(--color-text-secondary)', cursor:'pointer' }}>
                  <input type="checkbox" checked={settings[`seo_follow_${p.key}`]!=='false'} onChange={e=>setSettings(s=>({...s,[`seo_follow_${p.key}`]:e.target.checked?'true':'false'}))}/> Follow links
                </label>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SOCIAL & OG */}
      {tab === 'social' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <div style={infoBox}>
            <strong style={{ color:'var(--color-text-primary)' }}>OG image:</strong> 1200×630px · Under 8MB · Vercel serves it from /public/ · One image for the entire site as default, override per page. Facebook, LinkedIn, WhatsApp and Perplexity all use OG tags.
          </div>
          <div style={card}>
            <h3 style={sh}>Default Social Share Image</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div>
                <label style={lbl}>OG Image URL</label>
                <input value={settings.og_image_url||'https://niddhish.com/og-image.jpg'} onChange={set('og_image_url')} style={inp} placeholder="https://niddhish.com/og-image.jpg"/>
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.3rem' }}>Upload og-image.jpg to /public/ in your repo, or paste a URL</p>
              </div>
              <div>
                <label style={lbl}>OG Image Alt Text</label>
                <input value={settings.og_image_alt||'Niddhish Puuzhakkal — Film Director, Mumbai'} onChange={set('og_image_alt')} style={inp} placeholder="Niddhish Puuzhakkal — Film Director, Mumbai"/>
              </div>
              <div>
                <label style={lbl}>Twitter/X Card Type</label>
                <select value={settings.twitter_card||'summary_large_image'} onChange={set('twitter_card')} style={inp}>
                  <option value="summary_large_image">summary_large_image (recommended)</option>
                  <option value="summary">summary (small image)</option>
                </select>
              </div>
              <div>
                <label style={lbl}>Twitter/X Handle</label>
                <input value={settings.twitter_handle||'@niddhishp'} onChange={set('twitter_handle')} style={inp} placeholder="@niddhishp"/>
              </div>
            </div>
          </div>
          <div style={card}>
            <h3 style={sh}>Schema.org Person Entity</h3>
            <p style={{ fontSize:12, color:'var(--color-text-tertiary)', marginBottom:'1rem', lineHeight:1.6 }}>
              Structured data that tells Google, ChatGPT, and Gemini exactly who you are. Already in the site. Verify it passes at <a href="https://search.google.com/test/rich-results" target="_blank" rel="noopener" style={{ color:'var(--color-accent)' }}>Rich Results Test</a>.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div><label style={lbl}>Full Name</label><input value={settings.schema_name||'Niddhish Puuzhakkal'} onChange={set('schema_name')} style={inp}/></div>
              <div><label style={lbl}>Job Titles (comma-separated)</label><input value={settings.schema_jobtitles||'Film Director,Behavioral Psychologist,Brand Strategist,Author'} onChange={set('schema_jobtitles')} style={inp}/></div>
              <div><label style={lbl}>Organization</label><input value={settings.schema_org||'Light Seeker Films'} onChange={set('schema_org')} style={inp}/></div>
              <div><label style={lbl}>Location</label><input value={settings.schema_location||'Mumbai, India'} onChange={set('schema_location')} style={inp}/></div>
            </div>
          </div>
        </div>
      )}

      {/* KEYWORDS */}
      {tab === 'keywords' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
          <div style={infoBox}>
            <strong style={{ color:'var(--color-text-primary)' }}>Keyword strategy for niddhish.com</strong> — Built around 3 pillars: (1) Commercial intent terms that bring briefs, (2) Informational terms that build authority, (3) Ownable terms no one else has claimed yet.
          </div>
          {KEYWORD_CLUSTERS.map(cluster => (
            <div key={cluster.cluster} style={card}>
              <h3 style={{ ...sh, color: cluster.color, marginBottom:'1rem' }}>{cluster.cluster}</h3>
              <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem' }}>
                <div style={{ display:'grid', gridTemplateColumns:'200px 80px 110px 1fr', gap:'0.75rem', padding:'0.3rem 0', borderBottom:'0.5px solid var(--color-border)' }}>
                  {['Keyword','Volume','Intent','Strategic note'].map(h => <span key={h} style={{ fontSize:9, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)' }}>{h}</span>)}
                </div>
                {cluster.keywords.map(k => (
                  <div key={k.kw} style={{ display:'grid', gridTemplateColumns:'200px 80px 110px 1fr', gap:'0.75rem', padding:'0.4rem 0', borderBottom:'0.5px solid rgba(255,255,255,0.04)', alignItems:'start' }}>
                    <span style={{ fontSize:12, color:'var(--color-text-primary)', fontFamily:'monospace' }}>{k.kw}</span>
                    <span style={{ fontSize:11, color: k.vol==='High'?'#4caf93':k.vol==='Med'?'#d4a843':'var(--color-text-tertiary)' }}>{k.vol}</span>
                    <span style={{ fontSize:11, color:'var(--color-text-secondary)' }}>{k.intent}</span>
                    <span style={{ fontSize:11, color:'var(--color-text-tertiary)', lineHeight:1.5 }}>{k.notes}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div style={card}>
            <h3 style={sh}>Custom Keywords (for sitemap & meta)</h3>
            <label style={lbl}>Global site keywords — comma separated</label>
            <textarea value={settings.seo_keywords||'film director Mumbai, TVC director India, brand film director, behavioral filmmaking, advertising director India, Light Seeker Films, Niddhish Puuzhakkal, creative director Mumbai, feature film director India, brand strategy filmmaker'} onChange={set('seo_keywords')} rows={3} style={{...inp,resize:'vertical' as const}}/>
          </div>
        </div>
      )}

      {/* VERIFICATION */}
      {tab === 'verification' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <div style={infoBox}>
            Paste the <strong style={{ color:'var(--color-text-primary)' }}>content value only</strong> from each meta tag — not the full tag. E.g. from <code style={{ fontSize:11, background:'rgba(255,255,255,0.06)', padding:'1px 5px' }}>&lt;meta name="google-site-verification" content="<strong>ABC123</strong>"&gt;</code> paste only <code style={{ fontSize:11, background:'rgba(255,255,255,0.06)', padding:'1px 5px' }}>ABC123</code>.
          </div>
          <div style={card}>
            <h3 style={sh}>Search Engine Verification</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:'0.75rem', alignItems:'center' }}>
                <label style={{ ...lbl, marginBottom:0, display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <span style={{ color:'#4285f4', fontWeight:700, fontSize:13 }}>G</span> Google Search Console
                </label>
                <input value={settings.verify_google||''} onChange={set('verify_google')} style={inp} placeholder="Paste verification content value…"/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:'0.75rem', alignItems:'center' }}>
                <label style={{ ...lbl, marginBottom:0, display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <span style={{ color:'#0078d4', fontWeight:700, fontSize:13 }}>B</span> Bing Webmaster
                </label>
                <input value={settings.verify_bing||''} onChange={set('verify_bing')} style={inp} placeholder="msvalidate.01 content…"/>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:'0.75rem', alignItems:'center' }}>
                <label style={{ ...lbl, marginBottom:0, display:'flex', alignItems:'center', gap:'0.4rem' }}>
                  <span style={{ color:'#e60023', fontWeight:700, fontSize:13 }}>P</span> Pinterest
                </label>
                <input value={settings.verify_pinterest||''} onChange={set('verify_pinterest')} style={inp} placeholder="p:domain_verify content…"/>
              </div>
            </div>
          </div>
          <div style={card}>
            <h3 style={sh}>Analytics & Ads</h3>
            <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
              <div>
                <label style={lbl}>Google Analytics 4 — Measurement ID</label>
                <input value={settings.ga_id||''} onChange={set('ga_id')} style={inp} placeholder="G-XXXXXXXXXX"/>
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.3rem' }}>Enables pageview + event tracking. Get from analytics.google.com</p>
              </div>
              <div>
                <label style={lbl}>Google Ads — Conversion ID</label>
                <input value={settings.gads_id||''} onChange={set('gads_id')} style={inp} placeholder="AW-XXXXXXXXXX"/>
              </div>
              <div>
                <label style={lbl}>Meta Pixel ID (Facebook / Instagram Ads)</label>
                <input value={settings.meta_pixel||''} onChange={set('meta_pixel')} style={inp} placeholder="XXXXXXXXXXXXXXXXXX"/>
                <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.3rem' }}>For retargeting visitors from Facebook/Instagram ads campaigns</p>
              </div>
            </div>
          </div>
          <div style={card}>
            <h3 style={sh}>Google Business Profile</h3>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
              <div>
                <label style={lbl}>Business Profile URL</label>
                <input value={settings.gbp_url||''} onChange={set('gbp_url')} style={inp} placeholder="https://g.page/..."/>
              </div>
              <div>
                <label style={lbl}>Google Business Category</label>
                <input value={settings.gbp_category||'Film Production Company'} onChange={set('gbp_category')} style={inp} placeholder="Film Production Company"/>
              </div>
            </div>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.75rem', lineHeight:1.6 }}>
              Create/claim your profile at <a href="https://business.google.com" target="_blank" rel="noopener" style={{ color:'var(--color-accent)' }}>business.google.com</a> — essential for local search, Google Maps and AI-powered search overviews.
            </p>
          </div>
        </div>
      )}

      {/* TECHNICAL */}
      {tab === 'technical' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem' }}>
            <div style={card}>
              <h3 style={sh}>Canonical URL</h3>
              <label style={lbl}>Primary domain (for canonicals)</label>
              <input value={settings.canonical_base||'https://niddhish.com'} onChange={set('canonical_base')} style={inp}/>
              <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.5rem' }}>All pages use this as the base. Prevents duplicate content issues.</p>
            </div>
            <div style={card}>
              <h3 style={sh}>Sitemap</h3>
              <p style={{ fontSize:12, color:'var(--color-text-secondary)', lineHeight:1.6, marginBottom:'0.75rem' }}>
                Sitemap auto-generates at <code style={{ fontSize:11, background:'rgba(255,255,255,0.06)', padding:'1px 5px' }}>/sitemap.xml</code> from Next.js. Submit to Google Search Console after DNS is live.
              </p>
              <a href="/sitemap.xml" target="_blank" rel="noopener" style={{ fontSize:12, color:'var(--color-accent)', textDecoration:'none' }}>Preview sitemap.xml →</a>
            </div>
          </div>
          <div style={card}>
            <h3 style={sh}>Robots.txt</h3>
            <label style={lbl}>Custom robots.txt rules</label>
            <textarea value={settings.robots_txt||`User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://niddhish.com/sitemap.xml`} onChange={set('robots_txt')} rows={6} style={{...inp, fontFamily:'monospace', fontSize:12, resize:'vertical' as const}}/>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.5rem' }}>The /admin/ path is blocked from indexing. All public pages are open.</p>
          </div>
          <div style={card}>
            <h3 style={sh}>Additional Meta Tags</h3>
            <label style={lbl}>Raw HTML — injected into &lt;head&gt;</label>
            <textarea value={settings.additional_meta||''} onChange={set('additional_meta')} rows={4} style={{...inp, fontFamily:'monospace', fontSize:12, resize:'vertical' as const}} placeholder={'<!-- Any custom meta tags -->\n<meta name="..." content="..."/>'}/>
          </div>
        </div>
      )}

      {/* AI/GEO */}
      {tab === 'geo' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <div style={{ ...infoBox, borderLeft:'2px solid #9c6fe0' }}>
            <strong style={{ color:'#9c6fe0' }}>GEO = Generative Engine Optimisation</strong> — How to appear in ChatGPT, Gemini, Perplexity and Claude answers, not just Google links.
          </div>
          <div style={card}>
            <h3 style={sh}>GEO Checklist — What's Already Done</h3>
            {[
              ['✓','Schema.org Person markup','Tells AI engines who you are, what you do, where you work.'],
              ['✓','Structured job titles in JSON-LD','Film Director · Behavioral Psychologist · Brand Strategist · Author'],
              ['✓','sameAs links to Vimeo, LinkedIn, Instagram','Cross-platform entity recognition — AI engines use these to confirm identity.'],
              ['✓','Page-level meta descriptions','Used verbatim in AI summaries when crawled.'],
              ['✓','Semantic HTML structure','H1 → H2 hierarchy signals topic authority.'],
            ].map(([status, item, note]) => (
              <div key={item as string} style={{ display:'grid', gridTemplateColumns:'28px 1fr', gap:'0.75rem', padding:'0.625rem 0', borderBottom:'0.5px solid rgba(255,255,255,0.05)', alignItems:'start' }}>
                <span style={{ fontSize:14, color:'#4caf93' }}>{status}</span>
                <div>
                  <p style={{ fontSize:13, color:'var(--color-text-primary)', marginBottom:'0.2rem' }}>{item}</p>
                  <p style={{ fontSize:11, color:'var(--color-text-tertiary)' }}>{note}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={card}>
            <h3 style={sh}>GEO Action Items — Do These</h3>
            {[
              ['→','Add to Wikipedia or Wikidata','A Wikipedia article or Wikidata entry is the single strongest GEO signal. Even a stub listing "Indian film director, Mumbai" with your sameAs links dramatically increases AI citation frequency.'],
              ['→','Submit to Google Knowledge Graph','Via Google Search Console → Enhancements → once GSC is verified.'],
              ['→','Get cited in industry publications','Campaign India, Adgully, AFAQS articles mentioning you create the "third-party validation" AI engines require. Press page links to these.'],
              ['→','FAQ schema on key pages','Add FAQ structured data to /collaborate and /about. AI engines pull FAQ content directly into answers.'],
              ['→','Write a bio page at /niddhish','A standalone bio page with entity markup (Person schema, all credentials, sameAs links) gives AI a single authoritative source to cite.'],
              ['→','llms.txt file','Add /public/llms.txt — a plain-text summary of who you are for LLM crawlers. Perplexity and some Claude web access tools read this.'],
            ].map(([icon, item, note]) => (
              <div key={item as string} style={{ display:'grid', gridTemplateColumns:'28px 1fr', gap:'0.75rem', padding:'0.625rem 0', borderBottom:'0.5px solid rgba(255,255,255,0.05)', alignItems:'start' }}>
                <span style={{ fontSize:14, color:'var(--color-accent)' }}>{icon}</span>
                <div>
                  <p style={{ fontSize:13, color:'var(--color-text-primary)', marginBottom:'0.2rem' }}>{item}</p>
                  <p style={{ fontSize:11, color:'var(--color-text-tertiary)', lineHeight:1.6 }}>{note}</p>
                </div>
              </div>
            ))}
          </div>
          <div style={card}>
            <h3 style={sh}>llms.txt — AI Crawler Summary</h3>
            <label style={lbl}>Content for /public/llms.txt (plain text, read by LLM crawlers)</label>
            <textarea
              value={settings.llms_txt||`# Niddhish Puuzhakkal

Film director, behavioral psychologist, brand strategist and author based in Mumbai, India.

## What I do
- Direct TVCs and brand films for major brands (Nike, Harley Davidson, Maruti Suzuki, Adidas, Uber)
- Feature film director: EGO (starring Arshad Warsi, Juhi Chawla), Palkon Pe, Canvas
- Brand strategy and creative consulting using behavioral psychology frameworks
- Author of 3 books on creativity and filmmaking

## Company
Light Seeker Films, Mumbai, India
Website: https://niddhish.com

## Credentials
- MSc Psychology
- Six Sigma Black Belt
- Project Management Professional (PMP)
- 200+ TVCs across 80+ brands
- 20+ years in film direction

## Contact
niddhish@lightseekermedia.com`}
              onChange={set('llms_txt')}
              rows={20}
              style={{...inp, fontFamily:'monospace', fontSize:12, resize:'vertical' as const}}
            />
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.5rem' }}>
              Save this, then add the content to <code style={{ fontSize:11, background:'rgba(255,255,255,0.06)', padding:'1px 5px' }}>/public/llms.txt</code> in the repo.
            </p>
          </div>
        </div>
      )}

      {/* Save button bottom */}
      <div style={{ marginTop:'2rem', paddingTop:'1.5rem', borderTop:'0.5px solid var(--color-border)' }}>
        <button onClick={save} disabled={saving} className="btn-primary" style={{ opacity:saving?0.6:1 }}>
          {saved ? '✓ Saved to site' : saving ? 'Saving…' : 'Save All SEO Settings'}
        </button>
      </div>
    </div>
  )
}

const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'0.3rem' }
const h1: React.CSSProperties = { fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', letterSpacing:'-0.02em', marginBottom:'0.35rem' }
const sh: React.CSSProperties = { fontSize:11, fontWeight:500, letterSpacing:'0.08em', textTransform:'uppercase', color:'var(--color-text-tertiary)', marginBottom:'1rem' }
const card: React.CSSProperties = { border:'0.5px solid var(--color-border)', padding:'1.5rem', background:'var(--color-surface-1)' }
const infoBox: React.CSSProperties = { padding:'0.875rem 1.1rem', background:'rgba(232,104,58,0.06)', border:'0.5px solid rgba(232,104,58,0.2)', borderLeft:'2px solid var(--color-accent)', fontSize:12, color:'var(--color-text-secondary)', lineHeight:1.7 }
