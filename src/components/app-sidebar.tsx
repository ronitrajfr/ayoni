import { auth } from "@/server/auth";
import { db } from "@/server/db";
import * as React from "react";
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
import { redirect } from "next/navigation";

export async function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/");
  }

  const websites = await db.website.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const navItems = [
    {
      title: "Websites",
      url: "#",
      icon: "Globe",
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
        <NavUser session={session} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export const AppSidebarSkeleton = () => {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Logo />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={[]} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser session={null} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
};