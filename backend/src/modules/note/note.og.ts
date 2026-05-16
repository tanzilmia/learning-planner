function pickMeta(html: string, prop: string): string | undefined {
  const rx = new RegExp(`property=["']${prop}["'][^>]*content=["']([^"']+)["']`, 'i')
  const m = html.match(rx)
  if (m?.[1]) return m[1]
  const rx2 = new RegExp(`content=["']([^"']+)["'][^>]*property=["']${prop}["']`, 'i')
  const m2 = html.match(rx2)
  return m2?.[1]
}

function pickTitle(html: string): string | undefined {
  const m = html.match(/<title[^>]*>([^<]+)<\/title>/i)
  return m?.[1]?.trim()
}

export async function fetchOpenGraph(url: string): Promise<{ title?: string; description?: string; thumbnail?: string }> {
  const ctrl = new AbortController()
  const t = setTimeout(() => ctrl.abort(), 12000)

  try {
    const res = await fetch(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: {
        'user-agent':
          'Mozilla/5.0 (compatible; NoteShalaBot/1.0; +https://noteshala.local)',
        accept: 'text/html',
      },
    })
    clearTimeout(t)
    if (!res.ok) return {}
    const html = await res.text()
    const title = pickMeta(html, 'og:title') ?? pickMeta(html, 'twitter:title') ?? pickTitle(html)
    const description = pickMeta(html, 'og:description') ?? pickMeta(html, 'twitter:description')
    const thumbnail = pickMeta(html, 'og:image') ?? pickMeta(html, 'twitter:image')
    return {
      title: title?.slice(0, 500),
      description: description?.slice(0, 2000),
      thumbnail: thumbnail?.slice(0, 2000),
    }
  } catch {

    clearTimeout(t)
    return {}
  }
}


