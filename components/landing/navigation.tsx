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

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How it Works", href: "#how" },
  { label: "Certificates", href: "/certificates" },
];

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const isAnchor = href.startsWith("#");

  if (isAnchor) {
    return (
      <a
        href={href}
        className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
      >
        {children}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className="text-gray-300 hover:text-white transition-colors text-sm font-medium"
    >
      {children}
    </Link>
  );
}

export default function Navigation() {
  const { setOpenSignUp } = useClientProvider();
  return (
    <nav className="border-b border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo />

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          <AvatarMenu setOpen={setOpenSignUp} />
        </div>
      </div>
    </nav>
  );
}
