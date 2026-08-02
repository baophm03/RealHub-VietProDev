import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-background px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 25%, var(--surface-muted) 0%, transparent 45%), radial-gradient(circle at 85% 75%, var(--surface-muted) 0%, transparent 50%)",
        }}
      />
      <div className="relative z-10 w-full max-w-md animate-fade-up">
        {children}
      </div>
    </div>
  );
}
