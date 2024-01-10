import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProjectFromFB } from "../../PostProject/services";
import {
  assignProjectOnFb,
  finishMilestoneInFb,
  getParticipantsOfProject,
} from "../services";
import { Navbar } from "../../../../components/Navbar/Navbar";
import { AiFillGithub } from "react-icons/ai";
import { BsChatLeftText } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { MilestoneCard } from "../../../../components/MilestoneCard/MilestoneCard";
import {
  add_first_assignee,
  getAssigneeAddressOnBC,
  getContractBalance,
  getUserAddress,
  mark_milestone_as_complete,
} from "../../../../contracts/services";

export const ManageProject = () => {
  const [project, setProject] = useState({});
  const [update, setUpdate] = useState(0);
  const [list, setList] = useState([]);
  const [assigneeAddress, setAssigneeAddress] = useState("");
  const [availableFunds, setAvailableFunds] = useState(0);

  const { projectId } = useParams();
  const tabs = [
    { title: "My Projects", path: "/my-projects" },
    {
      title: "Manange Project",
      path: `/my-projects/manage-project/${projectId}`,
    },
  ];

  const assignProject = async (id, username, address) => {
    // in participant - mark assigned true
    // in project - mark alloted true
    let res = await getUserAddress();
    if (res.success) {
      // update the smart contract
      // fetch project details
      const tl = toast.loading("Assigning project to cryptolancer");
      const project = await getProjectFromFB(projectId);

      const contractAddress = project?.contractAddress;

      let result = await add_first_assignee(contractAddress, address);
      toast.dismiss(tl);
      if (result.success) {
        await toast.promise(
          assignProjectOnFb(id, projectId, username, address),
          {
            loading: `Saving project`,
            success: `Assigned successfully`,
            error: "Some error occured, contact support",
          }
        );
        setUpdate(update + 1);
      } else {
        toast.error("Internal error occured, contact support");
      }
    } else {
      toast("Please connect wallet", {
        icon: "🙋🏻",
      });
    }
  };

  const finishMilestone = async (milestoneId, projectId) => {
    try {
      const tl = toast.loading("Releasing reward to assignee");

      const contractAddress = project?.contractAddress;

      let result = await mark_milestone_as_complete(contractAddress);

      toast.dismiss(tl);

      if (result.success) {
        toast.success("Reward released");
        // release reward to the assignee

        // mark milestone as finished in the db
        await toast.promise(finishMilestoneInFb(milestoneId, projectId), {
          loading: "Updating milestone status",
          success: "Milestone updated",
          error: "Some error occured",
        });
        // finishMilestoneReleaseCryptoInSC()
        setUpdate(update + 1);
      } else {
        toast.error("Some error occured");
      }
    } catch (er) {}
  };

  const getAssigneeAddress = async () => {
    try {
      const tl = toast.loading("Fetching assignee address");

      const contractAddress = project?.contractAddress;

      let result = await getAssigneeAddressOnBC(contractAddress);
      toast.dismiss(tl);
      if (result.success) {
        toast.success("Address fetched");
        console.log(result.assigneeAddress);
        setAssigneeAddress(result.assigneeAddress);
      } else {
        toast.error("Some error occured");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getAvailableFunds = async () => {
    try {
      const tl = toast.loading("Fetching funds");
      const contractAddress = project?.contractAddress;

      let result = await getContractBalance(contractAddress);
      toast.dismiss(tl);
      if (result.success) {
        toast.success("Address fetched");
        console.log(result.balance);
        setAvailableFunds(result.balance);
      } else {
        toast.error("Some error occured");
      }
    } catch (err) {
      console.log(err);
      toast.error("Some error occured");
    }
  };

  useEffect(() => {
    getProjectFromFB(projectId).then((project) => {
      setProject(project);
      getParticipantsOfProject(projectId).then((list) => setList(list));
    });
  }, []);

  return (
    <>
      <Navbar tabs={tabs} />
      <div className="md:m-10 m-4">
        {project?.assigned ? (
          <>
            {/* Milestone Section  */}
            <div className="flex flex-row justify-between">
              <div>
                <p className="font-medium text-2xl inline-block">Milestones</p>
                <div className="mt-4 text-sm text-gray-600">
                  <p>
                    Contract Address: <span>{project?.contractAddress}</span>
                  </p>
                  <p className="my-1">
                    Assignee Address:{" "}
                    {assigneeAddress ? (
                      assigneeAddress
                    ) : (
                      <button
                        onClick={() => {
                          console.log("clicked");
                          getAssigneeAddress();
                        }}
                        className="rounded-md px-2 py-0.5 text-white bg-gray-600 hover:bg-gray-400"
                      >
                        Check
                      </button>
                    )}
                  </p>
                  <p className="my-1">
                    Available Funds:{" "}
                    {availableFunds ? (
                      availableFunds + " USD"
                    ) : (
                      <button
                        onClick={() => {
                          console.log("clicked");
                          getAvailableFunds();
                        }}
                        className="rounded-md px-2 py-0.5 text-white bg-gray-600 hover:bg-gray-400"
                      >
                        Check
                      </button>
                    )}
                  </p>
                </div>
              </div>
              <div className="inline-block">
                <p className="pb-1 font-medium">
                  CryptoLancer:{" "}
                  <a
                    className="font-medium text-sm text-lime-700 text-center"
                    href={`https://github.com/${project?.assignee}`}
                  >
                    <AiFillGithub className="text-2xl inline-block my-auto mx-1" />
                    {project?.assignee}
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
                              onClick={() => {
                                finishMilestone(
                                  milestone?.milestoneId,
                                  projectId
                                );
                              }}
                              className="bg-blue-500 text-sm font-bold p-2 text-white rounded-lg"
                            >
                              Accept and Release Reward
                            </button>
                            <p className="text-sm italic py-1 text-gray-500">
                              Cryptolancer has marked the milestone as
                              completed.
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              Status:{" "}
                              <span className="text-yellow-600 font-medium">
                                To Be Completed by Cryptolancer.{" "}
                              </span>
                            </p>
                            <p className="text-sm italic">
                              Ask cryptolancer to mark the milestone as
                              completed, if they have finished.
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
          // Assign Cryptolancer section
          <div className="">
            <p className="font-medium text-2xl">List of Cryptolancers</p>
            <hr className="my-6"></hr>
            <div>
              <ul className="bg-gray-100 p-2 rounded-md max-w-2xl h-96 overflow-scroll no-scrollbar">
                {list?.map((e) => (
                  <li
                    key={e.id}
                    className="bg-white m-1 my-2 flex flex-row justify-between items-center p-2 rounded-lg"
                  >
                    <a
                      className="font-medium text-sm text-lime-700 text-center flex items-center"
                      href={`https://github.com/${e?.participant}`}
                    >
                      <AiFillGithub className="text-2xl inline-block my-auto mx-1" />
                      {e?.participant}
                    </a>
                    <div
                      className={`${
                        e?.note
                          ? "mx-4 border p-4 text-center rounded-lg bg-gray-100"
                          : ""
                      }`}
                    >
                      {e?.note ? <>{e.note}</> : <></>}
                    </div>
                    <button
                      onClick={() =>
                        assignProject(e?.id, e?.participant, e?.address)
                      }
                      className="bg-blue-600 text-sm font-bold hover:bg-blue-400 py-2 h-fit px-6 text-white rounded-lg"
                    >
                      Assign
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
