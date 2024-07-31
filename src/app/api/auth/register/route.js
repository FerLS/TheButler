// src/app/api/auth/register/route.js
import dbConnect from "@/utils/db";
import User from "@/model/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { homedir } from "os";

export async function POST(request) {
  await dbConnect();

  const { username, password } = await request.json();
  const houseID = null;

  if (!username || !password) {
    return NextResponse.json(
      { message: "Missing username or password" },
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ username });

  if (existingUser) {
    return NextResponse.json(
      { message: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const user = new User({
    username,
    password: hashedPassword,
    houseID,
  });

  await user.save();

  return NextResponse.json(
    { message: "User created successfully" },
    { status: 201 }
  );
}
