// utils/web3.js
import Web3 from "web3";
import TimeCapsuleABI from "../contracts/TimeCapsuleABI.json";

let web3;
let contract;
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

export const initWeb3 = async () => {
  if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      
      // Create Web3 instance
      web3 = new Web3(window.ethereum);
      
      // Create contract instance
      contract = new web3.eth.Contract(TimeCapsuleABI, CONTRACT_ADDRESS);
      
      // Setup event listener for account changes
      window.ethereum.on("accountsChanged", () => {
        window.location.reload();
      });
      
      // Setup event listener for network changes
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
      
      return true;
    } catch (error) {
      console.error("User denied account access or error occurred:", error);
      return false;
    }
  } else {
    console.log("Non-Ethereum browser detected. You should consider installing MetaMask!");
    return false;
  }
};

export const getWeb3 = () => {
  if (!web3) {
    throw new Error("Web3 not initialized. Call initWeb3 first.");
  }
  return web3;
};

export const getContract = () => {
  if (!contract) {
    throw new Error("Contract not initialized. Call initWeb3 first.");
  }
  return contract;
};

export const getAccount = async () => {
  if (!web3) {
    throw new Error("Web3 not initialized. Call initWeb3 first.");
  }
  
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

export const checkNetwork = async () => {
  if (!web3) {
    throw new Error("Web3 not initialized. Call initWeb3 first.");
  }
  
  const networkId = await web3.eth.net.getId();
  // Replace with your expected network ID (1 for Ethereum mainnet, 3 for Ropsten, etc.)
  const expectedNetworkId = parseInt(process.env.NEXT_PUBLIC_EXPECTED_NETWORK_ID || "1");
  
  return networkId === expectedNetworkId;
};

export const convertToUnixTimestamp = (dateTimeString) => {
  return Math.floor(new Date(dateTimeString).getTime() / 1000);
};

export const isAddressValid = (address) => {
  if (!web3) {
    throw new Error("Web3 not initialized. Call initWeb3 first.");
  }
  
  return web3.utils.isAddress(address);
};