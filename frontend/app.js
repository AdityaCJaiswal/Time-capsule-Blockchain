// Contract Address and ABI (replace these with your actual contract's details)
const contractAddress = "0x55650214712B432f77739b3b2C2CaE81C47a5f91";  // Replace with your deployed contract address
const contractABI = [
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "unlockTime",
				"type": "uint256"
			}
		],
		"name": "CapsuleCreated",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "message",
				"type": "string"
			}
		],
		"name": "CapsuleOpened",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "unlockTime",
				"type": "uint256"
			}
		],
		"name": "createCapsule",
		"outputs": [],
		"stateMutability": "nonpayable",
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
		"inputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			}
		],
		"name": "openCapsuleByAnyone",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "capsules",
		"outputs": [
			{
				"internalType": "string",
				"name": "message",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "unlockTime",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "isOpened",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getCapsuleStatus",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let web3;
let contract;
let userAddress;

const connectButton = document.getElementById("connectButton");
const createTextCapsuleButton = document.getElementById("createTextCapsuleButton");
const createFileCapsuleButton = document.getElementById("createFileCapsuleButton");
const createCapsuleButton = document.getElementById("createCapsuleButton");
const uploadFileButton = document.getElementById("uploadFileButton");
const unlockButton = document.getElementById("unlockButton");
const capsuleMessageElement = document.getElementById("capsuleMessage");
const unlockTimeElement = document.getElementById("unlockTime");
const capsuleStatusElement = document.getElementById("capsuleStatus");
const downloadFileLink = document.getElementById("downloadFileLink");
const capsuleSection = document.getElementById("capsuleSection");
const createCapsuleSection = document.getElementById("createCapsuleSection");
const textCapsuleSection = document.getElementById("textCapsuleSection");
const fileCapsuleSection = document.getElementById("fileCapsuleSection");
const errorMessage = document.getElementById("errorMessage");

async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAddress = (await web3.eth.getAccounts())[0];
            connectButton.style.display = "none";
            createCapsuleSection.style.display = "block";
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

        // Get the capsule status (message, unlockTime, isOpened)
        const status = await contract.methods.getCapsuleStatus().call();
        console.log("Capsule Status:", status);

        // Display message and unlock time
        const message = status[0];
        const unlockTime = status[1];
        const isOpened = status[2];

        capsuleMessageElement.innerHTML = message;
        unlockTimeElement.innerText = `Unlock Time: ${new Date(unlockTime * 1000).toLocaleString()}`;
        capsuleStatusElement.innerText = `Capsule Status: ${isOpened ? "Opened" : "Locked"}`;

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

// Handle text capsule creation
async function createTextCapsule() {
    const message = document.getElementById("capsuleMessageInput").value;
    const unlockTime = new Date(document.getElementById("unlockTimeInput").value).getTime() / 1000;

    if (!message || !unlockTime) {
        alert("Please provide a valid message and unlock time.");
        return;
    }

    try {
        await contract.methods.createCapsule(message, unlockTime).send({ from: userAddress });
        alert("Capsule Created!");
        loadContract();  // Refresh contract data
        textCapsuleSection.style.display = "none";
        capsuleSection.style.display = "block";
    } catch (error) {
        console.error("Error creating capsule:", error);
        alert("Error creating capsule.");
    }
}

// Handle file upload
async function uploadFile() {
    const file = document.getElementById("fileInput").files[0];
    const unlockTime = new Date(document.getElementById("fileUnlockTimeInput").value).getTime() / 1000;

    if (!file || !unlockTime) {
        alert("Please provide a valid file and unlock time.");
        return;
    }

    try {
        // Upload file to IPFS (use a service like Pinata or Infura)
        const ipfsHash = await uploadToIPFS(file);
        
        await contract.methods.createCapsule(ipfsHash, unlockTime).send({ from: userAddress });
        alert("Capsule Created!");
        loadContract();  // Refresh contract data
        fileCapsuleSection.style.display = "none";
        capsuleSection.style.display = "block";
    } catch (error) {
        console.error("Error uploading file:", error);
        alert("Error uploading file.");
    }
}

// Upload file to IPFS (Pinata or Infura)
async function uploadToIPFS(file) {
    const formData = new FormData();
    formData.append("file", file);
    
    // Use your IPFS service (e.g., Pinata, Infura) to upload the file
    const response = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
            pinata_api_key: "YOUR_PINATA_API_KEY",
            pinata_secret_api_key: "YOUR_PINATA_SECRET_API_KEY"
        },
        body: formData
    });
    const data = await response.json();
    return data.IpfsHash;  // Return the IPFS hash
}

async function unlockCapsule() {
    try {
        await contract.methods.openCapsule().send({ from: userAddress });
        alert("Capsule Unlocked!");
        loadContract();  // Refresh the contract data after unlocking
    } catch (error) {
        console.error("Error unlocking capsule:", error);
        alert("Error unlocking the capsule.");
    }
}

connectButton.addEventListener("click", initWeb3);
createTextCapsuleButton.addEventListener("click", () => { textCapsuleSection.style.display = "block"; });
createFileCapsuleButton.addEventListener("click", () => { fileCapsuleSection.style.display = "block"; });
createCapsuleButton.addEventListener("click", createTextCapsule);
uploadFileButton.addEventListener("click", uploadFile);
unlockButton.addEventListener("click", unlockCapsule);
