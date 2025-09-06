import { Suspense } from "react";
import { LoginForm } from "./_components/login-form";
import { AuthLayout } from "./_components/auth-layout";
import { LoadingSkeleton } from "./_components/loading-skeleton";

export default function LoginPage() {
  return (
    <AuthLayout
      title="Happy Coding"
      subtitle="Sign in to your Skill Diggers account"
      footerText="Let's get coding shall we"
      footerLinkText=""
      footerLinkHref="/signup"
    >
      <Suspense fallback={<LoadingSkeleton />}>
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
