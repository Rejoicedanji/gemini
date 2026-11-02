// File validation utilities

export function validateFile(file) {
  const errors = []

  // Check file type
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'application/pdf'
  ]

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not supported. Allowed types: JPEG, PNG, GIF, WebP, PDF`)
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    errors.push(`File size exceeds 5MB limit`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}