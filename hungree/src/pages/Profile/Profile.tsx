import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/types";
import styled from "styled-components";
import ChangePassword from "../../components/profile/ChangePassword";
import {
  toggleTooltips,
  toggleAutoSave,
  setAutoSaveTime
} from "../../redux/actions/authActions";
import { selectTimeToAutoSave } from "../../redux/selectors/authSelectors";
import { shouldLog } from "../../constants/util";

export default function Profile() {
  const isDemo = useSelector((state: RootState) => state.auth.isDemo);

  return (
    <div style={{ margin: "5vh 10vw 10vh 10vw", display: "grid" }}>
      <h1 style={{ textAlign: "center" }}>PROFIL</h1>
      <UserData />
      {!isDemo && <ChangePassword />}
    </div>
  );
}

const UserData = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const isDemo = useSelector((state: RootState) => state.auth.isDemo);
  const timeToAutoSave = useSelector(selectTimeToAutoSave);
  const dispatch = useDispatch();

  const onAutoSaveTimeChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const saveTime = parseInt(event.target.value, 10);
    if (saveTime !== timeToAutoSave) {
      shouldLog(`New AutoSave time: ${saveTime}`);
      dispatch(setAutoSaveTime(saveTime));
    }
  };

  return (
    <StyledUserData>
      <DataKey>First name</DataKey>
      <p>{user.firstName}</p>
      <DataKey>Last name</DataKey>
      <p>{user.lastName}</p>
      {!isDemo && (
        <>
          <DataKey>Show hint</DataKey>
          <input
            type="checkbox"
            checked={user.settings.showTooltips}
            onChange={() => dispatch(toggleTooltips())}
            style={{
              alignSelf: "center"
            }}
          />
          <DataKey>Auto Save</DataKey>
          <input
            type="checkbox"
            checked={user.settings.useAutoSave}
            onChange={() => dispatch(toggleAutoSave())}
            style={{
              alignSelf: "center"
            }}
          />
          <DataKey>Waiting before save</DataKey>
          <select
            value={timeToAutoSave}
            onChange={onAutoSaveTimeChange}
            style={{
              alignSelf: "center",
              width: "50%"
            }}
          >
            <option value={10000}>10 seconds</option>
            <option value={30000}>30 seconds</option>
            <option value={60000}>1 minute</option>
            <option value={120000}>2 minute</option>
          </select>
        </>
      )}
    </StyledUserData>
  );
};

const DataKey = styled.p`
  text-align: end;
  font-size: 0.9em;
  color: #444;
`;

const StyledUserData = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 2em;
`;
