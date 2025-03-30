"use client"

import React, { useState, useEffect } from 'react';
import { initWeb3, getAccount } from '../utils/web3';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CreateCapsule from '../components/CreateCapsule';
import DisplayCapsule from '../components/DisplayCapsule';
import CapsuleList from '../components/CapsuleList';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Loading from '../components/Loading';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [view, setView] = useState('intro'); // 'intro', 'create', 'list', 'view'
  const [selectedCapsuleId, setSelectedCapsuleId] = useState(null);
  
  // Initialize Web3
  useEffect(() => {
    const initialize = async () => {
      try {
        const connected = await initWeb3();
        setIsConnected(connected);
        
        // If connected and user previously selected a view, keep it
        // Otherwise, default to intro
        if (connected && view === 'intro') {
          // Check if user has any capsules already
          try {
            const account = await getAccount();
            // This is where you could check for existing capsules
            // For now, we'll just keep the intro view
          } catch (error) {
            console.error("Error checking account capsules:", error);
          }
        }
      } catch (error) {
        console.error("Error initializing Web3:", error);
        setIsConnected(false);
      } finally {
        setIsInitializing(false);
      }
    };

    initialize();
  }, [view]);

  // Handle view switching
  const switchView = (newView, capsuleId = null) => {
    setView(newView);
    if (capsuleId !== null) {
      setSelectedCapsuleId(capsuleId);
    }
  };

  // Connect wallet manually
  const connectWallet = async () => {
    try {
      const connected = await initWeb3();
      setIsConnected(connected);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <Loading size="large" text="Initializing blockchain connection..." />
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        {!isConnected ? (
          <Card 
            title="Welcome to Blockchain Time Capsule" 
            subtitle="Store messages and files that can only be accessed at a specific time in the future."
            className="max-w-3xl mx-auto"
          >
            <div className="text-center py-8">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">Secure Your Memories in Time</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Create digital time capsules that are securely stored on the blockchain 
                  and can only be opened at the date and time you specify.
                </p>
                
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="p-6 bg-white rounded-lg shadow-md">
                    <div className="text-blue-500 text-4xl mb-4">🔒</div>
                    <h3 className="text-xl font-semibold mb-2">Secure Storage</h3>
                    <p className="text-gray-600">Your content is encrypted and stored on decentralized storage.</p>
                  </div>
                  
                  <div className="p-6 bg-white rounded-lg shadow-md">
                    <div className="text-blue-500 text-4xl mb-4">⏰</div>
                    <h3 className="text-xl font-semibold mb-2">Time-Locked</h3>
                    <p className="text-gray-600">Content is only accessible after your specified unlock date.</p>
                  </div>
                  
                  <div className="p-6 bg-white rounded-lg shadow-md">
                    <div className="text-blue-500 text-4xl mb-4">🔄</div>
                    <h3 className="text-xl font-semibold mb-2">Decentralized</h3>
                    <p className="text-gray-600">Built on blockchain technology for permanence and reliability.</p>
                  </div>
                </div>
              </div>
              
              <Button 
                onClick={connectWallet} 
                size="large"
                className="px-8"
              >
                Connect Your Wallet to Begin
              </Button>
              
              <p className="mt-4 text-sm text-gray-500">
                You&apos;ll need MetaMask or another Ethereum wallet to use this application.
              </p>
            </div>
          </Card>
        ) : (
          <div className="max-w-4xl mx-auto">
            {view === 'intro' && (
              <div className="space-y-6">
                <Card 
                  title="Your Blockchain Time Capsule" 
                  subtitle="What would you like to do?"
                  className="text-center py-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <Button 
                      onClick={() => switchView('create')}
                      size="large"
                      className="py-8"
                    >
                      Create a New Time Capsule
                    </Button>
                    
                    <Button 
                      onClick={() => switchView('list')}
                      variant="secondary"
                      size="large"
                      className="py-8"
                    >
                      View My Time Capsules
                    </Button>
                  </div>
                </Card>
                
                <Card
                  title="How It Works"
                  className="mt-8"
                >
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">1</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">Create a Time Capsule</h3>
                        <p className="text-gray-600">Write a message or upload a file, then set a future date when it can be unlocked.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">2</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">Secure Storage</h3>
                        <p className="text-gray-600">Your content is stored on IPFS and the access conditions are secured by blockchain smart contracts.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-bold">3</span>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium">Time-Locked Access</h3>
                        <p className="text-gray-600">After the unlock date arrives, the recipient can access the content of the time capsule.</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            )}
            
            {view === 'create' && (
              <div>
                <div className="mb-4">
                  <Button 
                    onClick={() => switchView('intro')} 
                    variant="secondary"
                    size="small"
                  >
                    ← Back to Menu
                  </Button>
                </div>
                <CreateCapsule onSuccess={() => switchView('list')} />
              </div>
            )}
            
            {view === 'list' && (
              <div>
                <div className="mb-4">
                  <Button 
                    onClick={() => switchView('intro')} 
                    variant="secondary"
                    size="small"
                  >
                    ← Back to Menu
                  </Button>
                </div>
                <CapsuleList onViewCapsule={(id) => switchView('view', id)} />
              </div>
            )}
            
            {view === 'view' && (
              <div>
                <div className="mb-4">
                  <Button 
                    onClick={() => switchView('list')} 
                    variant="secondary"
                    size="small"
                  >
                    ← Back to My Capsules
                  </Button>
                </div>
                <DisplayCapsule capsuleId={selectedCapsuleId} />
              </div>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}