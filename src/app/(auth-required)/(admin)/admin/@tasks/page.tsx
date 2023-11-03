"use client";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { type FC } from "react";
import {
  Button,
  Heading,
  Input,
  Label,
  TextArea,
  TextField,
} from "react-aria-components";
import { type SubmitHandler, useForm } from "react-hook-form";

import { AppDialog } from "~/app/_components/base/dialog";
import { AppSwitch } from "~/app/_components/base/switch";
import { TaskCard } from "~/app/_components/task/task-card";
import { TaskDifficulty } from "~/lib/task/difficulty";
import { api } from "~/lib/trpc/react";
import { type RouterInputs } from "~/lib/trpc/shared";
import {
  type InsertTaskPayload,
  type UpdateTaskPayload,
} from "~/server/api/routers/task";

type TaskFormParams = {
  onSuccess?: () => void | Promise<void>;
  taskHandlerKeys: string[];
  className?: string;
} & (
  | {
      type: "add";
    }
  | {
      type: "edit";
      task: UpdateTaskPayload;
    }
);

const ModTaskButton: FC<TaskFormParams> = ({
  onSuccess,
  taskHandlerKeys,
  className,
  ...params
}) => {
  const formType = params.type;
  type FormType = typeof formType;
  type Inputs = FormType extends "add"
    ? InsertTaskPayload
    : Omit<UpdateTaskPayload, "id">;
  type MutationData = FormType extends "add"
    ? RouterInputs["task"]["add"]
    : RouterInputs["task"]["update"];

  const task =
    params.type === "edit"
      ? params.task
      : {
          id: 0,
          difficulty: TaskDifficulty.Easy,
        };

  const { register, handleSubmit, reset, control } = useForm<Inputs>({
    defaultValues: task,
    mode: "onBlur",
    shouldUnregister: true,
  });

  const updateTaskMutation = api.task.update.useMutation();
  const addTaskMutation = api.task.add.useMutation();

  const doMutation = (data: MutationData) => {
    switch (formType) {
      case "add":
        return addTaskMutation.mutateAsync(data as never);
      case "edit":
        return updateTaskMutation.mutateAsync(data);
      default:
        return Promise.resolve();
    }
  };

  const onSubmit = ((data) => {
    return doMutation({
      ...data,
      id: task.id,
    });
  }) satisfies SubmitHandler<Inputs>;

  const { isLoading } = updateTaskMutation;

  return (
    <AppDialog
      className="mx-auto max-h-screen max-w-screen-sm overflow-auto rounded-md bg-primary p-4"
      trigger={
        <Button className={className}>
          {formType === "add" ? "Dodaj zadatak" : "Uredi"}
        </Button>
      }
      onOpenChange={() => {
        reset();
      }}
    >
      {({ close }) => (
        <form
          className="flex flex-col gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void handleSubmit(onSubmit)(e).then(() => {
              void onSuccess?.();
              close();
            });
          }}
        >
          <Heading className="mb-2 text-xl font-bold">
            {formType === "add" ? "Dodaj zadatak" : "Uredi zadatak"}
          </Heading>
          <TextField
            isRequired
            className="flex flex-col gap-1"
            isDisabled={isLoading}
          >
            <Label>Title</Label>
            <Input
              {...register("title")}
              required
              className="rounded-md bg-off-text px-2 py-1 text-background disabled:bg-neutral-300 disabled:text-neutral-700"
              placeholder="kopija/pašta"
            />
          </TextField>
          <TextField
            isRequired
            className="flex flex-col gap-1"
            isDisabled={isLoading}
          >
            <Label>Flag base</Label>
            <Input
              {...register("flagBase")}
              required
              className="rounded-md bg-off-text px-2 py-1 text-background disabled:bg-neutral-300 disabled:text-neutral-700"
              placeholder="owo_je_zastawica_"
            />
          </TextField>
          <div>
            <AppSwitch
              control={control}
              isDisabled={isLoading}
              name="flagUserSpecific"
            >
              Unique per user
            </AppSwitch>
          </div>
          <TextField
            isRequired
            className="flex flex-col gap-1"
            isDisabled={isLoading}
          >
            <Label>Description</Label>
            <TextArea
              {...register("description")}
              required
              className="rounded-md bg-off-text px-2 py-1 text-background"
              placeholder="Ovo je primjer zadatak za Comp CTF."
              rows={3}
            />
          </TextField>
          <TextField
            isRequired
            className="flex flex-col gap-1"
            isDisabled={isLoading}
          >
            <Label>Text</Label>
            <TextArea
              {...register("text")}
              required
              className="rounded-md bg-off-text px-2 py-1 text-background"
              rows={6}
              placeholder={`Ovo je primjer zadatak za Comp CTF.
Svaki zadatak ima "zastavicu" koju moraš naći i upisati u odgovarajuće polje. Zastavice nisu osjetljiva na velika i mala slova te sadrze iskljucivo slova.
Ako rješenje zadatka nije zastavica, to će biti naznačeno u tekstu zadatka.

Rješenje za ovaj zadatak je %%FLAG%%.

Zadatci neće uvijek biti ovako lagani, tako da nije sramota rješavati uz kolegu ili pitati na COMP pultu za savjet.
Jedino nemojte dijeliti rješenja s ostalima ili ih postati na razne kanale da ne umanjite zabavu drugima.`}
            />
          </TextField>
          <div className="flex flex-col items-start gap-1">
            <label>Difficulty</label>
            <select
              className="rounded-md bg-off-text px-2 py-1 text-background"
              disabled={isLoading}
              {...register("difficulty")}
            >
              {Object.entries(TaskDifficulty).map(([key, value]) => {
                return (
                  <option key={key} value={value}>
                    {key}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="flex flex-col items-start gap-1">
            <label>Handler</label>
            <select
              className="rounded-md bg-off-text px-2 py-1 text-background"
              disabled={isLoading}
              {...register("handler")}
            >
              <option className="italic" value="">
                Nema
              </option>
              {taskHandlerKeys.map((key) => {
                return (
                  <option key={key} value={key}>
                    {key}
                  </option>
                );
              })}
            </select>
          </div>
          <div>
            <AppSwitch control={control} isDisabled={isLoading} name="hidden">
              Hidden
            </AppSwitch>
          </div>
          <div className="flex">
            <Button onPress={close}>Cancel</Button>
            <Button className="ml-auto" isDisabled={isLoading} type="submit">
              Submit
            </Button>
          </div>
        </form>
      )}
    </AppDialog>
  );
};

