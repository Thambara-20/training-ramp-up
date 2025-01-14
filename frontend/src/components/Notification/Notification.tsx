import * as React from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Backdrop,
} from "@mui/material";
import styled from "styled-components";

interface ErrorPopupProps {
  open: boolean;
  onSubmit: () => void;
  onClose: () => void;
  type: string;
}

const ButtonWrapper = styled.div`
  padding: 15px 0 0 0;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const StyledBackdrop = styled(Backdrop)`
  background-color: rgba(255, 255, 255, 0.2) !important;
  color: #fff;
`;

const StyledDialogContent = styled(Dialog)`
  && {
    .MuiPaper-root.MuiDialog-paper {
      margin: 0 !important;
      border-radius: 10px;
    }

  && {
    .MuiDialogContent-root {
        padding: 15px 20px 5px 20px !important;
        min-width: 300px !important;
      }}
`;

const StyledButton = styled(Button)`
  border: none !important;
  margin-left: 4px !important;
  margin-right: 0px !important;
  padding: 5px !important;
`;

import { NotificationTypes, NotificationTexts } from "../../utilities";

const NotificationPopup: React.FC<ErrorPopupProps> = ({
  open,
  onClose,
  type,
  onSubmit,
}) => {
  let errorMessage = "";
  let button: React.ReactNode = null;

  const ButtonSet: React.FC = () => {
    return (
      <>
        <StyledButton variant="outlined" color="primary" onClick={onClose}>
          Dismiss
        </StyledButton>
        <StyledButton variant="outlined" color="secondary" onClick={onSubmit}>
          Confirm
        </StyledButton>
      </>
    );
  };

  const SingleButton: React.FC<{ text: string }> = ({ text }) => {
    return (
      <>
        <StyledButton variant="outlined" color="primary" onClick={onClose}>
          {text}
        </StyledButton>
      </>
    );
  };

  const AddUpdateErrorButton: React.FC = () => {
    return (
      <>
        <StyledButton variant="outlined" color="primary" onClick={onSubmit}>
          try again
        </StyledButton>
      </>
    );
  };
  if (type === NotificationTypes.LOADING_DATA) {
    errorMessage = NotificationTexts[NotificationTypes.LOADING_DATA];
    button = <SingleButton text="ok" />;
  } else if (type === NotificationTypes.ADD_USER) {
    errorMessage = NotificationTexts[NotificationTypes.ADD_USER];
    button = <SingleButton text="Confirm" />;
  } else if (type === NotificationTypes.SAVE_USER) {
    errorMessage = NotificationTexts[NotificationTypes.SAVE_USER];
    button = <SingleButton text="Confirm" />;
  } else if (type === NotificationTypes.MISSING_FIELDS) {
    errorMessage = NotificationTexts[NotificationTypes.MISSING_FIELDS];
    button = <SingleButton text="keep editing" />;
  } else if (type === NotificationTypes.DISCARD_CHANGES) {
    errorMessage = NotificationTexts[NotificationTypes.DISCARD_CHANGES];
    button = <ButtonSet />;
  } else if (type === NotificationTypes.SAVE_NEW_USER) {
    errorMessage = NotificationTexts[NotificationTypes.SAVE_NEW_USER];
    button = <SingleButton text="ok" />;
  } else if (type === NotificationTypes.FAIL_SAVE_NEW_USER) {
    errorMessage = NotificationTexts[NotificationTypes.FAIL_SAVE_NEW_USER];
    button = <AddUpdateErrorButton />;
  } else if (type === NotificationTypes.FAIL_UPDATE_USER) {
    errorMessage = NotificationTexts[NotificationTypes.FAIL_UPDATE_USER];
    button = <AddUpdateErrorButton />;
  } else if (type === NotificationTypes.DELETE_USER) {
    errorMessage = NotificationTexts[NotificationTypes.DELETE_USER];
    button = <ButtonSet />;
  } else if (type === NotificationTypes.DELETE_USER_SUCCESS) {
    errorMessage = NotificationTexts[NotificationTypes.DELETE_USER_SUCCESS];
    button = <SingleButton text="ok" />;
  } else if (type === NotificationTypes.LOGOUT_USER) {
    errorMessage = NotificationTexts[NotificationTypes.LOGOUT_USER];
    button = <ButtonSet />;
  } else if (type === NotificationTypes.SUCCESS_REGISTER_OBSERVER) {
    errorMessage =
      NotificationTexts[NotificationTypes.SUCCESS_REGISTER_OBSERVER];
    button = <SingleButton text="ok" />;
  } else if (type === NotificationTypes.SUCCESS_SEND_EMAIL) {
    errorMessage = NotificationTexts[NotificationTypes.SUCCESS_SEND_EMAIL];
    button = <SingleButton text="ok" />;
  } else if (type === NotificationTypes.FAIL_SEND_EMAIL) {
    errorMessage = NotificationTexts[NotificationTypes.FAIL_SEND_EMAIL];
    button = <SingleButton text="try again later" />;
  }

  function breakText(text: string) {
    if (text.length > 45) {
      const firstLine = text.substring(0, 45);
      const secondLine = text.substring(45);
      return `${firstLine}\n${secondLine}`;
    }
    return text;
  }

  return (
    <div>
      <StyledBackdrop open={open} />
      <StyledDialogContent open={open} onClose={onClose}>
        <DialogContent>
          <Typography variant="body1">
            {errorMessage ===
            NotificationTexts[NotificationTypes.SUCCESS_SEND_EMAIL]
              ? breakText(errorMessage)
              : errorMessage}
          </Typography>
          <ButtonWrapper>{button}</ButtonWrapper>
        </DialogContent>
      </StyledDialogContent>
    </div>
  );
};

export default NotificationPopup;
