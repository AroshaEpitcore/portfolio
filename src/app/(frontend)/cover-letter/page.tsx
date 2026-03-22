import type { Metadata } from "next";
import { CoverLetterClient } from "./cover-letter-client";

export const metadata: Metadata = {
  title: "Cover Letter Generator",
  description:
    "Create a professional cover letter tailored to your target role and download it as a polished PDF.",
};

export default function CoverLetterPage() {
  return <CoverLetterClient />;
}
