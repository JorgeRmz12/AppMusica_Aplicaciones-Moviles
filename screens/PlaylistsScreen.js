import { useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  Button,
  Card,
  Dialog,
  FAB,
  Icon,
  IconButton,
  Portal,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import PlaylistDetailScreen from './PlaylistDetailScreen';
import { usePlaylists } from '../context/PlaylistContext';

export default function PlaylistsScreen() {
  const theme = useTheme();
  const { playlists, crearPlaylist } = usePlaylists();
  const [playlistSeleccionada, setPlaylistSeleccionada] = useState(null);
  const [dialogoVisible, setDialogoVisible] = useState(false);
  const [nombre, setNombre] = useState('');
  const [error, setError] = useState('');

  const crear = () => {
    const resultado = crearPlaylist(nombre);
    if (resultado.error) {
      setError(resultado.error);
      return;
    }
    setNombre('');
    setError('');
    setDialogoVisible(false);
  };

  if (playlistSeleccionada) {
    return (
      <PlaylistDetailScreen
        playlistId={playlistSeleccionada}
        onBack={() => setPlaylistSeleccionada(null)}
      />
    );
  }

  return (
    <SafeAreaView edges={['top']} style={styles.pantalla}>
      <View style={styles.encabezado}>
        <View>
          <Text variant="headlineSmall" style={styles.negrita}>Tus playlists</Text>
          <Text variant="bodyMedium" style={styles.gris}>
            {playlists.length} {playlists.length === 1 ? 'playlist' : 'playlists'}
          </Text>
        </View>
        <IconButton icon="plus" mode="contained" onPress={() => setDialogoVisible(true)} accessibilityLabel="Crear playlist" />
      </View>

      <FlatList
        data={playlists}
        keyExtractor={(playlist) => playlist.id}
        contentContainerStyle={playlists.length === 0 && styles.vacioContenedor}
        renderItem={({ item }) => (
          <Card mode="contained" style={styles.tarjeta} onPress={() => setPlaylistSeleccionada(item.id)}>
            <Card.Title
              title={item.nombre}
              subtitle={`${item.canciones.length} ${item.canciones.length === 1 ? 'canción' : 'canciones'}`}
              left={(props) => <Icon {...props} source="playlist-music" />}
              right={(props) => <IconButton {...props} icon="chevron-right" />}
            />
          </Card>
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Icon source="playlist-music-outline" size={56} color={theme.colors.onSurfaceVariant} />
            <Text variant="titleMedium" style={styles.vacioTitulo}>Aún no tienes playlists</Text>
            <Text variant="bodyMedium" style={[styles.gris, styles.centrado]}>
              Crea una playlist y agrega tus canciones favoritas.
            </Text>
            <Button mode="contained" icon="plus" onPress={() => setDialogoVisible(true)} style={styles.boton}>
              Crear playlist
            </Button>
          </View>
        }
      />

      {playlists.length > 0 && (
        <FAB icon="plus" label="Nueva playlist" onPress={() => setDialogoVisible(true)} style={styles.fab} />
      )}

      <Portal>
        <Dialog visible={dialogoVisible} onDismiss={() => setDialogoVisible(false)}>
          <Dialog.Title>Nueva playlist</Dialog.Title>
          <Dialog.Content>
            <TextInput
              mode="outlined"
              label="Nombre"
              value={nombre}
              onChangeText={(value) => {
                setNombre(value);
                if (error) setError('');
              }}
              error={Boolean(error)}
              autoFocus
              onSubmitEditing={crear}
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogoVisible(false)}>Cancelar</Button>
            <Button mode="contained" onPress={crear}>Crear</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  pantalla: { flex: 1 },
  encabezado: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  negrita: { fontWeight: 'bold' },
  gris: { color: '#B3B3B3' },
  tarjeta: { marginHorizontal: 16, marginBottom: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16 },
  vacioContenedor: { flexGrow: 1 },
  vacio: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  vacioTitulo: { marginTop: 12, marginBottom: 4, fontWeight: 'bold' },
  centrado: { textAlign: 'center' },
  boton: { marginTop: 20 },
  error: { color: '#FFB4AB', marginTop: 8 },
});
