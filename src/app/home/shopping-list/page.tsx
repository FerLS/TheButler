"use client";
import { Button } from "@/components/ui/button";
import { Donut, Undo2, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ShoppingList = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-between  h-[100dvh] ">
      <div className="flex items-center justify-center flex-1 flex-col space-y-4">
        <Wrench size={100} strokeWidth={1}></Wrench>

        <h1 className="text-xl font-extrabold ">En trabajo...</h1>
      </div>
      <Button
        className="absolute bottom-0 text-xl font-black text-primary-foreground flex items-center justify-center space-x-2 w-screen h-20 rounded-b-none rounded-t-xl bg-primary"
        onClick={() => {
          router.push("/home");
        }}
      >
        <Undo2 />
        <p>Volver</p>
      </Button>{" "}
    </div>
  );
};

export default ShoppingList;