export default function PageAdminHomeTasks() {
  const [parent, _] = useAutoAnimate();

  const pageDataQuery = api.pageData.admin.indexTasks.useQuery();

  const taskMoveMutation = api.task.move.useMutation({
    onSuccess: () => {
      void pageDataQuery.refetch();
    },
  });

  const tasks = pageDataQuery.data?.tasks;
  const taskHandlerKeys = pageDataQuery.data?.taskHandlerKeys ?? [];

  return (
    <section className="flex flex-col gap-4 rounded-md bg-primary p-4">
      <h2 className="text-xl font-bold">Zadatci</h2>

      <div>
        <ModTaskButton
          taskHandlerKeys={taskHandlerKeys}
          type="add"
          onSuccess={() => {
            void pageDataQuery.refetch();
          }}
        />
      </div>

      <div
        ref={parent}
        className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {pageDataQuery.isLoading ? (
          <p>Loading...</p>
        ) : (
          tasks?.map((task, i) => (
            <TaskCard
              key={task.id}
              task={task}
              extraActions={
                <div className="flex align-middle">
                  <Button
                    className="disabled:opacity-50"
                    isDisabled={taskMoveMutation.isLoading || i === 0}
                    onPress={() => {
                      taskMoveMutation.mutate({
                        id: task.id,
                        direction: "backwards",
                      });
                    }}
                  >
                    &larr;
                  </Button>
                  <Button
                    className="disabled:opacity-50"
                    isDisabled={
                      taskMoveMutation.isLoading || i === tasks?.length - 1
                    }
                    onPress={() => {
                      taskMoveMutation.mutate({
                        id: task.id,
                        direction: "forwards",
                      });
                    }}
                  >
                    &rarr;
                  </Button>

                  <ModTaskButton
                    key={JSON.stringify(task)}
                    className="ml-auto"
                    task={task}
                    taskHandlerKeys={taskHandlerKeys}
                    type="edit"
                    onSuccess={() => {
                      void pageDataQuery.refetch();
                    }}
                  />
                </div>
              }
            />
          ))
        )}
      </div>
    </section>
  );
}
