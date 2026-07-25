import { createFileRoute } from "@tanstack/react-router";
import { ModeToggleButton, ModeToggleDropdown } from "@/components/mode-toggle";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      <div className="mt-6 flex items-center gap-2">
        <ModeToggleButton />
        <ModeToggleDropdown />
      </div>
    </div>
  );
}
