import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectFromFB } from "../../PostProject/services";
import {
  assignProjectOnFb,
  claimMilestoneInFb,
  finishMilestoneInFb,
  getParticipantsOfProject,
} from "../services";
import { Navbar } from "../../../../components/Navbar/Navbar";
import { AiFillGithub } from "react-icons/ai";
import { BsChatLeftText } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { MilestoneCard } from "../../../../components/MilestoneCard/MilestoneCard";

export const ManageApplication = () => {
  const [project, setProject] = useState({});
  const [update, setUpdate] = useState(0);
  const [list, setList] = useState([]);

  const { projectId } = useParams();
  const tabs = [
    { title: "My Applications", path: "/my-applications" },
    {
      title: "Manange Project",
      path: `/my-applications/manage-application/${projectId}`,
    },
  ];
  const markMilestoneAsComplete = async (milestoneId, projectId) => {
    // mark milestone as finished in the db
    await toast.promise(claimMilestoneInFb(milestoneId, projectId), {
      loading: "Updating milestone status",
      success: "Milestone updated",
      error: "Some error occured",
    });
    // finishMilestoneReleaseCryptoInSC()
    setUpdate(update + 1);
  };

  useEffect(() => {
    getProjectFromFB(projectId).then((project) => {
      console.log(project, update);
      setProject(project);
    });
  }, [update, projectId]);

  return (
    <>
      <Navbar tabs={tabs} />
      <div className="md:m-10 m-4">
        {project?.assigned ? (
          <>
            {/* Milestone Section  */}
            <div className="flex flex-row justify-between">
              <p className="font-medium text-2xl inline-block">Milestones</p>
              <div className="inline-block">
                <p className="pb-1 font-medium">
                  Job Poster:{" "}
                  <a
                    className="font-medium text-sm text-lime-700 text-center"
                    href={`https://github.com/${project?.username}`}
                  >
                    <AiFillGithub className="text-2xl inline-block my-auto mx-1" />
                    {project?.username}
                  </a>
                </p>
                <p className="inline-block ml-24 cursor-pointer text-sm text-white rounded-md italic  p-1 px-2 bg-blue-400">
                  Open chat <BsChatLeftText className="inline-block ml-2" />
                </p>
              </div>
            </div>
            <hr className="my-6"></hr>
            <div>
              <ul>
                {project?.milestones.map((milestone, idx) => (
                  <li
                    id={milestone?.milestoneId}
                    className={`m-3 border border-${
                      milestone?.finished ? "lime" : "yellow"
                    }-400 border-l-8 p-4`}
                  >
                    <MilestoneCard
                      milestone={milestone}
                      idx={idx}
                      col={milestone?.finished}
                    />
                    {milestone?.finished ? (
                      <p>
                        Status:{" "}
                        <span className="text-lime-600 font-medium">
                          Completed.{" "}
                        </span>
                      </p>
                    ) : (
                      <>
                        {milestone?.claimed ? (
                          <>
                            <button
                              disabled
                              className="bg-gray-500 my-1 text-sm font-bold p-2 text-white rounded-lg"
                            >
                              Marked as complete
                            </button>
                            <p className="text-sm italic py-1 text-gray-500">
                              You have marked milestone as completed, wait for
                              project owner to verify and update the milestone.
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              Status:{" "}
                              <span className="text-orange-600 font-medium">
                                To Be Completed.{" "}
                              </span>
                            </p>
                            <button
                              onClick={() => {
                                markMilestoneAsComplete(
                                  milestone?.milestoneId,
                                  projectId
                                );
                              }}
                              className="bg-yellow-500 my-1 text-sm font-bold p-2 text-white rounded-lg"
                            >
                              Mark as Completed
                            </button>
                            <p className="text-sm italic">
                              If you have completed the milestone, mark it as
                              finished, in order to receive rewards.
                            </p>
                          </>
                        )}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <></>
        )}
      </div>
    </>
  );
};
