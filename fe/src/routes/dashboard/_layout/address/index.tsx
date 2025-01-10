import Header from '@/components/layoutAdmin/header/header';
import { createFileRoute } from '@tanstack/react-router';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useState } from 'react';
import { Button } from '@medusajs/ui';

export const Route = createFileRoute('/dashboard/_layout/address/')({
  component: Address,
});

const containerStyle = {
  width: '100%',
  height: '500px',
};

const defaultCenter = {
  lat: 21.03813149621362,
  lng: 105.74725985527039,
};

function Address() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyALyc7VkotxfAcosGTKmz9HnCUxwty4BQk', // Replace with your API key
  });

  const [coordinates, setCoordinates] = useState(defaultCenter);

  const handleSaveLocation = () => {
    alert(`Coordinates saved: ${coordinates.lat}, ${coordinates.lng}`);
  };

  const handleSearch = () => {
    alert(`Search for coordinates: ${coordinates.lat}, ${coordinates.lng}`);
  };

  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoordinates({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          alert('Không thể lấy được vị trí của bạn.');
        }
      );
    } else {
      alert('Trình duyệt của bạn không hỗ trợ định vị!');
    }
  };

  return (
    <div>
      <Header title="Vị trí cửa hàng" />
      <div className='mt-4 mx-6 flex flex-col gap-1 rounded-lg border border-gray-200 bg-ui-bg-base px-6 py-4'>
        <div className="">
          <div className="pb-3">
            <div className="flex justify-between">
              <div><input
                type="text"
                value={coordinates.lat}
                readOnly
                className="border rounded px-2 py-1 w-80"
              />
                <span>-</span>
                <input
                  type="text"
                  value={coordinates.lng}
                  readOnly
                  className="border rounded px-2 py-1 w-80"
                /></div>
              <Button
                onClick={handleSearch}
                className=""
              >
                Tìm kiếm
              </Button>
            </div>
          </div>

          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={coordinates}
              zoom={15}
              onClick={(e) =>
                setCoordinates({
                  lat: e.latLng.lat(),
                  lng: e.latLng.lng(),
                })
              }
            >
              <Marker position={coordinates} />
            </GoogleMap>
          ) : (
            <div>Loading...</div>
          )}

          <div className="mt-3 flex justify-between items-center">
            <span>Tọa độ hiện tại: {coordinates.lat}, {coordinates.lng}</span>
            <div className="flex space-x-2">
              <Button
                onClick={handleGeolocation}
                className=""
                variant='secondary'
              >
                Định vị
              </Button>
              <Button
                onClick={handleSaveLocation}
                className=""
              >
                Lưu vị trí
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Address;
