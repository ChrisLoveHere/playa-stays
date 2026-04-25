'use client'

import { useRef, useState, useCallback } from 'react'
import Image from 'next/image'

export interface GalleryImage {
  /** WP attachment ID — undefined for newly selected local files not yet uploaded */
  wpId?: number
  url: string
  alt?: string
  isFeatured?: boolean
  /** True while this image is being uploaded to WordPress */
  uploading?: boolean
}

interface Props {
  images: GalleryImage[]
  onChange: (images: GalleryImage[]) => void
  /** WP post ID — used to attach uploaded media to the property */
  propertyId?: number
}

export function GalleryManager({ images, onChange, propertyId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const imagesRef = useRef(images)
  imagesRef.current = images

  const updateImages = useCallback((updater: (prev: GalleryImage[]) => GalleryImage[]) => {
    const next = updater(imagesRef.current)
    onChange(next)
  }, [onChange])

  function setFeatured(idx: number) {
    updateImages(prev => prev.map((img, i) => ({ ...img, isFeatured: i === idx })))
  }

  function removeImage(idx: number) {
    updateImages(prev => prev.filter((_, i) => i !== idx))
  }

  function moveImage(from: number, to: number) {
    if (to < 0 || to >= images.length) return
    updateImages(prev => {
      const next = [...prev]
      const [item] = next.splice(from, 1)
      next.splice(to, 0, item)
      return next
    })
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploadError(null)

    const placeholders: GalleryImage[] = []
    const fileList: File[] = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      fileList.push(file)
      placeholders.push({
        url: URL.createObjectURL(file),
        alt: file.name,
        uploading: true,
      })
    }

    const baseLen = images.length
    updateImages(prev => [...prev, ...placeholders])
    if (inputRef.current) inputRef.current.value = ''

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      const placeholderIdx = baseLen + i

      try {
        const fd = new FormData()
        fd.append('file', file)
        if (propertyId) fd.append('post_id', String(propertyId))

        const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
        const data = await res.json()

        if (!res.ok || !data.success) {
          throw new Error(data.error || `Upload failed: ${res.status}`)
        }

        const uploaded = data.media[0]
        updateImages(prev => prev.map((img, idx) =>
          idx === placeholderIdx
            ? { ...img, wpId: uploaded.id, url: uploaded.url, alt: uploaded.alt || img.alt, uploading: false }
            : img
        ))
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Upload failed'
        setUploadError(msg)
        updateImages(prev => prev.map((img, idx) =>
          idx === placeholderIdx ? { ...img, uploading: false } : img
        ))
      }
    }
  }

  const uploadedCount = images.filter(i => i.wpId).length
  const pendingCount = images.filter(i => !i.wpId && !i.uploading).length
  const uploadingCount = images.filter(i => i.uploading).length
  const featuredIdx = images.findIndex(i => i.isFeatured)

  if (images.length === 0) {
    return (
      <div className="adm-gallery-empty">
        <div className="adm-gallery-empty__icon">📷</div>
        <div className="adm-gallery-empty__title">No photos yet</div>
        <div className="adm-gallery-empty__desc">
          Upload at least 2 photos to make this listing publish-ready. Aim for 5+ for a strong listing.
        </div>
        <label className="adm-btn adm-btn--primary" htmlFor="gallery-upload" style={{ cursor: 'pointer' }}>
          Upload photos
          <input
            ref={inputRef}
            id="gallery-upload"
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </label>
        {uploadError && (
          <p className="adm-gallery__error">Upload error: {uploadError}</p>
        )}
      </div>
    )
  }

  return (
    <div>
      <div className="adm-gallery">
        {images.map((img, i) => {
          const isFeatured = img.isFeatured || (featuredIdx === -1 && i === 0)
          return (
            <div key={`${img.wpId || img.url}-${i}`} className={`adm-gallery__item${isFeatured ? ' is-featured' : ''}${img.uploading ? ' is-uploading' : ''}`}>
              <Image src={img.url} alt={img.alt || `Photo ${i + 1}`} fill style={{ objectFit: 'cover' }} sizes="160px" unoptimized={!img.wpId} />
              {img.uploading && (
                <div className="adm-gallery__uploading">
                  <span className="adm-gallery__spinner" />
                  Uploading...
                </div>
              )}
              <div className="adm-gallery__actions">
                {i > 0 && (
                  <button type="button" className="adm-gallery__action-btn" title="Move left" onClick={() => moveImage(i, i - 1)}>←</button>
                )}
                {i < images.length - 1 && (
                  <button type="button" className="adm-gallery__action-btn" title="Move right" onClick={() => moveImage(i, i + 1)}>→</button>
                )}
                <button type="button" className={`adm-gallery__action-btn${isFeatured ? ' is-active' : ''}`} title={isFeatured ? 'Currently featured' : 'Set as featured'} onClick={() => setFeatured(i)}>★</button>
                <button type="button" className="adm-gallery__action-btn adm-gallery__action-btn--danger" title="Remove from gallery" onClick={() => removeImage(i)}>×</button>
              </div>
              {isFeatured && <div className="adm-gallery__featured-badge">Main photo</div>}
            </div>
          )
        })}
        <label className="adm-gallery__upload" htmlFor="gallery-upload">
          <span className="adm-gallery__upload-icon">+</span>
          <span>Add more</span>
          <input
            ref={inputRef}
            id="gallery-upload"
            type="file"
            accept="image/*"
            multiple
            style={{ display: 'none' }}
            onChange={handleFileSelect}
          />
        </label>
      </div>

      <div className="adm-gallery__status">
        <span>{images.length} photo{images.length !== 1 ? 's' : ''}</span>
        {uploadedCount > 0 && <span className="adm-gallery__status-item adm-gallery__status-item--ok">{uploadedCount} saved</span>}
        {pendingCount > 0 && <span className="adm-gallery__status-item adm-gallery__status-item--warn">{pendingCount} not uploaded</span>}
        {uploadingCount > 0 && <span className="adm-gallery__status-item adm-gallery__status-item--active">{uploadingCount} uploading…</span>}
        {images.length < 5 && <span className="adm-gallery__status-item adm-gallery__status-item--hint">Aim for 5+ photos</span>}
      </div>

      {uploadError && (
        <div className="adm-gallery__error">
          Upload error: {uploadError}
          <button type="button" className="adm-gallery__error-dismiss" onClick={() => setUploadError(null)}>Dismiss</button>
        </div>
      )}
    </div>
  )
}
