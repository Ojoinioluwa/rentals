// export default function MapScreen({
//   longitude,
//   latitude,
// }: {
//   longitude: number;
//   latitude: number;
// }) {
//   return (
//     <View style={styles.container}>
//       <MapView
//         provider={PROVIDER_DEFAULT}
//         style={styles.map}
//         initialRegion={{
//           latitude,
//           longitude,
//           latitudeDelta: 0.01,
//           longitudeDelta: 0.01,
//         }}
//       >
//         <Marker
//           coordinate={{ latitude, longitude }}
//           title="Property Location"
//         />
//       </MapView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   map: { flex: 1 },
// });

import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function MapScreen({
  longitude,
  latitude,
}: {
  longitude: number;
  latitude: number;
}) {
  const apiKey = "d4d88a6869c243aeb1d563374f93385c";

  const mapHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          html, body, #map { margin: 0; padding: 0; height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          const map = L.map('map').setView([${latitude}, ${longitude}], 15);
          L.tileLayer('https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey=${apiKey}', {
            maxZoom: 20,
            attribution: '© OpenMapTiles © OpenStreetMap contributors'
          }).addTo(map);
          L.marker([${latitude}, ${longitude}]).addTo(map)
            .bindPopup("Property Location")
            .openPopup();
        </script>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: mapHtml }}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
        automaticallyAdjustContentInsets={false}
        scrollEnabled={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
