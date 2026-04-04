import { useEffect, useState } from "react";

interface IPLocation {
  country: string;
  country_code: string;
  city: string;
  lat: number;
  lng: number;
}

export function useIPGeolocation() {
  const [location, setLocation] = useState<IPLocation | null>(null);

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((r) => r.json())
      .then((data) => {
        setLocation({
          country:      data.country_name,
          country_code: data.country_code,
          city:         data.city,
          lat:          data.latitude,
          lng:          data.longitude,
        });
        // Set map default viewport to detected city
        if (typeof window !== "undefined") {
          sessionStorage.setItem("civicpulse-detected-location", JSON.stringify({
            lat: data.latitude,
            lng: data.longitude,
            city: data.city,
          }));
        }
      })
      .catch(() => null); // silent fail — Yaoundé is the fallback
  }, []);

  return location;
}