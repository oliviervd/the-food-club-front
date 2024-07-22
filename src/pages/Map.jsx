import Header from "../elements/Header.jsx";
import {MapContainer, TileLayer, Marker, Popup} from "react-leaflet";

const Map = ({}) => {

    let zoom = 12.5

    return(
        <div>
            <Header landing={true}/>
            <div style={{height:"100vh", width: "100vw"}}>
                <MapContainer
                    center={[51.0544, 3.7256]}
                    zoom={zoom}
                    zoomControl={false}
                >
                    <TileLayer
                        //attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>'
                        //url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        url="https://api.mapbox.com/styles/v1/oliviervd-tfc/clllwhqvq009s01pea2rw8mpt/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1Ijoib2xpdmllcnZkLXRmYyIsImEiOiJjbGxqZWFjd3MweTBzM2psaWFiemlnZnZnIn0.fMu0iJpz82mNYQ5Rrrwi-w"
                    />
                </MapContainer>
            </div>
        </div>
    )
}
export default Map
