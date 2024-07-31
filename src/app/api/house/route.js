// src/app/api/houses/route.js
import House from "@/model/House";
import connectDB from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(request) {
  await connectDB();

  try {
    const { houseID } = await request.json();

    if (!houseID) {
      return NextResponse.json(
        { message: "El HouseID esta vacio" },
        { status: 400 }
      );
    }

    const existingHouseID = await House.findOne({ houseID });

    if (existingHouseID) {
      return NextResponse.json(
        { message: "Ese hogar ya existe" },
        { status: 400 }
      );
    }

    const house = new House({ houseID });
    await house.save();

    return NextResponse.json(houseID, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error creating house" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectDB();

  try {
    const { searchParams } = new URL(request.url);
    const houseID = searchParams.get("houseID");

    const house = await House.findOne({ houseID });

    if (!house) {
      return NextResponse.json(
        { message: "Ese Hogar no existe aun" },
        { status: 400 }
      );
    }

    return NextResponse.json(house, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Error fetching house" },
      { status: 500 }
    );
  }
}
