import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/navigation";
import { Separator } from "./ui/separator";
import { MapPin, UserRound } from "lucide-react";

export type DirectorCardProps = {
  name: string;
  role: string;
  subtitle?: string;
  country: string;
  imageSrc?: string;
  profileUrl?: string;
};

export function DirectorCard({
  name,
  role,
  subtitle,
  country,
  imageSrc,
  profileUrl,
}: DirectorCardProps) {
  const content = (
    <Card className="group py-0 flex h-full flex-col items-center overflow-hidden border border-border/40 bg-card/80 text-center shadow-md backdrop-blur-sm transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02] hover:border-[#3B5998]/60 hover:shadow-2xl">
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={name}
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
            <UserRound className="h-16 w-16" />
          </div>
        )}
      </div>
      <CardContent className="flex flex-1 justify-between flex-col items-center gap-3 pt-5 pb-4 px-4 w-full">
        <div className="space-y-2 w-full">
          <CardTitle className="text-lg font-bold text-foreground leading-tight transition-colors duration-300 group-hover:text-[#3B5998]">
            {name}
          </CardTitle>

          <div className="inline-block px-3 py-1 rounded-full bg-[#3B5998]/10 border border-[#3B5998]/30 group-hover:bg-[#3B5998]/20 transition-colors duration-300">
            <CardDescription className="text-xs font-semibold text-[#3B5998] uppercase tracking-wide">
              {role}
            </CardDescription>
          </div>
        </div>

        {subtitle ? (
          <CardDescription className="text-sm text-muted-foreground leading-relaxed min-h-10 flex items-center">
            {subtitle}
          </CardDescription>
        ) : (
          <div className="min-h-10" />
        )}

        <Separator className="my-1" />

        <div className="w-full flex items-center gap-2 text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          <MapPin className="h-4 w-4 shrink-0 group-hover:text-[#3B5998] transition-colors duration-300" />
          <CardDescription className="text-sm font-medium">
            {country}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );

  if (profileUrl) {
    return (
      <Link href={profileUrl} className="block h-full">
        {content}
      </Link>
    );
  }

  return content;
}
