"use client";

import AvatarMenu from "@/components/Avatar";
import Image from "next/image";
import { useClientProvider } from "./client-provider";

export default function Navigation() {
  const { setOpenSignUp } = useClientProvider();
  return (
    <nav className="border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <Image
              src="/logo.png"
              alt="AWS Quiz Logo"
              width={34}
              height={34}
              className="rounded-lg"
            />
            <span className="text-xl font-bold">AWS Exam</span>
          </div>
          <AvatarMenu setOpen={setOpenSignUp} />
        </div>
      </div>
    </nav>
  );
}
