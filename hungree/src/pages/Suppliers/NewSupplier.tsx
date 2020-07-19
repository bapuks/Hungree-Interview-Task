import React, { useState } from "react";
import NewModal from "../../components/inventory/NewModals/NewModal";
import { useSelector, useDispatch } from "react-redux";
import { selectSupplierNames } from "../../redux/selectors/suppliersSelectors";
import { RootState } from "../../redux/types";
import { addChange } from "../../redux/actions/reportsActions";
import { saveCreatedSupplier } from "../../redux/actions/suppliersActions";

interface NewSupplierProps {
  isOpen: boolean;
  onClose: () => void;
}

const NewSupplier: React.FC<NewSupplierProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const supplierNames = useSelector(selectSupplierNames);
  const nextID = useSelector(
    (state: RootState) => state.suppliers.currentID + 1
  );

  const handleSave = () => {
    setMessage("");
    if (name.length < 1) {
      setMessage("Fill in name!");
    } else if (supplierNames.includes(name)) {
      setMessage("Enter a unique name!");
    } else {
      dispatch(
        addChange({
          type: "NEW_SUPPLIER",
          id: nextID,
          name,
          section: "suppliers"
        })
      );
      dispatch(saveCreatedSupplier(name));
      onClose();
    }
  };

  return (
    <NewModal
      isOpen={isOpen}
      onClose={onClose}
      title={"New supplier"}
      name={name}
      setName={setName}
      message={message}
      onSave={handleSave}
    />
  );
};

export default NewSupplier;
