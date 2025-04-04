import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { type Metadata } from "next";
import { Ayonilogo } from "@/components/logo";
import { ModeToggle } from "@/components/add-toggle";

export const metadata: Metadata = {
  title: "Ayoni - Dashboard",
  description:
    "Open-source web analytics built for modern websites — simple, fast, and easy to use. ",
  openGraph: {
    images: ["/ogayoni.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ayoni - Dashboard",
    description:
      "Open-source web analytics built for modern websites — simple, fast, and easy to use. ",
    images: ["/ogayoni.png"],
    creator: "@ronitrajfr",
  },
  icons: [{ rel: "icon", url: "/logo.svg" }],
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="mr-4 ml-auto">
            <ModeToggle />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
