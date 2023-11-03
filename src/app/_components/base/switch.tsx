import { type FC, type PropsWithChildren } from "react";
import { Switch, type SwitchProps } from "react-aria-components";
import { type Control, Controller } from "react-hook-form";

import { cn } from "~/lib/util/class";

import $style from "./switch.module.scss";

export const AppSwitch: FC<
  PropsWithChildren<
    SwitchProps & {
      control?: Control;
      className?: string;
    }
  >
> = ({ children, isDisabled, control, ...props }) => {
  return (
    <Controller
      defaultValue
      control={control}
      disabled={isDisabled}
      name={props.name ?? "switch"}
      render={({ field }) => {
        return (
          <Switch
            {...props}
            ref={field.ref}
            className={cn($style.switch, props.className)}
            isDisabled={field.disabled}
            isSelected={field.value as never}
            onBlur={(...args) => {
              field.onBlur?.();
              props.onBlur?.(...args);
            }}
            onChange={(...args) => {
              field.onChange(...args);
              props.onChange?.(...args);
            }}
          >
            <div className={$style.indicator} />
            {children}
          </Switch>
        );
      }}
    />
  );
};
