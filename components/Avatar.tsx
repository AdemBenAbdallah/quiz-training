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
import Link from "next/link";
import { LogOut, User } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useUser } from "@/hook/useUser";
import { useRouter } from "next/navigation";

const AvatarMenu = ({ setOpen }: { setOpen: (open: boolean) => void }) => {
  const { session } = useUser();
  const router = useRouter();

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
          router.push("/");
        },
      },
    });
  };

  return (
    <div className="flex items-center justify-center">
      {session ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src={session.user.image ?? ""} />
              <AvatarFallback>{getName()}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-48" align="end">
            <DropdownMenuLabel>{session.user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <Link href="/levels">
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Levels</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button
          onClick={() => setOpen(true)}
          className="border border-white text-black font-semibold px-4 py-4 text-md rounded-xl transition-all duration-200 hover:scale-105"
        >
          Sign Up
        </Button>
      )}
    </div>
  );
};

export default AvatarMenu;
