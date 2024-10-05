import { redirect } from "react-router-dom";
import { IGroup, deleteElement } from "../../../universal";

export async function destroyProductAction({ params }) {
  await deleteElement<IGroup>("products", params.groupId, params.elementId);
  return redirect(`/food-supply/food-groups/${params.groupId}`);
}
