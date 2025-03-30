// utils/ipfs.js
import axios from "axios";

export const uploadFileToIPFS = async (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to upload to IPFS");
    }

    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error(error.response?.data?.error || "Error uploading file to IPFS");
  }
};

export const uploadJSONToIPFS = async (jsonData) => {
  try {
    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      jsonData,
      {
        headers: {
          pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
          pinata_secret_api_key: process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error("Failed to upload JSON to IPFS");
    }

    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading JSON to IPFS:", error);
    throw new Error(error.response?.data?.error || "Error uploading JSON to IPFS");
  }
};

export const getIPFSUrl = (hash) => {
  if (!hash) return null;
  
  // Try to determine if hash is already a URL
  if (hash.startsWith("http")) return hash;
  
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};

export const getIPFSContentType = async (hash) => {
  try {
    const url = getIPFSUrl(hash);
    const response = await axios.head(url);
    return response.headers["content-type"];
  } catch (error) {
    console.error("Error getting IPFS content type:", error);
    return "application/octet-stream"; // Default content type
  }
};