"use client";

import { useEffect, useState } from "react";
import {
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Button, Table } from "flowbite-react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
export default function DashboardComp() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalPosts, setTotalPosts] = useState(0);
  const [lastMonthUsers, setLastMonthUsers] = useState(0);
  const [lastMonthPosts, setLastMonthPosts] = useState(0);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: 5,
          }),
        });

        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setLastMonthUsers(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/cars/get", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            limit: 5,
          }),
        });
        const data = await res.json();
        if (res.ok) {
          setPosts(data.posts);
          setTotalPosts(data.totalPosts);
          setLastMonthPosts(data.lastMonthPosts);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      try {
        await Promise.all([fetchUsers(), fetchPosts()]);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.publicMetadata?.isAdmin) {
      fetchData();
    }
  }, [user]);
  return (
    <div className="p-3 md:mx-auto">
      <div className="flex flex-wrap gap-4 justify-center">
        <div className="dashboard-stats-card">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 uppercase text-md">Total Users</h3>
              <p className="text-2xl">{totalUsers}</p>
            </div>
            <HiOutlineUserGroup className="bg-teal-600 dashboard-icon" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="flex items-center text-green-500">
              <HiArrowNarrowUp />
              {lastMonthUsers}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>

        <div className="dashboard-stats-card">
          <div className="flex justify-between">
            <div>
              <h3 className="text-gray-500 uppercase text-md">Total Posts</h3>
              <p className="text-2xl">{totalPosts}</p>
            </div>
            <HiDocumentText className="bg-lime-600 dashboard-icon" />
          </div>
          <div className="flex gap-2 text-sm">
            <span className="flex items-center text-green-500">
              <HiArrowNarrowUp />
              {lastMonthPosts}
            </span>
            <div className="text-gray-500">Last month</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center py-3 mx-auto">
        <div className="dashboard-card">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="p-2 text-center">Recent users</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link href={"/dashboard?tab=users"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>User image</Table.HeadCell>
              <Table.HeadCell>Username</Table.HeadCell>
            </Table.Head>
            {users &&
              users.map((user) => (
                <Table.Body key={user._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <Image
                        src={user.profilePicture}
                        alt="user"
                        width={40}
                        height={40}
                        className="profile-image"
                      />
                    </Table.Cell>
                    <Table.Cell>{user.username}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>

        <div className="dashboard-card">
          <div className="flex justify-between p-3 text-sm font-semibold">
            <h1 className="p-2 text-center">Recent posts</h1>
            <Button outline gradientDuoTone="purpleToPink">
              <Link href={"/dashboard?tab=posts"}>See all</Link>
            </Button>
          </div>
          <Table hoverable>
            <Table.Head>
              <Table.HeadCell>Car image</Table.HeadCell>
              <Table.HeadCell>Car make</Table.HeadCell>
              <Table.HeadCell>Car model</Table.HeadCell>
            </Table.Head>
            {posts &&
              posts.map((post) => (
                <Table.Body key={post._id} className="divide-y">
                  <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <Image
                        src={post?.images?.[0] ?? "/images/default-car.jpg"}
                        alt={`${post?.make || "Car"} ${post?.model || ""}`}
                        width={40}
                        height={40}
                        className="table-image"
                        onError={(e) => {
                          e.target.src = "/images/default-car.jpg";
                        }}
                      />
                    </Table.Cell>
                    <Table.Cell className="w-96">{post.make}</Table.Cell>
                    <Table.Cell className="w-5">{post.model}</Table.Cell>
                  </Table.Row>
                </Table.Body>
              ))}
          </Table>
        </div>
      </div>
    </div>
  );
}
