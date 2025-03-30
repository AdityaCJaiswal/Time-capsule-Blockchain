// components/CreateCapsule.jsx
"use client"

import React, { useState } from 'react';
import { getContract, getAccount, convertToUnixTimestamp } from '../utils/web3';
import { uploadFileToIPFS, uploadJSONToIPFS } from '../utils/ipfs';
import Card from './ui/Card';
import Button from './ui/Button';
import Input from './ui/Input';
import Textarea from './ui/Textarea';
import FileUpload from './FileUpload';
import Loading from './Loading';
import Web3 from "web3";

const CreateCapsule = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [unlockTime, setUnlockTime] = useState('');
  const [recipient, setRecipient] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [txHash, setTxHash] = useState('');

  // Calculate minimum date (tomorrow)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleUnlockTimeChange = (e) => {
    setUnlockTime(e.target.value);
  };

  const handleRecipientChange = (e) => {
    setRecipient(e.target.value);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const resetForm = () => {
    setFile(null);
    setMessage('');
    setUnlockTime('');
    setRecipient('');
    setTitle('');
    setError('');
  };

  const createCapsule = async () => {
    // Input validation
    if ((!message || message.trim() === '') && !file) {
      setError('Please provide a message or upload a file.');
      return;
    }

    
    if (!unlockTime) {
      setError('Please select an unlock time.');
      return;
    }

    const unixTimestamp = convertToUnixTimestamp(unlockTime);
    const currentTime = Math.floor(Date.now() / 1000);
    
    if (unixTimestamp <= currentTime) {
      setError('Unlock time must be in the future.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess(false);
    setTxHash('');

    try {
      const account = await getAccount();
      const contract = getContract();

      // Format data for IPFS
      const capsuleData = {
        title: title || 'Time Capsule',
        message: message,
        createdAt: new Date().toISOString(),
        createdBy: account,
        recipient: recipient || account,
        unlockTime: unixTimestamp,
      };

      // Upload file to IPFS if provided
      let contentHash;
      if (file) {
        contentHash = await uploadFileToIPFS(file);
        capsuleData.fileHash = contentHash;
        capsuleData.fileName = file.name;
        capsuleData.fileType = file.type;
        capsuleData.fileSize = file.size;
      }

      // Upload metadata to IPFS
      const metadataHash = await uploadJSONToIPFS(capsuleData);

      // Create capsule on-chain
      const hashedMetadata = Web3.utils.keccak256(metadataHash);

      console.log("📦 Creating Capsule With:");
console.log("Message/IPFS Hash:", message);
console.log("Unlock Time:", unlockTime);
console.log("From:", account);


const transaction = await contract.methods.createCapsule(
  hashedMetadata,
  recipient || account,
  unixTimestamp
).send({ from: account });

      setSuccess(true);
      setTxHash(transaction.transactionHash);
      resetForm();
    } catch (error) {
      console.error('Error creating capsule:', error);
      setError(error.message || 'Error creating capsule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card 
      title="Create a New Time Capsule" 
      subtitle="Store a message or file that can only be accessed at a specific time in the future."
    >
      {success ? (
        <div className="text-center py-6">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="mt-3 text-lg font-medium text-gray-900">Capsule Created Successfully!</h3>
          <p className="mt-2 text-sm text-gray-500">Your time capsule has been stored on the blockchain.</p>
          {txHash && (
            <p className="mt-1 text-xs text-gray-500">
              Transaction Hash: <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{txHash.slice(0, 10)}...{txHash.slice(-8)}</a>
            </p>
          )}
          <div className="mt-4">
            <Button onClick={() => setSuccess(false)} variant="primary">Create Another Capsule</Button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="Capsule Title (optional)"
            id="title"
            value={title}
            onChange={handleTitleChange}
            placeholder="E.g., 'Letter to my future self'"
          />
          
          <Textarea
            label="Message"
            id="message"
            value={message}
            onChange={handleMessageChange}
            placeholder="Write your message here or upload a file below"
            rows={5}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload File (optional)</label>
            <FileUpload onFileChange={handleFileChange} />
          </div>
          
          <Input
            label="Unlock Date and Time"
            id="unlockTime"
            type="datetime-local"
            value={unlockTime}
            onChange={handleUnlockTimeChange}
            min={new Date().toISOString().slice(0, 16)}
            required
          />
          
          <Input
            label="Recipient Address (optional)"
            id="recipient"
            value={recipient}
            onChange={handleRecipientChange}
            placeholder="Ethereum address (leave empty to send to yourself)"
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          
          <div className="flex justify-end">
            {loading ? (
              <div className="flex items-center">
                <Loading size="small" text="Creating capsule..." />
              </div>
            ) : (
              <Button onClick={createCapsule} type="button">
                Create Capsule
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

export default CreateCapsule;