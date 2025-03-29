const TimeCapsule = artifacts.require("TimeCapsule");

module.exports = function (deployer) {
  // Unix timestamp for future unlock time (adjust to your needs)
  const unlockTime = 1678483200; // Change this to a future date
  const message = "This is a secret message in the capsule!";
  
  // Deploy the contract with the unlock time and message
  deployer.deploy(TimeCapsule, unlockTime, message);
};
