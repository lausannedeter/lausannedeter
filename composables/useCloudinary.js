export const useCloudinary = () => {
  const config = useRuntimeConfig()

  async function upload(file, filename) {
    console.log('cloudinaryCloudName:', config.public.cloudinaryCloudName)
    console.log('cloudinaryUploadPreset:', config.public.cloudinaryUploadPreset)
    const body = new FormData()
    body.append('file', file)
    body.append('upload_preset', config.public.cloudinaryUploadPreset)
    body.append('public_id', filename.replace(/\.[^.]+$/, ''))

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${config.public.cloudinaryCloudName}/image/upload`,
      { method: 'POST', body }
    )

    if (!res.ok) throw new Error('Upload failed')

    const data = await res.json()
    return data
  }

  return { upload }
}
