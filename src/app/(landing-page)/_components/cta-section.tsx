import { Button } from "~/components/ui/button";
import { ArrowRight, Github, Twitter } from "lucide-react";

export function CTASection() {
  return (
    <section className="px-4 py-20">
      <div className="container mx-auto max-w-4xl space-y-8 text-center">
        <div className="space-y-4">
          <h2 className="text-foreground text-3xl font-bold md:text-4xl">
            Ready to Start Your Journey?
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Join thousands of developers who are already building the future
            together.
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button size="lg" className="px-8 text-lg">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent px-8 text-lg"
          >
            View Demo
          </Button>
        </div>

        <div className="flex items-center justify-center gap-6 pt-8">
          <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Github className="h-6 w-6" />
          </a>
          <a
            href="#"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <Twitter className="h-6 w-6" />
          </a>
        </div>
      </div>
    </section>
  );
}
