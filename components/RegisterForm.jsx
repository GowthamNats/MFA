"use client"

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import profile from '@/assets/profile.png'
import convertToBase64 from "@/lib/convert";

export default function RegisterForm() {

    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [file, setFile] = useState("")
    const [error, setError] = useState(null)

    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (!name || !email || !password || !file) {
            setError("All fields are necessary.")
            return
        }

        try {
            const resUserExists = await fetch("api/userExists", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email })
            })
            
            const { user } = await resUserExists.json()

            if (user) {
                setError("User already exists.")
                return
            }

            const res = await fetch('api/register', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password, file
                })
            })

            if (res.ok) {
                const form = e.target
                form.reset()
                router.push("/")
            } else {
                console.log("User registration failed.")
            }
        } catch (error) {
            console.log("Error during registration: ", error)
        }
    }

    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0])
        setFile(base64)
    }

  return (
    <div className="grid place-items-center h-screen">
        <div className="shadow-lg p-5 rounded-lg border-t-4 border-green-400">
            <h1 className="text-xl font-bold my-4">Register</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                    <label htmlFor="profile_img">
                        <Image src={file || profile} alt="profile_img" width={100} height={100} className="aspect-square rounded-full" />
                    </label>
                    <input onChange={onUpload} type="file" id="profile_img" className="hidden" />
                </div>
                <input 
                    onChange={e => setName(e.target.value)} 
                    type="text" 
                    placeholder="Full Name" 
                    required
                />
                <input 
                    onChange={e => setEmail(e.target.value)}
                    type="email" 
                    placeholder="Email" 
                    required
                />
                <input 
                    onChange={e => setPassword(e.target.value)}
                    type="password" 
                    placeholder="Password" 
                    required
                />
                <button className="bg-green-600 text-white font-bold cursor-pointer py-2 px-6">
                    Register
                </button>

                {error && (
                    <div className="bg-red-500 text-white w-fit text-sm py-1 px-3 rounded-md mt-2">
                        { error }
                    </div>
                )}
            
                <Link className="text-sm mt-2 text-right" href={"/"}>
                    Already a user? <span className="underline">Login</span>
                </Link>
            </form>
        </div>
    </div>
  )
}
