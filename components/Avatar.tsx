"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/useUser";
import { authClient } from "@/lib/auth-client";
import { BookOpen, Home, LogOut, Trophy } from "lucide-react";
import Link from "next/link";

const AvatarMenu = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { session, isLoading } = useUser();

  const getName = () => {
    if (!session?.user?.name) return "";
    const name = session.user.name.split(" ");
    return (
      name[0].charAt(0).toUpperCase() + (name[1]?.charAt(0).toUpperCase() ?? "")
    );
  };

  const handleLogout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          if (typeof window !== "undefined") {
            window.location.href = "/";
          }
        },
      },
    });
  };

  if (isLoading) {
    return (
      <div className="w-10 h-10 rounded-full bg-neutral-300 animate-pulse" />
    );
  }

  return (
    <div className="flex items-center justify-center">
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer ring-2 ring-primary/50 transition-all duration-200 hover:scale-105">
              <AvatarImage src={session.user.image ?? ""} />
              <AvatarFallback className="bg-gradient-to-br from-primary-500 to-primary-600 text-primary-foreground font-semibold">
                {getName()}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-2xl border border-white/10 bg-gradient-to-b from-neutral-900/95 via-black/95 to-black/95 backdrop-blur-xl shadow-2xl"
            align="end"
          >
            <DropdownMenuLabel className="font-normal p-4 pb-2">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none text-white">
                  {session.user.name}
                </p>
                <p className="text-xs leading-none text-gray-300">
                  {session.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10 mx-4" />

            {/* Navigation Items */}
            <div className="py-2 px-2">
              <Link href="/">
                <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-white/10 focus:bg-white/10 transition-all duration-200 p-3">
                  <Home className="mr-3 h-4 w-4 text-gray-300" />
                  <span className="text-white font-medium">Home</span>
                </DropdownMenuItem>
              </Link>

              <Link href="/certificates">
                <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-white/10 focus:bg-white/10 transition-all duration-200 p-3">
                  <BookOpen className="mr-3 h-4 w-4 text-gray-300" />
                  <span className="text-white font-medium">
                    All Certificates
                  </span>
                </DropdownMenuItem>
              </Link>
            </div>

            <DropdownMenuSeparator className="bg-white/10 mx-4" />

            {/* Secondary Actions */}
            <div className="py-2 px-2">
              <DropdownMenuItem className="cursor-pointer rounded-xl hover:bg-white/10 focus:bg-white/10 transition-all duration-200 p-3">
                <Trophy className="mr-3 h-4 w-4 text-gray-300" />
                <span className="text-white font-medium">Achievements</span>
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="bg-white/10 mx-4" />

            {/* Logout */}
            <div className="py-2 px-2">
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer rounded-xl hover:bg-red-500/20 focus:bg-red-500/20 text-red-400 focus:text-red-300 transition-all duration-200 p-3"
              >
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-medium">Sign Out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          variant="default"
          className="font-semibold px-4 py-2.5 text-md rounded-xl"
        >
          Sign In
        </Button>
      )}
    </div>
  );
};

export default AvatarMenu;
