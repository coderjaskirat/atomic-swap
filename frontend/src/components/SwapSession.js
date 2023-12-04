import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import sha256 from "crypto-js/sha256";
import { RiFileCopy2Fill, RiFileCopy2Line } from "react-icons/ri";

function SwapSession({
  // sessionID,
  generateSessionId,
  userAddress,
  tokenContractAddress,
  tokenId,
  title,
}) {
  const [sessionId, setSessionId] = useState("");
  const [sessionURL, setSessionURL] = useState("ABC");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    if (sessionURL) {
      navigator.clipboard
        .writeText(sessionURL)
        .then(() => {
          setCopied(true);
          setTimeout(() => {
            setCopied(false);
          }, 2000); // Reset copied state to false after 2 seconds
        })
        .catch(() => setError("Failed to copy URL to clipboard."));
    }
  };

  const handleGenerateId = async () => {
    try {
      setIsLoading(true);
      const id = await generateSessionId();
      setSessionURL(id);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Use useEffect to log the updated sessionURL after the state has been updated
  useEffect(() => {
    console.log("Updated URL", sessionURL);
  }, [sessionURL]);

  useEffect(() => {
    console.log("sessionURL", sessionURL);
    if (error) {
      alert(error);
      setError("");
    }
  }, [error]);

  return (
    <div className="flex flex-col overflow-hidden items-center w-96">
      <button
        className="bg-[#00bbff] text-black font-semibold hover:translate-x-[1px] hover:translate-y-[2px] px-6 py-2 rounded-lg focus:outline-none focus:shadow-outline-blue transition duration-300"
        style={{
          boxShadow: "0 4px 6px white",
        }}
        onClick={handleGenerateId}
        disabled={isLoading}
      >
        {isLoading ? "Creating Session..." : "Create Swap Session"}
      </button>

      {sessionURL && (
        <div className="flex flex-col items-center space-y-4 mt-5 p-4 rounded-md bg-gradient-to-l from-[black] via-[#292929] to-[#1f1f1f]">
          <div className="bg-white p-4 rounded-md shadow-md">
            <QRCodeSVG value={sessionURL} size={150} />
          </div>

          <div className="text-center">
            <p className="mb-2 font-semibold text-[16px] uppercase">Session URL:</p>
            <div className="flex items-center space-x-2 border p-2 py-1 rounded-xl">
              <input
                type="url"
                value={sessionURL}
                readOnly
                className="  rounded-md bg-transparent py-2 px-4 focus:outline-none w-full"
              />
              <span
                role="button"
                className="cursor-pointer text-blue-200 hover:underline"
                onClick={handleCopyClick}
              >
                {copied ? (
                  <RiFileCopy2Fill size={18} />
                ) : (
                  <RiFileCopy2Line size={18} />
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
}

export default SwapSession;
