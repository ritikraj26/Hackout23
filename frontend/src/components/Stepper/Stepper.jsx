import React from "react";

export const Stepper = ({ tabs, activeTab }) => {
  console.log("====================================");
  console.log(activeTab);
  console.log("====================================");
  return (
    <>
      <ol className="overflow-scroll no-scrollbar flex items-center w-full p-3 space-x-2 text-sm font-medium text-center text-gray-500 bg-white border border-gray-200 dark:text-gray-400 sm:text-base sm:p-4 sm:space-x-4">
        {tabs.map((tab, index) => (
          <li
            className={`flex items-center ${
              index + 1 <= activeTab
                ? "text-lime-600 dark:text-lime-500"
                : "text-gray-500 dark:text-gray-400"
            } space-x-2.5`}
          >
            <span
              className={`flex items-center justify-center w-5 h-5 mr-2 text-xs border ${
                index + 1 <= activeTab
                  ? "border-lime-600 dark:border-lime-500"
                  : "border-gray-500 dark:border-gray-400"
              } rounded-full shrink-0`}
            >
              {index + 1}
            </span>
            {tab.title}
            {index + 1 < tabs.length && (
              <svg
                aria-hidden="true"
                className="w-4 h-4 ml-2 sm:ml-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 5l7 7-7 7M5 5l7 7-7 7"
                ></path>
              </svg>
            )}
          </li>
        ))}
      </ol>
    </>
  );
};
