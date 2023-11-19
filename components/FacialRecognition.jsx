'use client'

import React, { useRef, useState, useCallback, useEffect } from "react";
import { signOut, useSession } from "next-auth/react";
import Webcam from "react-webcam";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function FacialRecognition() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [showVideo, setShowVideo] = useState(true);
  const { data: session } = useSession();
  const router = useRouter()

  useEffect(() => {
    if (!session)
        router.replace("/") 
}, [session])

  const captureImage = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setImage(imageSrc);
    setShowVideo(false)
  }, [webcamRef]);

  const handleRecognition = async () => {
    try {
      const data = await fetch("/api/user", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: session?.user.email })
      })
      const user = await data.json()
      const profile = await user.user.profile

      console.log(profile)
      console.log(image)
      const isMatch = await fetch("http://localhost:8000/facial", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            'Access-Control-Allow-Origin': '*',
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
        },
        body: JSON.stringify({ image1: profile, image2: image })
      })
      const answer = await isMatch.json()

      if (answer.message) {
        // Redirect to next page
        router.replace("/dashboard")
      } else {
        // Remove sesh token
        await signOut()
      }
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <div className="w-full max-w-md shadow-lg p-4 rounded-lg border-t-4 border-green-400">
        <h1 className="text-2xl font-bold mb-4">Facial Recognition</h1>

        {
          showVideo ? (
            <>
              <Webcam 
                ref={webcamRef} 
                width={340} 
                height={240} 
                screenshotFormat="image/jpeg"
              />
              <button 
                onClick={captureImage}
                className="w-full bg-green-500 px-4 py-3 rounded-md text-white"
              >Capture Picture</button>
            </>
          ) : (
            <>
               <Image
                src={image || ""}
                alt="Captured Image"
                className="my-4 w-full object-fit"
                height={240}
                width={320}
              />
              <button 
                onClick={() => setShowVideo(true)}
                className="w-full bg-green-500 px-4 py-3 rounded-md text-white"
              >Recapture</button>
              <button
                onClick={handleRecognition}
                className="w-full bg-green-500 px-4 py-3 rounded-md text-white"
              >
                Start Recognition
              </button>
            </>
          )
        }
      </div>
    </div>
  );
}