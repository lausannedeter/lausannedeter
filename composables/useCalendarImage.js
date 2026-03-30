export const useCalendarImage = () => {
  const config = useRuntimeConfig()

  async function resolve(filename) {
    if (!filename) return null
    const cloudinaryUrl = `https://res.cloudinary.com/${config.public.cloudinaryCloudName}/image/upload/${filename.replace(/\.[^.]+$/, '')}`
    const local = `/affiches/${filename}`

    if (import.meta.server) return local

    try {
      const res = await fetch(cloudinaryUrl, { method: 'HEAD' })
      if (res.ok) return cloudinaryUrl
    } catch {}

    return local
  }

  return { resolve }
}
