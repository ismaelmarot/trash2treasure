# Roadmap de Optimización - Trash2Treasure

## FÁCIL (1-2 horas) - Impacto inmediato

### Backend
- [ ] **Indices en MongoDB** para queries frecuentes
  ```js
  db.items.createIndex({ user_id: 1, created_at: -1 })
  db.items.createIndex({ claimed_by: 1 })
  db.userpoints.createIndex({ user_id: 1 }, { unique: true })
  ```
- [ ] **Response caching** para ranking y stats (5 min TTL)
- [ ] **Pagination** en /items y /ranking (límite 20 por request)

### Frontend
- [ ] **Lazy loading** de imágenes con `loading="lazy"`
- [ ] **Skeleton loaders** en lugar de spinners
- [ ] **Memoización** de componentes pesados (listas, cards)

---

## MEDIO (half day) - Mejora significativa

### Backend
- [ ] **Conexión persistente** a MongoDB (reutilizar pool)
- [ ] **Proyección** en queries: `select: { field: 1 }` en vez de traér todo
- [ ] **Batch updates** para múltiples operaciones
- [ ] **WebSocket** para updates en tiempo real (reemplazar polling)

### Frontend
- [ ] **Code splitting** por rutas (React.lazy + Suspense)
- [ ] **Virtual scrolling** para listas largas (>50 items)
- [ ] **Service Worker** cachear API responses (offline-first)
- [ ] **Optimistic updates** para acciones del usuario

---

## AVANZADO (1-2 días) - Impacto alto

### Backend
- [ ] **Redis cache** para:
  - Ranking (1 min TTL)
  - Stats de usuario (5 min TTL)
  - Challenge definitions (static, 1hr TTL)
- [ ] **Colas asíncronas** (Bull/BullMQ) para:
  - Procesamiento de logros/desafíos
  - Notifications
  - Cleanup de items expirados
- [ ] **Rate limiting** por usuario/IP
- [ ] **Database read replicas** para queries de solo lectura

### Frontend
- [ ] **GraphQL** o API REST optimizada con dataloaders
- [ ] **Prefetching** de rutas adyacentes
- [ ] **Image optimization**: WebP, srcset, blur hash placeholders
- [ ] **Bundle analysis** y tree shaking

---

## EXPERTO (1 semana+) - Arquitectura

### Backend
- [ ] **Microservicios**:
  - `api-users` - auth, profile
  - `api-items` - CRUD items
  - `api-points` - achievements, challenges, stats
  - `api-notifications` - push, email
- [ ] **Message queue** (RabbitMQ/Kafka) para eventos cross-services
- [ ] **CDN** para assets estáticos
- [ ] **Database sharding** por user_id

### Frontend
- [ ] **PWA completo**:
  - Background sync
  - Push notifications
  - App shortcuts
- [ ] **React Server Components** para data fetching
- [ ] **Edge functions** para lógica ligera (Vercel/Cloudflare)

---

## PRIORIDADES SUGERIDAS (orden recomendado)

1. **MongoDB indices** → inmediato, sin riesgo
2. **Lazy loading + skeleton** → UX mejora visible
3. **Code splitting** → bundle más pequeño
4. **Redis cache** → mayor impacto en velocidad
5. **Optimistic updates** → app se siente instantánea
6. **Virtual scrolling** → cuando haya +100 items

---

## MÉTRICAS A MEDIR

Antes y después de cada cambio:

```javascript
// Backend
- Response time (p95, p99)
- DB query time
- Memory usage
- Error rate

// Frontend  
- Lighthouse score
- FCP, LCP, TTI
- Bundle size
- Time to Interactive
```
