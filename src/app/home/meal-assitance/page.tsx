"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import axios from "axios";
import { Donut, SkipBack, Undo2, UtensilsCrossed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MealAssitance() {
  const router = useRouter();
  const [assistance, setAssistance] = useState<string[]>([]);
  const [fetched, setFetched] = useState(false);
  interface HouseRecord {
    _id: string;
    houseID: string;
    user: string;
    date: string;
    confirmed: boolean;
    __v: number;
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `/api/meal?houseID=${localStorage.getItem("houseID")}`
        );
        //await 1 second
        await new Promise((resolve) => setTimeout(resolve, 500));
        const confirmedUsers: string[] = (response.data as HouseRecord[])
          .filter((record: HouseRecord) => record.confirmed)
          .map((record: HouseRecord) => record.user);

        setAssistance(confirmedUsers);
        setFetched(true);
      } catch (error: any) {
        if (error.response) {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.response.data.message,
          });
        } else {
          toast({
            title: "Error",
            description: "An unexpected error occurred",
          });
        }
      }
    };

    fetchData();
  }, []);

  return (
    <div className={" flex justify-center "}>
      <div className="flex flex-col items-center justify-centers h-[100dvh] p-10 pb-0 space-y-10 max-w-[768px] w-full">
        <div className=" w-full flex justify-start items-center space-x-5 ">
          <h1 className="text-4xl font-black text-left">Asistencia</h1>
          <UtensilsCrossed size={40}></UtensilsCrossed>
        </div>

        <div className="flex flex-1 flex-col space-y-5 w-full">
          {!fetched ? (
            <>
              <Skeleton className="flex items-center justify-between w-full h-20 border-4 bg-primary-foreground rounded-xl p-4 space-x-4">
                <Skeleton className="h-4 w-[250px]" />

                <Skeleton className="w-12 h-12 max-h-10 rounded-full"></Skeleton>
              </Skeleton>
              <Skeleton className="flex items-center justify-between w-full h-20 border-4 bg-primary-foreground rounded-xl p-4 space-x-4">
                <Skeleton className="h-4 w-[250px]" />

                <Skeleton className="w-12 h-12 max-h-10 rounded-full"></Skeleton>
              </Skeleton>
              <Skeleton className="flex items-center justify-between w-full h-20 border-4 bg-primary-foreground rounded-xl p-4 space-x-4">
                <Skeleton className="h-4 w-[250px]" />

                <Skeleton className="w-12 h-12 max-h-10 rounded-full"></Skeleton>
              </Skeleton>
              <Skeleton className="flex items-center justify-between w-full h-20 border-4 bg-primary-foreground rounded-xl p-4 space-x-4">
                <Skeleton className="h-4 w-[250px]" />

                <Skeleton className="w-12 h-12 max-h-10 rounded-full"></Skeleton>
              </Skeleton>
            </>
          ) : assistance.length === 0 ? (
            <div className="flex flex-col items-center w-full h-full justify-center space-y-10">
              <Donut size={100} strokeWidth={1}></Donut>
              <p className="text-xl font-bold w-[50%] text-center ">
                {" "}
                Parece que nadie come hoy...
              </p>
            </div>
          ) : (
            assistance.map((name, index) => (
              <section
                key={index}
                className="flex items-center justify-between w-full h-20 border-4 bg-primary-foreground rounded-xl p-4"
              >
                <p className="text-xl">
                  <span className="font-bold">{name}</span> va a comer{" "}
                  {
                    /*Si es mas tarde de las 20:00 poner mañana, sino hoy */
                    new Date().getHours() >= 20 ? "mañana " : "hoy "
                  }
                  -{" "}
                  <span className="italic">
                    {new Date().toLocaleDateString()}
                  </span>
                </p>
                <Avatar>
                  <AvatarFallback>{name.charAt(0)}</AvatarFallback>
                </Avatar>
              </section>
            ))
          )}
        </div>
        <Button
          className="max-w-[768px] sticky  min-h-20 bottom-0 text-xl font-black text-primary-foreground flex items-center justify-center space-x-2 w-screen rounded-b-none rounded-t-xl bg-primary"
          onClick={() => {
            router.push("/home");
          }}
        >
          <Undo2 />
          <p>Volver</p>
        </Button>
      </div>
    </div>
  );
}
