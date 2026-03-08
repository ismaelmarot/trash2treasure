🇪🇸 DOCUMENTO DE REQUISITOS DEL PROYECTO (PRD) – Trash2Treasure

Versión: 1.0.0
Fecha: 6 de marzo de 2026
Autor: Ismael Marot


---

1. VISÓN GENERAL

ReciclaApp es una aplicación diseñada para conectar a quienes tienen materiales reciclables o donaciones disponibles con aquellas personas que recolectan estos recursos. Actualmente, muchos materiales útiles como cajas, latas, botellas, ropa o muebles terminan en las calles o veredas, lo que dificulta y consume mucho tiempo de los recolectores al buscarlos de forma aleatoria.

Nuestra solución es una plataforma sencilla que permite a cualquier usuario publicar la ubicación exacta de estos materiales usando GPS y mapas interactivos, facilitando así que quienes los recolectan los encuentren sin perder tiempo. Además, fomentamos la colaboración y el agradecimiento entre usuarios para crear una comunidad confiable y activa.

El público objetivo son personas en situación vulnerable dedicadas a la recolección, así como vecinos y dueños de comercios interesados en donar o ayudar, con acceso a dispositivos móviles o la web.


---

2. OBJETIVOS Y CRITERIOS DE ÉXITO

El propósito principal de ReciclaApp es optimizar el proceso de recolección de materiales reciclables y donaciones, reduciendo el tiempo perdido en búsquedas y promoviendo una red solidaria entre usuarios.

Generar al menos 10 publicaciones activas diarias para validar el uso y utilidad del MVP.

Lograr que el 50% de los usuarios regresen a la app la semana siguiente para fomentar la retención.

Obtener que más del 70% de las publicaciones visitadas sean puntuadas, fomentando la interacción y confianza.

Conseguir que al menos la mitad de los usuarios activos reciban y abran notificaciones push, manteniéndolos informados y conectados.

Incentivar que los usuarios guarden un promedio de 3 locaciones favoritas, ayudando a organizar y volver a revisar oportunidades.

Asegurar que el tiempo de carga en dispositivos móviles sea menor a 2 segundos, para una experiencia fluida.


---

3. FUNCIONALIDADES CLAVE Y REQUISITOS

Estas son las funcionalidades principales que harán posible la experiencia propuesta, ordenadas por prioridad:

Publicación de locaciones: Los usuarios podrán indicar dónde hay materiales disponibles con soporte GPS y mapa interactivo. Las publicaciones deben incluir de 1 a 3 fotos, descripción, usuario que publica, puntaje, hora y un temporizador de hasta 24 horas para mantener la información actualizada.

Filtrado y búsqueda avanzada: Permite buscar publicaciones por categoría (cartón, latas, muebles, etc.), proximidad geográfica o palabras clave, facilitando el acceso a lo necesario rápidamente.

Navegación integrada: Orienta a los recolectores desde su ubicación actual hasta el lugar donde se encuentran los materiales mediante GPS.

Scoring y agradecimientos: Los usuarios pueden puntuar publicaciones y agradecer, creando un sistema de reputación confiable y motivador.

Notificaciones push: Alertan a usuarios cercanos sobre nuevas publicaciones para no perder oportunidades cercanas.

Favoritos: Guardar locaciones que interesan para revisarlas posteriormente.

Estadísticas personalizadas: Los usuarios que publican pueden ver su actividad, puntajes y agradecimientos recibidos, lo que incentiva la participación.

Informe general de la app: Muestra métricas globales como cantidad de contribuyentes, publicaciones y categorías.

Chat simple (opcional): Facilita la coordinación para retirar materiales entre usuarios, agilizando la logística.

Ejemplos de usuario:

Como recolector, quiero ver en el mapa dónde hay materiales, para no perder tiempo buscando.

Como donante, quiero subir fotos y ubicación de materiales que ya no uso, para ayudar a otros.

Como usuario, deseo puntuar y agradecer publicaciones para fomentar la confianza en la comunidad.

Como recolector, quiero filtrar los materiales por categoría para encontrar fácilmente lo que necesito.

Como usuario, quiero recibir notificaciones de materiales cerca para no desaprovechar oportunidades.


---

4. RESTRICCIONES Y SUPOSICIONES

La aplicación debe funcionar principalmente en dispositivos móviles, con soporte web para accesibilidad.

Como MVP, la base de datos será SQLite por simplicidad, aunque se considera PostgreSQL para un futuro escalado.

Suponemos que los usuarios cuentan con conexión a internet la mayor parte del tiempo, aunque la PWA ofrecerá funcionalidades offline parciales.

El acceso mediante login básico por email/password es fundamental; Google y Facebook serán opciones adicionales.

Se dependerá de APIs externas de mapas (Google Maps o Mapbox), que deben estar accesibles para la navegación y geolocalización.

Los recursos técnicos y humanos se limitan a un equipo pequeño, orientando la implementación hacia simplicidad y rapidez de desarrollo.


---

5. DEPENDENCIAS Y ACTORES CLAVE

Equipos técnicos: Desarrollo frontend (React para web y PWA), backend (Node.js y Express) y bases de datos.

Proveedores externos: Servicios de mapas GPS (Google Maps o Mapbox) y plataformas de deploy (Vercel o Netlify).

Usuarios finales: Personas vulnerables que recolectan, vecinos y comercios que donan.

Stakeholders internos: Equipo de producto, marketing y soporte, encargados de desplegar y promover la app.


---

6. CRONOGRAMA E HITOS

Para lanzar el MVP en un plazo razonable, se propone:

    Mes 1:
        Diseño y prototipado (wireframes y estilo visual simple, móvil-friendly).

    Mes 2:
        Desarrollo de funcionalidades básicas: publicación, mapa y búsqueda.

    Mes 3:
        Implementación de scoring, notificaciones y sistema de usuarios.

    Mes 4:
        Pruebas piloto con usuarios reales y ajustes finales.

    Mes 5:
        Lanzamiento oficial y monitorización de métricas iniciales.


---

7. CONCLUSIÓN

ReciclaApp representa una oportunidad real para mejorar la gestión de materiales reciclables y donaciones en la comunidad, facilitando que quienes más lo necesitan optimicen su tiempo y esfuerzo. Con una experiencia simple, accesible y colaborativa, buscamos construir una red confiable y activa que beneficie a todos los participantes.

Los próximos pasos son validar el diseño y arrancar el desarrollo MVP, asegurándonos que las funcionalidades centrales cumplan con los objetivos planteados y generen valor desde el primer momento.