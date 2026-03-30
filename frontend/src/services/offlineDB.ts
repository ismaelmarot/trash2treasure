const DB_NAME = 'trash2treasure-offline'
const DB_VERSION = 1
const STORE_NAME = 'pending-items'

interface PendingItem {
  id: string
  title: string
  description: string
  category: string
  latitude: number
  longitude: number
  imageBase64: string | null
  timestamp: number
  synced: number
  retryCount?: number
}

let db: IDBDatabase | null = null

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    if (db) {
      resolve(db)
      return
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)

    request.onsuccess = () => {
      db = request.result
      resolve(db)
    }

    request.onupgradeneeded = (event) => {
      const database = (event.target as IDBOpenDBRequest).result

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        const store = database.createObjectStore(STORE_NAME, { keyPath: 'id' })
        store.createIndex('synced', 'synced', { unique: false })
        store.createIndex('timestamp', 'timestamp', { unique: false })
      }
    }
  })
}

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const base64ToFile = (base64: string, filename: string): File => {
  const arr = base64.split(',')
  const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/jpeg'
  const bstr = atob(arr[1])
  let n = bstr.length
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], filename, { type: mime })
}

export const savePendingItem = async (item: Omit<PendingItem, 'id' | 'timestamp' | 'synced'>): Promise<string> => {
  const database = await openDB()
  const id = `pending-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

  const pendingItem: PendingItem = {
    ...item,
    id,
    timestamp: Date.now(),
    synced: 0,
    retryCount: 0
  }

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.add(pendingItem)

    request.onsuccess = () => resolve(id)
    request.onerror = () => reject(request.error)
  })
}

export const getPendingItems = async (): Promise<PendingItem[]> => {
  const database = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readonly')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('synced')
    const request = index.getAll(IDBKeyRange.only(0))

    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error)
  })
}

export const markItemAsSynced = async (id: string): Promise<void> => {
  const database = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const getRequest = store.get(id)

    getRequest.onsuccess = () => {
      const item = getRequest.result
      if (item) {
        item.synced = 1
        const putRequest = store.put(item)
        putRequest.onsuccess = () => resolve()
        putRequest.onerror = () => reject(putRequest.error)
      } else {
        resolve()
      }
    }
    getRequest.onerror = () => reject(getRequest.error)
  })
}

export const removePendingItem = async (id: string): Promise<void> => {
  const database = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

export const incrementRetryCount = async (id: string): Promise<number> => {
  const database = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const getRequest = store.get(id)

    getRequest.onsuccess = () => {
      const item = getRequest.result
      if (item) {
        item.retryCount = (item.retryCount || 0) + 1
        const putRequest = store.put(item)
        putRequest.onsuccess = () => resolve(item.retryCount)
        putRequest.onerror = () => reject(putRequest.error)
      } else {
        resolve(0)
      }
    }
    getRequest.onerror = () => reject(getRequest.error)
  })
}

const MAX_RETRIES = 3

export const removeFailedItem = async (id: string): Promise<void> => {
  const database = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const request = store.delete(id)

    request.onsuccess = () => {
      console.warn(`Item ${id} removed after ${MAX_RETRIES} failed attempts`)
      resolve()
    }
    request.onerror = () => reject(request.error)
  })
}

export const clearSyncedItems = async (): Promise<void> => {
  const database = await openDB()

  return new Promise((resolve, reject) => {
    const transaction = database.transaction([STORE_NAME], 'readwrite')
    const store = transaction.objectStore(STORE_NAME)
    const index = store.index('synced')
    const request = index.openCursor(IDBKeyRange.only(1))

    request.onsuccess = () => {
      const cursor = request.result
      if (cursor) {
        cursor.delete()
        cursor.continue()
      } else {
        resolve()
      }
    }
    request.onerror = () => reject(request.error)
  })
}

export const getPendingCount = async (): Promise<number> => {
  const items = await getPendingItems()
  return items.length
}

export const isOnline = (): boolean => {
  return navigator.onLine
}

export { fileToBase64, base64ToFile }
export type { PendingItem }
