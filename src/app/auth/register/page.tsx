"use client";

import { use, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

const Register = () => {
  const { toast } = useToast();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (localStorage.getItem("username")) {
      router.push("/home");
    }
  }, []);

  const handleRegister = async (e: any) => {
    e.preventDefault();

    try {
      await axios.post("/api/auth/register", { username, password });
      router.push("/auth/login");
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
      <h1 className="text-4xl font-bold">Register</h1>
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
      <Button onClick={handleRegister}>Register</Button>
    </div>
  );
};

export default Register;
