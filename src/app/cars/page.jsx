import CarSearch from "../components/CarSearch";
import Cars from "../components/Cars";

export default async function CarsPage() {
  return (
    <>
      <section className="py-8 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto max-w-7xl">
          <CarSearch />
        </div>
      </section>
      <Cars />
    </>
  );
}
