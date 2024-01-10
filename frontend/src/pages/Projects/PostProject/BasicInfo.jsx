import React, { useState } from "react";

export const BasicInfo = (props) => {
  const [projectDetails, setProjectDetails] = useState(props.projectDetails);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProjectDetails({ ...projectDetails, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    props.updateProjectDetails(projectDetails);
    props.nextTab();
  };
  return (
    <>
      <div className="p-2">
        <form onSubmit={handleSubmit}>
          <div className="space-y-12">
            <div className="border-b border-gray-900/10 pb-12">
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Project Info
              </h2>

              <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Title
                  </label>
                  <div className="mt-2">
                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                      <input
                        type="text"
                        name="title"
                        id="title"
                        autoComplete="title"
                        className="block flex-1 border-0 bg-transparent p-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                        placeholder="Eg: Web3 Dapp"
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="col-span-full">
                  <label
                    htmlFor="about"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Project Description
                  </label>
                  <div className="mt-2">
                    <textarea
                      placeholder="Project Description"
                      id="description"
                      name="description"
                      rows={3}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Full description of the project.
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium leading-6 text-gray-900">
                    Tech Stack/Skills
                  </label>
                  <div className="mt-2">
                    <input
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      placeholder="Eg: React, Solidity, Web3"
                      name="techStack"
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <p className="mt-3 text-sm leading-6 text-gray-600">
                    Comma separated list of tech stack/skills required for the
                    project.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 flex items-center justify-between gap-x-6">
            <button
              type="button"
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-md bg-lime-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
