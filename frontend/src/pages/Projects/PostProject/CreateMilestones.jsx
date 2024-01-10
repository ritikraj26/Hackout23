import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { createProjectInFB } from "./services";

export const CreateMilestones = (props) => {
  const [milestones, setMilestones] = useState([]);
  const [milestone, setMilestone] = useState({});
  const access_token = sessionStorage.getItem("githubToken");

  const repo = props.projectDetails.repo;
  const addMilestone = (e) => {
    console.log(milestone);
    e.preventDefault();
    setMilestones([...milestones, { ...milestone }]);
    setMilestone({ title: "", description: "", reward: "" });
  };

  const handleMilestoneChange = (e) => {
    setMilestone({ ...milestone, [e.target.name]: e.target.value });
  };

  const deleteMilestone = (index) => {
    setMilestones(milestones.filter((milestone, i) => i !== index));
  };

  const total = () => {
    console.log(milestones);
    let sum = 0;
    milestones.forEach((milestone) => {
      sum += Number(milestone.reward);
    });
    return sum;
  };

  const postAllMilestonesToGithubAndCreateProject = async (e) => {
    console.log(milestones);
    // Posting all milestones to the repo
    let i = 1;
    for (const milestone of milestones) {
      await toast.promise(
        axios.post(
          `https://api.github.com/repos/${repo}/milestones`,
          {
            title: milestone.title,
            description: milestone.description,
          },
          {
            headers: {
              Accept: "application/vnd.github+json",
              Authorization: `Bearer ${access_token}`,
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        ),
        {
          loading: "Creating Milestone: " + milestone.title,
          success: (response) => {
            milestones[i - 1].milestoneId = response.data.id;
            return `Milestone ${i} created successfully`;
          },
          error: (err) => {
            return `Error creating milestone ${i}`;
          },
        }
      );
      i++;
    }
    // Creating the project
    await toast.promise(
      createProjectInFB({ ...props.projectDetails, milestones: milestones }),
      {
        loading: "Creating Project",
        success: (response) => {
          props.updateProjectDetails({
            ...props.projectDetails,
            milestones: milestones,
            projectId: response,
          });
          return `Project created successfully`;
        },
        error: (err) => {
          return `Error creating project`;
        },
      }
    );
    props.nextTab();
  };

  return (
    <>
      <div className="h-screen pt-10 px-4 overflow-scroll">
        <h1 className="mb-5 text-2xl font-bold">
          Split project into milestones
        </h1>
        <p>Add milestones and their rewards to complete the project</p>
        <p className="text-right mr-6 font-medium text-xl">
          Total Reward:{" "}
          <span className="text-lime-600 font-medium">{total()}.00 $</span>
        </p>
        <hr className="mb-6"></hr>
        <div className="flex flex-col md:flex-row ">
          <div className="">
            <>
              <div className="w-full max-w-xs">
                {/* Milestone form  */}
                <form
                  onSubmit={addMilestone}
                  className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
                >
                  <p className="text-xl pb-4 font-bold">Add a new milestone</p>
                  <div className="mb-4">
                    <label
                      className="mb-2 block text-sm font-bold text-gray-700"
                      for="username"
                    >
                      {" "}
                      Title of the Milestone{" "}
                    </label>
                    <input
                      className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                      id="title"
                      type="text"
                      name="title"
                      value={milestone.title}
                      placeholder="Eg: Services layer complete"
                      onChange={handleMilestoneChange}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="mb-2 block text-sm font-bold text-gray-700"
                      for="description"
                    >
                      {" "}
                      Description{" "}
                    </label>
                    <textarea
                      placeholder="Milestone Description"
                      id="description"
                      name="description"
                      value={milestone.description}
                      rows={3}
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      defaultValue={""}
                      onChange={handleMilestoneChange}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      className="mb-2 block text-sm font-bold text-gray-700"
                      for="password"
                    >
                      {" "}
                      Expected Reward(in USD){" "}
                    </label>
                    <input
                      type="number"
                      min={0}
                      className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                      id="reward"
                      name="reward"
                      value={milestone.reward}
                      onChange={handleMilestoneChange}
                      placeholder="Eg: 100"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                      type="submit"
                    >
                      Create
                    </button>
                  </div>
                </form>
              </div>
            </>
          </div>
          <div className="w-3/4 pl-2 border-l-2 border-gray-100">
            {milestones.map((milestone, idx) => (
              <div className="rounded-lg md:w-2/3">
                <div className="mb-6 justify-between rounded-lg bg-white p-6 shadow-md sm:flex sm:justify-start">
                  <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
                    <div className="mt-5 sm:mt-0">
                      <h2 className="text-lg font-bold text-gray-900">
                        <span className="text-lime-600">
                          Milestone {idx + 1}:{" "}
                        </span>{" "}
                        {milestone.title}
                      </h2>
                      <p className="mt-1 text-xs text-gray-700">
                        {milestone.description}
                      </p>
                    </div>
                    <div className="mt-4 flex justify-between sm:mt-0 sm:block sm:space-x-6 sm:space-y-6">
                      <div className="flex items-center space-x-4">
                        <p className="text-sm">{milestone.reward} $</p>
                        <svg
                          onClick={() => {
                            deleteMilestone(idx);
                          }}
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="h-5 w-5 cursor-pointer duration-150 hover:text-red-500"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {milestones.length > 0 && (
              <>
                <button
                  onClick={() => postAllMilestonesToGithubAndCreateProject()}
                  className="rounded-md mr-auto bg-lime-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-lime-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Finish Project
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
