// components/Header.jsx
"use client"

import React, { useState, useEffect } from 'react';
import { getAccount, getWeb3 } from '../utils/web3';
import { formatAddress } from '../utils/formatters';
import Button from './ui/Button';
import { initWeb3 } from '../utils/web3'; // make sure this is imported at the top

const Header = () => {
  const [account, setAccount] = useState('');
  const [network, setNetwork] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const fetchAccount = async () => {
      try {
        const initialized = await initWeb3();
        if (!initialized) {
          console.warn('Web3 not initialized');
          return;
        }
    
        const userAccount = await getAccount();
        setAccount(userAccount);
    
        const web3 = getWeb3();
        const networkId = await web3.eth.net.getId();
        const networks = {
          1: 'Ethereum Mainnet',
          3: 'Ropsten',
          4: 'Rinkeby',
          5: 'Goerli',
          42: 'Kovan',
          56: 'Binance Smart Chain',
          137: 'Polygon',
          80001: 'Mumbai',
          11155111: 'Sepolia'
        };
        setNetwork(networks[networkId] || `Network ID: ${networkId}`);
      } catch (error) {
        console.error('Error fetching account:', error);
      }
    };

    if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
      fetchAccount();
      
      // Listen for account changes
      window.ethereum.on('accountsChanged', () => {
        fetchAccount();
      });
      
      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        fetchAccount();
      });
    }
  }, []);

  const connectWallet = async () => {
    if (typeof window === 'undefined' || typeof window.ethereum === 'undefined') {
      alert('Please install MetaMask to use this application');
      return;
    }
    
    setIsConnecting(true);
    
    try {
      await initWeb3(); 
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const userAccount = await getAccount();
      setAccount(userAccount);
    } catch (error) {
      console.error('Error connecting wallet:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <header className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold">Time Capsule</h1>
            </div>
            <div className="ml-4 md:ml-6 text-sm">
              {network && <span className="px-2 py-1 rounded bg-blue-700">{network}</span>}
            </div>
          </div>
          <div>
            {account ? (
              <div className="px-3 py-1 text-sm rounded bg-blue-700">
                Connected: {formatAddress(account)}
              </div>
            ) : (
              <Button
                onClick={connectWallet}
                disabled={isConnecting}
                variant="outline"
                size="small"
                className="text-white border-white hover:bg-blue-500"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;