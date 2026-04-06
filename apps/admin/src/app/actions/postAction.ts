import { validatePost } from "../../utils/post";

export async function savePost(_: any, formData: FormData) {
  const data = Object.fromEntries(formData);
  const errors = validatePost(data);

  if (Object.keys(errors).length > 0) {
    return { errors };
  }
  return { success: "Post saved successfully!" };
}