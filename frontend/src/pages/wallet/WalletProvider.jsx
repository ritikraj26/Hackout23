import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { BiWallet } from "react-icons/bi";

let injectedProvider = false

if (typeof window.ethereum !== 'undefined') {
  injectedProvider = true
  console.log(window.ethereum)
}

const isMetaMask = injectedProvider ? window.ethereum.isMetaMask : false

function WalletProvider() {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (!isMetaMask) {
      toast("Please install metamask to continue", {
        icon: "🙋🏻",
      });
    }else{
      // if wallet is already connected previously
      if (window.ethereum.selectedAddress) {
        updateWallet(window.ethereum.selectedAddress)
      }
    }
  }, []);

  const updateWallet = async (accounts) => { 
    console.log(accounts)    
    setAccount(accounts)                          
  }                                                  

  const handleConnect = async () => {   
    try {
      let accounts = await window.ethereum.request({   
        method: "eth_requestAccounts",                 
      })                                               
      updateWallet(accounts[0])  
    } catch (err) {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
      }
    }                                    
  }  
  return (
    <div className="m-2">
      <div>
        {account ? (
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full">
            {/* Show the dotted address with a circular wallet icon */}
            <div className="flex flex-row items-center">
              <BiWallet className="mr-1 text-2xl" />
              {account.substr(0, 6) + "..." + account.substr(-4)}
            </div>
          </button>
        ) : (
          <button
            onClick={() => handleConnect()}
            className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-full"
          >
            Connect Wallet
          </button>
        )}
      </div>
    </div>
  );
}

export default WalletProvider;