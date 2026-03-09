import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "./ui/separator";
import { MapPin } from "lucide-react";

export type DirectorCardProps = {
  name: string;
  role: string;
  subtitle?: string;
  country: string;
  imageSrc: string;
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
  return (
    <Card className="group flex h-full flex-col items-center text-center bg-card/80 backdrop-blur-sm overflow-hidden border border-border/40 shadow-md hover:shadow-2xl hover:border-[#1e3a6e]/60 transition-all duration-500 ease-out hover:-translate-y-2 hover:scale-[1.02]">
      <div className="relative w-full aspect-square bg-muted overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-background/90 via-background/20 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          priority={false}
        />
      </div>
      <CardContent className="flex flex-1 justify-between flex-col items-center gap-3 pt-5 pb-4 px-4 w-full">
        <div className="space-y-2 w-full">
          <CardTitle className="text-lg font-bold text-foreground leading-tight group-hover:text-[#1e3a6e] transition-colors duration-300">
            {profileUrl ? (
              <Link
                href={profileUrl}
                className="hover:underline decoration-2 underline-offset-2"
                target="_blank"
                rel="noopener noreferrer"
              >
                {name}
              </Link>
            ) : (
              name
            )}
          </CardTitle>

          <div className="inline-block px-3 py-1 rounded-full bg-[#1e3a6e]/10 border border-[#1e3a6e]/30 group-hover:bg-[#1e3a6e]/20 transition-colors duration-300">
            <CardDescription className="text-xs font-semibold text-[#1e3a6e] uppercase tracking-wide">
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
          <MapPin className="h-4 w-4 shrink-0 group-hover:text-[#1e3a6e] transition-colors duration-300" />
          <CardDescription className="text-sm font-medium">
            {country}
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
