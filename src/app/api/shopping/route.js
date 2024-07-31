// src/app/api/shopping/route.js
import ShoppingItem from "@/model/ShoppingItem";
import House from "@/model/House";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();

  try {
    const { item, houseId } = await request.json();
    const newItem = new ShoppingItem({ item, house: houseId });
    await newItem.save();

    await House.findByIdAndUpdate(houseId, {
      $push: { shoppingList: newItem._id },
    });

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating shopping item" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectDB();

  try {
    const { houseId } = request.query;
    const shoppingList = await ShoppingItem.find({ house: houseId });

    return NextResponse.json(shoppingList, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching shopping list" },
      { status: 500 }
    );
  }
}
