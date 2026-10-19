import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import ts from 'typescript'

const compile = source => ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } }).outputText
const moduleUrl = source => `data:text/javascript;base64,${Buffer.from(source).toString('base64')}`
const videoModule = moduleUrl(compile(await readFile(new URL('../lib/videoUtils.ts', import.meta.url), 'utf8')))
const projectSource = compile(await readFile(new URL('../lib/projects.ts', import.meta.url), 'utf8')).replace("'./videoUtils'", JSON.stringify(videoModule))
const { loadProjects, isMusicVideo, matchesCategory, projectThumbnail } = await import(moduleUrl(projectSource))
const { parseVideoUrl } = await import(videoModule)

test('music category accepts the admin label and the public plural filter', () => {
  assert.equal(isMusicVideo('Music Video'), true)
  assert.equal(isMusicVideo(' music videos '), true)
  assert.equal(matchesCategory('Music Video', 'Music Videos'), true)
  assert.equal(matchesCategory('Narrative', 'Music Videos'), false)
})

test('empty, failed and malformed responses never substitute demo films', async t => {
  const fetchMock = t.mock.method(globalThis, 'fetch', async () => new Response('{"projects":[],"overrides":{}}'))
  assert.deepEqual(await loadProjects(), [])
  fetchMock.mock.mockImplementation(async () => new Response('{}', { status: 503 }))
  await assert.rejects(loadProjects(), /Unable to load/)
  fetchMock.mock.mockImplementation(async () => new Response('{}'))
  await assert.rejects(loadProjects(), /Invalid film/)
})

test('saved media and order remain authoritative, with no guessed Vimeo image ID', async t => {
  const saved = [{ id: 'custom', title: 'Edited title', video_url: 'https://vimeo.com/1218787838', thumbnail: 'https://example.com/custom.jpg', sort_order: 11, is_active: true }]
  t.mock.method(globalThis, 'fetch', async () => new Response(JSON.stringify({ projects: saved, overrides: {} })))
  assert.deepEqual(await loadProjects(), saved)
  assert.equal(projectThumbnail(saved[0]), saved[0].thumbnail)
  assert.equal(projectThumbnail({ ...saved[0], thumbnail: '' }), '')
})

test('current Supabase media overrides survive, hidden and placeholder films stay out', async t => {
  const projects = [
    { id: 'hidden', is_active: false, video_url: 'https://vimeo.com/1235749015', sort_order: 0 },
    { id: 'placeholder', is_active: true, video_url: 'https://youtube.com/watch?v=EQV7jlmU72Q', sort_order: 0 },
    { id: 'later', is_active: true, video_url: 'https://vimeo.com/1218787838', sort_order: 9 },
    { id: 'corrected', is_active: true, video_url: 'https://youtube.com/watch?v=EQV7jlmU72Q', sort_order: 1 },
  ]
  t.mock.method(globalThis, 'fetch', async url => new Response(JSON.stringify(
    url === '/api/admin/projects' ? { projects } : { overrides: url.endsWith('/thumbnails')
      ? { '1195397280': 'https://example.com/saved-override.jpg' }
      : { corrected: 'https://vimeo.com/1195397280' } }
  )))
  const loaded = await loadProjects()
  assert.deepEqual(loaded.map(p => p.id), ['corrected', 'later'])
  assert.equal(loaded[0].video_url, 'https://vimeo.com/1195397280')
  assert.equal(loaded[0].thumbnail, 'https://example.com/saved-override.jpg')
})

test('each music video resolves to its own Vimeo identity; unlisted hashes survive', () => {
  for (const id of ['1235749015', '1195397280', '1233526847', '1218787838']) {
    const parsed = parseVideoUrl(`https://vimeo.com/${id}`)
    assert.equal(parsed.id, id)
    assert.equal(new URL(parsed.embedUrl).pathname, `/video/${id}`)
  }
  assert.equal(new URL(parseVideoUrl('https://player.vimeo.com/video/123456789?h=secret123').embedUrl).searchParams.get('h'), 'secret123')
  assert.equal(parseVideoUrl('https://example.com/vimeo.com/123456789'), null)
})
