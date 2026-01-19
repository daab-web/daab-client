import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

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
    <Card className="flex h-full flex-col items-center text-center">
      <CardHeader className="items-center">
        <div className="relative h-48 w-48 overflow-hidden rounded-lg bg-muted">
          <Image
            src={imageSrc}
            alt={name}
            fill
            sizes="(max-width: 640px) 12rem, 12rem"
            className="object-cover"
            priority={false}
          />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col items-center gap-2">
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
        <CardDescription className="text-sm text-foreground">
          {role}
        </CardDescription>
        {subtitle ? (
          <CardDescription className="text-sm text-foreground">
            {subtitle}
          </CardDescription>
        ) : null}
        <CardDescription className="text-sm">{country}</CardDescription>
      </CardContent>
    </Card>
  );
}
