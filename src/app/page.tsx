"use client";
import { HeroGeometric } from "@/components/ui/shape-landing-hero";

import { useSession, signIn } from "next-auth/react";

import Link from "next/link";

export default function HomePage() {
  const { data: session } = useSession();

  // console.log(session);

  return (
    <main>
      <HeroGeometric
        badge="Ayoni"
        title1="Handle Analytics"
        title2="Like A Pro"
      />
    </main>
  );
}
