// MapSelector.jsx
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useMemo } from "react";

export default function MapSelector({ markerPos, setMarkerPos, setCoords }) {
  const icon = useMemo(
    () =>
      L.icon({
        iconUrl: "https://cdn-icons-png.flaticon.com/512/1483/1483336.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
        iconSize: [42, 42],
        iconAnchor: [21, 42],
        popupAnchor: [0, -40],
      }),
    []
  );

  function MapClicker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkerPos([lat, lng]);
        setCoords(lat, lng);
      },
    });

    return null;
  }

  return (
    <MapContainer
      center={[-7.12, -34.88]}
      zoom={13}
      scrollWheelZoom={true}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      <MapClicker />

      {markerPos && (
        <Marker position={markerPos} icon={icon}>
          <Popup>
            📍 Local Selecionado <br />
            Lat: {markerPos[0].toFixed(6)} <br />
            Lng: {markerPos[1].toFixed(6)}
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
}