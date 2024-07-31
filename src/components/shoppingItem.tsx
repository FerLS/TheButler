import React from "react";
import { Checkbox } from "./ui/checkbox";

export type ShoppingItemType = {
  id: string;
  name: string;
};

type ShoppingItemProps = {
  id: string;
  name: string;
  checked: boolean;
  onCheck: (id: string, checked: boolean) => void;
};

export default function ShoppingItem({
  id,
  name,
  checked,
  onCheck,
}: ShoppingItemProps) {
  const handleClick = () => {
    onCheck(id, !checked);
  };

  return (
    <div className="flex items-center justify-between w-full relative">
      <p className={`font-bold ${checked ? "opacity-55" : ""}`}>{name}</p>
      <Checkbox
        className="rounded-full h-5 w-5"
        onClick={handleClick}
        checked={checked}
      ></Checkbox>

      {checked && (
        <div className="h-[2px] w-[90%] bg-secondary rounded-e-full left-0 absolute opacity-80"></div>
      )}
    </div>
  );
}
