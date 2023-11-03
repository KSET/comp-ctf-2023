"use client";

import { type FC } from "react";
import { Button, Input, Label, TextField } from "react-aria-components";
import { useFormState, useFormStatus } from "react-dom";

import { submitFlagAction } from "./page.action";

export const SubmitFlagFormInputs: FC<{
  taskId: number;
}> = ({ taskId }) => {
  const status = useFormStatus();
  const [state, formAction] = useFormState(
    submitFlagAction.bind(null, {
      id: taskId,
    }),
    null,
  );

  return (
    <>
      <TextField
        isRequired
        className="flex flex-col gap-1"
        isDisabled={status.pending}
      >
        <Label className="text-xl font-bold">Rješenje:</Label>
        <Input
          required
          className="rounded-md bg-off-text px-2 py-1 text-background disabled:bg-neutral-300 disabled:text-neutral-700"
          name="flag"
          placeholder="COMP_CTF{zastavica_ide_tu_abcdefgh}"
        />
      </TextField>

      <Button
        className="rounded-md bg-primary px-4 py-2 text-lg font-bold text-off-text hover:text-text disabled:text-neutral-300"
        formAction={formAction as never}
        isDisabled={status.pending}
        type="submit"
      >
        Predaj
      </Button>

      {state?.status === "error" ? (
        <div className="w-full rounded-md bg-off-text px-4 py-2 text-background">
          <h3 className="m-0 font-bold text-red-700">Greška!</h3>

          <span className="whitespace-pre-wrap">{state.message}</span>
        </div>
      ) : null}
    </>
  );
};
