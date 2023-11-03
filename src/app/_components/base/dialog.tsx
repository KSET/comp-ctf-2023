import { type FC, type ReactElement } from "react";
import {
  Dialog,
  type DialogProps,
  DialogTrigger,
  type DialogTriggerProps,
  Modal,
  type ModalOverlayProps,
} from "react-aria-components";

export type AppDialogProps = Omit<DialogTriggerProps, "children"> &
  DialogProps & {
    trigger: ReactElement;
    modalProps?: ModalOverlayProps;
  };

export const AppDialog: FC<AppDialogProps> = ({
  trigger,
  modalProps,
  defaultOpen,
  isOpen,
  onOpenChange,
  ...restProps
}) => {
  return (
    <DialogTrigger {...{ defaultOpen, isOpen, onOpenChange }}>
      {trigger}
      <Modal isDismissable {...modalProps}>
        <Dialog {...restProps} />
      </Modal>
    </DialogTrigger>
  );
};
