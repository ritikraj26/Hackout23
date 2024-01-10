import React from "react";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

export const ProjectCard = (props) => {
  const { link, project } = props;
  return (
    <>
      <Link id={project.id} to={link}>
        <article
          key={project.id}
          className="flex max-w-xl flex-col items-start justify-between shadow-md rounded-xl border-2 p-4 border-lime-100 hover:border-lime-200 hover:shadow-lg transition duration-500 ease-in-out"
        >
          {/* CARD HEADER  */}
          <div className="flex items-center gap-x-4 text-xs">
            <p className="text-gray-500">{project.createdAt}</p>
            {project.techStack.split(",").map((skill) => (
              <div className="relative z-10 rounded-full bg-lime-500 px-3 py-1.5 font-medium text-white hover:bg-lime-400">
                {skill}
              </div>
            ))}
          </div>
          {/* CARD CONTENT  */}
          <div className="group relative">
            <h3 className="mt-3 text-lg font-semibold leading-6 text-gray-900 group-hover:text-gray-600">
              <a href={project.href}>
                <span className="absolute inset-0" />
                {project.title}
              </a>
            </h3>
            <p className="mt-5 line-clamp-3 text-sm leading-6 text-gray-600">
              {project.description}
            </p>
          </div>
          {/* CARD FOOTER  */}
          <div className="relative mt-8 flex items-center gap-x-4">
            <img
              src={project.user_avatar}
              alt=""
              className="h-10 w-10 rounded-full bg-gray-50"
            />
            <div className="text-sm leading-6">
              <p className="font-semibold text-gray-900">
                <a href={`https://github.com/${project.username}`}>
                  <span className="absolute inset-0" />
                  {project.username}
                </a>
              </p>
              <FaGithub className="inline-block my-auto" />
              <p className="text-gray-600 inline-block px-1"> Github</p>
            </div>
          </div>
        </article>
      </Link>
    </>
  );
};
