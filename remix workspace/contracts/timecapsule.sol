// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeCapsule {
    // Struct to store the time capsule information
    struct Capsule {
        bytes32 messageHash;  // Storing the hash of the message (encrypted off-chain)
        uint256 unlockTime;
        bool isOpened;
    }

    // Mapping to associate each address with their time capsule
    mapping(address => Capsule) public capsules;

    // Event to notify when a time capsule is opened
    event CapsuleOpened(address indexed user, string message);
    
    // Event to notify when a time capsule is created
    event CapsuleCreated(address indexed user, uint256 unlockTime);

    // Reentrancy guard (mutex)
    bool private locked = false;

    modifier noReentrancy() {
        require(!locked, "No reentrancy allowed.");
        locked = true;
        _;
        locked = false;
    }

    // Modifier to check if the time capsule exists
    modifier capsuleExists() {
        require(capsules[msg.sender].messageHash != bytes32(0), "No time capsule found.");
        _;
    }

    // Modifier to check if the time capsule can be opened
    modifier canOpen() {
        require(block.timestamp >= capsules[msg.sender].unlockTime, "Capsule is still locked.");
        require(!capsules[msg.sender].isOpened, "Capsule already opened.");
        _;
    }

    // Create a time capsule with user-specified unlock time
    function createCapsule(bytes32 messageHash, uint256 unlockTime) public {
        // Ensure the unlock time is in the future
        require(unlockTime > block.timestamp, "Unlock time must be in the future");
        
        // Ensure the unlock time is not too far in the future (e.g., max 10 years)
        require(unlockTime <= block.timestamp + 10 * 365 days, "Unlock time too far in the future");

        // Create the capsule
        capsules[msg.sender] = Capsule({
            messageHash: messageHash,
            unlockTime: unlockTime,
            isOpened: false
        });

        // Emit event for capsule creation
        emit CapsuleCreated(msg.sender, unlockTime);
    }

    // Open the time capsule (for the owner)
    function openCapsule() public capsuleExists canOpen noReentrancy {
        Capsule storage capsule = capsules[msg.sender];
        
        capsule.isOpened = true;

        // Decrypt the message off-chain and log it (log the decrypted message as a simple example)
        string memory message = "Decrypted message (not stored on-chain)"; // Decrypt off-chain

        // Emit event for opening the capsule
        emit CapsuleOpened(msg.sender, message);
    }

    // Open the time capsule for anyone (if needed)
    function openCapsuleByAnyone(address user) public noReentrancy {
        require(capsules[user].messageHash != bytes32(0), "No time capsule found.");
        require(!capsules[user].isOpened, "Capsule already opened.");
        require(block.timestamp >= capsules[user].unlockTime, "Capsule is still locked.");
        
        capsules[user].isOpened = true;

        // Emit event for opening the capsule
        emit CapsuleOpened(user, "Decrypted message (not stored on-chain)");
    }

    // Get the status of the time capsule (if it exists and is locked or opened)
    function getCapsuleStatus() public view returns (bytes32, uint256, bool) {
        Capsule memory capsule = capsules[msg.sender];
        return (capsule.messageHash, capsule.unlockTime, capsule.isOpened);
    }
}