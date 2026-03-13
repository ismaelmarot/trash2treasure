# PROJECT

Trash2Treasure

Aplicación para publicar ubicaciones donde hay materiales reutilizables o reciclables
(cartón, botellas, metales, ropa, muebles, etc.).

Los usuarios pueden:

- publicar ubicaciones con foto, descripción y GPS
- ver publicaciones en un mapa
- navegar hacia la ubicación

Plataforma principal: **mobile web (PWA)**.

PRD completo:
docs/prd/


---

# STACK

Frontend
- React
- TypeScript
- Styled Components

Map
- Leaflet
- React Leaflet
- OpenStreetMap

Backend
- Node.js
- Express

Database
- SQLite

Auth
- JWT
- bcrypt

Package manager
- npm


---

# PROJECT STRUCTURE

project
├── backend
├── docs
│    ├── design
│    └── prd
└── frontend
     └── src
        ├── @types
        ├── assets
        ├── components
        ├── hooks
        ├── mixins
        ├── navigation
        ├── router
        ├── screens
        ├── styles
        └── types


Frontend y backend están separados.


---

# ARCHITECTURE

Frontend
- React + TypeScript
- Styled Components
- arquitectura modular basada en:
  - components
  - screens
  - hooks
  - navigation

Backend
- API REST con Express
- maneja:
  - usuarios
  - publicaciones
  - fotos
  - ratings

Database
- SQLite

Map
- Leaflet + OpenStreetMap


---

# CORE FEATURES (MVP)

- publicación de materiales con foto
- mapa con marcadores
- navegación hacia ubicación
- sistema de usuarios
- puntuación de publicaciones
- favoritos
- notificaciones (futuro)


---

# FRONTEND ARCHITECTURE

src/

components  
UI reutilizable (buttons, cards, modals, inputs, map components).

screens  
Vistas completas de la app.

Ejemplos:
- MapScreen
- AddItemScreen
- ItemDetailScreen
- ProfileScreen

navigation  
sidebar, bottom nav, navigation config.

router  
definición de rutas.

hooks  
custom hooks reutilizables.

Ejemplos:
- useUserLocation
- useMapMarkers
- useAuth

styles  
theme, global styles, design tokens.

assets  
imagenes e iconos.

types / @types  
definiciones TypeScript.


---

# NAMING CONVENTIONS

Components → PascalCase  
Ej: `ItemCard`, `MapMarker`

Screens → PascalCase + Screen  
Ej: `MapScreen`, `AddItemScreen`

Hooks → `use` prefix  
Ej: `useAuth`, `useUserLocation`

Types → PascalCase  
Ej: `User`, `Item`, `Location`

Variables → camelCase  
Ej: `userLocation`, `mapMarkers`

Constants → UPPER_CASE  
Ej: `MAX_UPLOAD_IMAGES`


---

# DOMAIN MODEL (MVP)

User
- id
- name
- email
- password_hash
- created_at

Item
- id
- title
- description
- category
- latitude
- longitude
- created_at
- expires_at
- user_id

ItemPhoto
- id
- item_id
- image_url

Rating
- id
- item_id
- user_id
- score


---

# RULES

- prefer simple solutions
- avoid unnecessary dependencies
- respect existing folder structure
- avoid large architectural changes
- explain changes before implementing


---

# CURRENT STATUS

✔ frontend base creado  
✔ arquitectura de carpetas definida  
✔ PRD documentado  

Pendiente:

- mapa
- backend API
- SQLite
- autenticación
- subida de fotos
- publicaciones
