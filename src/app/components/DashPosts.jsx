"use client";

import { Button, Modal, Table } from "flowbite-react";
import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import Image from "next/image";
import { toast } from "react-toastify";

export default function DashPosts() {
  const { user } = useUser();
  console.log("user", user);

  const [userPosts, setUserPosts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [postIdToDelete, setPostIdToDelete] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/cars/user/${user?.publicMetadata?.userMongoId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data);
        } else {
          setError(data.message || "Failed to fetch posts");
        }
      } catch (error) {
        setError("Failed to load posts. Please try again later.");
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    // Only fetch if user is admin
    if (user?.publicMetadata?.isAdmin) {
      fetchPosts();
    }
  }, [user?.publicMetadata?.isAdmin, user?.publicMetadata?.userMongoId]);

  const handleDeletePost = async () => {
    setShowModal(false);
    setDeleteLoading(true);
    try {
      const res = await fetch(`/api/cars/${postIdToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (res.ok) {
        const newPosts = userPosts.filter((car) => car._id !== postIdToDelete);
        setUserPosts(newPosts);
        toast.success("Post deleted successfully");
      } else {
        throw new Error("Failed to delete post");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to delete post");
    } finally {
      setDeleteLoading(false);
      setPostIdToDelete("");
    }
  };

  if (!user?.publicMetadata?.isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full py-7">
        <h1 className="text-2xl font-semibold">You are not an admin!</h1>
      </div>
    );
  }

  if (loading) {
    return <div className="py-4 text-center">Loading...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="p-3 overflow-x-scroll table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      {user?.publicMetadata?.isAdmin && userPosts.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Car image</Table.HeadCell>
              <Table.HeadCell>Car.make</Table.HeadCell>
              <Table.HeadCell>Car.model</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>
                <span>Edit</span>
              </Table.HeadCell>
            </Table.Head>
            {userPosts &&
              userPosts.map((car) => (
                <Table.Body className="divide-y" key={car._id}>
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      {new Date(car.updatedAt).toLocaleDateString()}
                    </Table.Cell>
                    <Table.Cell>
                      <Link href={`/cars/${car._id}`}>
                        <Image
                          src={car.images[0] || "/default-car.jpg"}
                          alt={car.make}
                          width={100}
                          height={100}
                          className="object-cover w-20 h-10 bg-gray-500 dark:bg-gray-700"
                          onError={(e) => {
                            e.target.src = "/default-car.jpg";
                          }}
                          priority={false}
                        />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {car.make}
                      </p>
                    </Table.Cell>
                    <Table.Cell>{car.model}</Table.Cell>
                    <Table.Cell>
                      <span
                        className="font-medium text-red-500 cursor-pointer hover:underline"
                        onClick={() => {
                          setShowModal(true);
                          setPostIdToDelete(car._id);
                        }}
                      >
                        Delete
                      </span>
                    </Table.Cell>
                    <Table.Cell>
                      <Link
                        className="text-teal-500 hover:underline"
                        href={`/dashboard/edit/${car._id}`}
                      >
                        <span>Edit</span>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </>
      ) : (
        <p>You have no posts yet!</p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200" />
            <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
              Are you sure you want to delete this post?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={handleDeletePost}>
                Yes, I&apos;m sure
              </Button>
              <Button color="gray" onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
