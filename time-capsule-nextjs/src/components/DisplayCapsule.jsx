// components/DisplayCapsule.jsx
"use client"

import React, { useState, useEffect } from 'react';
import { getContract, getAccount } from '../utils/web3';
import { getIPFSUrl, getIPFSContentType } from '../utils/ipfs';
import Card from './ui/Card';
import Button from './ui/Button';
import Loading from './Loading';

const DisplayCapsule = ({ address }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [capsule, setCapsule] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileContentType, setFileContentType] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [currentAccount, setCurrentAccount] = useState(null);

  useEffect(() => {
    const fetchCapsule = async () => {
      if (!address) return;
      
      setLoading(true);
      setError('');
      
      try {
        const contract = getContract();
        const account = await getAccount();
        setCurrentAccount(account);
        
        // Check if user is the owner
        const userIsOwner = address.toLowerCase() === account.toLowerCase();
        setIsOwner(userIsOwner);
        
        // Get capsule data
        let capsuleData;
        
        try {
          if (userIsOwner) {
            // Get user's own capsule using getCapsuleStatus
            const [message, unlockTime, isOpened] = await contract.methods.getCapsuleStatus().call({ from: account });
            capsuleData = {
              message,
              unlockTime,
              isOpened,
              owner: account
            };
          } else {
            // Access another user's capsule through the public mapping
            const capsuleInfo = await contract.methods.capsules(address).call();
            capsuleData = {
              message: capsuleInfo.message,
              unlockTime: capsuleInfo.unlockTime,
              isOpened: capsuleInfo.isOpened,
              owner: address
            };
          }
          
          setCapsule(capsuleData);
          
          // If no message (capsule doesn't exist), return early
          if (!capsuleData.message || capsuleData.message === '') {
            setError('No capsule found for this address.');
            setLoading(false);
            return;
          }
        } catch (contractError) {
          console.error('Contract interaction error:', contractError);
          setError('Error accessing blockchain data. Please make sure you have MetaMask connected.');
          setLoading(false);
          return;
        }
        
        // The message field contains the IPFS hash for the metadata
        try {
          const metadataUrl = getIPFSUrl(capsuleData.message);
          const response = await fetch(metadataUrl);
          
          if (!response.ok) {
            throw new Error(`Failed to fetch metadata: ${response.status}`);
          }
          
          const data = await response.json();
          setMetadata(data);
          
          // If there's a file, prepare the URL and content type
          if (data.fileHash) {
            const url = getIPFSUrl(data.fileHash);
            setFileUrl(url);
            
            // Get file content type
            const contentType = await getIPFSContentType(data.fileHash);
            setFileContentType(contentType);
          }
        } catch (metadataError) {
          console.error('Error fetching metadata:', metadataError);
          setError('Failed to fetch capsule metadata. The IPFS gateway might be down.');
        }
      } catch (error) {
        console.error('Error fetching capsule:', error);
        setError('Failed to fetch capsule data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCapsule();
  }, [address]); // Only address as dependency

  // Function to render file preview based on content type
  const renderFilePreview = () => {
    if (!fileUrl || !fileContentType) return null;
    
    if (fileContentType.startsWith('image/')) {
      return (
        <div className="mt-4 border rounded-lg overflow-hidden">
          <img src={fileUrl} alt="Capsule Image" className="max-w-full h-auto" />
        </div>
      );
    } else if (fileContentType.startsWith('video/')) {
      return (
        <div className="mt-4 border rounded-lg overflow-hidden">
          <video controls className="w-full">
            <source src={fileUrl} type={fileContentType} />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else if (fileContentType.startsWith('audio/')) {
      return (
        <div className="mt-4 border rounded-lg p-4">
          <audio controls className="w-full">
            <source src={fileUrl} type={fileContentType} />
            Your browser does not support the audio tag.
          </audio>
        </div>
      );
    } else {
      // For other file types, just provide a download link
      return (
        <div className="mt-4">
          <Button 
            onClick={() => window.open(fileUrl, '_blank')}
            variant="secondary"
            size="small"
          >
            Download File
          </Button>
        </div>
      );
    }
  };
  
  // Function to handle opening the capsule
  const handleOpenCapsule = async () => {
    if (!capsule || !isOwner) return;
    
    setLoading(true);
    setError('');
    
    try {
      const contract = getContract();
      const account = await getAccount();
      
      // Call the openCapsule function
      await contract.methods.openCapsule().send({ 
        from: account,
        gas: 200000
      });
      
      // Update the local state to show capsule as opened
      setCapsule({
        ...capsule,
        isOpened: true
      });
      
    } catch (error) {
      console.error('Error opening capsule:', error);
      setError('Failed to open the capsule. ' + (error.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Function to handle anyone opening an unlocked capsule
  const handleOpenCapsuleByAnyone = async () => {
    if (!capsule || isOwner || !isUnlocked() || capsule.isOpened) return;
    
    setLoading(true);
    setError('');
    
    try {
      const contract = getContract();
      const account = await getAccount();
      
      // Call the openCapsuleByAnyone function
      await contract.methods.openCapsuleByAnyone(capsule.owner).send({ 
        from: account,
        gas: 200000
      });
      
      // Update the local state to show capsule as opened
      setCapsule({
        ...capsule,
        isOpened: true
      });
      
    } catch (error) {
      console.error('Error opening capsule:', error);
      setError('Failed to open the capsule. ' + (error.message || 'Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  // Function to check if capsule is unlocked (time has passed)
  const isUnlocked = () => {
    if (!capsule) return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= parseInt(capsule.unlockTime);
  };

  // Function to check if user can access content
  const canAccessContent = () => {
    if (!capsule) return false;
    
    // User can access if the capsule has been opened
    return capsule.isOpened;
  };

  if (loading) {
    return (
      <Card>
        <div className="flex justify-center py-12">
          <Loading text="Loading capsule data..." />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Error Loading Capsule">
        <div className="py-6">
          <p className="text-red-600">{error}</p>
          <Button 
            onClick={() => window.location.reload()}
            variant="primary"
            className="mt-4"
          >
            Try Again
          </Button>
        </div>
      </Card>
    );
  }

  if (!capsule || !metadata) {
    return (
      <Card title="Capsule Not Found">
        <div className="py-6">
          <p>The requested time capsule could not be found or has been deleted.</p>
        </div>
      </Card>
    );
  }

  // Format the unlock time for display
  const unlockDate = new Date(parseInt(capsule.unlockTime) * 1000);
  const formattedUnlockDate = unlockDate.toLocaleString();

  return (
    <Card
      title={metadata.title || "Time Capsule"}
      subtitle={`Created on ${new Date(metadata.createdAt).toLocaleString()}`}
    >
      <div className="space-y-6 py-2">
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-md font-medium">
                {isUnlocked() ? "Capsule Unlocked" : "Capsule Locked"}
              </h3>
              <p className="text-sm text-gray-500">
                {isUnlocked()
                  ? "This time capsule is now unlocked and can be opened."
                  : `This time capsule will unlock on ${formattedUnlockDate}`}
              </p>
            </div>
            
            {isOwner && isUnlocked() && !capsule.isOpened && (
              <Button onClick={handleOpenCapsule} variant="primary">
                Open Capsule
              </Button>
            )}
            
            {!isOwner && isUnlocked() && !capsule.isOpened && (
              <Button onClick={handleOpenCapsuleByAnyone} variant="secondary">
                Open Capsule
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Owner</h3>
            <p className="mt-1 text-sm text-gray-900">{capsule.owner}</p>
          </div>
          
          {metadata.intendedRecipient && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Intended Recipient</h3>
              <p className="mt-1 text-sm text-gray-900">{metadata.intendedRecipient}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Unlock Time</h3>
            <p className="mt-1 text-sm text-gray-900">{formattedUnlockDate}</p>
          </div>
          
          {metadata.fileHash && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">File</h3>
              <p className="mt-1 text-sm text-gray-900">{metadata.fileName}</p>
            </div>
          )}
        </div>
        
        <div className="border-t border-gray-200 pt-4">
          <h3 className="text-lg font-medium">Capsule Content</h3>
          
          {canAccessContent() ? (
            <div className="mt-4">
              {metadata.message && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <pre className="whitespace-pre-wrap font-sans">{metadata.message}</pre>
                </div>
              )}
              
              {metadata.fileHash && renderFilePreview()}
            </div>
          ) : (
            <div className="mt-4 bg-yellow-50 p-4 rounded-lg">
              {isUnlocked() ? (
                <p className="text-yellow-700">
                  {isOwner ? 
                    "Click the 'Open Capsule' button to view the contents." : 
                    "The owner must open this capsule before it can be viewed."}
                </p>
              ) : (
                <p className="text-yellow-700">
                  This content is locked until {formattedUnlockDate}.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default DisplayCapsule;