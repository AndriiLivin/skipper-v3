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

interface IGroupNameProps {
  groupName: string;
  groupId: string;
}

export default function RecipeGroupNameEdit(props: IGroupNameProps) {
  // const {productId, groupName} = props;
  const submit = useSubmit();

  const [open, setOpen] = React.useState(false);
  const [inputText, setInputText] = useState(props.groupName);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const formData = new FormData();

  const handleClickSave = () => {
    formData.append("newRecipeGroupName", inputText);

    submit(formData, {
      method: "post",
      action: `recipe-groups/${props.groupId}/edit-name`,
    });
    setOpen(false);
  };

  const handleClickCancel = () => {
    setOpen(false);
    setInputText(props.groupName);
  };

  return (
    <div>
      <Tooltip title="Edit group name">
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
          Edit the Recipe Group name.
        </DialogTitle>
        <DialogContent>
          {/* <DialogContentText>
            Отредактируйте название продуктовой группы.
          </DialogContentText> */}
          <TextField
            autoFocus
            // margin="dense"
            id="groupe-name"
            // label="Group Name"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
            }}
            type="text"
            fullWidth
          />
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
