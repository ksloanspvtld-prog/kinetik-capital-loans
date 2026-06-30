"use client";

import { useState, useEffect } from "react";

interface AddressInputProps {
  value: {
    city: string;
    state: string;
    pincode: string;
  };
  onChange: (data: { city: string; state: string; pincode: string }) => void;
  required?: boolean;
}

export default function AddressInput({ value, onChange, required = false }: AddressInputProps) {
  const [states, setStates] = useState<{ name: string; isoCode: string }[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedState, setSelectedState] = useState(value.state || "");
  const [selectedCity, setSelectedCity] = useState(value.city || "");
  const [pincode, setPincode] = useState(value.pincode || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStates = async () => {
      const { State } = await import("country-state-city");
      const indianStates = State.getStatesOfCountry("IN").map((s: { name: string; isoCode: string }) => ({
        name: s.name,
        isoCode: s.isoCode,
      }));
      setStates(indianStates);
    };
    loadStates();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (selectedState) {
        const { State, City } = await import("country-state-city");
        const stateObj = State.getStatesOfCountry("IN").find((s: { isoCode: string }) => s.isoCode === selectedState);
        if (stateObj) {
          const cityList = City.getCitiesOfState("IN", stateObj.isoCode).map((c: { name: string }) => c.name);
          setCities(cityList);
        } else {
          setCities([]);
        }
      } else {
        setCities([]);
      }
    };
    loadCities();
  }, [selectedState]);

  useEffect(() => {
    if (selectedCity && selectedState) {
      onChange({ city: selectedCity, state: selectedState, pincode });
    }
  }, [selectedCity, selectedState, pincode]);

  const lookupPincode = async (code: string) => {
    if (code.length !== 6) return;
    setIsLoading(true);
    try {
      const res = await fetch(`https://api.postalpincode.in/pincode/${code}`);
      const data = await res.json();
      if (data[0]?.Status === "Success") {
        const postOffice = data[0].PostOffice[0];
        const cityName = postOffice.District;
        const stateName = postOffice.State;
        const { State, City } = await import("country-state-city");
        const stateObj = State.getStatesOfCountry("IN").find((s: { name: string }) => s.name === stateName);
        if (stateObj) {
          setSelectedState(stateObj.isoCode);
          const cityList = City.getCitiesOfState("IN", stateObj.isoCode);
          const matchedCity = cityList.find((c: { name: string }) => c.name === cityName);
          if (matchedCity) {
            setSelectedCity(matchedCity.name);
            setPincode(code);
            onChange({ city: matchedCity.name, state: stateObj.isoCode, pincode: code });
          } else {
            setPincode(code);
            onChange({ city: "", state: stateObj.isoCode, pincode: code });
          }
        } else {
          setPincode(code);
          onChange({ city: "", state: "", pincode: code });
        }
      } else {
        alert("Invalid pincode or not found");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to lookup pincode");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      <select
        value={selectedState}
        onChange={(e) => {
          setSelectedState(e.target.value);
          setSelectedCity("");
          setPincode("");
          onChange({ city: "", state: e.target.value, pincode: "" });
        }}
        className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
        required={required}
      >
        <option value="">Select State</option>
        {states.map((state) => (
          <option key={state.isoCode} value={state.isoCode}>
            {state.name}
          </option>
        ))}
      </select>

      <select
        value={selectedCity}
        onChange={(e) => {
          setSelectedCity(e.target.value);
          onChange({ city: e.target.value, state: selectedState, pincode });
        }}
        className="w-full border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
        disabled={!selectedState}
        required={required}
      >
        <option value="">{selectedState ? "Select City" : "Select State First"}</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <div className="flex gap-3">
        <input
          type="text"
          maxLength={6}
          placeholder="Pincode"
          value={pincode}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, "");
            if (val.length <= 6) {
              setPincode(val);
              if (val.length === 6) {
                lookupPincode(val);
              }
            }
          }}
          className="flex-1 border-2 border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white p-3 rounded-xl focus:outline-none focus:border-indigo-500 transition"
        />
        <button
          type="button"
          onClick={() => lookupPincode(pincode)}
          disabled={pincode.length !== 6 || isLoading}
          className="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl transition disabled:opacity-50"
        >
          {isLoading ? "..." : "🔍"}
        </button>
      </div>
    </div>
  );
}