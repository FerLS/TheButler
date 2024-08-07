"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import axios from "axios";
import { format } from "date-fns";
import {
  CalendarIcon,
  Donut,
  SkipBack,
  Undo2,
  UtensilsCrossed,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Switch } from "@/components/ui/switch";
import { PopoverClose } from "@radix-ui/react-popover";
import { set } from "mongoose";

export default function MealAssitance() {
  const router = useRouter();
  const [assistance, setAssistance] = useState<string[]>([]);
  const [fetched, setFetched] = useState(false);
  const [username, setUsername] = useState("");

  interface HouseRecord {
    _id: string;
    houseID: string;
    user: string;
    date: string;
    confirmed: boolean;
    __v: number;
  }
  const fetchData = async (date?: Date) => {
    try {
      setFetched(false);
      const response = await axios.get(
        `/api/meal?houseID=${localStorage.getItem("houseID")}&date=${
          date ? date.getTime() : new Date().setHours(0, 0, 0, 0)
        }`
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
  useEffect(() => {
    setUsername(localStorage.getItem("username") || "");
    handleSetDate(new Date());
  }, []);

  const [date, setDate] = useState<Date>();

  const handleSetDate = (newDate: Date | undefined) => {
    if (!newDate) {
      return;
    }

    const updatedDate = new Date(newDate);
    updatedDate.setHours(0, 0, 0, 0);
    setDate(updatedDate);

    setAssistance([]);

    fetchData(updatedDate);
  };

  const changeMealValue = async (value: boolean) => {
    try {
      await axios.post("/api/meal", {
        houseID: localStorage.getItem("houseID"),
        user: localStorage.getItem("username"),
        date: date,
        confirmed: value,
      });
      fetchData(date);
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

  return (
    <div className={" flex justify-center "}>
      <div className="flex flex-col items-center justify-centers h-[100dvh]  pb-0  max-w-[768px] w-full">
        <div className="space-y-10 p-10 w-full">
          <div className=" w-full flex justify-start items-center space-x-5 ">
            <h1 className="text-4xl font-black text-left">Asistencia</h1>
            <UtensilsCrossed size={40}></UtensilsCrossed>
          </div>

          <div className="w-full flex flex-col space-y-4">
            {" "}
            <div className="flex space-x-4 ">
              <Switch
                checked={assistance.includes(username)}
                onCheckedChange={(value) => {
                  changeMealValue(value);
                }}
              ></Switch>

              <p className="text-left w-full italic opacity-50 text-lg">
                Como en esta fecha
              </p>
            </div>
            <div className="flex justify-start space-x-2">
              {" "}
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      " justify-start text-left font-normal p-6 text-lg items-center",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    {date ? (
                      format(date, "PPP")
                    ) : (
                      <span>Selecciona una fecha</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <PopoverClose>
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={handleSetDate}
                      initialFocus
                    />
                  </PopoverClose>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        <div className="flex flex-1 flex-col space-y-5 w-full bg-primary-foreground p-10 rounded-t-xl">
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
                className="flex items-center justify-between w-full h-20 border-4 bg-card rounded-xl p-4"
              >
                <p className="text-xl">
                  <span className="font-bold">{name}</span> va a comer{" "}
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
