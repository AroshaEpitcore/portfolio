import { CustomCursor } from "@/components/shared/custom-cursor";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <CustomCursor />
      {children}
    </>
  );
}
