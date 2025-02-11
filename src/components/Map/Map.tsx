"use client";

import Image from "next/image";
import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import locations from '../../app/map/locations.json';

// Define types for the location data structure
type Coordinates = {
  latitude: number;
  longitude: number;
};

type Location = {
  address: string;
  coordinates: Coordinates;
};

type CityLocations = {
  [city: string]: Location[];
};

type LocationsType = {
  [key: string]: {
    [key: string]: {
      [key: string]: {
        address: string;
        coordinates: {
          latitude: number;
          longitude: number;
        };
      }[];
    };
  };
};

type BrandSpednType = Record<string, string>;

const brandSpedn: BrandSpednType = {
  "BancoAgricola": "/spedn/BancoAgricola.png",
  "BarnesAndNoble": "/spedn/BarnesandNoble.png",
  "BaskinRobbins": "/spedn/BaskinRobbins.png",
  "Chipotle": "/spedn/Chipotle.png",
  "CoCoBubbleTea": "/spedn/CoCoBubbleTea.png",
  "TheCoffeeBean": "/spedn/TheCoffeeBean.png",
  "FamousFootwear": "/spedn/FamousFootwear.png",
  "Fresh": "/spedn/Fresh.png",
  "GameStop": "/spedn/Gamestop.png",
  "InternationalShoppes": "/spedn/InternationalShoppes.png",
  "Kiehls": "/spedn/Kiehls.png",
  "LuxuryBeautyStore": "/spedn/LuxuryBeautyStore.png",
  "LondonJewelers": "/spedn/LondonJewelers.png",
  "Mikimoto": "/spedn/Mikimoto.png",
  "Nordstrom": "/spedn/Nordstrom.png",
  "NordstromRack": "/spedn/NordstromRack.png",
  "Regal": "/spedn/Regal.png",
  "Sheetz": "/spedn/Sheetz.png",
  "UltaBeauty": "/spedn/UltaBeauty.png",
  "Wompi": "/spedn/Wompi.png",
};

// List of brands (to display and fetch locations)
const storeList = [
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
];

// Default location coordinates (e.g., Times Square, NYC)
const defaultLocation = { lat: 40.758, lng: -73.9855 };

const mapContainerStyle = {
  width: "100%",
  height: "600px",
};

const defaultCenter: Coordinates = {
  latitude: 19.4527232,
  longitude: -70.7471359,
};

const LocationFilter: React.FC = () => {
  const [selectedStore, setSelectedStore] = useState("BarnesAndNoble");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
 
  const availableStates = Object.keys((locations as LocationsType)[selectedStore] ?? {});
  const availableCities = selectedState
    ? Object.keys((locations as LocationsType)[selectedStore]?.[selectedState] ?? {})
    : [];

  const handleStateChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(event.target.value);
    setSelectedCity("");
  };

  const handleCityChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(event.target.value);
  };

  const selectedLocations =
    selectedState && selectedCity
      ? (locations as LocationsType)[selectedStore]?.[selectedState]?.[selectedCity]
      : [];

  const handleStoreSelect = (store: string) => {
    setSelectedStore(store);
  };

  return (
    <div className="py-6">
      {/* Page Heading */}
      <h1 className="text-4xl font-bold text-center mb-2">Spedn Store Locator</h1>
      <h2 className="text-lg text-center mb-6">select brand -&gt; select state -&gt; select city</h2>
      
      {/* State and City Dropdowns */}
      <div className="flex items-center gap-2">
        <div>
          <label htmlFor="state">State: </label>
          <select id="state" value={selectedState} onChange={handleStateChange}>
            <option value="">Select a state</option>
            {availableStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* City Dropdown */}
        {selectedState && (
          <div>
            <label htmlFor="city">City: </label>
            <select id="city" value={selectedCity} onChange={handleCityChange}>
              <option value="">Select a city</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Show filtered results and map */}
      <div className="py-6 h-[600px]" style={{ display: "flex" }}>
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
                <Image
                  src={brandSpedn[store.name]}
                  alt={store.displayName}
                  style={{ width: "auto", height: "80px" }}
                  width={200}
                  height={200}
                />
                <p>{store.displayName}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ width: "70%", height: "600px" }}>
          <LoadScript
            googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_API_KEY ?? ""}
          >
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              center={{
                lat: selectedLocations
                  ? selectedLocations[0]?.coordinates.latitude
                  : defaultCenter.latitude,
                lng: selectedLocations
                  ? selectedLocations[0]?.coordinates.longitude
                  : defaultCenter.longitude,
              }}
              zoom={13}
            >
              {selectedLocations?.map((location, index) => (
                <Marker
                  key={index}
                  position={{
                    lat: location.coordinates.latitude,
                    lng: location.coordinates.longitude,
                  }}
                />
              ))}
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
      
      <style>{`
        .brand-grid {
          height: 600px;
          overflow-y: scroll;
          overflow-x: hidden;
        }
        /* Styling for the scrollbar */
        .brand-grid::-webkit-scrollbar {
          width: 8px;
        }
        .brand-grid::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .brand-grid::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        .brand-grid::-webkit-scrollbar-thumb:hover {
          background: #555;
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

export default LocationFilter;
