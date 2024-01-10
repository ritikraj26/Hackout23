import React, { useState } from "react";
import { updateProjectInFB } from "./services";
import { BiBriefcase, BiCheck, BiDollar } from "react-icons/bi";
import {
  addFundsToContractOnBC,
  deployContractOnBC,
  getContractBalance,
} from "../../../contracts/services";
import { toast } from "react-hot-toast";
import { ethers } from "ethers";

export const DeployContractAndAddFunds = (props) => {
  console.log(props.projectDetails);
  const projectId = props.projectDetails.projectId;

  const milestones = props.projectDetails.milestones;

  const totalAmount =
    milestones?.reduce((acc, obj) => acc + Number(obj.reward), 0) || 400;

  const [step, setStep] = useState(0);
  const [contractAddress, setContractAddress] = useState(
    "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
  );
  const [contractBalance, setContractBalance] = useState(null);

  const deployContract = async () => {
    try {
      const tl = toast.loading("Deploying contract on blockchain...");
      let milestonesArray = [];
      if (milestones) {
        // convert the each number which is usd to wei
        for (const ms of milestones) {
          let usd = Number(ms.reward);
          const ethAmount = usd * 0.001;

          // Approve and transfer the converted ETH to the contract
          const ethValue = ethers.utils.parseEther(ethAmount.toString());

          milestonesArray.push(ethValue);
        }
      } else {
        // for testing
        milestonesArray = [100, 200, 300];
      }
      let res = await deployContractOnBC(milestonesArray);

      if (res.success) {
        setStep(1);
        setContractAddress(res.contractAddress);
        toast.dismiss(tl);
        toast.success("Contract Deployed Successfully");
      } else {
        toast.dismiss(tl);
        toast.error("Error in deploying contract: " + res.error);
      }
    } catch (er) {
      console.log(er);
    }
  };

  const addFundsToContract = async (amount) => {
    try {
      const tl = toast.loading("Adding funds to contract...");
      let res = await addFundsToContractOnBC(amount, contractAddress);

      if (res.success) {
        let data = {
          contractAddress: contractAddress,
          deployed: true,
        };
        await updateProjectInFB(projectId, data);
        toast.dismiss(tl);
        setStep(2);
        toast.success("Funds added to contract successfully");
      } else {
        toast.dismiss(tl);
        toast.error("Error in adding funds to contract: " + res.error);
      }
    } catch (er) {
      console.log(er);
    }
  };

  const viewAvailableFunds = async () => {
    try {
      const tl = toast.loading("Fetching available funds...");
      console.log("==========", contractAddress);
      let res = await getContractBalance(contractAddress);
      if (res.success) {
        toast.dismiss(tl);
        toast.success("Available funds fetched successfully");
        setContractBalance(res.balance);
      } else {
        toast.dismiss(tl);
        toast.error("Error in fetching available funds: " + res.error);
      }
    } catch (er) {
      console.log(er);
    }
  };

  return (
    <>
      <div className="flex mt-20 justify-center">
        <ol class="relative text-gray-500 border-l border-gray-200 dark:border-gray-700 dark:text-gray-400">
          <li class="mb-10 ml-6">
            {step <= 0 ? (
              <>
                <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                  <BiBriefcase className="text-xl" />
                </span>
              </>
            ) : (
              <>
                <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                  <BiCheck className="text-xl" />
                </span>
              </>
            )}
            <h3 class="font-medium leading-tight">Deploy Contract</h3>
            {step > 0 && (
              <div className="flex flex-col mt-2">
                <p class="text-xs text-gray-400">
                  Contract Address:{" "}
                  <span className="font-medium">
                    {contractAddress || "adfdcavsv"}
                  </span>
                </p>
                <p class="text-xs text-gray-400">
                  Contract Balance: <span className="font-medium">{0} USD</span>
                </p>
              </div>
            )}
            {step === 0 && (
              <>
                <p class="text-sm">Deploy the contract on the blockchain</p>

                <button
                  onClick={() => deployContract()}
                  className="bg-gray-700 mt-3 text-sm font-bold p-2 text-white rounded-lg"
                >
                  Deploy
                </button>
              </>
            )}
          </li>
          <li class="mb-10 ml-6">
            {step <= 1 ? (
              <>
                <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                  <BiDollar className="text-xl" />
                </span>
              </>
            ) : (
              <>
                <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                  <BiCheck className="text-xl" />
                </span>
              </>
            )}
            <h3 class="font-medium leading-tight">Add Funds</h3>
            {step > 1 && (
              <div className="flex flex-col mt-2">
                <p class="text-xs text-gray-400">Funds Added!</p>
              </div>
            )}
            {step === 1 && (
              <>
                <p class="text-sm">Add Funds for the project</p>

                <p class="text-sm font-bold my-4">
                  Your Budget = {totalAmount || 400} USD
                </p>

                <button
                  onClick={() => {
                    addFundsToContract(totalAmount || 400);
                  }}
                  className="bg-gray-700 my-1 text-sm font-bold p-2 text-white rounded-lg"
                >
                  Fund {totalAmount || 400} USD to Contract
                </button>
              </>
            )}
          </li>
          <li class="mb-10 ml-6">
            {step <= 1 ? (
              <>
                <span class="absolute flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                  <BiCheck className="text-xl" />
                </span>
              </>
            ) : (
              <>
                <span class="absolute flex items-center justify-center w-8 h-8 bg-green-200 rounded-full -left-4 ring-4 ring-white dark:ring-gray-900 dark:bg-green-900">
                  <BiCheck className="text-xl" />
                </span>
              </>
            )}
            <h3 class="font-medium leading-tight">Done</h3>

            {contractBalance && (
              <p className="text-xl font-bold text-gray-600">
                {contractBalance} USD
              </p>
            )}
            <button
              onClick={() => viewAvailableFunds()}
              className="bg-gray-700 my-1 text-sm font-bold p-2 text-white rounded-lg"
            >
              View Available Funds
            </button>
          </li>
        </ol>
      </div>
    </>
  );
};
