"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Check,
  ChevronsUpDown,
  Copy,
  HomeIcon,
  HouseIcon,
  LogOut,
  Settings,
  ShoppingCartIcon,
  Triangle,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { useRouter } from "next/navigation";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import React, { use, useEffect, useRef } from "react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CommandList } from "cmdk";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Playfair_Display } from "next/font/google";
import { Switch } from "@/components/ui/switch";
import Typewriter, { TypewriterClass } from "typewriter-effect";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import { useMediaQuery } from "react-responsive";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const playfair = Playfair_Display({
  weight: "700",
  subsets: ["latin"],
  style: "italic",
  display: "swap",
});

const mealPreference = [
  {
    value: "always",
    label: "Siempre",
  },
  {
    value: "never",
    label: "Nunca",
  },
];

export default function Home() {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [mealValue, setMealValue] = React.useState("always");
  const [defaultMeal, setDefaultMeal] = React.useState("always");

  const changeMealValue = async (value: string) => {
    setMealValue(value);

    try {
      await axios.post("/api/meal", {
        houseID,
        user: username,
        confirmed: value === "always",
      });

      if (value === "always") {
        typewriterRef.current
          ?.deleteAll(15)
          .typeString("Ok, te vere en la mesa")
          .start();
      } else {
        typewriterRef.current
          ?.deleteAll(15)
          .typeString("Ok, come bien fuera")
          .start();
      }
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

  const getMealValue = async () => {
    try {
      const response = await axios.get(
        `/api/meal?user=${localStorage.getItem("username")}`
      );
      setMealValue(response.data.confirmed ? "always" : "never");
    } catch (error: any) {
      if (error.response) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.response.data.message,
        });
      }
    }
  };

  const changeDefaultMeal = async (value: string) => {
    try {
      await axios.put("/api/auth/login", {
        username,
        houseID,
        defaultMeal: value === "always",
      });

      setDefaultMeal(value);
      localStorage.setItem("defaultMeal", value);
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

  const typewriterRef = useRef<TypewriterClass | null>(null);

  const [username, setUsername] = React.useState("");
  const [houseID, setHouseID] = React.useState("");
  const [onHouse, setOnHouse] = React.useState(false);

  useEffect(() => {
    const house = localStorage.getItem("houseID");

    setHouseID(() => {
      return house === null || house === "undefined" ? "" : house;
    });
    setUsername(localStorage.getItem("username") || "");
    setDefaultMeal(localStorage.getItem("defaultMeal") || "");
    if (house != null && house != "undefined" && house != "") {
      setOnHouse(true);
      getMealValue();
    }
  }, []);

  const logOut = () => {
    localStorage.clear();
    router.push("/auth/login");
  };

  const createHouse = async () => {
    try {
      const response = await axios.post("/api/house", {
        houseID,
      });
      localStorage.setItem("houseID", houseID);
      setMealValue("always");
      setOnHouse(true);
      await axios.put("/api/auth/login", {
        username,
        houseID,
        defaultMeal: defaultMeal === "always",
      });
      toast({
        description: (
          <div className="flex justify-between items-center space-x-4">
            <p>Hogar creado con exito</p>
            <Check className="absolute right-5"></Check>
          </div>
        ),
      });
      await axios.post("/api/meal", {
        houseID,
        user: username,
        confirmed: true,
      });
      typewriterRef.current
        ?.deleteAll(15)
        .typeString("Hola, en que puedo ayudarte?")
        .start();
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
  const joinHouse = async () => {
    try {
      const response = await axios.get(`/api/house/?houseID=${houseID}`);
      localStorage.setItem("houseID", houseID);
      setOnHouse(true);

      await axios.put("/api/auth/login", {
        username,
        houseID,
        defaultMeal: defaultMeal === "always",
      });
      toast({
        description: (
          <div className="flex justify-between items-center space-x-4">
            <p>Te has unido con exito!</p>
            <Check className="absolute right-5"></Check>
          </div>
        ),
      });
      await axios.post("/api/meal", {
        houseID,
        user: username,
        confirmed: true,
      });
      setMealValue("always");
      typewriterRef.current
        ?.deleteAll(15)
        .typeString("Hola, en que puedo ayudarte?")
        .start();
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
      <div className="flex flex-col items-center justify-between  h-[100dvh] w-full  max-w-[768px] bg-background">
        <div className="p-10 w-full flex justify items-center space-x-5 ">
          <h1 className="text-4xl font-black text-left">Hogar</h1>
          <HouseIcon size={40}></HouseIcon>
        </div>
        <div
          className="relative flex items-start justify-start rounded-l-lg  ml-10 w-[80%] h-[20dvh] p-5 text-left text-2xl text-wrap bg-primary text-background outline-2 outline-offset-2 outline outline-primary   self-end "
          style={{ fontFamily: playfair.style.fontFamily }}
        >
          <Typewriter
            options={{ cursor: "_", delay: 30 }}
            onInit={(typewriter) => {
              typewriterRef.current = typewriter;
              typewriter
                .typeString(
                  !onHouse
                    ? "Por favor, indique el HouseID en ajustes para continuar"
                    : "Hola, en que puedo ayudarte?"
                )
                .start();
            }}
          />
        </div>

        <div className="mb-4 space-y-10  flex-col flex min-h-[60dvh] w-full p-10  ">
          <Button
            onClick={() => router.push("/home/shopping-list")}
            className="flex-1 space-x-6 hover:scale-110 transition-all "
            disabled={!onHouse}
          >
            <p className="text-2xl font-bold text-left ">
              Lista de <br></br> la Compra{" "}
            </p>{" "}
            <ShoppingCartIcon size={40} />
          </Button>
          <Button
            onClick={() => router.push("/home/meal-assitance")}
            variant="outline"
            disabled={!onHouse}
            className="flex-1  space-x-6 hover:scale-110 transition-all"
          >
            <p className="text-2xl font-bold text-left">
              Quien viene a<br></br> comer?{" "}
            </p>{" "}
            <UtensilsCrossed size={40} />
          </Button>

          <div className="flex flex-1 max-h-[15%] space-x-4">
            <div className="flex justify-between items-center border-2 bg-primary-foreground  rounded-lg w-[70%] px-4 relative overflow-hidden">
              <p className="font-semibold flex items-center space-x-2  ">
                Voy a comer {new Date().getHours() >= 20 ? "mañana" : "hoy"}
              </p>{" "}
              <Switch
                onClick={() =>
                  changeMealValue(mealValue === "always" ? "never" : "always")
                }
                checked={mealValue === "always"}
                disabled={!onHouse}
              ></Switch>
              {!onHouse && (
                <div className="w-[110%] h-[110%] absolute bg-black -bottom-1 -left-1 opacity-50"></div>
              )}
            </div>
            <Dialog>
              <DialogTrigger asChild className="flex-1 h-full">
                <Button className="bg-red-500">
                  <LogOut></LogOut>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md space-y-2  max-w-[90%] rounded-lg">
                <DialogHeader>
                  <DialogTitle>Seguro que quieres salir ?</DialogTitle>
                </DialogHeader>

                <Button
                  type="submit"
                  variant="destructive"
                  className="px-3"
                  onClick={logOut}
                >
                  <span>Cerrar Sesion</span>
                </Button>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        <div className="self-end w-full ">
          <Drawer>
            <DrawerTrigger className="text-xl font-black text-primary-foreground flex items-center justify-center space-x-2 w-full h-20 rounded-b-none rounded-t-xl bg-primary">
              <Settings />
              <p>Ajustes</p>
            </DrawerTrigger>

            <DrawerContent className="flex  items-center">
              <div className="max-w-[768px] w-full">
                <DrawerHeader>
                  <DrawerTitle className="py-4">Preferencias</DrawerTitle>

                  <div className="flex items-center space-x-4 py-4">
                    <DrawerDescription className="text-left ">
                      Asistencia a comidas por defecto
                    </DrawerDescription>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[200px] justify-between"
                        >
                          {
                            mealPreference.find(
                              (framework) => framework.value === defaultMeal
                            )?.label
                          }
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {mealPreference.map((framework) => (
                                <CommandItem
                                  key={framework.value}
                                  value={framework.value}
                                  onSelect={(currentValue) => {
                                    changeDefaultMeal(currentValue);
                                    setOpen(false);
                                    toast({
                                      description: (
                                        <div className="flex justify-between items-center space-x-4">
                                          <p>
                                            Preferencia actualizada a{" "}
                                            <span className="font-bold">
                                              {" "}
                                              {framework.label}
                                            </span>
                                          </p>
                                          <Check className="absolute right-5"></Check>
                                        </div>
                                      ),
                                    });
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      defaultMeal === framework.value
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                  {framework.label}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                  <DrawerTitle className="py-4">Ajustes de Hogar</DrawerTitle>
                  <DrawerDescription className="text-left ">
                    {" "}
                    Crea un Hogar o unete a uno con su ID
                  </DrawerDescription>

                  <div className="flex flex-col items-center space-y-4 py-4">
                    <Input
                      type="text"
                      placeholder="House ID"
                      value={houseID}
                      onChange={(e) => setHouseID(e.target.value)}
                    />
                    <div className="flex space-x-4 w-full">
                      <Button
                        type="submit"
                        className="grow"
                        onClick={joinHouse}
                      >
                        Unirse
                      </Button>
                      <Button
                        type="submit"
                        variant="outline"
                        onClick={createHouse}
                      >
                        Crear
                      </Button>
                    </div>
                  </div>
                </DrawerHeader>
                <DrawerFooter>
                  <DrawerClose>
                    <Button variant="destructive" className="w-full">
                      Atras
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
    </div>
  );
}
