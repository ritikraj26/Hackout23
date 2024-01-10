import React from "react";

export const MilestoneCard = ({ milestone, idx, col }) => {
  return (
    <>
      <div className="rounded-lg md:w-2/3">
        <div
          className={`${
            col && col === true && "bg-lime-300"
          } mb-6 justify-between rounded-l p-6 shadow-md sm:flex sm:justify-start`}
        >
          <div className="sm:ml-4 sm:flex sm:w-full sm:justify-between">
            <div className="mt-5 sm:mt-0">
              <h2 className="text-lg font-bold text-gray-900">
                <span className="text-lime-600">Milestone {idx + 1}: </span>{" "}
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
    </>
  );
};
