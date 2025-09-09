interface LocationData {
  city?: string;
  country_code?: string;
  region_code?: string;
  zip?: string;
}

export async function getUserLocation(): Promise<LocationData> {
  try {
    const response = await fetch("https://ipapi.co/json/");
    if (!response.ok) throw new Error("Failed to fetch location data");
    const data = await response.json();
    return {
      city: data.city,
      country_code: data.country,
      region_code: data.region,
      zip: data.postal,
    };
  } catch (error) {
    console.error("Error getting user location:", error);
    return {
      city: "San Francisco",
      country_code: "US",
      region_code: "CA",
      zip: "94102",
    };
  }
}

export async function getBillingInfo(): Promise<{
  city: string;
  country: string;
  state: string;
  street: string;
  zipcode: string;
}> {
  const location = await getUserLocation();
  return {
    city: location.city || "San Francisco",
    country: location.country_code || "US",
    state: location.region_code || "CA",
    street: "123 Main St",
    zipcode: location.zip || "94102",
  };
}

export function getDefaultBillingInfo() {
  return {
    city: "San Francisco",
    country: "US",
    state: "CA",
    street: "123 Main St",
    zipcode: "94102",
  };
}
