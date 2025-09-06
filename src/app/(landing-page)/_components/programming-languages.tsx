import { Code2 } from "lucide-react";
import Image from "next/image";

export function ProgrammingLanguages() {
  return (
    <div className="relative h-96 w-full max-w-md">
      {/* TypeScript */}
      <div className="animate-float absolute top-4 left-8">
        <div className="bg-card border-border rounded-xl border p-4 shadow-lg">
          <Image
            src="/images/hero-section/typescript.svg"
            alt="TypeScript logo"
            width={48}
            height={48}
            priority
          />
          <p className="text-muted-foreground mt-2 text-center text-xs">
            TypeScript
          </p>
        </div>
      </div>

      {/* Python */}
      <div
        className="animate-float absolute top-16 right-4"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="bg-card border-border rounded-xl border p-4 shadow-lg">
          <Image
            src="/images/hero-section/react.svg"
            alt="React logo"
            width={48}
            height={48}
            priority
          />
          <p className="text-muted-foreground mt-2 text-center text-xs">
            React
          </p>
        </div>
      </div>

      {/* Go */}
      <div
        className="animate-float absolute bottom-20 left-4"
        style={{ animationDelay: "1s" }}
      >
        <div className="bg-card border-border rounded-xl border p-4 shadow-lg">
          <Image
            src="/images/hero-section/next.svg"
            alt="Next.js logo"
            width={48}
            height={48}
            priority
            className="invert"
          />
          <p className="text-muted-foreground mt-2 text-center text-xs">
            Next.js
          </p>
        </div>
      </div>

      {/* C++ */}
      <div
        className="animate-float absolute right-8 bottom-4"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="bg-card border-border rounded-xl border p-4 shadow-lg">
          <Image
            src="/images/hero-section/hono.svg"
            alt="Hono logo"
            width={48}
            height={48}
            priority
          />
          <p className="text-muted-foreground mt-2 text-center text-xs">Hono</p>
        </div>
      </div>

      {/* Center connecting lines */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="border-primary/20 h-32 w-32 animate-pulse rounded-full border-2">
          <div className="flex h-full w-full items-center justify-center">
            <div className="bg-primary/10 flex h-16 w-16 items-center justify-center rounded-full">
              <Code2 className="text-primary h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
