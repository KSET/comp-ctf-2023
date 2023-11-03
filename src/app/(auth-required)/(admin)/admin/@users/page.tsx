"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

import { api } from "~/lib/trpc/react";
import { type RouterOutputs } from "~/lib/trpc/shared";

type PageData = RouterOutputs["pageData"]["admin"]["indexUsers"];

type User = PageData["users"][number];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Task = PageData["tasks"][number];

const defaultColumns = [
  {
    header: "User",
    columns: [
      {
        accessorKey: "name",
        header: () => "Name",
        cell: (info) => info.getValue<User["name"]>(),
      },
      {
        accessorKey: "email",
        header: () => "Email",
        cell: (info) => info.getValue<User["email"]>(),
      },
      {
        accessorKey: "role",
        header: () => "Role",
        cell: (info) => info.getValue<User["role"]>() ?? "/",
      },
      {
        id: "accounts",
        accessorFn: (row) => row.accounts,
        header: () => "Accounts",
        cell: (info) =>
          info
            .getValue<User["accounts"]>()
            .map((x) => x.provider)
            .join(", "),
      },
    ],
  },
  {
    header: "Tasks",
    columns: [
      {
        id: "tasks-started",
        accessorFn: (row) => row.taskSolves,
        header: () => "Started",
        cell: (info) => info.getValue<User["taskSolves"]>().length,
      },
      {
        id: "tasks-finished",
        accessorFn: (row) => row.taskSolves,
        header: () => "Finished",
        cell: (info) =>
          info.getValue<User["taskSolves"]>().filter((x) => x.finishedAt)
            .length,
      },
    ],
  },
] satisfies ColumnDef<User>[];

export default function PageAdminHomeUsers() {
  const pageDataQuery = api.pageData.admin.indexUsers.useQuery();
  const users = pageDataQuery.data?.users ?? [];

  const columns = useMemo(() => [...defaultColumns], []);
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!pageDataQuery.data) {
    return (
      <section className="flex flex-col gap-4 rounded-md bg-primary p-4">
        <h2 className="text-xl font-bold">Korisnici</h2>

        <div>Loading...</div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-4 rounded-md bg-primary p-4">
      <h2 className="text-xl font-bold">Korisnici</h2>

      <table className="border-separate border-spacing-y-1">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: " 🔼",
                          desc: " 🔽",
                        }[header.column.getIsSorted() as string] ?? null}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>
          {table
            .getRowModel()
            .rows.slice(0, 10)
            .map((row) => {
              return (
                <tr key={row.id} className="bg-background/20">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="p-2">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </table>
    </section>
  );
}
