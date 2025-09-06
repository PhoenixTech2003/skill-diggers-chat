import { Button } from "~/components/ui/button";
import { ProgrammingLanguages } from "./programming-languages";
import { ArrowRight, Code2 } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="flex flex-col items-center gap-12 lg:flex-row">
          {/* Left Content */}
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <Code2 className="text-primary h-8 w-8" />
                <span className="text-primary text-lg font-semibold">
                  Skill Diggers
                </span>
              </div>
              <h1 className="text-foreground text-4xl font-bold text-balance md:text-6xl">
                Brewing the Next Generation of{" "}
                <span className="text-primary">Programmers</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl text-xl text-pretty">
                Join our tech-centered community where passionate developers
                connect, learn, and grow together. Share knowledge, collaborate
                on projects, and accelerate your programming journey.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <Button size="lg" className="px-8 text-lg">
                Join Community
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="bg-transparent px-8 text-lg"
              >
                Learn More
              </Button>
            </div>

            <div className="text-muted-foreground flex items-center justify-center gap-4 text-sm lg:justify-start">
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-full"></div>
                <span>10,000+ Developers</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-primary h-2 w-2 rounded-full"></div>
                <span>50+ Programming Languages</span>
              </div>
            </div>
          </div>

          {/* Right Content - Programming Languages */}
          <div className="flex flex-1 justify-center">
            <ProgrammingLanguages />
          </div>
        </div>
      </div>
    </section>
  );
}
