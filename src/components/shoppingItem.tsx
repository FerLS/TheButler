import React from "react";
import { Checkbox } from "./ui/checkbox";

export type ShoppingItemType = {
  id: string;
  name: string;
  checked: boolean;
  added: Date;
  buyed: Date;
};

type ShoppingItemProps = {
  id: string;
  name: string;
  checked: boolean;
  added: Date;
  buyed: Date;
  onCheck: (id: string, checked: boolean) => void;
};

export default function ShoppingItem({
  id,
  name,
  checked,
  added,
  buyed,

  onCheck,
}: ShoppingItemProps) {
  const handleClick = () => {
    onCheck(id, !checked);
  };

  return (
    <div className="flex items-center justify-between w-full relative max-w-full ">
      <p
        className={`font-bold truncate w-full  ${checked ? "opacity-55" : ""}`}
      >
        {name}
      </p>
      <p className="text-right mx-2 italic opacity-50 text-sm   ">
        {!checked
          ? new Date(added).toLocaleDateString()
          : "Comprado el " + new Date(buyed).toLocaleDateString()}
      </p>

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
