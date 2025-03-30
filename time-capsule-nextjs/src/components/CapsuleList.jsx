'use client';

import React, { useEffect, useState } from 'react';
import { getContract, getAccount } from '../utils/web3';
import Card from './ui/Card';
import Button from './ui/Button';
import Loading from './Loading';

export default function CapsuleList({ onViewCapsule }) {
  const [capsule, setCapsule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    const fetchCapsule = async () => {
      try {
        const user = await getAccount();
        setAccount(user);
        const contract = getContract();

        const capsuleData = await contract.methods.capsules(user).call();
        setCapsule({
          messageHash: capsuleData.messageHash,
          unlockTime: Number(capsuleData.unlockTime),
          isOpened: capsuleData.isOpened,
        });
      } catch (error) {
        console.error("Error loading capsule:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCapsule();
  }, []);

  if (loading) {
    return <Loading text="Loading your capsule..." />;
  }

  if (!capsule || capsule.messageHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
    return (
      <Card title="No Capsule Found">
        <p className="text-gray-600">You don't have any time capsules yet. Try creating one!</p>
      </Card>
    );
  }

  return (
    <Card title="Your Capsule Details" subtitle={`Owner: ${account}`}>
      <div className="space-y-3">
        <p><strong>Status:</strong> {capsule.isOpened ? 'Unlocked' : 'Locked'}</p>
        <p><strong>Unlock Time:</strong> {new Date(capsule.unlockTime * 1000).toLocaleString()}</p>
        <p><strong>Message Hash (IPFS/File Hash):</strong> {capsule.messageHash}</p>

        <Button
          onClick={() => onViewCapsule(account)}
          variant="primary"
        >
          View Capsule
        </Button>
      </div>
    </Card>
  );
}
