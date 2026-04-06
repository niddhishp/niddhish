'use client'
import { useState, useEffect } from 'react'

const PAGE_META = [
  { key: 'home',        label: 'Home',        url: '/',            defaultTitle: 'Niddhish Puuzhakkal — Film Director & Brand Strategist, Mumbai', defaultDesc: 'Film director, behavioral psychologist and brand strategist based in Mumbai. 200+ TVCs for Nike, Harley Davidson, Maruti & 80+ brands. 3 feature films. Creativity. Applied.' },
  { key: 'work',        label: 'Work',        url: '/work',        defaultTitle: 'Work — 200+ Films | Niddhish Puuzhakkal', defaultDesc: '200+ commercials and 3 feature films directed by Niddhish Puuzhakkal. Brand films for Nike, Harley Davidson, Adidas, Maruti Suzuki, Uber, Toyota and 80+ brands.' },
  { key: 'about',       label: 'About',       url: '/about',       defaultTitle: 'About Niddhish Puuzhakkal — Film Director, Psychologist, Mumbai', defaultDesc: 'Niddhish Puuzhakkal — film director, MSc Psychologist, Six Sigma Black Belt, and author of 3 books on creativity. Founder, Light Seeker Films, Mumbai.' },
  { key: 'blog',        label: 'Blog',        url: '/blog',        defaultTitle: 'The Creativity Applied — Writing by Niddhish Puuzhakkal', defaultDesc: 'Essays on behavioral filmmaking, brand strategy, creative psychology and the business of making great work. By Niddhish Puuzhakkal.' },
  { key: 'press',       label: 'Press',       url: '/press',       defaultTitle: 'Press & Media — Niddhish Puuzhakkal', defaultDesc: 'Press features, podcast appearances and media coverage of Niddhish Puuzhakkal — film director and brand strategist, Mumbai.' },
  { key: 'collaborate', label: 'Collaborate', url: '/collaborate', defaultTitle: 'Start a Project — Niddhish Puuzhakkal', defaultDesc: 'Brief Niddhish Puuzhakkal for your next TVC, brand film, feature film or brand strategy project. Mumbai-based, global portfolio.' },
]

interface Settings { [key: string]: string }

