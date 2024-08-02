import User from "@/model/User.js";
import MealConfirmation from "@/model/MealConfirmation.js";
import dbConnect from "@/utils/db.js";

export const dynamic = "force-dynamic"; // static by default, unless reading the request
export const revalidate = 0;

export async function GET(request: Request) {
  await dbConnect();

  try {
    const users = await User.find();

    //Delete all meal confirmations
    await MealConfirmation.deleteMany();

    for (const user of users) {
      if (
        user.houseID === null ||
        user.houseID === "undefined" ||
        user.houseID === ""
      ) {
        continue;
      }

      const newMealConfirmation = new MealConfirmation({
        houseID: user.houseID,
        user: user.username,
        date: (() => {
          return new Date().getHours() >= 20
            ? new Date().setDate(new Date().getDate() + 1)
            : new Date().toLocaleDateString();
        })(),
        confirmed: user.defaultMeal,
      });

      await newMealConfirmation.save();
    }

    console.log("Meal confirmations created successfully.");

    return new Response(
      `Meal confirmations created successfully. ${process.env.VERCEL_REGION}`,
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating meal confirmations:", error);
    return new Response("Error creating meal confirmations", { status: 500 });
  }
}
