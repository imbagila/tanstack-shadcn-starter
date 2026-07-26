import * as React from "react";

import { SearchForm } from "@/components/search-form";
import { VersionSwitcher } from "@/components/version-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Link, useRouterState } from "@tanstack/react-router";

interface SidebarData {
  versions: string[];
  navMain: SidebarNavMain[];
}

interface SidebarNavMain {
  title: string;
  url: string;
  items: SidebarItem[];
}

interface SidebarItem {
  title: string;
  url: string;
}

// This is sample data.
const data: SidebarData = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Home",
      url: "#",
      items: [
        {
          title: "Dashboard",
          url: "/dashboard",
        },
        {
          title: "Logout",
          url: "/logout",
        },
      ],
    },
    {
      title: "Login",
      url: "#",
      items: [
        {
          title: "Login 01",
          url: "/login/01",
        },
        {
          title: "Login 02",
          url: "/login/02",
        },
        {
          title: "Login 03",
          url: "/login/03",
        },
        {
          title: "Login 04",
          url: "/login/04",
        },
        {
          title: "Login 05",
          url: "/login/05",
        },
      ],
    },
    {
      title: "Sign Up",
      url: "#",
      items: [
        {
          title: "Sign Up 01",
          url: "/signup/01",
        },
        {
          title: "Sign Up 02",
          url: "/signup/02",
        },
        {
          title: "Sign Up 03",
          url: "/signup/03",
        },
        {
          title: "Sign Up 04",
          url: "/signup/04",
        },
        {
          title: "Sign Up 05",
          url: "/signup/05",
        },
      ],
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <VersionSwitcher versions={data.versions} defaultVersion={data.versions[0]} />
        <SearchForm />
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={item.url === pathname}
                      render={<Link to={item.url}>{item.title}</Link>}
                    >
                      {item.title}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
