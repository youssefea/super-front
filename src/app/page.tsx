'use client';
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function Home() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [mainReceiver, setMainReceiver] = useState("");
  const [sideReceiver, setSideReceiver] = useState("");
  const [sideReceiverPortion, setSideReceiverPortion] = useState(0);
  const [deployedSplitters, setDeployedSplitters] = useState([]);
  const [newPortions, setNewPortions] = useState({});


  const contractAddress = "0xaf34569A0c641f95195DaaFDBe8db89E00B1E310";
  const ABI_Factory = [
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_mainReceiver",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_sideReceiver",
          "type": "address"
        },
        {
          "internalType": "int96",
          "name": "_sideReceiverPortion",
          "type": "int96"
        }
      ],
      "name": "createNewSplitter",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "deployer",
          "type": "address"
        }
      ],
      "name": "getDesployedSplitters",
      "outputs": [
        {
          "internalType": "address[]",
          "name": "",
          "type": "address[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "hostAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "superTokenAddress",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];

  const ABI_Splitter = [
    {
      "inputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "superToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "agreementData",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "ctx",
          "type": "bytes"
        }
      ],
      "name": "afterAgreementCreated",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "newCtx",
          "type": "bytes"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "superToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "agreementData",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "cbdata",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "ctx",
          "type": "bytes"
        }
      ],
      "name": "afterAgreementTerminated",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "newCtx",
          "type": "bytes"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "superToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "agreementData",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "cbdata",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "ctx",
          "type": "bytes"
        }
      ],
      "name": "afterAgreementUpdated",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "newCtx",
          "type": "bytes"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "_mainReceiver",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "_sideReceiver",
          "type": "address"
        },
        {
          "internalType": "int96",
          "name": "_sideReceiverPortion",
          "type": "int96"
        },
        {
          "internalType": "contract ISuperToken",
          "name": "_acceptedSuperToken",
          "type": "address"
        },
        {
          "internalType": "contract ISuperfluid",
          "name": "_host",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "NotAcceptedSuperToken",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "NotImplemented",
      "type": "error"
    },
    {
      "inputs": [],
      "name": "UnauthorizedHost",
      "type": "error"
    },
    {
      "inputs": [
        {
          "internalType": "int96",
          "name": "newSideReceiverPortion",
          "type": "int96"
        }
      ],
      "name": "updateSplit",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "acceptedSuperToken",
      "outputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "beforeAgreementCreated",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "superToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "agreementData",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "beforeAgreementTerminated",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "superToken",
          "type": "address"
        },
        {
          "internalType": "address",
          "name": "agreementClass",
          "type": "address"
        },
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        },
        {
          "internalType": "bytes",
          "name": "agreementData",
          "type": "bytes"
        },
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "name": "beforeAgreementUpdated",
      "outputs": [
        {
          "internalType": "bytes",
          "name": "",
          "type": "bytes"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "CFAV1_TYPE",
      "outputs": [
        {
          "internalType": "bytes32",
          "name": "",
          "type": "bytes32"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "host",
      "outputs": [
        {
          "internalType": "contract ISuperfluid",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "contract ISuperToken",
          "name": "superToken",
          "type": "address"
        }
      ],
      "name": "isAcceptedSuperToken",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "mainReceiver",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sideReceiver",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "sideReceiverPortion",
      "outputs": [
        {
          "internalType": "int96",
          "name": "",
          "type": "int96"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
  

  useEffect(() => {
    handleGetDeployedSplitters();
  }, [walletAddress]);

  async function handleGetDeployedSplitters() {
    if (walletAddress && typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI_Factory, signer);
      try {
        const splitters = await contract.getDesployedSplitters(walletAddress);
        setDeployedSplitters(splitters);
        console.log(`Deployed contracts: ${splitters}`);
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    } else {
      console.log("Please connect your wallet first");
    }
  }

  const handleUpdatePortion = (address, newPortion) => {
    setNewPortions({...newPortions, [address]: newPortion});
  };

  const handleUpdateSplit = async (address) => {
    if (walletAddress && typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(address, ABI_Splitter, signer);
      try {
        const tx = await contract.updateSplit(newPortions[address]*10);
        console.log(`Transaction hash: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`Transaction was mined in block ${receipt.blockNumber}`);
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    } else {
      console.log("Please connect your wallet first");
    }
  };


  async function handleConnectWallet() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      try {
        await window.ethereum.enable(); // user prompts to connect their MetaMask wallet
        const userAddress = await signer.getAddress(); // get user wallet address
        setWalletAddress(userAddress);
        setIsConnected(true);
        console.log(`Connected with address: ${userAddress}`);
      } catch (error) {
        console.error(`Error connecting to wallet: ${error}`);
      }
    } else {
      alert("No Ethereum interface injected into browser. Consider using MetaMask");
    }
  }

  async function handleDeploy() {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(contractAddress, ABI_Factory, signer);
      try {
        const tx = await contract.createNewSplitter(mainReceiver, sideReceiver, sideReceiverPortion*10);
        console.log(`Transaction hash: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`Transaction was mined in block ${receipt.blockNumber}`);
      } catch (err) {
        console.error(`Error: ${err}`);
      }
    } else {
      alert("Please connect your wallet first");
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
    <header className="text-center mt-10 mb-4">
      <img src="https://media.licdn.com/dms/image/C4E0BAQHUC6fMuagr3Q/company-logo_200_200/0/1654722550327?e=1697068800&v=beta&t=xdLqtwxTfjLJ8Yn5IWa_O6LLRNA5T9-qBSEY3v7JztE" alt="Logo" className="w-20 h-20 mx-auto"/>
      <h1 className="text-3xl font-bold">FlowSplitter Factory</h1>
      <p className="px-6">
        This frontend allows you to deploy new FlowSplitter contracts and update the portion of the side receiver.
      </p>
    </header>
    <main className="flex items-center justify-center text-center">
      {!isConnected ?
        <button 
          className="px-6 py-3 text-lg font-semibold text-white bg-blue-600 rounded hover:bg-blue-500"
          onClick={handleConnectWallet}
        >
          Connect Wallet
        </button>
        :
        <div className="flex flex-col items-center justify-center">
          <p>Wallet Connected</p>
          <p>{walletAddress}</p>
          <div className="mt-4">
            <input
              type="text"
              placeholder="Main Receiver"
              onChange={(e) => setMainReceiver(e.target.value)}
              className="mb-4 p-2 w-64 rounded border-2 border-gray-200"
            />
            <input
              type="text"
              placeholder="Side Receiver"
              onChange={(e) => setSideReceiver(e.target.value)}
              className="mb-3 p-2 w-64 rounded border-2 border-gray-200"
            />
            <input
              type="number"
              placeholder="Side Receiver Portion (in %)"
              onChange={(e) => setSideReceiverPortion(e.target.value)}
              className="mb-3 p-2 w-64 rounded border-2 border-gray-200"
            />
            <button 
              onClick={handleDeploy}
              className="px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded hover:bg-blue-500"
            >
              Deploy
            </button>
            {deployedSplitters.length > 0 && 
      <div className="mt-4">
        <h2>Deployed contracts:</h2>
        <ul>
          {deployedSplitters.map((address, index) => (
            <li key={index}>
              <span>{address}</span>
              <input
                type="number"
                placeholder="New Portion"
                onChange={(e) => handleUpdatePortion(address, e.target.value)}
                className="mb-3 ml-3 p-2 w-64 rounded border-2 border-gray-200"
              />
              <button 
                onClick={() => handleUpdateSplit(address)}
                className="ml-3 px-6 py-2 text-lg font-semibold text-white bg-blue-600 rounded hover:bg-blue-500"
              >
                Update Split
              </button>
            </li>
          ))}
        </ul>
      </div>
    }
    
          </div>
        </div>
      }
      </main>
    </div>
  );

}
