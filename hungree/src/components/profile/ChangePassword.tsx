import React, { useState } from "react";
import styled from "styled-components";
import ReactModal from "react-modal";
import { setNewPassword } from "../../api/auth";
import ForgotPassword from "../ForgotPassword";
import useMargin from "../../hooks/useMargin";
ReactModal.setAppElement("#root");

type ViewTypes = "change" | "forgot" | "updated";

const ChangePassword = () => {
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <ChangeText onClick={() => setOpen(true)}>Endre passord</ChangeText>
      {isOpen && (
        <ChangePasswordModal isOpen={isOpen} onClose={() => setOpen(false)} />
      )}
    </>
  );
};

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  const [oldPwd, setOldPwd] = useState("");
  const [newPwd, setNewPwd] = useState("");
  const [repeatPwd, setRepeatPwd] = useState("");
  const [messages, setMessages] = useState([] as string[]);
  const [isValid, setValid] = useState(false);
  const [view, setView] = useState("change" as ViewTypes);

  const checkValidity = () => {
    setMessages([]);

    let msgArray: string[] = [];
    if (newPwd.length < 8) {
      msgArray.push("Must be at least 8 characters long");
    }

    if (newPwd.includes(" ")) {
      msgArray.push("Can't contain spaces");
    }

    const hasUppercase = new RegExp("^(?=.*[A-Z]).*$");
    if (!hasUppercase.test(newPwd)) {
      msgArray.push("Must contain at least one uppercase character");
    }

    const hasLowercase = new RegExp("^(?=.*[a-z]).*$");
    if (!hasLowercase.test(newPwd)) {
      msgArray.push("Must contain at least one lowercase character");
    }
    const hasDigit = new RegExp("^(?=.*[0-9]).*$");
    if (!hasDigit.test(newPwd)) {
      msgArray.push("Must contain at least one number");
    }

    if (msgArray.length > 0) {
      setMessages(msgArray);
      setValid(false);
      return;
    }

    if (newPwd === repeatPwd) {
      setValid(true);
    } else {
      setMessages(["Passwords must be the same"]);
      setValid(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isValid) {
      setNewPassword(
        oldPwd,
        newPwd,
        () => {
          setView("updated");
        },
        err => {
          setMessages([err]);
        }
      );
    }
  };

  const modalWidth = window.innerWidth >= 364 ? 350 : window.innerWidth;
  const sideMargin = useMargin(modalWidth);

  return (
    <ReactModal
      isOpen={isOpen}
      contentLabel="Change Password"
      shouldCloseOnOverlayClick={true}
      shouldCloseOnEsc={true}
      onRequestClose={onClose}
      style={{
        overlay: {
          backgroundColor: "rgba(0, 0, 0, 0.7)",
          zIndex: "10"
        },
        content: {
          top: "30vh",
          bottom: "auto",
          right: `${sideMargin}px`,
          left: `${sideMargin}px`,
          width: `${modalWidth}px`,
          border: "none",
          padding: "0",
          background: "white"
        }
      }}
    >
      <ModalWrapper>
        {view === "change" && (
          <>
            <p>Endre passord</p>
            <MessageList>
              {messages.map((m, i) => (
                <MessageItem key={"message_" + i}>{m}</MessageItem>
              ))}
            </MessageList>
            <PasswordForm onSubmit={handleSubmit}>
              <label htmlFor="old">Nåværende passord</label>
              <input
                id="old"
                type="password"
                value={oldPwd}
                onChange={e => setOldPwd(e.target.value)}
              />
              <label htmlFor="new">Nytt passord</label>
              <input
                id="new"
                type="password"
                value={newPwd}
                onChange={e => setNewPwd(e.target.value)}
                onBlur={checkValidity}
              />
              <label htmlFor="repeat">Gjenta passordet</label>
              <input
                id="repeat"
                type="password"
                value={repeatPwd}
                onChange={e => setRepeatPwd(e.target.value)}
                onBlur={checkValidity}
              />
              <SubmitButton
                type="submit"
                value="Save"
                disabled={!isValid || oldPwd.length < 6}
              />
              <ForgotPasswordLink onClick={() => setView("forgot")}>
                
Forgot your passwordet?
              </ForgotPasswordLink>
            </PasswordForm>
          </>
        )}

        {view === "updated" && (
          <UpdatedWrapper>
            <p>Passordet er endret!</p>
            <button onClick={() => onClose()}>Lukk</button>
          </UpdatedWrapper>
        )}
        {view === "forgot" && <ForgotPassword back={() => setView("change")} />}
      </ModalWrapper>
    </ReactModal>
  );
};

const ChangeText = styled.p`
  color: #333;
  text-decoration-line: underline;
  cursor: pointer;
  justify-self: center;
`;

const ForgotPasswordLink = styled(ChangeText)`
  color: #666;
  margin: 0.5em;
  grid-column: 1 / 3;
`;

const ModalWrapper = styled.div`
  padding: 1em;
  display: grid;
  grid-template-columns: 1fr;
  place-items: center;
  place-content: center;
`;

const MessageList = styled.ul`
  margin: 0;
  margin-bottom: 1em;
`;

const MessageItem = styled.li`
  color: #ff4f4f;
`;

const PasswordForm = styled.form`
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  row-gap: 0.5em;
`;

const SubmitButton = styled.input`
  grid-column: 1/3;
  width: 80%;
  justify-self: center;
`;

const UpdatedWrapper = styled.div`
  grid-row: 2/4;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr 1fr;
`;

export default ChangePassword;
