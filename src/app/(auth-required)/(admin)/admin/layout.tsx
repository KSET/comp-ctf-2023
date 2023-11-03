import { type NextAppLayoutProps } from "~/types/next";

export default function LayoutDefaultAdmin({
  tasks,
  users,
}: NextAppLayoutProps<never, ["tasks", "users"]>) {
  return (
    <>
      <h1 className="text-3xl font-bold">Admin</h1>
      {tasks}
      {users}
    </>
  );
}
