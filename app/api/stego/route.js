import { connectMongoDB } from "@/lib/mongodb";
import { decode } from "@/lib/steganography";
import User from "@/models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        await connectMongoDB()
        const { email, encodedImage } = await req.json()
        const img = Object.values(encodedImage)

        const data = await User.findOne({ email }).select('secret')
        const secret = await data.secret
        
        const msg = decode(img)
        
        if (msg === secret)
            return NextResponse.json({ value: true })
        else
            return NextResponse.json({ value: false })
    } catch (error) {
        console.log(error)
    }   
}