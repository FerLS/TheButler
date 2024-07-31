"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Club, Diamond, Heart, Spade } from "lucide-react";
import { useEffect } from "react";

const HomePage = () => {
  const router = useRouter();

  useEffect(() => {
    if (localStorage.getItem("username")) {
      router.push("/home");
    }
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-[100dvh] py-2">
      <h1 className="text-6xl font-bold mb-4">TheButler</h1>
      <div className="mb-4 space-y-2 flex-col">
        <Button
          onClick={() => router.push("/auth/login")}
          className="mr-2"
          size="lg"
        >
          Login
        </Button>
        <Button
          onClick={() => router.push("/auth/register")}
          variant="outline"
          size="lg"
        >
          Register
        </Button>
      </div>
      <Spade
        size={50}
        strokeWidth={1}
        className="absolute left-[5vh] top-[5vh]"
      />
      <Diamond
        size={50}
        strokeWidth={1}
        className="absolute right-[5vh] top-[5vh]"
      />
      <Heart
        size={50}
        strokeWidth={1}
        className="absolute left-[5vh] bottom-[5vh]"
      />
      <Club
        size={50}
        strokeWidth={1}
        className="absolute right-[5vh] bottom-[5vh]"
      />
    </div>
  );
};

export default HomePage;
