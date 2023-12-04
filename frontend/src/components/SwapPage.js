import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useState, useEffect } from "react";
import { IoSwapHorizontalOutline } from "react-icons/io5";
import { useAccount } from "wagmi";
import Image from "next/image";
import SwapSession from "./SwapSession";
import { Alchemy, Network } from "alchemy-sdk";
import sha256 from "crypto-js/sha256";
import { ethers } from "ethers";
import { depositFromAcc1, completeSwap } from "../utils/Interact";
import walletGif from "@/assets/walletGif.gif";
import placeholderImg from "@/assets/placeholderLogo.png";

const config = {
  apiKey: "Jyuuy4MI_u6RLY8TlkGasdskg1CJeIhE",
  network: Network.MATIC_MUMBAI,
};
const alchemy = new Alchemy(config);

const SwapPage = () => {
  const [amount, setAmount] = useState("");
  const [freezeClicked, setFreezeClicked] = useState(false); // Track Freeze button click
  const { address, isConnected } = useAccount();
  const [nfts, setNfts] = useState([]);
  const [selectedNft, setSelectedNft] = useState(null);
  const [showNftSelector, setShowNftSelector] = useState(false);
  const [sessionURL, setSessionURL] = useState("");
  const baseURL = "https://atomic-swap98.vercel.app/swap";

  const fetchNFTs = async (walletAddress) => {
    console.log("Fetching NFTs for address:", walletAddress);
    try {
      const nftData = await alchemy.nft.getNftsForOwner(walletAddress);

      const fetchedNfts = nftData.ownedNfts.map((nft) => {
        const title =
          nft.name || `NFT ${nft.tokenId} from ${nft.contract.name}`;

        const image = nft.image?.gateway || "default_image_url_here";

        return {
          address: nft.contract.address,
          tokenId: nft.tokenId,
          title: title,
          image: image,
        };
      });

      console.log("Fetched NFTs:", fetchedNfts);
      setNfts(fetchedNfts);
    } catch (error) {
      console.error("Error fetching NFTs:", error);
    }
  };
  const initializeEthers = async () => {
    try {
      // Connect to an Ethereum provider (e.g., MetaMask)
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      // Access the user's account address
      const [account] = await provider.listAccounts();
      console.log("Connected account:", account);

      // Example: Retrieve the balance
      const balance = await provider.getBalance(account);
      console.log("Balance:", ethers.utils.formatEther(balance));
      return provider;
    } catch (error) {
      console.error("Error initializing ethers:", error.message);
    }
  };
  useEffect(() => {
    const getEthers = async () => {
      const provider = await initializeEthers();
      console.log(provider);
    };
    getEthers();
  }, []);

  const handleNftSelect = (nft) => {
    console.log("Selected NFT:", nft);
    setSelectedNft(nft);
    setShowNftSelector(false);
  };

  useEffect(() => {
    if (isConnected && address) {
      fetchNFTs(address);
    }
  }, [address, isConnected]);
  const handleConnect = () => {
    setShowModal(true);
  };

  const handleDisconnect = () => {
    // Implement disconnect logic if needed
    setShowModal(false);
  };

  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };

  const handleConfirm = () => {
    // Implement logic to handle the confirmed amount
    console.log("Amount confirmed:", amount);
    setShowModal(false);
  };
  const handleCopyLink = () => {
    // Implement copy link logic
    console.log("Link copied to clipboard");
  };

  const generateSessionId = () => {
    if (!address || !selectedNft.address || !selectedNft.tokenId) {
      setError("Invalid token or user information.");
      return;
    }

    // setIsLoading(true);
    console.log("Generating session ID...");

    try {
      const uniqueId = sha256(
        `${address}-${selectedNft.address}-${selectedNft.tokenId}-${Date.now()}`
      ).toString();
      // setSessionId(uniqueId);
      console.log("Session ID set:", uniqueId);
      const sessionURL = `${baseURL}?session_id=${uniqueId}&userAddress=${encodeURIComponent(
        address
      )}&title=${encodeURIComponent(selectedNft.title)}`;
      setSessionURL(sessionURL);
      return sessionURL;
    } catch (e) {
      console.error("Error generating session ID:", e);
      // setError("Failed to generate session ID.");
    } finally {
      // setIsLoading(false);
    }
  };

  const handleFreezeClick = async () => {
    setFreezeClicked(true);
    const provider = await initializeEthers();
    console.log(
      "this is the URL which we r sending from user1 for bytes 32 hash",
      sessionURL
    );
    depositFromAcc1(
      sessionURL,
      provider,
      selectedNft.address,
      selectedNft.tokenId
    );
  };

  const handleSignClick = async () => {
    const provider = await initializeEthers();
    const bytes32SessionId = ethers.utils.solidityKeccak256(
      ["string"],
      [sessionURL]
    );
    completeSwap(provider, bytes32SessionId);
  };

  console.log(nfts);

  return (
    <div className="flex flex-col md:flex-row h-full max-md:items-center bg-black min-h-screen text-white z-[999]">
      {/* Left Side */}
      <div className="flex-1 flex flex-col items-center justify-center md:p-6">
        {!isConnected && (
          <Image alt="walletGif" src={walletGif} width={180} height={180} />
        )}
        <div
          className={"rounded-lg mb-2"}
          style={{
            boxShadow: isConnected ? "" : "0 -1px 0px gray, 0 4px 6px white",
          }}
        >
          <ConnectButton
            accountStatus={{
              smallScreen: "avatar",
              largeScreen: "full",
            }}
            chainStatus="icon"
          />
        </div>
        {!isConnected && (
          <p className="text-[17px] text-[#bebdbd] mt-3">
            Please connect your wallet
          </p>
        )}
        {isConnected && (
          <div>
            {selectedNft && (
              <div className="mt-2">
                <h2 className="text-[14px] text-[#d5d2d2] font-semibold">
                  Selected NFT
                </h2>
                <div className="bg-gradient-to-l from-[black] via-[#4a4949] to-[#3d3d3d] p-2 my-1 rounded text-white">
                  <h1 className="font-semibold">
                    <i className="font-[400]">Title :</i> {selectedNft.title}
                  </h1>
                  <h1 className="font-semibold">
                    <i className="font-[400] ml-1 mr-[17px]">ID </i>: {selectedNft.tokenId}
                  </h1>
                </div>
              </div>
            )}
            <button
              onClick={() => setShowNftSelector(!freezeClicked && true)} // Enable button if Freeze not clicked
              className={`${
                freezeClicked ? "bg-gray-400 cursor-not-allowed" : ""
              } text-white px-4 py-2 mt-4 rounded hover:translate-y-[-4px] transition-all duration-300`}
              disabled={freezeClicked}
              style={{
                boxShadow: "0 -1px 0px gray, 0 4px 6px white",
              }}
            >
              Select NFT
            </button>
            <button
              onClick={() => setShowNftSelector(!freezeClicked && true)} // Enable button if Freeze not clicked
              className={`${
                freezeClicked ? "bg-gray-400 cursor-not-allowed" : ""
              } text-white px-4 py-2 mt-4 ml-4 rounded hover:translate-y-[-4px] transition-all duration-300`}
              disabled={freezeClicked}
              style={{
                boxShadow: "0 -1px 0px gray, 0 4px 6px white",
              }}
            >
              Select Token
            </button>
          </div>
        )}
        {showNftSelector && (
          <div className="absolute w-72 max-h-96 overflow-y-auto bg-white border border-gray-300 p-4 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold mb-2 text-black">
              Select an NFT for swap
            </h2>
            {nfts.map((nft) => (
              <div
                key={`${nft.address}-${nft.tokenId}`}
                onClick={() => handleNftSelect(nft)}
                className="p-2 border-b border-gray-300 cursor-pointer hover:bg-gray-100 text-black flex items-center"
              >
                <img
                  src={nft?.image || placeholderImg}
                  alt={nft.title}
                  className="w-10 h-10 mr-2"
                />
                {nft.title}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Center */}
      <div className="w-12 flex flex-col items-center justify-center md:p-6">
        <div className="bg-white p-2 rounded-full">
          <IoSwapHorizontalOutline
            size={30}
            color="#4A5568"
            className="font-bold"
          />
        </div>

        <div className="flex max-md:items-center max-md:justify-center gap-2 md:flex-col md:space-y-4 mt-6">
          <button
            onClick={handleFreezeClick}
            className={`${
              freezeClicked
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-tr from-[#495155] via-[#008cffb1] to-[#0ed8d8]"
            } text-white py-2 px-4 rounded transition-all duration-300 shadow-md shadow-[#0ed8d8] uppercase tracking-[2px]`}
            disabled={freezeClicked}
          >
            Freeze
          </button>

          <button
            onClick={handleSignClick}
            className={`${
              false
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-tr from-[#5f4f4a] via-[#ff4000b1] to-[#d8550e]"
            } text-white py-2 px-7 md:px-4 rounded transition-all duration-300 shadow-md shadow-[red] uppercase tracking-[2px]`}
          >
            Sign
          </button>
        </div>
      </div>

      {/* Right Side */}
      <div className="flex-1 flex flex-col items-center justify-center md:p-6">
        <div className="flex flex-col items-center space-y-4">
          {!selectedNft ? (
            <div
              className="rounded-lg w-[300px] h-[300px] flex items-center justify-center border"
              style={{
                boxShadow: isConnected
                  ? ""
                  : "0 -1px 0px gray, 0 4px 6px #0ed8d8",
              }}
            >
              <h1 className="font-medium tracking-[2px] text-[#dae1e3] bg-[black] ">
                Select{" "}
                <i className="font-semibold text-[20px] text-[#6a99d5]">NFT</i>{" "}
                to continue.
              </h1>
            </div>
          ) : (
            <SwapSession
              sessionID={sessionURL}
              generateSessionId={generateSessionId}
              userAddress={address}
              tokenContractAddress={selectedNft.address}
              tokenId={selectedNft.tokenId}
              title={selectedNft.title}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default SwapPage;
