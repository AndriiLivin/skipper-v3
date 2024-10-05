import React, { useState } from "react";
import { useSubmit } from "react-router-dom";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  // DialogContentText,
  DialogTitle,
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

interface IElementProps {
  groupName: string;
  groupId: string;

  elementId: string;
  elementName: string;
  elementQty: string;
  elementDim: string;
}

export default function ProductEdit(props: IElementProps) {
  const submit = useSubmit();

  const dimentions = ["---", "kg", "Lt", "pieces", "mLt", "gr."];

  const [inputName, setInputName] = useState(props.elementName);
  const [inputQty, setInputQty] = useState(props.elementQty);
  const [inputDim, setInputDim] = useState(props.elementDim);

  const currentIndex = dimentions.findIndex((dim) => {
    return dim === props.elementDim;
  });
  const [selectedIndex, setSelectedIndex] = React.useState(currentIndex);

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const formData = new FormData();

  const handleClickSave = () => {
    formData.append("elementName", inputName);
    formData.append("elementQty", inputQty);
    formData.append("elementDim", inputDim);

    submit(formData, {
      method: "post",
      action: `/food-supply/food-groups/${props.groupId}/${props.elementId}/edit-element`,
    });
    setOpen(false);
  };

  const handleClickCancel = () => {
    setOpen(false);
    setInputName(props.elementName);
    setInputQty(props.elementQty);
    setInputDim(props.elementDim);
  };

  return (
    <div>
      <Tooltip title="Edit product">
        <IconButton type="button" onClick={handleClickOpen}>
          <EditOutlinedIcon fontSize="small" color="primary" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClickCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Сhange the Product characteristics.
        </DialogTitle>
        <DialogContent sx={{ display: "flex" }}>
          <TextField
            sx={{ flex: "1 0 55%" }}
            autoFocus
            // margin="dense"
            id="product-name"
            // label="Group Name"
            value={inputName}
            onChange={(e) => {
              setInputName(e.target.value);
            }}
            type="text"
            fullWidth
          />
          {/* <TextField */}
          <input
            style={{
              flex: "1 0 10%",
              maxWidth: "5rem",
              color: "black",
              borderRadius: "4px",
              border: "1px solid lightgrey",
            }}
            // max="5"
            min="0"
            step="0.5"
            // autoFocus
            // margin="dense"
            id="product-qty"
            // label="Group Name"
            value={inputQty}
            onChange={(e) => {
              setInputQty(e.target.value);
            }}
            type="number"
            // fullWidth
          />

          <TextField
            sx={{ flex: "1 0 25%", maxWidth: "5.8rem" }}
            id="standard-select"
            select
            // label="Native select"
            value={selectedIndex}
            SelectProps={{
              // нужно а то нет выбора
              native: true,
            }}
            // делает окно узким
            // variant="standard"
            fullWidth
            onChange={(event) => {

              const target = event.target as unknown as HTMLSelectElement;
              
              setInputDim(dimentions[target.selectedIndex]);
              setSelectedIndex(target.selectedIndex);
            }}
          >
            {dimentions.map((dimention, index) => (
              <option value={index} key={index}>
                {dimention}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickSave} color="primary">
            Save
          </Button>
          <Button onClick={handleClickCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
