// src/app/api/meal-confirmation/route.js
import MealConfirmation from "@/model/MealConfirmation";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();

  try {
    const { houseID, user, confirmed } = await request.json();

    const existingConfirmation = await MealConfirmation.findOne({
      user: user,
      date: (() => {
        const date =
          new Date().getHours() >= 20
            ? new Date(new Date().getTime() + 86400000)
            : new Date();

        date.setHours(0, 0, 0, 0);
        return date;
      })(),
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
      date: (() => {
        const date =
          new Date().getHours() >= 20
            ? new Date(new Date().getTime() + 86400000)
            : new Date();
        date.setHours(0, 0, 0, 0);
        return date;
      })(),
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
    const user = searchParams.get("user");

    if (houseID) {
      const mealConfirmations = await MealConfirmation.find({
        houseID: houseID,
        date: (() => {
          const date =
            new Date().getHours() >= 20
              ? new Date(new Date().getTime() + 86400000)
              : new Date();
          date.setHours(0, 0, 0, 0);
          return date;
        })(),
      });
      return NextResponse.json(mealConfirmations, { status: 200 });
    } else if (user) {
      const mealConfirmation = await MealConfirmation.findOne({
        user: user,
        date: (() => {
          const date =
            new Date().getHours() >= 20
              ? new Date(new Date().getTime() + 86400000)
              : new Date();
          date.setHours(0, 0, 0, 0);
          return date;
        })(),
      });
      return NextResponse.json(mealConfirmation, { status: 200 });
    }

    return NextResponse.json(
      { message: "User dont exists in MealDatabase" },
      { status: 400 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching meal confirmations" },
      { status: 500 }
    );
  }
}
