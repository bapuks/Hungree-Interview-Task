import React from "react";
import Buttons from "../../util/Buttons";
import Icons from "../../util/Icons";

interface IFunctionsRow {
  undo: () => void;
}

const FunctionsRow: React.FC<IFunctionsRow> = ({ undo }) => {
  return (
    <tr>
      <td />
      <td />
      <td
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          marginRight: "1em"
        }}
      >
        <br />
        <Buttons.Confirm
          message="Are you sure you want to Cancel?"
          onConfirm={undo}
        >
          <Icons.Undo />
        </Buttons.Confirm>
      </td>
    </tr>
  );
};

export default FunctionsRow;
