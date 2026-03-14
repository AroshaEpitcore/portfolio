import { Metadata } from "next";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProjectDetailPage } from "./project-detail";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  try {
    const supabase = await createClient();
    const { data: project } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .single();

    if (!project) {
      return {
        title: "Project Not Found",
      };
    }

    return {
      title: project.title,
      description: project.short_description || project.long_description,
    };
  } catch {
    return {
      title: "Project",
    };
  }
}

async function getData(slug: string) {
  try {
    const supabase = await createClient();

    const [projectResult, relatedResult] = await Promise.all([
      supabase.from("projects").select("*").eq("slug", slug).single(),
      supabase
        .from("projects")
        .select("*")
        .eq("is_published", true)
        .neq("slug", slug)
        .limit(3),
    ]);

    return {
      project: projectResult.data,
      relatedProjects: relatedResult.data,
    };
  } catch {
    return {
      project: null,
      relatedProjects: null,
    };
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const { project, relatedProjects } = await getData(slug);

  // For demo purposes, use placeholder if no project found
  const placeholderProject = {
    id: "1",
    title: "E-Commerce Platform",
    slug: "e-commerce",
    short_description:
      "A modern e-commerce platform built with Next.js and Stripe.",
    long_description: `
## Overview

This is a full-featured e-commerce platform built from scratch using modern web technologies. The project showcases my ability to build complex, production-ready applications.

## Features

- **Product Management**: Full CRUD operations for products with image uploads
- **Shopping Cart**: Persistent cart with real-time updates
- **Secure Checkout**: Stripe integration for secure payment processing
- **User Authentication**: JWT-based auth with password recovery
- **Admin Dashboard**: Complete admin panel for managing products, orders, and users
- **Order Management**: Track orders, update status, send notifications
- **Responsive Design**: Works perfectly on all devices

## Technical Highlights

- Server-side rendering with Next.js for optimal SEO
- PostgreSQL database with Prisma ORM
- Redis caching for improved performance
- Comprehensive test coverage with Jest and Cypress
- CI/CD pipeline with GitHub Actions
- Deployed on Vercel with automatic previews

## Challenges & Solutions

One of the main challenges was implementing real-time inventory management. I solved this by using WebSockets for instant updates and implementing optimistic UI updates for better user experience.
    `,
    thumbnail_url: "/images/project-1.jpg",
    images: ["/images/project-1-1.jpg", "/images/project-1-2.jpg"],
    tech_stack: ["Next.js", "TypeScript", "Stripe", "PostgreSQL", "Tailwind CSS", "Prisma", "Redis"],
    live_url: "#",
    github_url: "#",
    is_featured: true,
    is_published: true,
    order_index: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const displayProject = project || placeholderProject;

  if (!project && slug !== "e-commerce") {
    notFound();
  }

  return (
    <ProjectDetailPage
      project={displayProject}
      relatedProjects={relatedProjects || undefined}
    />
  );
}
