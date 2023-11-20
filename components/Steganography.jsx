'use client';
import React, { useState, useEffect } from 'react';
import { convertToUint8Array } from '@/lib/convert';
import { encode } from '@/lib/steganography';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const Steganography = () => {
  const router = useRouter()
  const { data: session } = useSession();

  useEffect(() => {
    if (!session)
        router.replace("/") 
  }, [session])  

  const [secret, setSecret] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleEncode = async () => {
    try {
      const imageFile = await convertToUint8Array(file);
      const encodedImage = encode(secret, imageFile);
      
      const data = await fetch("/api/stego", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: session?.user.email, encodedImage })
      })

      const isMatch = await data.json()
      console.log(isMatch.value)

      if (isMatch.value) {
        // Redirect to next page
        router.replace("/dashboard")
      } else {
        // Remove sesh token
        await signOut()
      }
    } catch (error) {
      console.error('Error encoding secret message:', error);
      setError(error.message);
    }
  };

  return (
    <div className="grid place-items-center h-screen">
      <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
        <h1 className="text-xl font-bold my-4">Secret</h1>
        <div className="flex flex-col gap-3">
          <input
            onChange={(e) => setSecret(e.target.value)}
            value={secret}
            type="text"
            placeholder="Secret Key"
            required
          />
          <div>
            <label htmlFor="image-file">Upload Image file</label>
            <input type="file" id="image-file" onChange={(e) => setFile(e.target.files[0])} />
          </div>
          <button
            className="bg-green-600 text-white font-bold cursor-pointer py-2 px-6"
            onClick={() => handleEncode()}
          >
            Verify Secret
          </button>
        </div>
        <div>
          {error && (
            <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Steganography;
