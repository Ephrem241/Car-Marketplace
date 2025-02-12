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
          <CarHeaderImage image={car.images[0]} />
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
                  <button className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600">
                    <i className="mr-2 fas fa-bookmark"></i> Bookmark Car
                  </button>
                  <button className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600">
                    <i className="mr-2 fas fa-share"></i> Share Car
                  </button>

                  <div className="p-6 bg-white rounded-lg shadow-md">
                    <h3 className="mb-6 text-xl font-bold">
                      Contact Car Manager
                    </h3>
                    <form>
                      <div className="mb-4">
                        <label
                          className="block mb-2 text-sm font-bold text-gray-700"
                          htmlFor="name"
                        >
                          Name:
                        </label>
                        <input
                          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                          id="name"
                          type="text"
                          placeholder="Enter your name"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block mb-2 text-sm font-bold text-gray-700"
                          htmlFor="email"
                        >
                          Email:
                        </label>
                        <input
                          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block mb-2 text-sm font-bold text-gray-700"
                          htmlFor="phone"
                        >
                          Phone:
                        </label>
                        <input
                          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
                          id="phone"
                          type="text"
                          placeholder="Enter your phone number"
                        />
                      </div>
                      <div className="mb-4">
                        <label
                          className="block mb-2 text-sm font-bold text-gray-700"
                          htmlFor="message"
                        >
                          Message:
                        </label>
                        <textarea
                          className="w-full px-3 py-2 text-gray-700 border rounded shadow appearance-none h-44 focus:outline-none focus:shadow-outline"
                          id="message"
                          placeholder="Enter your message"
                        ></textarea>
                      </div>
                      <div>
                        <button
                          className="flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:shadow-outline"
                          type="submit"
                        >
                          <i className="mr-2 fas fa-paper-plane"></i> Send
                          Message
                        </button>
                      </div>
                    </form>
                  </div>
                </aside>
              </div>
            </div>
          </section>
          <CarImages images={car.images} />
        </>
      )}
    </>
  );
}
