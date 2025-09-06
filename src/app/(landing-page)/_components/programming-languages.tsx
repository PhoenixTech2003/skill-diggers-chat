import { Code2 } from "lucide-react";

export function ProgrammingLanguages() {
  return (
    <div className="relative h-96 w-full max-w-md">
      {/* TypeScript */}
      <div className="animate-float absolute top-4 left-8">
        <div className="bg-card border-border rounded-xl border p-4 shadow-lg">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#3178C6" />
            <path d="M9.5 16.5V12.5H7V11H14V12.5H11.5V16.5H9.5Z" fill="white" />
            <path
              d="M15 16.5V15H16.5C17.3 15 18 14.3 18 13.5V12.5C18 11.7 17.3 11 16.5 11H15V16.5Z"
              fill="white"
            />
          </svg>
          <p className="text-muted-foreground mt-2 text-xs">TypeScript</p>
        </div>
      </div>

      {/* Python */}
      <div
        className="animate-float absolute top-16 right-4"
        style={{ animationDelay: "0.5s" }}
      >
        <div className="bg-card border-border rounded-xl border p-4 shadow-lg">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.5 2 7 3.5 7 6V8H17V6C17 3.5 15.5 2 12 2Z"
              fill="#3776AB"
            />
            <path
              d="M7 16V18C7 20.5 8.5 22 12 22C15.5 22 17 20.5 17 18V16H7Z"
              fill="#FFD43B"
            />
            <circle cx="9.5" cy="5.5" r="1" fill="white" />
            <circle cx="14.5" cy="18.5" r="1" fill="white" />
          </svg>
          <p className="text-muted-foreground mt-2 text-xs">Python</p>
        </div>
      </div>

      {/* Go */}
      <div
        className="animate-float absolute bottom-20 left-4"
        style={{ animationDelay: "1s" }}
      >
        <div className="bg-card border-border rounded-xl border p-4 shadow-lg">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#00ADD8" />
            <path
              d="M8 14C8 15.1 8.9 16 10 16H14C15.1 16 16 15.1 16 14V10C16 8.9 15.1 8 14 8H10C8.9 8 8 8.9 8 10V14Z"
              fill="white"
            />
            <circle cx="12" cy="12" r="2" fill="#00ADD8" />
          </svg>
          <p className="text-muted-foreground mt-2 text-xs">Go</p>
        </div>
      </div>

      {/* C++ */}
      <div
        className="animate-float absolute right-8 bottom-4"
        style={{ animationDelay: "1.5s" }}
      >
        <div className="bg-card border-border rounded-xl border p-4 shadow-lg">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="4" fill="#00599C" />
            <path
              d="M8 8H10V10H12V8H14V10H16V12H14V14H12V12H10V14H8V12H6V10H8V8Z"
              fill="white"
            />
            <text
              x="12"
              y="18"
              textAnchor="middle"
              fill="white"
              fontSize="8"
              fontWeight="bold"
            >
              C++
            </text>
          </svg>
          <p className="text-muted-foreground mt-2 text-xs">C++</p>
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
