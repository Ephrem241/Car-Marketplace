import { fetchCars } from "@/utils/requests";
import CarCard from "../components/CarCard";

export default async function CarsPage() {
  const cars = await fetchCars();

  cars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return (
    <section className="px-4 py-6">
      <div className="container-xl lg:container m-auto px-4 py-6">
        {cars.length === 0 ? (
          <p>No cars found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cars.map((car) => (
              <CarCard key={car._id} car={car} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
