import { Card } from "~/components/ui/card";

export function VideoGrid() {
  const participants = [
    { id: 1, name: "You", isActive: true },
    { id: 2, name: "Alex Chen", isActive: true },
    { id: 3, name: "Jordan Smith", isActive: true },
    { id: 4, name: "Sam Patel", isActive: false },
  ];

  return (
    <div className="flex-1 overflow-auto p-4">
      <div className="grid auto-rows-max grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
        {participants.map((participant) => (
          <Card
            key={participant.id}
            className="bg-secondary border-border group relative aspect-video overflow-hidden rounded-lg"
          >
            <div className="from-secondary to-muted flex h-full w-full items-center justify-center bg-gradient-to-br">
              <div className="text-center">
                <div className="bg-primary/20 mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full">
                  <span className="text-2xl">👤</span>
                </div>
                <p className="text-foreground font-semibold">
                  {participant.name}
                </p>
                {!participant.isActive && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    Camera off
                  </p>
                )}
              </div>
            </div>

            {/* Status Badge */}
            <div className="absolute top-3 right-3">
              {participant.isActive ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-green-500/20 px-2 py-1 text-xs text-green-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
                  Active
                </span>
              ) : (
                <span className="bg-muted text-muted-foreground inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs">
                  <span className="bg-muted-foreground h-1.5 w-1.5 rounded-full"></span>
                  Away
                </span>
              )}
            </div>

            {/* Name Badge */}
            <div className="absolute right-3 bottom-3 left-3">
              <p className="text-foreground truncate text-sm font-medium">
                {participant.name}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
