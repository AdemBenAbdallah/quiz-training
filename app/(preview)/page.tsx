"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Frown, Lock } from "lucide-react";
import useLocalStorage from "@/hook/useLocalStorage";
import { LevelParts, TLevelParts } from "./parts";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { containerVariants, itemVariants } from "@/lib/variants";

export default function HomePage() {
  const [levelParts] = useLocalStorage<TLevelParts>("levelParts", LevelParts);
  const router = useRouter();
  const {
    data: session,
    isPending, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  if (!levelParts) {
    // You can render a loading spinner here if you'd like
    return null;
  }
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push("/signup");
        },
      },
    });
  };

  return (
    <div className="w-full min-h-screen bg-black flex flex-col items-center justify-center p-8 overflow-y-auto">
      <div className="fixed top-0 w-full z-20 px-10 py-8 flex gap-3">
        {!session ? (
          <Button
            className="text-white bg-orange-900"
            onClick={() => redirect("/signup")}
          >
            SingUp
          </Button>
        ) : (
          <Button className="text-white bg-orange-900" onClick={handleSignOut}>
            SingOut
          </Button>
        )}

        <Button
          className="text-white bg-orange-900"
          onClick={() => router.push("/levels")}
        >
          Levels Page
        </Button>
      </div>
    </div>
  );
}
