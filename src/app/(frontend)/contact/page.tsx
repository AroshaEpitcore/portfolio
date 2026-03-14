import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { ContactPage } from "./contact-page";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with me. I'd love to hear from you.",
};

async function getData() {
  try {
    const supabase = await createClient();

    const [contactResult, socialResult] = await Promise.all([
      supabase.from("contact_info").select("*").single(),
      supabase
        .from("social_links")
        .select("*")
        .order("order_index", { ascending: true }),
    ]);

    return {
      contactInfo: contactResult.data,
      socialLinks: socialResult.data,
    };
  } catch {
    return {
      contactInfo: null,
      socialLinks: null,
    };
  }
}

export default async function Page() {
  const { contactInfo, socialLinks } = await getData();

  return (
    <ContactPage
      contactInfo={contactInfo || undefined}
      socialLinks={socialLinks || undefined}
    />
  );
}
