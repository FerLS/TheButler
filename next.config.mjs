/** @type {import('next').NextConfig} */

// next.config.js
import cron from "node-cron";
import User from "./src/model/User.js";
import House from "./src/model/House.js";
import MealConfirmation from "./src/model/MealConfirmation.js";
import dbConnect from "./src/utils/db.js";

const scheduleMealConfirmations = async () => {
  await dbConnect();

  cron.schedule("0 0  * * *", async () => {
    try {
      const users = await User.find();

      for (const user of users) {
        //Borrar las confirmaciones de comida de los usuarios
        await MealConfirmation.deleteMany({ user: user.username });

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
    } catch (error) {
      console.error("Error creating meal confirmations:", error);
    }
  });
};

export default {
  async rewrites() {
    await scheduleMealConfirmations();
    return [];
  },
  // Otras configuraciones
};
