import { Badge } from "~/components/ui/badge";
import { ExternalLink, GitBranch, MessageCircle } from "lucide-react";

interface BountyCardProps {
  name: string;
  points: number;
  issueNumber?: number;
  issueUrl?: string;
  branchName: string;
  unreadCount?: number;
  onMessageClick?: () => void;
}

export function BountyCard({
  name,
  points,
  issueNumber,
  issueUrl,
  branchName,
  unreadCount = 0,
  onMessageClick,
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
        <div className="flex items-center gap-1">
          {onMessageClick && (
            <button
              onClick={onMessageClick}
              className="text-muted-foreground hover:text-foreground relative p-1 transition-colors"
              title="View messages"
            >
              <MessageCircle className="h-3 w-3" />
              {unreadCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center bg-blue-600 p-0 text-xs text-white"
                >
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </button>
          )}
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
    </div>
  );
}
