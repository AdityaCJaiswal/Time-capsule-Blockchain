// Contract Address and ABI (replace these with your actual contract's details)
const contractAddress = "0xB45fCC8fab3f9Fbe9b9cC05e414E33653D8378F8";  // Replace with your deployed contract address
const contractABI = [
    {
        "inputs": [],
        "name": "getCapsuleStatus",
        "outputs": [
            { "internalType": "bytes32", "name": "", "type": "bytes32" },
            { "internalType": "uint256", "name": "", "type": "uint256" },
            { "internalType": "bool", "name": "", "type": "bool" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "openCapsule",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "openCapsuleByAnyone",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let web3;
let contract;
let userAddress;

const connectButton = document.getElementById("connectButton");
const unlockButton = document.getElementById("unlockButton");
const capsuleMessageElement = document.getElementById("capsuleMessage");
const unlockTimeElement = document.getElementById("unlockTime");
const capsuleStatusElement = document.getElementById("capsuleStatus");
const capsuleSection = document.getElementById("capsuleSection");
const errorMessage = document.getElementById("errorMessage");

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = (await web3.eth.getAccounts())[0];
            connectButton.style.display = "none";
            capsuleSection.style.display = "block";
            loadContract();
        } catch (error) {
            console.error("Error connecting to MetaMask:", error);
            errorMessage.style.display = "block";
        }
    } else {
        alert("Please install MetaMask to use this app.");
    }
}

async function loadContract() {
    if (!web3) {
        console.error("Web3 is not initialized.");
        return;
    }
    try {
        contract = new web3.eth.Contract(contractABI, contractAddress);
        console.log("Contract Loaded:", contract.methods);

        // Get the capsule status (messageHash, unlockTime, isOpened)
        const status = await contract.methods.getCapsuleStatus().call();
        console.log("Capsule Status:", status);

        // Display message and unlock time
        const messageHash = status[0];
        const unlockTime = status[1];
        const isOpened = status[2];

        // Hash needs to be decoded, assuming it's a bytes32 hash
        const decodedMessage = web3.utils.hexToUtf8(messageHash);
        capsuleMessageElement.innerHTML = decodedMessage;
        unlockTimeElement.innerText = `Unlock Time: ${new Date(unlockTime * 1000).toLocaleString()}`;
        capsuleStatusElement.innerText = `Capsule is ${isOpened ? "opened" : "locked"}`;

        if (isOpened) {
            unlockButton.style.display = "none";
        } else {
            unlockButton.style.display = "block";
        }
    } catch (error) {
        console.error("Error loading contract:", error);
        alert("Error loading contract.");
    }
}

async function unlockCapsule() {
    try {
        console.log("Attempting to unlock capsule...");
        await contract.methods.openCapsule().send({ from: userAddress });
        alert("Capsule Unlocked!");
        loadContract();  // Refresh the contract data after unlocking
    } catch (error) {
        console.error("Error unlocking capsule:", error);
        alert("Error unlocking the capsule.");
    }
}

connectButton.addEventListener("click", initWeb3);
unlockButton.addEventListener("click", unlockCapsule);
