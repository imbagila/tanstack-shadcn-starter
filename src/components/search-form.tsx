"use client";

import * as React from "react";
import { Search } from "lucide-react";

import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarInput,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function SearchInput({ id, className, ...props }: React.ComponentProps<typeof SidebarInput>) {
  return (
    <div className={cn("relative", className)}>
      <Label htmlFor={id} className="sr-only">
        Search
      </Label>
      <SidebarInput id={id} placeholder="Search the docs..." className="pl-8" {...props} />
      <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
    </div>
  );
}

export function SearchForm({ className, ...props }: React.ComponentProps<"form">) {
  const { state, isMobile } = useSidebar();
  const [open, setOpen] = React.useState(false);
  const closeTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  const isCollapsed = state === "collapsed" && !isMobile;

  const handleOpen = React.useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    setOpen(true);
  }, []);

  const handleClose = React.useCallback(() => {
    closeTimeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  const handleClick = React.useCallback(() => {
    handleOpen();
    requestAnimationFrame(() => {
      document.getElementById("search-collapsed")?.focus();
    });
  }, [handleOpen]);

  React.useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  if (!isCollapsed) {
    return (
      <form {...props}>
        <SidebarGroup className="py-0">
          <SidebarGroupContent className="relative">
            <SearchInput id="search" />
          </SidebarGroupContent>
        </SidebarGroup>
      </form>
    );
  }

  return (
    <form {...props} className={cn("w-full", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <SidebarMenu>
          <SidebarMenuItem>
            <PopoverTrigger asChild>
              <SidebarMenuButton
                type="button"
                onMouseEnter={handleOpen}
                onMouseLeave={handleClose}
                onClick={handleClick}
              >
                <Search />
                <span className="sr-only">Search</span>
              </SidebarMenuButton>
            </PopoverTrigger>
          </SidebarMenuItem>
        </SidebarMenu>
        <PopoverContent
          side="right"
          align="start"
          sideOffset={8}
          className="w-64 p-2"
          onMouseEnter={handleOpen}
          onMouseLeave={handleClose}
          onOpenAutoFocus={(event) => event.preventDefault()}
        >
          <SearchInput id="search-collapsed" />
        </PopoverContent>
      </Popover>
    </form>
  );
}
