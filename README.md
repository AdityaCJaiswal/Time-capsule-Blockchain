# Time Capsule Blockchain Project

## 🚀 Project Vision
The **Time Capsule** blockchain project allows users to create digital time capsules that securely store messages, files, or other data. These capsules are time-locked, meaning they can only be accessed after a specific date and time that the user sets. This project utilizes blockchain technology (Ethereum), **IPFS** for file storage, and **smart contracts** to ensure data integrity and security. The project aims to provide a decentralized, secure, and transparent way to store and share messages or files that are intended to be opened in the future.

## 🎯 Concept
In today’s digital world, preserving memories or important data to be accessed in the future has become an intriguing idea. The **Time Capsule** allows users to encrypt and store data in a blockchain-based application. Each capsule is time-locked, and it can only be opened by the user or someone they designate once the unlock time has passed. This ensures that the contents remain private and inaccessible until the specified time.

The **Time Capsule** concept also includes:
- **Decentralized Storage** using **IPFS**.
- **Smart Contracts** on **Ethereum** to control access and ensure immutability.
- Ability to create, store, and retrieve capsules securely.

## 📦 Technologies Used
- **Blockchain**: Ethereum Smart Contracts
- **Smart Contracts**: Written in Solidity
- **Frontend**: React.js (with Tailwind CSS for UI styling)
- **IPFS (InterPlanetary File System)**: To store and retrieve files in a decentralized manner
- **Web3.js**: For Ethereum interaction with frontend
- **Pinata**: IPFS file pinning and hosting service
- **Next.js**: For server-side rendering and building the web application
- **MetaMask**: To interact with Ethereum blockchain

## ⚙️ Project Features
1. **Create Time Capsule**: Users can create time capsules by entering a message or uploading a file. They can also set an unlock time in the future.
2. **Time-Locked**: The content inside the capsule is locked until the specified unlock time.
3. **Open Capsule**: After the unlock time has passed, users can open the capsule and access the contents.
4. **Decentralized File Storage**: Files are securely stored on IPFS and can be retrieved using their unique hash.
5. **Blockchain Integration**: Ethereum smart contracts ensure the integrity, ownership, and unlock time of each capsule.

## 📚 Setup Instructions

### 1. **How to Run Locally with `npm run dev` (Recommended)**

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/time-capsule-blockchain.git
    cd time-capsule-blockchain
    ```

2. **Install Dependencies**:
    Make sure you have **Node.js** and **npm** installed. Run the following command to install the required dependencies:
    ```bash
    npm install
    ```

3. **Set up Environment Variables**:
    Create a `.env.local` file in the root directory and add the following environment variables:
    ```bash
    NEXT_PUBLIC_CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS
    NEXT_PUBLIC_PINATA_API_KEY=YOUR_PINATA_API_KEY
    NEXT_PUBLIC_PINATA_SECRET_API_KEY=YOUR_PINATA_SECRET_API_KEY
    NEXT_PUBLIC_EXPECTED_NETWORK_ID=3  # For Ropsten, you can change to another network if needed
    ```

4. **Start the Development Server**:
    Run the following command to start the project locally:
    ```bash
    npm run dev
    ```

5. **Open the App**:
    Once the server starts, open your browser and go to `http://localhost:3000` to view the application.

---

### 2. **How to Run Directly on Remix (For Quick Testing)**

1. **Deploy the Contract on Remix**:
    - Open **[Remix IDE](https://remix.ethereum.org/)**.
    - Create a new Solidity file (e.g., `TimeCapsule.sol`).
    - Copy the code of the contract from your `TimeCapsule.sol` file and paste it into the Remix editor.
    - Compile the contract by selecting the appropriate compiler version (e.g., `0.8.x`).
    - Deploy the contract to your desired Ethereum network (e.g., **Ropsten**, **Goerli**, or **Localhost**).

2. **Integrate Contract in Frontend**:
    - Once the contract is deployed on Remix, you will receive the contract address.
    - Replace `YOUR_CONTRACT_ADDRESS` in the `.env.local` file with the deployed contract address.

3. **Interact with the Smart Contract**:
    - Once the contract is deployed and connected, use MetaMask to interact with it via the frontend application running on Remix.

---

## 🔑 Running Tests

To ensure everything is working smoothly, you can run tests for your smart contract using **Truffle** or **Hardhat** framework for Ethereum development. For frontend testing, you can use **Jest** or **React Testing Library**.

### Run Tests with Truffle (if using Truffle):
```bash
truffle test
```

### Run Tests with Hardhat (if using Hardhat):
```bash
npx hardhat test
```

## 🔐 Deployment on Vercel

1. **Deploy Frontend on Vercel:

- Push the code to GitHub or any Git provider.

- Link your GitHub repository to Vercel.

- Set up environment variables in the Vercel dashboard to include the required keys:

--`NEXT_PUBLIC_CONTRACT_ADDRESS`

-`NEXT_PUBLIC_PINATA_API_KEY`

-`NEXT_PUBLIC_PINATA_SECRET_API_KEY`

-`NEXT_PUBLIC_EXPECTED_NETWORK_ID`

Deploy the Smart Contract on Mainnet or Testnet:

Ensure your smart contract is deployed on an Ethereum testnet like Ropsten or Goerli, or on the Ethereum mainnet.

Once deployed, make sure the contract's address is updated in your .env.local file and in the Vercel environment variables.

Access the Live App: Once deployed, you can access the live application at:
Time Capsule Blockchain App

🛠️ Troubleshooting
MetaMask Wallet Issues:

Ensure that your MetaMask is connected to the same network where your smart contract is deployed.

If MetaMask is not showing your connected wallet, try logging out and logging back in.

IPFS Uploading:

If files are not uploading correctly to Pinata, ensure your API keys are correctly set in the .env.local file.

Check the IPFS status page on Pinata to see if there are any outages or issues.

Smart Contract Errors:

If the smart contract is not executing correctly (e.g., "Transaction Reverted"), ensure that the contract’s state is correct (e.g., proper unlock time, valid data passed).

Add console.log statements in the frontend to check the values being passed to the contract.

🧑‍💻 Contributing
Contributions are welcome! If you’d like to contribute to this project, follow these steps:

Fork the repository

Create a new branch for your changes

Make your changes and commit them

Push your changes and create a pull request

📝 License
This project is licensed under the MIT License - see the LICENSE.md file for details.

🚀 Conclusion
The Time Capsule blockchain project provides an innovative solution to securely store data and messages for future access. Using Ethereum, IPFS, and smart contracts, it ensures decentralization, immutability, and security for sensitive data. With the user-friendly interface, users can create and interact with their capsules, creating memories or important files that can be unlocked at a specific future time.

