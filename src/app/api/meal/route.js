// src/app/api/meal-confirmation/route.js
import MealConfirmation from "@/model/MealConfirmation";
import User from "@/model/User";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();

  try {
    const { houseID, user, confirmed, date } = await request.json();

    const existingConfirmation = await MealConfirmation.findOne({
      user: user,
      date: date,
    });

    if (existingConfirmation) {
      existingConfirmation.confirmed = confirmed;
      existingConfirmation.houseID = houseID;
      await existingConfirmation.save();
      return NextResponse.json(existingConfirmation, { status: 200 });
    }

    const confirmation = new MealConfirmation({
      houseID: houseID,
      user: user,
      date: date,
      confirmed,
    });
    await confirmation.save();

    return NextResponse.json(confirmation, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating meal confirmation" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const houseID = searchParams.get("houseID");
    const date = searchParams.get("date");

    const users = await User.find({ houseID: houseID });
    const mealConfirmations = [];

    for (const user of users) {
      const mealConfirmation = await MealConfirmation.findOne({
        user: user.username,
        date: date,
      });

      if (mealConfirmation) {
        mealConfirmations.push(mealConfirmation);
      } else {
        const confirmation = new MealConfirmation({
          houseID: houseID,
          user: user.username,
          date: date,
          confirmed: user.defaultMeal,
        });
        await confirmation.save();
        mealConfirmations.push(confirmation);
      }
    }

    return NextResponse.json(mealConfirmations, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching meal confirmations" },
      { status: 500 }
    );
  }
}
