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
    <Card className="flex h-full flex-col items-center text-center bg-transparent backdrop-blur-sm overflow-hidden border border-[#1e3a6e]">
      <div className="relative w-full aspect-square bg-muted">
        <Image
          src={imageSrc}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, 25vw"
          className="object-cover"
          priority={false}
        />
      </div>
      <CardContent className="flex flex-1 justify-between flex-col items-center gap-2 pt-4 w-full">
        <CardTitle className="text-lg font-semibold text-primary">
          {profileUrl ? (
            <Link
              href={profileUrl}
              className="hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              {name}
            </Link>
          ) : (
            name
          )}
        </CardTitle>
        <CardDescription className="text-sm text-foreground flex-1">
          {role}
        </CardDescription>
        {subtitle ? (
          <CardDescription className="text-sm text-foreground flex-1">
            {subtitle}
          </CardDescription>
        ) : null}

        <Separator />
        <CardDescription className="text-sm self-start flex gap-2 text-end">
          <MapPin className="h-4 w-4"/>
          {country}
        </CardDescription>
      </CardContent>
    </Card>
  );
}
