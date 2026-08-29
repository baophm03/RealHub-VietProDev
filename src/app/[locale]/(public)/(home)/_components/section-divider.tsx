export function SectionDivider() {
  return (
    <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-6 md:px-8 lg:px-12">
      <div className="h-px flex-1 bg-border" />
      <div className="size-1.5 rounded-full bg-primary/40" />
      <div className="h-px flex-1 bg-border" />
    </div>
  );
}
