// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract TimeCapsule {

    address public owner;
    uint256 public unlockTime;
    string public capsuleMessage;
    bool public isUnlocked;

    event CapsuleCreated(address indexed owner, uint256 unlockTime);
    event CapsuleUnlocked(address indexed owner, uint256 unlockTime);

    constructor(uint256 _unlockTime, string memory _capsuleMessage) {
        require(_unlockTime > block.timestamp, "Unlock time must be in the future");
        require(bytes(_capsuleMessage).length > 0, "Message cannot be empty");

        owner = msg.sender;
        unlockTime = _unlockTime;
        capsuleMessage = _capsuleMessage;
        isUnlocked = false;
        emit CapsuleCreated(msg.sender, _unlockTime);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "You are not the owner!");
        _;
    }

    modifier onlyAfterUnlockTime() {
        require(block.timestamp >= unlockTime, "The time capsule is still locked.");
        _;
    }

    modifier canUnlock() {
        require(msg.sender == owner || block.timestamp >= unlockTime, "You cannot unlock the capsule yet.");
        _;
    }

    // Function to unlock the time capsule
    function unlockCapsule() public canUnlock {
        isUnlocked = true;
        emit CapsuleUnlocked(msg.sender, block.timestamp);
    }

    // Function to view the capsule's message after it’s unlocked
    function getCapsuleMessage() public view onlyAfterUnlockTime returns (string memory) {
        require(isUnlocked, "The time capsule is still locked.");
        return capsuleMessage;
    }

    // Owner can unlock anytime
    function unlockBeforeMaturity() public onlyOwner {
        isUnlocked = true;
        emit CapsuleUnlocked(msg.sender, block.timestamp);
    }
}
