import React, { useEffect, useState } from "react";
import { getAllProjectsByUser, getProjectsByParticipant } from "../services";
import { ProjectCard } from "../../../../components/ProjectCard/ProjectCard";
import { Navbar } from "../../../../components/Navbar/Navbar";
import { RxCross2 } from "react-icons/rx";

export const MyApplications = () => {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("cryptoLancerUser"));
  const fetchProjects = async () => {
    const res = await getProjectsByParticipant(user.username);
    setPosts(res);
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <>
      <Navbar tabs={[{ title: "My Projects", path: "/my-projects" }]} />
      <div className="bg-white pb-24 pt-10 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Your Work
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Manage your work
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts?.map((post) => (
              <div id={post?.id}>
                <ProjectCard
                  project={post}
                  link={
                    post?.assignee === user.username
                      ? `/my-applications/manage-application/${post?.id}`
                      : "#"
                  }
                />
                <p
                  className={`p-2 font-medium rounded-b-md flex justify-between items-center ${post?.assignee === user.username
                      ? "bg-lime-200"
                      : "bg-yellow-200"
                    }`}
                >
                  <span>
                    Status:{" "}
                    <span
                      className={` text-white px-2 py-1 rounded-full ${post?.assignee === user.username
                          ? "bg-green-400"
                          : "bg-orange-400"
                        }`}
                    >
                      {post?.assignee === user.username ? "Assigned" : "Pending"}
                    </span>
                  </span>
                  <button title="Withdraw Application" className={`mx-2 bg-white p-2 rounded-full hover:scale-125 hover:outline hover:outline-2 hover:outline-red-300
                    ${post?.assignee !== user.username
                        ? "visible"
                        : "invisible"
                      }
                  `}>
                    <RxCross2/>
                  </button>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
