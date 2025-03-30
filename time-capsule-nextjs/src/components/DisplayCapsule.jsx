// components/DisplayCapsule.jsx
"use client"

import React, { useState, useEffect } from 'react';
import { getContract, getAccount } from '../utils/web3';
import { getIPFSUrl, getIPFSContentType } from '../utils/ipfs';
import Card from './ui/Card';
import Button from './ui/Button';
import Loading from './Loading';
import CapsuleStatus from './CapsuleStatus';

const DisplayCapsule = ({ capsuleId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [capsule, setCapsule] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [fileContentType, setFileContentType] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [isRecipient, setIsRecipient] = useState(false);

  useEffect(() => {
    const fetchCapsule = async () => {
      if (!capsuleId) return;
      
      setLoading(true);
      setError('');
      
      try {
        const contract = getContract();
        const account = await getAccount();
        
        // Fetch capsule data from the smart contract
        const capsuleData = await contract.methods.getCapsule(capsuleId).call();
        setCapsule(capsuleData);
        
        // Check if user is owner or recipient
        setIsOwner(capsuleData.creator.toLowerCase() === account.toLowerCase());
        setIsRecipient(capsuleData.recipient.toLowerCase() === account.toLowerCase());
        
        // Fetch metadata from IPFS
        if (capsuleData.metadataHash) {
          try {
            const metadataUrl = getIPFSUrl(capsuleData.metadataHash);
            const response = await fetch(metadataUrl);
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
        }
      } catch (error) {
        console.error('Error fetching capsule:', error);
        setError('Failed to fetch capsule data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCapsule();
  }, [capsuleId]);

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

  // Function to check if capsule is unlocked
  const isUnlocked = () => {
    if (!capsule) return false;
    const now = Math.floor(Date.now() / 1000);
    return now >= parseInt(capsule.unlockTime);
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

  // Check if user can access the content
  const canAccessContent = isUnlocked() && isRecipient;

  return (
    <Card
      title={metadata.title || "Time Capsule"}
      subtitle={`Created on ${new Date(metadata.createdAt).toLocaleString()}`}
    >
      <div className="space-y-6 py-2">
        <CapsuleStatus 
          unlockTime={parseInt(capsule.unlockTime)} 
          isRecipient={isRecipient}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-sm font-medium text-gray-500">Created By</h3>
            <p className="mt-1 text-sm text-gray-900">{capsule.creator}</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500">Recipient</h3>
            <p className="mt-1 text-sm text-gray-900">{capsule.recipient}</p>
          </div>
          
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
          
          {canAccessContent ? (
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
                  This content is only accessible by the designated recipient.
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