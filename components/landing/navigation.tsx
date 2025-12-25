"use client";

import AvatarMenu from "@/components/Avatar";
import Image from "next/image";
import Link from "next/link";
import { useClientProvider } from "./client-provider";

export const Logo = () => {
  return (
    <Link
      href="/"
      className="flex items-center hover:opacity-80 transition-opacity"
    >
      <Image
        src="/logo.png"
        alt="CertQuickly Logo"
        width={69}
        height={69}
        className="rounded-lg"
        suppressHydrationWarning
      />
      <span className="text-xl font-bold -translate-x-3">CertQuickly</span>
    </Link>
  );
};
export default function Navigation() {
  const { setOpenSignUp } = useClientProvider();
  return (
    <nav className="border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />
          <AvatarMenu setOpen={setOpenSignUp} />
        </div>
      </div>
    </nav>
  );
}
