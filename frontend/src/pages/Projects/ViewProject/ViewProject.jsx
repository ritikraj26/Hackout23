import React, { useEffect, useState } from "react";
import { getProjectFromFB } from "../PostProject/services";
import { Navbar } from "../../../components/Navbar/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import { BiGitMerge } from "react-icons/bi";
import { toast } from "react-hot-toast";
import { addParticipantToFB } from "../services";
import { getUserAddress } from "../../../contracts/services";

const user = JSON.parse(sessionStorage.getItem("cryptoLancerUser"));

export const ViewProject = (props) => {
  const [project, setProject] = useState({});
  const { projectId } = useParams();
  const pid = projectId || props.pid;
  const [note, setNote] = useState("");

  const tabs = [
    { path: "/projects", title: "Projects" },
    { path: "/view-project/" + pid, title: "View Project" },
  ];
  useEffect(() => {
    getProjectFromFB(pid).then((project) => {
      console.log(project);
      setProject(project);
    });
  }, []);
  const total = () => {
    let sum = 0;
    project?.milestones?.map((milestone) => {
      sum += Number(milestone.reward);
    });
    return sum;
  };

  const handleClick = async () => {
    if (
      sessionStorage.getItem("cryptoLancerUser") &&
      sessionStorage.getItem("githubToken")
    ) {
      const res = await getUserAddress();
      if (res.success) {
        let address = res.address;
        await toast.promise(
          addParticipantToFB(user.username, pid, note, address),
          {
            loading: "Adding you to the project...",
            success: (data) => {
              return data;
            },
            error: (err) => {
              return "Something went wrong!";
            },
          }
        );
      } else {
        toast("Please connect wallet", {
          icon: "🙋🏻",
        });
      }
    } else {
      toast("Connect github to continue", {
        icon: "🙋🏻",
      });
    }
  };

  return (
    <>
      <Navbar tabs={tabs} />
      <div className="bg-white pb-24 pt-10 sm:pb-32 md:px-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0">
            <h2 className="text-3xl pb-2 font-bold tracking-tight text-gray-900 sm:text-3xl">
              {project?.title}
            </h2>
            <a
              href={"https://github.com/" + project?.repo}
              className="text-sm font-medium leading-6 text-blue-500"
            >
              <BiGitMerge className="inline-block text-lg text-blue-600 font-bold" />{" "}
              {project?.repo}
            </a>
            <p className="font-medium py-2 text-gray-600">
              Total Reward: <span className="font-normal">{total()} USD</span>
            </p>
            <p className="mt-2 text-lg leading-8 text-gray-600">
              {project?.description}
            </p>
          </div>
          <div className="flex flex-row">
            {project.username === user?.username ? (
              <button className="relative mt-4 inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-200">
                <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                  View Cryptolancers
                </span>
              </button>
            ) : (
              <div className="flex items-center justify-center w-full">
                <form className="mx-4 grow flex items-center">
                  <label for="note">Add Note: </label>
                  <input
                    className="grow border-2 mx-2 rounded-md p-2 "
                    id="note"
                    name="note"
                    placeholder="show off ur skills here ;)"
                    type="textarea"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                  ></input>
                </form>
                <button
                  onClick={handleClick}
                  className="relative mt-2 inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-teal-300 to-lime-300 group-hover:from-teal-300 group-hover:to-lime-300 focus:ring-4 focus:outline-none focus:ring-lime-200"
                >
                  <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                    Interested
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>

        <hr className="mt-4"></hr>
        <div className="pt-10">
          <div className="w-3/4 mx-auto border-l-2 border-gray-100">
            {project?.milestones?.map((milestone, idx) => (
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
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