export default function AdminSEO() {
  const [settings, setSettings] = useState<Settings>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState<'pages'|'verification'|'keywords'|'sitemap'>('pages')

  useEffect(() => {
    fetch('/api/admin/settings').then(r => r.json()).then(d => {
      if (d.settings) setSettings(d.settings)
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const save = async () => {
    setSaving(true)
    await fetch('/api/admin/settings', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ settings }) })
    setSaving(false); setSaved(true); setTimeout(() => setSaved(false), 2500)
  }

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement>) =>
    setSettings(p => ({ ...p, [k]: e.target.value }))

  const charCount = (v: string, max: number) => {
    const c = (v||'').length
    const color = c > max ? '#ff6060' : c > max * 0.9 ? 'rgba(255,160,50,0.9)' : 'var(--color-text-tertiary)'
    return <span style={{ fontSize:10, color }}>{c}/{max}</span>
  }

  if (loading) return <div style={{ padding:'3rem', color:'var(--color-text-tertiary)', fontSize:14 }}>Loading SEO settings…</div>

  return (
    <div>
      <div style={{ marginBottom:'2rem' }}>
        <h1 style={{ fontFamily:'var(--font-playfair,serif)', fontSize:28, fontWeight:400, color:'var(--color-text-primary)', letterSpacing:'-0.02em', marginBottom:'0.35rem' }}>SEO & GEO Settings</h1>
        <p style={{ fontSize:14, color:'var(--color-text-secondary)' }}>Optimize for Google, Bing, and AI search engines (ChatGPT, Gemini, Perplexity, Claude)</p>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'0.5px solid var(--color-border)', marginBottom:'2rem', gap:0, overflowX:'auto' }}>
        {([['pages','Page Meta'],['keywords','Keywords & GEO'],['verification','Site Verification'],['sitemap','Sitemap & Robots']] as const).map(([t,l]) => (
          <button key={t} onClick={()=>setActiveTab(t)} style={{ fontSize:12, padding:'0.875rem 1.25rem', background:'transparent', border:'none', borderBottom: activeTab===t ? '1.5px solid var(--color-accent)' : '1.5px solid transparent', color: activeTab===t ? 'var(--color-accent)' : 'var(--color-text-secondary)', cursor:'pointer', fontFamily:'inherit', letterSpacing:'0.04em', whiteSpace:'nowrap' }}>{l}</button>
        ))}
      </div>

      {/* PAGE META */}
      {activeTab === 'pages' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'2rem' }}>
          <div style={{ padding:'1rem', background:'rgba(232,104,58,0.06)', border:'0.5px solid rgba(232,104,58,0.2)' }}>
            <p style={{ fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.6 }}>
              <strong style={{ color:'var(--color-accent)' }}>Title tag:</strong> 50–60 chars ideal. Keyword first, brand name last. Include Mumbai/India for geo-targeting.<br/>
              <strong style={{ color:'var(--color-accent)' }}>Meta description:</strong> 140–155 chars. Describe the page clearly — this is your ad in search results.<br/>
              <strong style={{ color:'var(--color-accent)' }}>Focus keyword:</strong> The single phrase you most want this page to rank for.
            </p>
          </div>
          {PAGE_META.map(page => (
            <div key={page.key} style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'1.25rem' }}>
                <div style={{ background:'var(--color-surface-1)', padding:'3px 10px', fontSize:11, color:'var(--color-text-tertiary)', fontFamily:'monospace' }}>{page.url}</div>
                <h3 style={{ fontSize:14, fontWeight:500, color:'var(--color-text-primary)' }}>{page.label}</h3>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                    <label style={lbl}>Focus Keyword</label>
                  </div>
                  <input value={settings[`seo_${page.key}_keyword`] || ''} onChange={set(`seo_${page.key}_keyword`)} style={inp} placeholder={`e.g. film director Mumbai`}/>
                </div>
                <div>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                    <label style={lbl}>Title Tag</label>
                    {charCount(settings[`seo_${page.key}_title`] || page.defaultTitle, 60)}
                  </div>
                  <input value={settings[`seo_${page.key}_title`] || ''} onChange={set(`seo_${page.key}_title`)} style={inp} placeholder={page.defaultTitle}/>
                </div>
              </div>
              <div>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.3rem' }}>
                  <label style={lbl}>Meta Description</label>
                  {charCount(settings[`seo_${page.key}_desc`] || page.defaultDesc, 155)}
                </div>
                <textarea value={settings[`seo_${page.key}_desc`] || ''} onChange={set(`seo_${page.key}_desc`)} rows={2} style={{ ...inp, resize:'vertical' as const }} placeholder={page.defaultDesc}/>
              </div>
              <div style={{ marginTop:'0.75rem', display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap' }}>
                <label style={{ display:'flex', alignItems:'center', gap:'6px', fontSize:12, color:'var(--color-text-secondary)', cursor:'pointer' }}>
                  <input type="checkbox" checked={settings[`seo_${page.key}_noindex`] !== 'true'} onChange={e => setSettings(p => ({ ...p, [`seo_${page.key}_noindex`]: e.target.checked ? 'false' : 'true' }))}/>
                  Indexable (appear in search results)
                </label>
                <span style={{ fontSize:11, color:settings[`seo_${page.key}_noindex`]==='true'?'#ff6060':'rgba(80,200,120,0.8)' }}>
                  {settings[`seo_${page.key}_noindex`]==='true' ? '⚠ Noindex — hidden from search' : '✓ Indexed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* KEYWORDS & GEO */}
      {activeTab === 'keywords' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem' }}>
            <h3 style={{ fontSize:13, fontWeight:500, color:'var(--color-text-primary)', marginBottom:'1rem' }}>Default OG Image (Social Share)</h3>
            <p style={{ fontSize:12, color:'var(--color-text-tertiary)', marginBottom:'0.75rem' }}>1200×630px image shown when pages are shared on Facebook, LinkedIn, Twitter. Upload to /public and paste the path.</p>
            <input value={settings['seo_og_image'] || '/og-image.jpg'} onChange={set('seo_og_image')} style={inp} placeholder="/og-image.jpg"/>
          </div>

          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem' }}>
            <h3 style={{ fontSize:13, fontWeight:500, color:'var(--color-text-primary)', marginBottom:'0.5rem' }}>Global Keywords</h3>
            <p style={{ fontSize:12, color:'var(--color-text-tertiary)', marginBottom:'0.75rem' }}>Comma-separated. These appear in the meta keywords tag across all pages.</p>
            <textarea value={settings['seo_keywords'] || 'Niddhish Puuzhakkal,film director Mumbai,TVC director India,brand film director,behavioral filmmaker,commercial director India,Light Seeker Films,psychology-based advertising'} onChange={set('seo_keywords')} rows={3} style={{ ...inp, resize:'vertical' as const, fontFamily:'monospace', fontSize:12 }}/>
          </div>

          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem' }}>
            <h3 style={{ fontSize:13, fontWeight:500, color:'var(--color-text-primary)', marginBottom:'0.5rem' }}>GEO & AI Visibility (Generative Engine Optimization)</h3>
            <p style={{ fontSize:12, color:'var(--color-text-tertiary)', marginBottom:'1rem' }}>For ChatGPT, Gemini, Perplexity and Claude to surface you correctly, your content must clearly state your expertise, location and credentials. The Person schema already handles this, but the description below supplements it.</p>
            <label style={lbl}>AI-Optimized About Description</label>
            <textarea value={settings['seo_ai_description'] || 'Niddhish Puuzhakkal is a film director and brand strategist based in Mumbai, India. He has directed 200+ television commercials and brand films for Nike, Harley Davidson, Maruti Suzuki, Adidas, Uber, Toyota, LG, Zomato, Mastercard and 80+ brands. He holds an MSc in Psychology and is a Six Sigma Black Belt. He has written three published books on creativity. He is the founder of Light Seeker Films. His three feature films include EGO (starring Arshad Warsi and Juhi Chawla), Palkon Pe (in post-production) and Kabirinte Canvas (in production).'} onChange={set('seo_ai_description')} rows={5} style={{ ...inp, resize:'vertical' as const, lineHeight:1.6 }}/>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginTop:'0.4rem' }}>This feeds into the Person structured data markup. Full sentences with specific numbers and names rank better with AI search engines.</p>
          </div>
        </div>
      )}

      {/* SITE VERIFICATION */}
      {activeTab === 'verification' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={{ padding:'1rem', background:'rgba(232,104,58,0.06)', border:'0.5px solid rgba(232,104,58,0.2)', marginBottom:'0.5rem' }}>
            <p style={{ fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.6 }}>
              Paste the <strong style={{ color:'var(--color-accent)' }}>content value</strong> from each platform's verification meta tag.<br/>
              Example: for <code style={{ fontSize:11 }}>&lt;meta name="google-site-verification" content="abc123"/&gt;</code> — paste only <code style={{ fontSize:11 }}>abc123</code>
            </p>
          </div>
          {[
            { key:'verify_google',    label:'Google Search Console', hint:'Get from search.google.com/search-console → Add Property → HTML Tag', placeholder:'abcdef1234567890' },
            { key:'verify_bing',      label:'Bing Webmaster Tools',  hint:'Get from bing.com/webmasters → Add Site → XML Meta Tag', placeholder:'ABCDEF1234567890ABCDEF1234567890' },
            { key:'verify_pinterest', label:'Pinterest',             hint:'Get from pinterest.com/business/hub → Claim Website → Add meta tag', placeholder:'abcdef1234567890abcdef1234567890' },
          ].map(v => (
            <div key={v.key} style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', marginBottom:'0.75rem' }}>
                <h3 style={{ fontSize:14, fontWeight:500, color:'var(--color-text-primary)' }}>{v.label}</h3>
                {settings[v.key] && <span style={{ fontSize:10, color:'rgba(80,200,120,0.8)', background:'rgba(80,200,120,0.1)', border:'0.5px solid rgba(80,200,120,0.3)', padding:'2px 8px' }}>✓ Set</span>}
              </div>
              <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginBottom:'0.75rem' }}>{v.hint}</p>
              <input value={settings[v.key] || ''} onChange={set(v.key)} style={inp} placeholder={v.placeholder}/>
            </div>
          ))}

          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem' }}>
            <h3 style={{ fontSize:14, fontWeight:500, color:'var(--color-text-primary)', marginBottom:'0.5rem' }}>Google Analytics / Tag Manager</h3>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginBottom:'0.75rem' }}>GA4 Measurement ID (e.g. G-XXXXXXXXXX) or GTM Container ID (e.g. GTM-XXXXXXX)</p>
            <input value={settings['seo_ga_id'] || ''} onChange={set('seo_ga_id')} style={inp} placeholder="G-XXXXXXXXXX or GTM-XXXXXXX"/>
          </div>

          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem' }}>
            <h3 style={{ fontSize:14, fontWeight:500, color:'var(--color-text-primary)', marginBottom:'0.5rem' }}>Additional Meta Tags</h3>
            <p style={{ fontSize:11, color:'var(--color-text-tertiary)', marginBottom:'0.75rem' }}>Raw HTML meta tags to inject into &lt;head&gt;. One per line.</p>
            <textarea value={settings['seo_additional_meta'] || ''} onChange={set('seo_additional_meta')} rows={4} style={{ ...inp, resize:'vertical' as const, fontFamily:'monospace', fontSize:12 }} placeholder={'<meta name="facebook-domain-verification" content="..." />\n<meta name="p:domain_verify" content="..." />'}/>
          </div>
        </div>
      )}

      {/* SITEMAP & ROBOTS */}
      {activeTab === 'sitemap' && (
        <div style={{ display:'flex', flexDirection:'column', gap:'1.25rem' }}>
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem' }}>
            <h3 style={{ fontSize:14, fontWeight:500, color:'var(--color-text-primary)', marginBottom:'0.75rem' }}>Sitemap Status</h3>
            <p style={{ fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.7 }}>
              Your sitemap is auto-generated at <a href="https://niddhish.com/sitemap.xml" target="_blank" rel="noopener noreferrer" style={{ color:'var(--color-accent)' }}>niddhish.com/sitemap.xml</a>. It includes all static pages and every published blog post. Submit this URL in Google Search Console and Bing Webmaster Tools.
            </p>
            <div style={{ marginTop:'1rem', padding:'0.875rem 1rem', background:'var(--color-surface-1)', fontFamily:'monospace', fontSize:12, color:'var(--color-text-secondary)' }}>
              https://niddhish.com/sitemap.xml
            </div>
          </div>
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem' }}>
            <h3 style={{ fontSize:14, fontWeight:500, color:'var(--color-text-primary)', marginBottom:'0.75rem' }}>Robots.txt Status</h3>
            <p style={{ fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.7, marginBottom:'1rem' }}>
              <a href="https://niddhish.com/robots.txt" target="_blank" rel="noopener noreferrer" style={{ color:'var(--color-accent)' }}>niddhish.com/robots.txt</a> allows all crawlers on all public pages. Admin routes are blocked.
            </p>
            <div style={{ padding:'0.875rem 1rem', background:'var(--color-surface-1)', fontFamily:'monospace', fontSize:12, color:'var(--color-text-secondary)', whiteSpace:'pre-line' }}>
{`User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/admin
Sitemap: https://niddhish.com/sitemap.xml`}
            </div>
          </div>
          <div style={{ border:'0.5px solid var(--color-border)', padding:'1.5rem' }}>
            <h3 style={{ fontSize:14, fontWeight:500, color:'var(--color-text-primary)', marginBottom:'0.5rem' }}>SEO Checklist</h3>
            {[
              ['Add niddhish.com to Vercel project domains', 'critical', true],
              ['Submit sitemap to Google Search Console', 'critical', !settings['verify_google']],
              ['Submit sitemap to Bing Webmaster Tools', 'important', !settings['verify_bing']],
              ['Add Google Search Console verification code', 'critical', !settings['verify_google']],
              ['Upload og-image.jpg (1200×630px) to /public', 'important', true],
              ['Add Google Analytics / GA4 tracking', 'important', !settings['seo_ga_id']],
              ['Blog: remove or rewrite YouTube-style posts', 'important', true],
              ['Set focus keywords for each page', 'nice', !settings['seo_home_keyword']],
              ['Sitemap auto-generated ✓', 'done', false],
              ['robots.txt auto-generated ✓', 'done', false],
              ['Person schema (JSON-LD) ✓', 'done', false],
              ['Article schema on blog posts ✓', 'done', false],
              ['OG/Twitter cards ✓', 'done', false],
              ['Canonical tags ✓', 'done', false],
            ].map(([label, level, show]) => show ? (
              <div key={label as string} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.5rem 0', borderBottom:'0.5px solid var(--color-border)' }}>
                <span style={{ fontSize:9, padding:'2px 7px', border:'0.5px solid', borderColor: level==='critical'?'rgba(255,80,80,0.4)':level==='important'?'rgba(255,160,50,0.4)':'rgba(80,200,120,0.4)', color: level==='critical'?'#ff6060':level==='important'?'rgba(255,160,50,0.9)':'rgba(80,200,120,0.8)', textTransform:'uppercase', letterSpacing:'0.06em' }}>{level}</span>
                <span style={{ fontSize:13, color:'var(--color-text-secondary)' }}>{label as string}</span>
              </div>
            ) : null)}
          </div>
        </div>
      )}

      <div style={{ marginTop:'2rem', paddingTop:'1.5rem', borderTop:'0.5px solid var(--color-border)', display:'flex', alignItems:'center', gap:'1rem' }}>
        <button onClick={save} disabled={saving} className="btn-primary" style={{ opacity:saving?0.6:1 }}>
          {saved ? '✓ Saved' : saving ? 'Saving…' : 'Save SEO Settings'}
        </button>
        <p style={{ fontSize:12, color:'var(--color-text-tertiary)' }}>Changes to verification codes require a deploy to take effect.</p>
      </div>
    </div>
  )
}

const inp: React.CSSProperties = { width:'100%', background:'var(--color-surface-1)', border:'0.5px solid var(--color-border-mid)', padding:'0.625rem 0.875rem', fontSize:13, color:'var(--color-text-primary)', fontFamily:'inherit', outline:'none', boxSizing:'border-box' }
const lbl: React.CSSProperties = { display:'block', fontSize:10, letterSpacing:'0.08em', textTransform:'uppercase' as const, color:'var(--color-text-tertiary)' }
