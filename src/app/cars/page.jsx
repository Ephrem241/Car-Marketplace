import { fetchCars } from "@/utils/requests";
import CarCard from "../components/CarCard";
import CarSearch from "../components/CarSearch";

export default async function CarsPage() {
  const cars = await fetchCars();

  cars.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <>
      <section className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto max-w-7xl">
          <CarSearch />
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto max-w-7xl">
          <h1 className="mb-8 text-3xl font-bold text-center text-gray-900 dark:text-white">
            Available Cars
          </h1>
          {cars.length === 0 ? (
            <p className="text-center text-gray-600 dark:text-gray-400">
              No cars found.
            </p>
          ) : (
            <div className="grid items-stretch grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
              {cars.map((car) => (
                <CarCard key={car._id} car={car} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
