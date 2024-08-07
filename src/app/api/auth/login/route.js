// src/app/api/auth/login/route.js
import dbConnect from "@/utils/db";
import User from "@/model/User";
import MealConfirmation from "@/model/MealConfirmation";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request) {
  await dbConnect();

  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json(
      { message: "Missing username or password" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ username });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return NextResponse.json(
      { message: "Invalid credentials" },
      { status: 400 }
    );
  }

  const houseID = user.houseID;
  const defaultMeal = user.defaultMeal;

  return NextResponse.json({ houseID, defaultMeal }, { status: 200 });
}

export async function PUT(request) {
  await dbConnect();

  const { username, houseID, defaultMeal } = await request.json();

  if (!username) {
    return NextResponse.json({ message: "Missing username" }, { status: 400 });
  }
  if (!houseID) {
    return NextResponse.json(
      { message: "El HouseID esta vacio" },
      { status: 400 }
    );
  }
  const user = await User.findOne({ username });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }

  if (houseID != user.houseID || defaultMeal != user.defaultMeal) {
    //Borrar las confirmaciones de comida de los usuarios
    await MealConfirmation.deleteMany({ user: user.username });
  }

  user.houseID = houseID;
  user.defaultMeal = defaultMeal;
  await user.save();

  return NextResponse.json(
    { houseID, message: "houseID added successfully" },
    { status: 200 }
  );
}

export async function GET(request) {
  await dbConnect();

  const { username } = await request.query;

  if (!username) {
    return NextResponse.json({ message: "Missing username" }, { status: 400 });
  }

  const user = await User.findOne({ username });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }

  const houseID = user.houseID;
  const defaultMeal = user.defaultMeal;

  return NextResponse.json({ houseID, defaultMeal }, { status: 200 });
}
