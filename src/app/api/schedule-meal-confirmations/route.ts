// app/api/schedule-meal-confirmations/route.ts
import { NextRequest, NextResponse } from "next/server";
import cron from "node-cron";
import MealConfirmation from "@/model/MealConfirmation";
import User from "@/model/User";
import House from "@/model/House";
import connectDB from "@/utils/db";

export async function GET(request: NextRequest) {
  await connectDB();

  // Configura el CRON job para que se ejecute todos los días a la medianoche
  cron.schedule("0 0 * * *", async () => {
    try {
      const users = await User.find();

      for (const user of users) {
        const newMealConfirmation = new MealConfirmation({
          houseID: user.houseID,
          user: user.username,
          date: new Date(),
          confirmed: user.defaultMeal,
        });

        await newMealConfirmation.save();

        // También puedes actualizar la casa si es necesario
        const house = await House.findOne({ houseID: user.houseID });
        if (house) {
          house.mealConfirmations.push(newMealConfirmation._id);
          await house.save();
        } else {
          console.error("House not found");
        }
      }

      console.log("Meal confirmations created successfully.");
    } catch (error) {
      console.error("Error creating meal confirmations:", error);
    }
  });

  return NextResponse.json({ message: "CRON job scheduled" });
}
