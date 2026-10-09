import { useEffect, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, Dialog, Icon, IconButton, List, Portal, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import data from '../data.json';
import SongListItem from '../components/SongListItem';
import { usePlayer } from '../context/PlayerContext';
import { usePlaylists } from '../context/PlaylistContext';

export default function PlaylistDetailScreen({ playlistId, onBack }) {
  const theme = useTheme();
  const { reproducir } = usePlayer();
  const { playlists, agregarCancion, quitarCancion, eliminarPlaylist } = usePlaylists();
  const [selectorVisible, setSelectorVisible] = useState(false);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const playlist = playlists.find((item) => item.id === playlistId);

  useEffect(() => {
    if (!playlist) onBack();
  }, [onBack, playlist]);

  if (!playlist) {
    return null;
  }

  const contiene = (id) => playlist.canciones.some((cancion) => cancion.id === id);
  const eliminar = () => {
    eliminarPlaylist(playlist.id);
    setConfirmarEliminacion(false);
    onBack();
  };

  return (
    <SafeAreaView edges={['top']} style={styles.pantalla}>
      <View style={styles.barra}>
        <IconButton icon="arrow-left" onPress={onBack} accessibilityLabel="Volver a playlists" />
        <Text variant="titleLarge" style={styles.titulo} numberOfLines={1}>{playlist.nombre}</Text>
        <IconButton icon="delete-outline" onPress={() => setConfirmarEliminacion(true)} accessibilityLabel="Eliminar playlist" />
      </View>

      <View style={styles.resumen}>
        <View style={[styles.icono, { backgroundColor: theme.colors.primary }]}>
          <Icon source="playlist-music" size={42} color={theme.colors.onPrimary} />
        </View>
        <View style={styles.info}>
          <Text variant="headlineSmall" style={styles.negrita} numberOfLines={2}>{playlist.nombre}</Text>
          <Text variant="bodyMedium" style={styles.gris}>
            {playlist.canciones.length} {playlist.canciones.length === 1 ? 'canción' : 'canciones'}
          </Text>
        </View>
      </View>

      <View style={styles.acciones}>
        <Button mode="contained" icon="play" disabled={playlist.canciones.length === 0} onPress={() => reproducir(playlist.canciones[0], playlist.canciones)}>
          Reproducir
        </Button>
        <Button mode="outlined" icon="plus" onPress={() => setSelectorVisible(true)}>
          Agregar canciones
        </Button>
      </View>

      <FlatList
        data={playlist.canciones}
        keyExtractor={(cancion) => cancion.id}
        renderItem={({ item }) => (
          <View style={styles.fila}>
            <View style={styles.cancion}>
              <SongListItem cancion={item} onPress={() => reproducir(item, playlist.canciones)} />
            </View>
            <IconButton icon="close" onPress={() => quitarCancion(playlist.id, item.id)} accessibilityLabel={`Quitar ${item.titulo}`} />
          </View>
        )}
        contentContainerStyle={playlist.canciones.length === 0 && styles.vacioContenedor}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Icon source="music-note-off" size={56} color={theme.colors.onSurfaceVariant} />
            <Text variant="titleMedium" style={styles.vacioTitulo}>Playlist vacía</Text>
            <Text variant="bodyMedium" style={[styles.gris, styles.centrado]}>
              Agrega canciones del catálogo para comenzar.
            </Text>
            <Button mode="contained" icon="plus" onPress={() => setSelectorVisible(true)} style={styles.boton}>
              Agregar canciones
            </Button>
          </View>
        }
      />

      <Portal>
        <Dialog visible={selectorVisible} onDismiss={() => setSelectorVisible(false)}>
          <Dialog.Title>Agregar canciones</Dialog.Title>
          <Dialog.ScrollArea style={styles.scrollArea}>
            <FlatList
              data={data.canciones}
              keyExtractor={(cancion) => cancion.id}
              renderItem={({ item }) => (
                <List.Item
                  title={item.titulo}
                  description={item.artista}
                  left={(props) => <List.Icon {...props} icon="music-note" />}
                  right={(props) => (
                    <IconButton
                      {...props}
                      icon={contiene(item.id) ? 'check' : 'plus'}
                      iconColor={contiene(item.id) ? theme.colors.primary : undefined}
                      disabled={contiene(item.id)}
                      onPress={() => agregarCancion(playlist.id, item)}
                      accessibilityLabel={contiene(item.id) ? 'Canción ya agregada' : `Agregar ${item.titulo}`}
                    />
                  )}
                />
              )}
            />
          </Dialog.ScrollArea>
          <Dialog.Actions>
            <Button onPress={() => setSelectorVisible(false)}>Cerrar</Button>
          </Dialog.Actions>
        </Dialog>

        <Dialog visible={confirmarEliminacion} onDismiss={() => setConfirmarEliminacion(false)}>
          <Dialog.Title>Eliminar playlist</Dialog.Title>
          <Dialog.Content>
            <Text>¿Seguro que quieres eliminar “{playlist.nombre}”?</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setConfirmarEliminacion(false)}>Cancelar</Button>
            <Button onPress={eliminar}>Eliminar</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1 },
  barra: { flexDirection: 'row', alignItems: 'center', paddingRight: 4 },
  titulo: { flex: 1, fontWeight: 'bold' },
  resumen: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  icono: { width: 96, height: 96, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginLeft: 16 },
  negrita: { fontWeight: 'bold' },
  gris: { color: '#B3B3B3' },
  acciones: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16, marginBottom: 8 },
  fila: { flexDirection: 'row', alignItems: 'center' },
  cancion: { flex: 1 },
  vacioContenedor: { flexGrow: 1 },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  vacioTitulo: { marginTop: 12, marginBottom: 4, fontWeight: 'bold' },
  centrado: { textAlign: 'center' },
  boton: { marginTop: 20 },
  scrollArea: { maxHeight: 420, paddingHorizontal: 0 },
});
