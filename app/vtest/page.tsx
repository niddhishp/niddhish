export default function VimeoTest() {
  return (
    <html>
      <body style={{ background: '#000', margin: 0, padding: '2rem' }}>
        <h2 style={{ color: '#fff', fontFamily: 'sans-serif', marginBottom: '1rem' }}>
          Vimeo Test — bare iframe, no React, no modal
        </h2>
        <div style={{ maxWidth: 800, aspectRatio: '16/9', position: 'relative' }}>
          {/* Test 1: Standard embed */}
          <iframe
            src="https://player.vimeo.com/video/2064044054?autoplay=1&title=0&byline=0&portrait=0&dnt=1&app_id=122963"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            title="Vimeo test"
          />
        </div>
        <p style={{ color: '#666', fontFamily: 'sans-serif', marginTop: '1rem', fontSize: 13 }}>
          Video ID: 2064044054 (Nike — The Charge Within)
        </p>
      </body>
    </html>
  )
}
