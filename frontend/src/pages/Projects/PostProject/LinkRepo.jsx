import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdPublic } from "react-icons/md";
import { BiGitMerge } from "react-icons/bi";
import { BiLockAlt } from "react-icons/bi";

export const LinkRepo = (props) => {
  const [repos, setRepos] = useState([]);
  const [fetched, setFetched] = useState(false);
  const access_token = sessionStorage.getItem("githubToken");

  useEffect(() => {
    axios
      .get(`https://api.github.com/user/repos`, {
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${access_token}`,
          "X-GitHub-Api-Version": "2022-11-28",
        },
        per_page: 100,
      })
      .then((response) => response.data)
      .then((data) => {
        console.log(data);
        setRepos(data);
        setFetched(true);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <div className="p-2">
        <div className="max-h-screen">
          <p className="text-2xl font-semibold text-gray-900">
            Link Project's Repository
          </p>

          <div className="mt-4 p-2 h-80 border border-gray-200 overflow-scroll no-scrollbar max-w-5xl">
            {!fetched ? (
              <>
                {!access_token?(
                  <div className="text-center animate-bounce mt-8 text-gray-700">
                    Connect to a GitHub account and choose a repository to proceed.
                  </div>
                ):
                (
                  <div className="text-center animate-bounce mt-8 text-gray-700">
                    Fetching your repositories...
                  </div>
                )
              }
              </>
            ) : (
              <>
                <ul className="divide-y border border-gray-200 rounded-lg  divide-gray-300">
                  {repos.map((repo) => (
                    <>
                      <li className="flex justify-between gap-x-6 p-5 py-3">
                        <div className="min-w-0 flex-auto">
                          <p className="pl-1 leading-6 inline-block text-gray-400">
                            <span className="font-medium text-gray-800">
                              {repo.name}
                            </span>
                            &nbsp;&#8226;&nbsp;
                          </p>
                          {repo.private ? (
                            <BiLockAlt className="inline-block text-lg text-gray-500 my-auto" />
                          ) : (
                            <MdPublic className="inline-block text-lg text-gray-500 my-auto" />
                          )}
                        </div>
                        <div className="flex sm:flex-row flex-col">
                          <a
                            href={repo.html_url}
                            className="text-sm leading-6 text-blue-500"
                          >
                            <BiGitMerge className="inline-block text-lg text-blue-600 font-bold" />{" "}
                            {repo.full_name}
                          </a>
                          <button
                            onClick={() => {
                              props.updateProjectDetails({
                                ...props.projectDetails,
                                repo: repo.full_name,
                              });
                              props.nextTab();
                            }}
                            className="px-2 text-sm py-1 bg-black ml-2 rounded-md text-white"
                          >
                            Link
                          </button>
                        </div>
                      </li>
                    </>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div className="mt-6 flex items-center justify-between gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
              onClick={() => {
                props.prevTab();
              }}
            >
              Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
