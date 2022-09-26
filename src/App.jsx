import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import useRouteStore from "./store/route";
import { ToastContainer } from "react-toastify";
import Book from "./components/Book";
import BookingForm from "./components/BookingForm";
import "react-toastify/dist/ReactToastify.css";

const center = { lat: 18.4655, lng: 73.844 };

function App() {
  const { direction } = useRouteStore((state) => ({
    direction: state.direction,
  }));

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
    libraries: ["places"],
  });

  if (isLoaded)
    return (
      <div className="App">
        <ToastContainer />
        <div className="absolute w-screen h-screen top-0 left-0">
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          >
            <Marker position={center} />
            {direction && <DirectionsRenderer directions={direction} />}
          </GoogleMap>
        </div>
        <BookingForm></BookingForm>
        <Book></Book>
      </div>
    );
}

export default App;
