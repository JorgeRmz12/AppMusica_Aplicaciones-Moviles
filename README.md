/plan @workspace Analiza el código actual de esta aplicación de música. Necesito implementar una funcionalidad para crear una lista de reproducción personalizada.

Por favor, genera un plan de desarrollo paso a paso que cumpla con los siguientes requerimientos:

1. Crear una nueva playlist.

2. Asignarle un nombre.

3. Agregar canciones existentes de la aplicación.

4. Visualizar la playlist creada.

5. Mostrar las canciones que contiene.

6. La interfaz debe utilizar estrictamente los componentes de React Native Paper.

Consideraciones obligatorias:

- No utilizar ninguna API externa.

- No instalar nuevas librerías (revisar package.json).

- Reutilizar los componentes y datos existentes (como el listado de canciones actual).

- No eliminar funcionalidades actuales de la aplicación.

- El estado de la playlist debe conservarse mientras el usuario navega por la aplicación (sugiere cómo manejar este estado global basándote en la arquitectura actual del proyecto).

# Plan de desarrollo: playlists personalizadas

## 1. Definir el modelo y el contexto global

- Crear `context/PlaylistContext.js`.
- Modelar cada playlist con:
  - Identificador único.
  - Nombre.
  - Lista de canciones existentes.
- Exponer operaciones para:
  - Crear playlists.
  - Consultar playlists.
  - Agregar canciones.
  - Evitar canciones duplicadas.
  - Quitar canciones.
  - Eliminar playlists.
- Validar que el nombre no esté vacío.
- Mantener los errores de validación visibles en la interfaz.

## 2. Integrar el proveedor global

- Integrar `PlaylistProvider` en la raíz de la aplicación.
- Montarlo junto a `PaperProvider` y `PlayerProvider`.
- Mantener el contexto por encima de las pantallas para conservar las playlists al navegar.
- No modificar el funcionamiento actual del reproductor ni de favoritos.

## 3. Añadir la sección de playlists

- Agregar una nueva pestaña `Playlists` a `BottomNavigation.Bar`.
- Mostrar:
  - Lista de playlists creadas.
  - Nombre de cada playlist.
  - Cantidad de canciones.
  - Estado vacío cuando no existan playlists.
- Utilizar componentes de React Native Paper como:
  - `Card`.
  - `List`.
  - `Icon`.
  - `IconButton`.
  - `Button`.
  - `FAB`.
  - `Dialog`.
  - `Portal`.
  - `TextInput`.

## 4. Implementar la creación de playlists

- Añadir un botón para crear una nueva playlist.
- Mostrar un diálogo con un campo de texto para introducir el nombre.
- Validar nombres vacíos.
- Crear y guardar la playlist en el contexto global.
- Permitir crear múltiples playlists personalizadas.

## 5. Implementar el detalle de una playlist

- Crear una vista de detalle para cada playlist.
- Mostrar:
  - Nombre de la playlist.
  - Cantidad de canciones.
  - Botón para reproducir.
  - Lista de canciones incluidas.
- Reutilizar `SongListItem`.
- Reproducir las canciones utilizando el `PlayerContext` existente.
- Permitir:
  - Volver a la lista de playlists.
  - Agregar canciones.
  - Quitar canciones.
  - Eliminar la playlist.
- Mostrar un estado vacío cuando la playlist no tenga canciones.

## 6. Implementar la selección de canciones

- Utilizar el catálogo local de `data.json`.
- No utilizar APIs externas.
- Mostrar las canciones disponibles en un selector.
- Permitir agregar canciones a la playlist.
- Marcar las canciones que ya fueron agregadas.
- Impedir que una misma canción se agregue más de una vez.
- Mantener intactas las funciones actuales de reproducción y favoritos.

## 7. Mantener la consistencia visual y la accesibilidad

- Utilizar componentes visuales de React Native Paper.
- Usar el tema existente mediante `useTheme()` y `theme.js`.
- Mantener la interfaz compatible con pantallas móviles pequeñas.
- Añadir etiquetas de accesibilidad a los botones.
- No eliminar ni alterar las funcionalidades existentes:
  - Inicio.
  - Favoritos.
  - Mini reproductor.
  - Reproductor principal.
  - Catálogo de canciones.

## 8. Validar la implementación

- Validar la sintaxis de los archivos JavaScript.
- Ejecutar los diagnósticos disponibles.
- Generar el bundle web de Expo.
- Verificar manualmente:
  - Creación de varias playlists.
  - Validación de nombres vacíos.
  - Agregado de canciones.
  - Prevención de duplicados.
  - Visualización del contenido.
  - Eliminación de canciones.
  - Reproducción de una playlist.
  - Eliminación de playlists.
  - Conservación del estado al cambiar de pestaña.

## Archivos principales

- `context/PlaylistContext.js`
- `App.js`
- `screens/PlaylistsScreen.js`
- `screens/PlaylistDetailScreen.js`

## Restricciones cumplidas

- No se añadieron librerías nuevas.
- No se modificó `package.json`.
- No se utilizaron APIs externas.
- Se reutilizaron los datos existentes de `data.json`.
- Las playlists se conservan mientras la aplicación permanece abierta.
- No se implementó persistencia después de cerrar la aplicación, ya que eso requeriría una librería de almacenamiento no incluida en el proyecto.