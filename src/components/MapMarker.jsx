import { Marker, Popup } from "react-leaflet"

function MapMarker({city}) {
  const {cityName, position: {lat, lng}} = city
  
  return (
    <Marker position={[lat, lng]}>
    <Popup>
      <span>{cityName}</span>
    </Popup>
  </Marker>
  )
}

export default MapMarker
