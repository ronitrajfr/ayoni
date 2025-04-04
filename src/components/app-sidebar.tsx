"use client";

import * as React from "react";
import { Globe, PieChart, ChevronsUpDown } from "lucide-react";
import { useEffect, useState } from "react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { Logo } from "@/components/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

// Define the Website type
interface Website {
  id: string;
  name: string;
  domain: string;
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [websites, setWebsites] = useState<Website[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWebsites() {
      try {
        const response = await fetch("/api/website");
        if (!response.ok) {
          throw new Error("Failed to fetch websites");
        }
        const data = await response.json();
        setWebsites(data.websites);
      } catch (error) {
        console.error("Error fetching websites:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchWebsites();
  }, []);

  // Create navigation items with real website data
  const navItems = [
    {
      title: "Dashboard",
      url: "#",
      icon: PieChart,
      isActive: true,
    },
    {
      title: "Websites",
      url: "#",
      icon: Globe,
      items: websites.map((website) => ({
        title: website.name,
        url: `/dashboard/${website.id}`,
      })),
    },
  ];

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
