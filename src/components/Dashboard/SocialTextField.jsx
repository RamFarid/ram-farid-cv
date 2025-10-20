'use client'

import updateSocialLinks from '@/utils/updateSocialLinks'
import { useState, useEffect } from 'react'

// Reusable TextInput as a simple controlled input with save-on-blur
export default function SocialTextField({ id, label, value }) {
  const [localValue, setLocalValue] = useState(value)
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setLocalValue(value)
    setSaved(false)
  }, [value])

  const handleBlur = async () => {
    if (localValue === value) return // No change
    setIsSaving(true)
    setSaved(false)
    try {
      await updateSocialLinks({ [id]: localValue })
      setSaved(true)
    } catch (error) {
      console.error('Failed to save', error)
      // Optionally revert or show error
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div style={{ marginBottom: '16px' }}>
      <div
        className='inp-co'
        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      >
        <input
          id={id}
          type='text'
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          style={{
            flex: 1,
            padding: '8px 12px',
            border: '1px solid #ccc',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        <label
          htmlFor={id}
          style={{ display: 'block', fontWeight: 'bold', marginBottom: '6px' }}
        >
          {label}
        </label>
        {isSaving && (
          <span style={{ fontSize: '12px', color: '#666' }}>Saving...</span>
        )}
        {!isSaving && saved && (
          <span style={{ fontSize: '12px', color: 'green' }}>Saved!</span>
        )}
        <button
          disabled={localValue === value}
          className='primary-btn'
          onClick={handleBlur}
        >
          {' '}
          Save
        </button>
      </div>
    </div>
  )
}
