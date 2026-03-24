import type { ConfirmationConfig } from '@/interface'
import { useState } from 'react'

export function useConfirmationModal() {
    const [isOpen, setIsOpen] = useState(false)
    const [config, setConfig] = useState<ConfirmationConfig | null>(null)

    const openModal = (data: ConfirmationConfig) => {
        setConfig(data)
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
        setConfig(null)
    }

    const handleConfirm = () => {
        config?.onConfirm()
        closeModal()
    }

    const handleCancel = () => {
        closeModal()
    }

    return {
        isOpen,
        config,
        openModal,
        handleConfirm,
        handleCancel
    }
}