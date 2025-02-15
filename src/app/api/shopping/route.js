// src/app/api/shopping/route.js
import ShoppingItem from "@/model/ShoppingItem";
import House from "@/model/House";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();

  try {
    const { item, houseID } = await request.json();

    if (!item) {
      return NextResponse.json(
        { message: "Ponle un nombre al alimento" },
        { status: 400 }
      );
    }

    const existingItem = await ShoppingItem.findOne({ item, houseID });
    if (existingItem) {
      return NextResponse.json(
        { message: "Ya existe un alimento con ese nombre" },
        { status: 400 }
      );
    }
    const newItem = new ShoppingItem({ item, houseID });
    await newItem.save();

    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating shopping item" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  await connectDB();

  try {
    const { id, checked } = await request.json();
    const updatedItem = await ShoppingItem.findByIdAndUpdate(
      id,
      { checked, buyed: new Date() },
      { new: true }
    );

    //Los items se eliminan en un dia si estan marcados como checked
    if (checked) {
      setTimeout(async () => {
        await ShoppingItem.findByIdAndDelete(id);
      }, 86400000);
    }

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error updating shopping item" },
      { status: 500 }
    );
  }
}
export async function DELETE(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const houseID = searchParams.get("houseID");

    if (houseID === "_all") {
      await ShoppingItem.deleteMany();
      return NextResponse.json("Lista eliminada", { status: 200 });
    }
    await ShoppingItem.deleteMany({ houseID, checked: true });
    return NextResponse.json("Lista eliminada", { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error deleting shopping item" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const houseID = searchParams.get("houseID");
    const shoppingList = await ShoppingItem.find({ houseID: houseID });

    return NextResponse.json(shoppingList, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching shopping list" },
      { status: 500 }
    );
  }
}
