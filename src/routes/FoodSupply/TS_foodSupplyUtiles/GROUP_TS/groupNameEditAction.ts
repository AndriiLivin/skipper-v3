import { redirect } from "react-router-dom";
import { IGroup, updateGroupName } from "../../../universal";

export async function groupNameEditAction({ request, params }) {
  const formData = await request.formData();
  const newGroupName = formData.get("newGroupName");

  await updateGroupName<IGroup>("products", params.groupId, newGroupName);
  return redirect(`/food-supply/food-groups/${params.groupId}`);
}
