"use client";
import { useState } from "react";
import GoogleMapReact from "google-map-react";

// Define types for the dynamic location fetched from Google Places API
interface Location {
  lat: number;
  lng: number;
  name: string;
}

// Marker component to display store name on the map
const StoreMarker = ({ name }: { name: string }) => (
  <div style={{ color: "red", fontWeight: "bold" }}>{name}</div>
);

// Sample spedn for each brand
type BrandSpednType = Record<string, string>;

const brandSpedn: BrandSpednType = {
  BancoAgricola: "./spedn/BancoAgricola.png",
  BarnesAndNoble: "./spedn/BarnesAndNoble.png",
  BaskinRobbins: "/spedn/BaskinRobbins.png",
  Chipotle: "/spedn/Chipotle.png",
  CoCoBubbleTea: "/spedn/CoCoBubbleTea.png",
  TheCoffeeBean: "/spedn/TheCoffeeBean.png",
  FamousFootwear: "/spedn/FamousFootwear.png",
  Fresh: "/spedn/Fresh.png",
  GameStop: "/spedn/GameStop.png",
  InternationalShoppes: "/spedn/InternationalShoppes.png",
  Kiehls: "/spedn/Kiehls.png",
  LuxuryBeautyStore: "/spedn/LuxuryBeautyStore.png",
  LondonJewelers: "/spedn/LondonJewelers.png",
  Mikimoto: "/spedn/Mikimoto.png",
  Nordstrom: "/spedn/Nordstrom.png",
  NordstromRack: "/spedn/NordstromRack.png",
  Regal: "/spedn/Regal.png",
  Sheetz: "/spedn/Sheetz.png",
  UltaBeauty: "/spedn/UltaBeauty.png",
  Wompi: "/spedn/Wompi.png",
};

// List of brands (to display and fetch locations)
const storeList = [
  { name: "BancoAgricola", displayName: "Banco Agricola" },
  { name: "BarnesAndNoble", displayName: "Barnes & Noble" },
  { name: "BaskinRobbins", displayName: "Baskin-Robbins" },
  { name: "Chipotle", displayName: "Chipotle" },
  { name: "CoCoBubbleTea", displayName: "CoCo Bubble Tea" },
  { name: "TheCoffeeBean", displayName: "The Coffee Bean & Tea Leaf" },
  { name: "FamousFootwear", displayName: "Famous Footwear" },
  { name: "Fresh", displayName: "Fresh" },
  { name: "GameStop", displayName: "GameStop" },
  { name: "InternationalShoppes", displayName: "International Shoppes" },
  { name: "Kiehls", displayName: "Kiehl's" },
  { name: "LuxuryBeautyStore", displayName: "Luxury Beauty Store" },
  { name: "LondonJewelers", displayName: "London Jewelers" },
  { name: "Mikimoto", displayName: "Mikimoto" },
  { name: "Nordstrom", displayName: "Nordstrom" },
  { name: "NordstromRack", displayName: "Nordstrom Rack" },
  { name: "Regal", displayName: "Regal" },
  { name: "Sheetz", displayName: "Sheetz" },
  { name: "UltaBeauty", displayName: "Ulta Beauty" },
  { name: "Wompi", displayName: "Wompi" },
];

// Default location coordinates (e.g., Times Square, NYC)
const defaultLocation = { lat: 40.758, lng: -73.9855 };

const MapPage: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState<string | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);

  const fetchStoreLocations = async (storeName: string) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${storeName}+store&key=AIzaSyDduV2URznwk_HiV8YbpYxl43yvyNbe3ho`
      );
      const data = await response.json();

      const fetchedLocations = data.results.map((place: any) => ({
        lat: place.geometry.location.lat,
        lng: place.geometry.location.lng,
        name: place.name,
      }));

      setLocations(fetchedLocations);
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const handleStoreSelect = (store: string) => {
    setSelectedStore(store);
    fetchStoreLocations(store); // Fetch locations for the selected store
  };

  return (
    <div className="py-6" style={{ display: "flex" }}>
      {/* Sidebar for selecting a store */}
      <div style={{ width: "30%", paddingRight: "20px" }}>
        <h2>Select a Store</h2>
        <div className="brand-grid">
          {storeList.map((store: any, index: number) => (
            <div
              key={index}
              className={`brand-item flex items-center ${
                selectedStore === store.name ? "selected" : ""
              }`}
              onClick={() => handleStoreSelect(store.name)}
              style={{ cursor: "pointer", marginBottom: "10px" }}
            >
              <img
                src={brandSpedn[store.name]}
                alt={store.displayName}
                style={{ width: "auto", height: "80px" }}
              />
              <p>{store.displayName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Map displaying store locations */}
      <div style={{ width: "70%", height: "auto" }}>
        <GoogleMapReact
          bootstrapURLKeys={{ key: "AIzaSyDduV2URznwk_HiV8YbpYxl43yvyNbe3ho" }}
          defaultCenter={
            locations.length > 0
              ? { lat: locations[0].lat, lng: locations[0].lng }
              : defaultLocation
          }
          defaultZoom={10}
        >
          {locations.map((location, index) => (
            <StoreMarker key={index} name={location.name} />
          ))}
        </GoogleMapReact>
      </div>

      {/* Example styling for the brand selection */}
      <style>{`
        .brand-grid {
          height : 600px;
          overflow-y : scroll;
           overflow-x : hidden;
           
        }
        /* Styling for the scrollbar */
.brand-grid::-webkit-scrollbar {
    width: 8px; /* Adjust the width here */
}

.brand-grid::-webkit-scrollbar-track {
    background: #f1f1f1; /* Track color */
}

.brand-grid::-webkit-scrollbar-thumb {
    background: #888; /* Thumb color */
    border-radius: 10px; /* Rounded corners */
}

.brand-grid::-webkit-scrollbar-thumb:hover {
    background: #555; /* Thumb color on hover */
}

        .brand-item {
          text-align: center;
          transition: all 0.3s ease;
        }

        .brand-item.selected {
          border: 2px solid #007bff;
        }

        .brand-item img {
          max-width: 100%;
          height: auto;
        }

        .brand-item p {
          margin-top: 5px;
          font-size: 14px;
          font-weight: bold;
        }

        .brand-item:hover {
          transform: scale(1.05);
        }
      `}</style>
    </div>
  );
};

export default MapPage;
