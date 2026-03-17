"use client";

// Native smooth scroll — no JS scroll interception for better performance
export function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
