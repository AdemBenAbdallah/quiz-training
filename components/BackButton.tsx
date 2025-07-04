import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackButton({ href }: { href: string }) {
  return (
    <Link href={href} aria-label="Go back" tabIndex={0} className="inline-flex">
      <Button className="flex items-center gap-2" type="button">
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        Back
      </Button>
    </Link>
  );
}
