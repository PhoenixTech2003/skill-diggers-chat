import type React from "react";
import Link from "next/link";
import { Code2 } from "lucide-react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  footerText: string;
  footerLinkText: string;
  footerLinkHref: string;
}

const AuthLayout = ({
  children,
  title,
  subtitle,
  footerText,
  footerLinkText,
  footerLinkHref,
}: AuthLayoutProps) => {
  return (
    <div className="from-primary/50 via-primary/20 to-background flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="space-y-4 text-center">
          <Link
            href="/"
            className="text-primary hover:text-primary/80 inline-flex items-center gap-2"
          >
            <Code2 className="h-8 w-8" />
            <span className="text-2xl font-bold">Skill Diggers</span>
          </Link>
          <div className="space-y-2">
            <h1 className="text-foreground text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
        </div>

        {/* Form */}
        {children}

        {/* Footer */}
        <div className="text-center">
          <p className="text-muted-foreground">
            {footerText}{" "}
            <Link
              href={footerLinkHref}
              className="text-primary hover:text-primary/80 font-medium"
            >
              {footerLinkText}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export { AuthLayout };
export default AuthLayout;
