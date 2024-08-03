"use client";
import ShoppingItem, { ShoppingItemType } from "@/components/shoppingItem";
import { Button } from "@/components/ui/button";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import axios from "axios";
import {
  Coffee,
  Delete,
  Donut,
  Notebook,
  Pizza,
  Plus,
  Refrigerator,
  ShoppingCart,
  Trash,
  Undo2,
  Wrench,
} from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const ShoppingList = () => {
  const router = useRouter();

  const [shoppingList, setShoppingList] = useState<ShoppingItemType[]>([]);

  const checkedItemsList = shoppingList.filter((item) => item.checked);
  const uncheckedItemsList = shoppingList.filter((item) => !item.checked);

  const [houseID, setHouseID] = useState("");
  const [itemName, setItemName] = useState("");

  interface ShoppingRecord {
    _id: string;
    item: string;
    houseID: string;
    checked: boolean;
    __v: number;
  }

  const handleCheck = (id: string, checked: boolean) => {
    try {
      setShoppingList((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, checked: checked } : item
        )
      );
      axios.put(`/api/shopping/`, { id: id, checked: checked });
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

  const fetchShoppingList = async () => {
    try {
      const response = await axios.get(
        `/api/shopping/?houseID=${localStorage.getItem("houseID")}`
      );
      const shoppingList: ShoppingItemType[] = (
        response.data as ShoppingRecord[]
      ).map((record: ShoppingRecord) => ({
        id: record._id,
        name: record.item,
        checked: record.checked,
      }));

      setShoppingList(shoppingList);

      const checkedItems: { [key: string]: boolean } = {};
      shoppingList.forEach((item) => {
        checkedItems[item.id] = item.checked;
      });
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

  const handleAddItem = async () => {
    try {
      const response = await axios.post(`/api/shopping`, {
        item: itemName,
        houseID: houseID,
      });

      const newRecord: ShoppingRecord = response.data;
      setShoppingList((prev) => [
        ...prev,
        { id: newRecord._id, name: newRecord.item, checked: newRecord.checked },
      ]);
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
  const handleClean = async () => {
    try {
      await axios.delete(`/api/shopping/`, {
        params: {
          houseID: houseID,
        },
      });
      fetchShoppingList();
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
    setHouseID(localStorage.getItem("houseID") || "");
    fetchShoppingList();
  }, []);

  return (
    <div className={" flex justify-center "}>
      <div className="flex flex-col items-center justify-centers h-[100dvh]   max-w-[768px] w-full">
        <div className=" w-full flex justify-start items-center space-x-5 pl-10 pt-10">
          <h1 className="text-4xl font-black text-left">La Compra</h1>
          <ShoppingCart size={40}></ShoppingCart>
        </div>
        <div className=" flex items-center justify-start flex-1 flex-col  bg-primary-foreground w-full  rounded-t-xl mt-10   ">
          {/*  <Wrench size={100} strokeWidth={1}></Wrench>

        <h1 className="text-xl font-extrabold ">En trabajo...</h1> */}
          <div className="p-10 w-full space-y-10 flex-1 ">
            {shoppingList.length === 0 ? (
              <div className="flex justify-center items-center flex-col h-full space-y-10">
                <Notebook size={100} strokeWidth={1}></Notebook>

                <h1 className="text-xl font-extrabold text-center ">
                  La lista de la <br></br>compra esta vacia
                </h1>
              </div>
            ) : (
              <>
                {" "}
                <div className="w-full space-y-5 flex flex-col ">
                  <h2 className="font-bold text-xl w-full text-right">
                    Sin Comprar
                  </h2>

                  {uncheckedItemsList.length === 0 ? (
                    <div className="flex justify-between  opacity-75">
                      <p className="font-semibold">La nevera esta llena!</p>
                      <Refrigerator> </Refrigerator>
                    </div>
                  ) : (
                    <>
                      {uncheckedItemsList.map((item) => (
                        <>
                          {uncheckedItemsList.indexOf(item) !== 0 && (
                            <Separator />
                          )}

                          <ShoppingItem
                            key={item.id}
                            id={item.id}
                            name={item.name}
                            checked={
                              shoppingList.find((i) => i.id === item.id)
                                ?.checked || false
                            }
                            onCheck={handleCheck}
                          />
                        </>
                      ))}
                    </>
                  )}
                </div>
                <Separator className="bg-primary h-1 rounded-full" />
                <div className="w-full space-y-5 flex flex-col ">
                  <h2 className="font-bold text-xl w-full text-right">
                    Comprados
                  </h2>

                  {checkedItemsList.length === 0 ? (
                    <div className="flex justify-between  opacity-75">
                      <p className="font-semibold">Rellenando la despensa...</p>
                      <Coffee> </Coffee>
                    </div>
                  ) : (
                    <>
                      {checkedItemsList.map((item) => (
                        <ShoppingItem
                          key={item.id}
                          id={item.id}
                          name={item.name}
                          checked={
                            shoppingList.find((i) => i.id === item.id)
                              ?.checked || false
                          }
                          onCheck={handleCheck}
                        />
                      ))}
                    </>
                  )}
                </div>
              </>
            )}
          </div>
          <div className="bottom-0 sticky w-full flex-col flex space-y-2 px-2 ">
            <Dialog>
              <DialogTrigger asChild className="flex-1 h-full">
                <Button
                  className="self-end text-xl font-black  flex items-center justify-center space-x-2 h-full w-[35%] rounded-b-none rounded-xl min-h-20 "
                  variant="destructive"
                >
                  <Trash />
                  <p>Clean </p>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md space-y-2  max-w-[90%] rounded-lg">
                <DialogHeader>
                  <DialogTitle>
                    Borrar todos los alimentos comprados?
                  </DialogTitle>
                </DialogHeader>

                <DialogClose className="min-w-full">
                  <Button
                    type="submit"
                    variant="destructive"
                    className="px-3 w-full"
                    onClick={handleClean}
                  >
                    <span>Borrar</span>
                  </Button>
                </DialogClose>
              </DialogContent>
            </Dialog>
            <div className="w-full flex min-h-20 space-x-2 h-20 ">
              <Button
                className="text-xl font-black text-primary-foreground flex items-center justify-center space-x-2 h-full w-[65%] rounded-b-none rounded-t-xl bg-primary"
                onClick={() => {
                  router.push("/home");
                }}
              >
                <Undo2 />
                <p>Volver</p>
              </Button>{" "}
              <Drawer>
                <DrawerTrigger className="text-xl font-black text-primary-foreground flex items-center justify-center space-x-2 w-[35%]   rounded-b-none rounded-t-xl bg-green-500">
                  <Plus />
                  <p>New</p>
                </DrawerTrigger>

                <DrawerContent className="flex  items-center">
                  <div className="max-w-[768px] w-full">
                    <DrawerHeader>
                      <DrawerTitle className="py-4">Nuevo Alimento</DrawerTitle>

                      <div className="flex items-center space-x-4 py-4">
                        <DrawerDescription className="text-left ">
                          Añade un alimento a la lista de la compra
                        </DrawerDescription>

                        <Input
                          className=""
                          placeholder="Nombre"
                          onChange={(e) => setItemName(e.target.value)}
                        />
                      </div>
                    </DrawerHeader>
                    <DrawerFooter>
                      <DrawerClose className="space-y-4">
                        <Button className="w-full" onClick={handleAddItem}>
                          Añadir
                        </Button>
                        <Button variant="outline" className="w-full">
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
      </div>
    </div>
  );
};

export default ShoppingList;
