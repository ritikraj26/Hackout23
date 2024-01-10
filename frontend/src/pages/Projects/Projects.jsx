import React, { useEffect, useState } from "react";
import { Navbar } from "../../components/Navbar/Navbar";
import { getAllProjects } from "./services";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

export const Projects = () => {
  const [posts, setPosts] = useState([]);

  const fetchProjects = async () => {
    const res = await getAllProjects();
    setPosts(res);
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <>
      <Navbar tabs={[{ title: "Projects", path: "/projects" }]} />
      <div className="bg-white pb-24 pt-10 sm:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Projects looking for Cryptolancers...
            </h2>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              Find the best projects to work on and earn crypto.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-gray-200 pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
            {posts
              .filter((post) => post.deployed && post.deployed === true)
              .map((post) => (
                <Link id={post.id} to={`/view-project/${post.id}`}>
                  <article
                    key={post.id}
                    className="flex max-w-xl flex-col items-start justify-between shadow-md rounded-xl border-2 p-4 border-lime-100 hover:border-lime-200 hover:shadow-lg transition duration-500 ease-in-out"
                  >
                    {/* CARD HEADER  */}
                    <div className="flex items-center gap-x-4 text-xs">
                      <p className="text-gray-500">{post.createdAt}</p>
                      {post.techStack.split(",").map((skill) => (
                        <div className="relative z-10 rounded-full bg-lime-500 px-3 py-1.5 font-medium text-white hover:bg-lime-400">
                          {skill}
                        </div>
                      ))}
                    </div>
                    {/* CARD CONTENT  */}
                    <div className="group relative">
                      <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
                        <a href={post.href}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </a>
                      </h3>
                      <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
                        {post.description}
                      </p>
                    </div>
                    {/* CARD FOOTER  */}
                    <div className="relative mt-8 flex items-center gap-x-4">
                      <img
                        src={post.user_avatar}
                        alt=""
                        className="h-10 w-10 rounded-full bg-gray-50"
                      />
                      <div className="text-sm leading-6">
                        <p className="font-semibold text-gray-900">
                          <a href={`https://github.com/${post.username}`}>
                            <span className="absolute inset-0" />
                            {post.username}
                          </a>
                        </p>
                        <FaGithub className="inline-block my-auto" />
                        <p className="text-gray-600 inline-block px-1">
                          {" "}
                          Github
                        </p>
                      </div>
                    </div>
                  </article>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </>
  );
};
