import { createContext, useCallback, useContext, useState } from 'react';

const PlaylistContext = createContext(null);

export function PlaylistProvider({ children }) {
  const [playlists, setPlaylists] = useState([]);

  const crearPlaylist = useCallback((nombre) => {
    const nombreNormalizado = nombre.trim();
    if (!nombreNormalizado) return { error: 'Escribe un nombre para la playlist.' };

    const playlist = {
      id: `playlist-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      nombre: nombreNormalizado,
      canciones: [],
    };
    setPlaylists((actuales) => [...actuales, playlist]);
    return { playlist };
  }, []);

  const agregarCancion = useCallback((playlistId, cancion) => {
    setPlaylists((actuales) =>
      actuales.map((playlist) => {
        if (playlist.id !== playlistId || playlist.canciones.some((item) => item.id === cancion.id)) {
          return playlist;
        }
        return { ...playlist, canciones: [...playlist.canciones, cancion] };
      })
    );
  }, []);

  const quitarCancion = useCallback((playlistId, cancionId) => {
    setPlaylists((actuales) =>
      actuales.map((playlist) =>
        playlist.id === playlistId
          ? { ...playlist, canciones: playlist.canciones.filter((cancion) => cancion.id !== cancionId) }
          : playlist
      )
    );
  }, []);

  const eliminarPlaylist = useCallback((playlistId) => {
    setPlaylists((actuales) => actuales.filter((playlist) => playlist.id !== playlistId));
  }, []);

  return (
    <PlaylistContext.Provider
      value={{ playlists, crearPlaylist, agregarCancion, quitarCancion, eliminarPlaylist }}
    >
      {children}
    </PlaylistContext.Provider>
  );
}

export function usePlaylists() {
  const context = useContext(PlaylistContext);
  if (!context) throw new Error('usePlaylists debe usarse dentro de <PlaylistProvider>');
  return context;
}
