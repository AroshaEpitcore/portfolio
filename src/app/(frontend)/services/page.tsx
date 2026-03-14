import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ServicesPage } from "./services-page";

export const metadata: Metadata = {
  title: "Services",
  description: "Freelance services and what I can build for you.",
};

async function getData() {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("services")
      .select("*")
      .order("order_index", { ascending: true });
    return { services: data };
  } catch {
    return { services: null };
  }
}

export default async function Page() {
  const { services } = await getData();
  return <ServicesPage services={services || undefined} />;
}
