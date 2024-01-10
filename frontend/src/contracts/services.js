import { ethers } from "ethers";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const usdToEthRate = 0.001; // 1 USD to 0.001 ETH

let contractABIJSON = require("./CryptolancerContractAbi.json");
// contractABIJSON = JSON.parse(JSON.stringify(contractABIJSON));\

export async function getUserAddress() {
  try {
    const signer = provider.getSigner();
    const sender = await signer.getAddress();
    return { success: true, address: sender };
  } catch (error) {
    console.log(error);
    return { success: false, error: error };
  }
}

export async function deployContractOnBC(milestones) {
  console.log(contractABIJSON);
  const signer = provider.getSigner();
  console.log(contractABIJSON.abi);

  const factory = new ethers.ContractFactory(
    contractABIJSON.abi,
    contractABIJSON.bytecode,
    signer
  );

  const deployment = factory.deploy(milestones);

  try {
    const deployedContract = await deployment;
    console.log("Contract deployed at address:", deployedContract.address);
    return { success: true, contractAddress: deployedContract.address };
  } catch (error) {
    console.error("Error deploying contract:", error);
    return { success: false, error: error };
  }
}

export async function addFundsToContractOnBC(fundAmount, contractAddress) {
  try {
    const signer = provider.getSigner();

    const ethAmount = fundAmount * usdToEthRate;

    // Approve and transfer the converted ETH to the contract
    const ethValue = ethers.utils.parseEther(ethAmount.toString());

    const contract = new ethers.Contract(
      contractAddress,
      contractABIJSON.abi,
      signer
    );

    // Send the transaction
    const tx = await contract.addBudgetToContract({
      value: ethValue,
    });

    console.log("Transaction successful", tx);
    return { success: true, tx: tx };
  } catch (er) {
    console.log(er);
    return { success: false, error: er };
  }
}

export async function getContractBalance(contractAddress) {
  try {
    const contract = new ethers.Contract(
      contractAddress,
      contractABIJSON.abi,
      provider
    );

    let balance = await contract.getLeftFunds();
    console.log(`Contract balance:`, balance);

    balance = balance._hex;
    balance = ethers.utils.formatEther(balance);
    balance = parseFloat(balance);

    // convert this to dollars
    balance = balance / usdToEthRate;

    return { success: true, balance: balance };
  } catch (er) {
    console.log(er);
    return { success: false, error: er };
  }
}

export async function add_first_assignee(contractAddress, assigneeAddress) {
  try {
    const signer = provider.getSigner();
    const sender = await signer.getAddress();
    const contract = new ethers.Contract(
      contractAddress,
      contractABIJSON.abi,
      signer
    );

    const tx = await contract.add_first_assignee(assigneeAddress);

    console.log(`Transaction successful:`, tx);
    return { success: true, tx: tx };
  } catch (er) {
    console.log(er);
    return { success: false, error: er };
  }
}

export async function getAssigneeAddressOnBC(contractAddress) {
  try {
    const contract = new ethers.Contract(
      contractAddress,
      contractABIJSON.abi,
      provider
    );

    const assigneeAddress = await contract.getCurAssignee();
    console.log(`Assignee address:`, assigneeAddress);

    return { success: true, assigneeAddress: assigneeAddress };
  } catch (er) {
    console.log(er);
    return { success: false, error: er };
  }
}

export async function mark_milestone_as_complete(contractAddress) {
  try {
    const signer = provider.getSigner();
    const sender = await signer.getAddress();
    const contract = new ethers.Contract(
      contractAddress,
      contractABIJSON.abi,
      signer
    );

    const tx = await contract.mark_milestone_as_complete({
      gasLimit: 2000000,
    });

    console.log(`Transaction successful:`, tx);
    return { success: true, tx: tx };
  } catch (er) {
    console.log(er);
    return { success: false, error: er };
  }
}
