"use client";

import { use, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("username")) {
      router.push("/home");
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });
      localStorage.setItem(
        "houseID",
        response.data.houseID === null ? "" : response.data.houseID
      );
      localStorage.setItem("username", username);
      localStorage.setItem(
        "defaultMeal",
        response.data.defaultMeal ? "always" : "never"
      );
      router.push("/home");
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
    <div className="flex justify-center items-center h-screen flex-col space-y-5 p-10 ">
      <h1 className="text-4xl font-bold">Login</h1>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="max-w-96"
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="max-w-96"
      />
      <Button onClick={handleLogin}>Login</Button>
    </div>
  );
};

export default Login;
