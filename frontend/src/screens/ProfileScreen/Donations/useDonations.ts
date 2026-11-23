import { useState, useEffect } from 'react'

export function useDonations() {
  const [isDonationsOpen, setIsDonationsOpen] = useState(false)
  const [isPromoOpen, setIsPromoOpen] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState(false)

  const copyAlias = () => {
    try {
      navigator.clipboard.writeText('marot.ismael')
      setCopyFeedback(true)
      setTimeout(() => setCopyFeedback(false), 2000)
    } catch (err) {
      console.error('Error copying alias:', err)
      setCopyFeedback(false)
    }
  }

  const [profileData, setProfileData] = useState<any>(null)

  return {
    isDonationsOpen,
    setIsDonationsOpen,
    isPromoOpen,
    setIsPromoOpen,
    copyFeedback,
    setCopyFeedback,
    copyAlias,
    profileData,
    setProfileData
  }
}
