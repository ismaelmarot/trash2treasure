import { useState, useEffect, useCallback } from 'react'
import { API_BASE_URL } from '@/constants'
import {
  getPendingItems,
  markItemAsSynced,
  removePendingItem,
  getPendingCount,
  isOnline,
  base64ToFile,
  incrementRetryCount,
  removeFailedItem,
  type PendingItem
} from '@/services/offlineDB'
import { useAuth } from '@/hooks/useAuth'

const MAX_RETRIES = 3

// Solicitar permiso para notificaciones
const requestNotificationPermission = async (): Promise<boolean> => {
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  
  const permission = await Notification.requestPermission()
  return permission === 'granted'
}

// Enviar notificación
const sendNotification = async (title: string, body: string) => {
  const hasPermission = await requestNotificationPermission()
  if (!hasPermission) return

  try {
    new Notification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'trash2treasure-sync',
      requireInteraction: true
    })
  } catch (error) {
    console.error('Error sending notification:', error)
  }
}

export function useOfflineSync() {
  const [pendingCount, setPendingCount] = useState(0)
  const [isSyncing, setIsSyncing] = useState(false)
  const { token } = useAuth()

  const updateCount = useCallback(async () => {
    const count = await getPendingCount()
    setPendingCount(count)
  }, [])

  const syncItem = useCallback(async (item: PendingItem): Promise<boolean> => {
    if (!token) return false

    try {
      // 1. Crear el item en el backend
      const itemResponse = await fetch(`${API_BASE_URL}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          category: item.category,
          latitude: item.latitude,
          longitude: item.longitude
        })
      })

      if (!itemResponse.ok) {
        const retryCount = await incrementRetryCount(item.id)
        if (retryCount >= MAX_RETRIES) {
          console.error(`Item ${item.id} failed after ${MAX_RETRIES} attempts, removing`)
          await removeFailedItem(item.id)
        }
        return false
      }

      const itemData = await itemResponse.json()
      const itemId = itemData._id || itemData.id

      // 2. Subir la foto si existe (fallo blando - item queda sin imagen)
      let imageUploaded = false
      if (item.imageBase64) {
        try {
          const imageFile = base64ToFile(item.imageBase64, `photo-${Date.now()}.jpg`)
          const formData = new FormData()
          formData.append('image', imageFile)

          const photoResponse = await fetch(`${API_BASE_URL}/items/${itemId}/photos`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`
            },
            body: formData
          })

          if (photoResponse.ok) {
            imageUploaded = true
          } else {
            console.warn(`Image upload failed for item ${itemId}, item created without image`)
          }
        } catch (photoError) {
          console.warn(`Image upload error for item ${itemId}:`, photoError)
        }
      }

      // 3. Marcar como sincronizado (item creado, imagen es opcional)
      await markItemAsSynced(item.id)
      await removePendingItem(item.id)

      return true
    } catch (error) {
      console.error('Error syncing item:', error)
      const retryCount = await incrementRetryCount(item.id)
      if (retryCount >= MAX_RETRIES) {
        console.error(`Item ${item.id} failed after ${MAX_RETRIES} attempts, removing`)
        await removeFailedItem(item.id)
      }
      return false
    }
  }, [token])

  const syncAll = useCallback(async () => {
    if (!isOnline() || !token || isSyncing) return

    setIsSyncing(true)
    let successCount = 0
    let failCount = 0

    try {
      const pendingItems = await getPendingItems()

      for (const item of pendingItems) {
        const success = await syncItem(item)
        if (success) {
          successCount++
        } else {
          failCount++
        }
      }

      await updateCount()

      // Enviar notificaciones
      if (successCount > 0) {
        await sendNotification(
          '✅ Tesoro publicado',
          `${successCount} ${successCount === 1 ? 'tesoro se publicó' : 'tesoros se publicaron'} correctamente.`
        )
      }

      if (failCount > 0) {
        await sendNotification(
          '⚠️ Error al publicar',
          `${failCount} ${failCount === 1 ? 'tesoro no se pudo publicar. Verificá tu conexión e intentá de nuevo.' : 'tesoros no se pudieron publicar. Verificá tu conexión e intentá de nuevo.'}`
        )
      }
    } catch (error) {
      console.error('Error during sync:', error)
    } finally {
      setIsSyncing(false)
    }
  }, [token, isSyncing, syncItem, updateCount])

  // Sincronizar cuando vuelva la conexión
  useEffect(() => {
    const handleOnline = () => {
      console.log('Connection restored, syncing...')
      syncAll()
    }

    window.addEventListener('online', handleOnline)

    // Intentar sincronizar al cargar si hay conexión
    if (isOnline()) {
      syncAll()
    }

    updateCount()

    return () => {
      window.removeEventListener('online', handleOnline)
    }
  }, [syncAll, updateCount])

  return {
    pendingCount,
    isSyncing,
    syncAll,
    updateCount
  }
}
