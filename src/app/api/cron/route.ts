import User from "@/model/User.js";
import MealConfirmation from "@/model/MealConfirmation.js";
import dbConnect from "@/utils/db.js";

export const dynamic = "force-dynamic"; // static by default, unless reading the request

export async function GET(request: Request) {
  await dbConnect();

  try {
    const users = await User.find();

    //Delete all meal confirmations
    await MealConfirmation.deleteMany();

    for (const user of users) {
      const newMealConfirmation = new MealConfirmation({
        houseID: user.houseID,
        user: user.username,
        date: (() => {
          const date = new Date();
          date.setHours(0, 0, 0, 0);
          return date;
        })(),
        confirmed: user.defaultMeal,
      });

      await newMealConfirmation.save();
    }

    console.log("Meal confirmations created successfully.");

    return new Response(
      `Meal confirmations created successfully. ${process.env.VERCEL_REGION}`
    );
  } catch (error) {
    console.error("Error creating meal confirmations:", error);
  }
}
