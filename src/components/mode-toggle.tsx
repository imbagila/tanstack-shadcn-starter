import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "@/components/theme-provider";

function ThemeIcon() {
  return (
    <>
      <Sun className="size-[1.2rem] scale-100 rotate-0 opacity-100 transition-[opacity,transform] dark:scale-95 dark:-rotate-90 dark:opacity-0" />
      <Moon className="absolute size-[1.2rem] scale-95 rotate-90 opacity-0 transition-[opacity,transform] dark:scale-100 dark:rotate-0 dark:opacity-100" />
    </>
  );
}

export function ModeToggleDropdown() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="outline" size="icon" className="relative" />}>
        <ThemeIcon />
        <span className="sr-only">Toggle theme</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as "dark" | "light" | "system")}>
          <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ModeToggleButton() {
  const { resolvedTheme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
    >
      <ThemeIcon />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
