import { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import Image from "next/image";
import { FaCheck, FaTimes, FaSort } from "react-icons/fa";

export default function DashUsers({ user, isLoaded }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sort, setSort] = useState("desc");
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: pagination.page,
            limit: 10,
            sort: sort,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
          setPagination(data.pagination);
        } else {
          setError(data.error || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.publicMetadata?.isAdmin) {
      fetchUsers();
    }
  }, [user?.publicMetadata?.isAdmin, pagination.page, sort]);

  const toggleSort = () => {
    setSort((prev) => (prev === "asc" ? "desc" : "asc"));
  };

  if (!user?.publicMetadata?.isAdmin && isLoaded) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <h1 className="text-2xl font-semibold">You are not an admin!</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full w-full py-7">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : user?.publicMetadata?.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className="shadow-md">
            <Table.Head>
              <Table.HeadCell>
                <button
                  onClick={toggleSort}
                  className="flex items-center gap-2 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Date created
                  <FaSort
                    className={`transition-transform ${
                      sort === "asc" ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </Table.HeadCell>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
              <Table.HeadCell>Email</Table.HeadCell>
              <Table.HeadCell>Admin</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {users.map((user) => (
                <Table.Row
                  className="bg-white dark:border-gray-700 dark:bg-gray-800"
                  key={user._id}
                >
                  <Table.Cell>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <Image
                      src={user.profilePicture}
                      alt={user.username}
                      width={40}
                      height={40}
                      className="profile-image"
                    />
                  </Table.Cell>
                  <Table.Cell>{user.username}</Table.Cell>
                  <Table.Cell>{user.email}</Table.Cell>
                  <Table.Cell>
                    {user.isAdmin ? (
                      <FaCheck className="text-green-500" />
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          <div className="flex justify-center gap-2 mt-8">
            {[...Array(pagination.pages)].map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() =>
                  setPagination((prev) => ({ ...prev, page: idx + 1 }))
                }
                className={`dashboard-button ${
                  pagination.page === idx + 1
                    ? "dashboard-button-primary"
                    : "bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p>You have no users yet!</p>
      )}
    </div>
  );
}
