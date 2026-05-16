export function parseYouTube(input: string): { videoId: string; embedUrl: string } | null {
  try {
    const u = new URL(input)
    const host = u.hostname.replace(/^www\./, '')
    let videoId: string | null = null

    if (host === 'youtu.be') {
      videoId = u.pathname.split('/').filter(Boolean)[0] ?? null
    } else if (host.includes('youtube.com')) {
      if (u.pathname.startsWith('/embed/')) {
        videoId = u.pathname.split('/')[2] ?? null
      } else if (u.pathname.startsWith('/shorts/')) {
        videoId = u.pathname.split('/')[2] ?? null
      } else {
        videoId = u.searchParams.get('v')
      }
    }

    if (!videoId || !/^[\w-]{6,}$/i.test(videoId)) return null
    const embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`
    return { videoId, embedUrl }
  } catch {
    return null
  }
}


