import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function SocialProof({
  users,
  totalCount,
}: {
  users: Array<{ name: string; image: string | null }>;
  totalCount: number;
}) {
  const initials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex -space-x-2">
        {users.map((u, index) => (
          <Avatar key={index} className="w-8 h-8 border-2 border-white">
            <AvatarImage src={u.image || undefined} alt={u.name} />
            <AvatarFallback className="text-xs bg-gradient-to-br from-red-700 to-red-900 text-white">
              {initials(u.name)}
            </AvatarFallback>
          </Avatar>
        ))}
      </div>
      <span className="text-sm text-gray-400">
        <span className="text-white font-semibold">{totalCount}+</span> users
        already preparing
      </span>
    </div>
  );
}
