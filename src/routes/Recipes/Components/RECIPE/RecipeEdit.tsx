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
  Box,
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
// import RecipesTable from "./RecipesTable";
import IngredientsTable from "./IngredientsTable";
import { IIngredient } from "../../../universal";

interface IElementProps {
  groupName: string;
  groupId: string;

  elementId: string;
  elementName: string;
  elementQty: string;
  elementDim: string;

  ingredients: IIngredient[];
}

export default function RecipeEdit(props: IElementProps) {
  // const { group, qqq} = useLoaderData();
  const submit = useSubmit();

  const [inputName, setInputName] = useState(props.elementName);
  const [inputQty, setInputQty] = useState(props.elementQty);
  const [inputIngredients, setInputIngredients] = useState<IIngredient[]>(
    props.ingredients
  );

  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const formData = new FormData();

  const handleClickSave = () => {
    formData.append("elementName", inputName);
    formData.append("elementQty", inputQty);
    //  т.к. не поддерживает передачу массивов и объуктов SON.stringify
    formData.append("elementIngredients", JSON.stringify(inputIngredients));

    submit(formData, {
      method: "post",
      action: `/recipes/recipe-groups/${props.groupId}/${props.elementId}/add-ingredient`,
    });
    setOpen(false);
  };

  const handleClickCancel = () => {
    setInputName(props.elementName);
    setInputQty(props.elementQty);
    setInputIngredients(props.ingredients);

    setOpen(false);
  };

  return (
    <div>
      <Tooltip title="Edit recipe">
        <IconButton type="button" onClick={handleClickOpen}>
          <EditOutlinedIcon fontSize="small" color="primary" />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClickCancel}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle
          id="form-dialog-title"
          sx={{ margin: "0 auto", fontWeight: 700 }}
        >
          You may change this Recipe.
        </DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
        >
          <Box sx={{ display: "flex", gap: "0.5rem" }}>
            <Box sx={{ alignContent: "center", fontWeight: 700 }}>
              Recipe name:
            </Box>

            <TextField
              sx={{
                flex: "1 0 50%",
              }}
              autoFocus
              // margin="dense"
              id="recipe-name"
              // label="Group Name"
              value={inputName}
              onChange={(e) => {
                setInputName(e.target.value);
              }}
              type="text"
              fullWidth
            />
            <Box sx={{ alignContent: "center", fontWeight: 700 }}>Persons:</Box>
            <input
              style={{
                flex: "1 0 5%",
                maxWidth: "3rem",
                color: "black",
                borderRadius: "4px",
                border: "1px solid lightgrey",
              }}
              // max="5"
              min="1"
              step="1"
              // autoFocus
              // margin="dense"
              id="recipe-qty"
              // label="Group Name"
              value={inputQty}
              onChange={(e) => {
                setInputQty(e.target.value);
              }}
              type="number"
              // fullWidth
            />
          </Box>
          <DialogTitle
            id="form-dialog-title"
            sx={{ margin: "0 auto", fontWeight: 700 }}
          >
            Ingredients for this Recipe.
          </DialogTitle>

          <IngredientsTable
            groupId={props.groupId}
            elementId={props.elementId}
            ingredients={inputIngredients}
            returnIngredients={setInputIngredients}
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
