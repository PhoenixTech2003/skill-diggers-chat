import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { MessageSquare, Users, BookOpen, Zap } from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "Real-time Chat",
    description:
      "Connect with developers worldwide in specialized programming rooms and channels.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "Learn from experienced mentors and collaborate with peers on exciting projects.",
  },
  {
    icon: BookOpen,
    title: "Knowledge Sharing",
    description:
      "Access tutorials, code snippets, and best practices shared by the community.",
  },
  {
    icon: Zap,
    title: "Skill Building",
    description:
      "Participate in coding challenges and hackathons to level up your skills.",
  },
];

export function FeaturesSection() {
  return (
    <section className="bg-card/5 px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-16 space-y-4 text-center">
          <h2 className="text-foreground text-3xl font-bold md:text-4xl">
            Why Choose Skill Diggers?
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-xl">
            Everything you need to accelerate your programming journey and
            connect with like-minded developers.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border-border bg-card hover:bg-card/80 transition-colors"
            >
              <CardHeader className="text-center">
                <div className="bg-primary/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg">
                  <feature.icon className="text-primary h-6 w-6" />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center text-sm">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
