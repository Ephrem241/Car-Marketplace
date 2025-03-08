"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchCar } from "@/utils/requests";
import CarHeaderImage from "@/app/components/CarHeaderImage";
import Link from "next/link";

import CarDetails from "@/app/components/CarDetails";
import { FaArrowLeft } from "react-icons/fa";
import Spinner from "@/app/components/Spinner";
import CarImages from "@/app/components/CarImages";
import BookmarkButton from "@/app/components/BookmarkButton";
import ShareButtons from "@/app/components/ShareButtons";
import CarContactForm from "@/app/components/CarContactForm";

export default function CarPage() {
  const { id } = useParams();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarData = async () => {
      if (!id) return;
      try {
        const car = await fetchCar(id);
        setCar(car);
      } catch (error) {
        console.error("Error fetching car", error);
      } finally {
        setLoading(false);
      }
    };

    if (car === null) {
      fetchCarData();
    } else {
      setLoading(false);
    }
  }, [id, car]);

  if (!car && !loading) {
    return (
      <h1 className="mt-10 text-2xl font-bold text-center">Car Not Found</h1>
    );
  }

  return (
    <>
      {loading && <Spinner loading={loading} />}
      {!loading && car && (
        <>
          <CarHeaderImage image={car.images?.[0]} />
          <section>
            <div className="container px-6 py-6 m-auto">
              <Link
                href="/cars"
                className="flex items-center text-blue-500 hover:text-blue-600"
              >
                <FaArrowLeft className="mr-2" /> Back to cars
              </Link>
            </div>
          </section>

          <section className="bg-blue-50">
            <div className="container px-6 py-10 m-auto">
              <div className="grid w-full grid-cols-1 gap-6 md:grid-cols-70/30">
                <CarDetails car={car} />

                <aside className="space-y-4">
                  <BookmarkButton car={car} />
                  <ShareButtons car={car} />
                  <CarContactForm car={car} />
                </aside>
              </div>
            </div>
          </section>
          {car.images && car.images.length > 0 && (
            <CarImages images={car.images} />
          )}
        </>
      )}
    </>
  );
}
