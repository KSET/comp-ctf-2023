export const metadata = {
  title: {
    template: "%s | Zadaci | Comp CTF",
    default: "Zadaci",
  },
};

export default function LayoutTasks({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
