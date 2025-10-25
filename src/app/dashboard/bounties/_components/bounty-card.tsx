import { Badge } from "~/components/ui/badge";
import { ExternalLink, GitBranch } from "lucide-react";

interface BountyCardProps {
  name: string;
  points: number;
  issueNumber?: number;
  issueUrl?: string;
  branchName: string;
}

export function BountyCard({
  name,
  points,
  issueNumber,
  issueUrl,
  branchName,
}: BountyCardProps) {
  return (
    <div className="w-full min-w-0 space-y-3">
      <div className="min-w-0 space-y-2">
        <h3 className="truncate text-sm leading-tight font-medium">{name}</h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {points} pts
          </Badge>
          {issueNumber && (
            <span className="text-muted-foreground text-xs">
              #{issueNumber}
            </span>
          )}
        </div>
      </div>

      <div className="flex min-w-0 items-start justify-between gap-2">
        <div className="text-muted-foreground flex min-w-0 flex-1 items-start gap-1 text-xs">
          <GitBranch className="mt-0.5 h-3 w-3 flex-shrink-0" />
          <span className="truncate">{branchName}</span>
        </div>
        {issueUrl && (
          <a
            href={issueUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-foreground flex-shrink-0 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        )}
      </div>
    </div>
  );
}
