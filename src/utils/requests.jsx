const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || "";

export const fetchCars = async ({ ShowFeatured = false } = {}) => {
  try {
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : apiDomain;
    const url = new URL(`/api/cars${ShowFeatured ? "/featured" : ""}`, baseUrl);

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.message ||
          `Failed to fetch data: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();

    if (!data || (!data.cars && !Array.isArray(data))) {
      console.error("Invalid data format received:", data);
      return { cars: [] };
    }

    return {
      cars: data.cars || data || [],
      total: data.total,
      page: data.page,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
    };
  } catch (error) {
    console.error("Error fetching cars:", error);
    // Return empty data structure with error information
    return {
      cars: [],
      error: error.message,
      total: 0,
      page: 1,
      pageSize: 9,
      totalPages: 0,
    };
  }
};

export const fetchCarById = async (id) => {
  const response = await fetch(`/api/cars/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch car details");
  }
  return response.json();
};

async function fetchCar(id) {
  try {
    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : apiDomain;
    const url = new URL(`/api/cars/${id}`, baseUrl);

    const res = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch car: ${res.statusText}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching car:", error);
    return null;
  }
}

export { fetchCar };
