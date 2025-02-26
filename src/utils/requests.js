const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null;

async function fetchCars() {
  try {
    if (!apiDomain) {
      return [];
    }
    const res = await fetch(`${apiDomain}/cars`, {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    // Return the cars array if it exists, otherwise return an empty array
    return data.cars || data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

async function fetchCar(id) {
  try {
    if (!apiDomain) {
      return null;
    }
    const res = await fetch(`${apiDomain}/cars/${id}`);

    if (!res.ok) {
      throw new Error(`Failed to fetch car: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching car:", error);
    return null;
  }
}

export { fetchCars, fetchCar };
