import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View } from "react-native";

export default function MapScreen({
  longitude,
  latitude,
}: {
  longitude: number;
  latitude: number;
}) {
  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude,
          longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude, longitude }}
          title="Property Location"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
