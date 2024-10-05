import { redirect } from "react-router-dom";
import { IGroup, deleteGroup } from "../../../universal";

export async function destroyGroupAction({ params }) {
  // throw new Error("Вот ВАМ Баг!")
  await deleteGroup<IGroup>("products", params.groupId);

  return redirect("/food-supply");
}
