import React, { useEffect, useState } from "react";
import { getAllProjectsByUser } from "../services";
import { ProjectCard } from "../../../../components/ProjectCard/ProjectCard";
import { Navbar } from "../../../../components/Navbar/Navbar";

export const MyProjects = () => {
  const [posts, setPosts] = useState([]);
  const user = JSON.parse(sessionStorage.getItem("cryptoLancerUser"));
  const fetchProjects = async () => {
    const res = await getAllProjectsByUser(user.username);
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
              Your Projects
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Manage your projects
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts?.map((post) => (
              <ProjectCard
                id={post?.id}
                project={post}
                link={`/my-projects/manage-project/${post?.id}`}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
