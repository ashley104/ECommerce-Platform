"use server";

import { createPost, updatePost } from "@repo/db/posts";
import { toUrlPath } from "@repo/utils/url";
import { validatePost } from "../../utils/post";

type SavePostState = {
  errors?: Record<string, string>;
  success?: boolean;
};

export async function savePost(
  _prevState: SavePostState,
  formData: FormData
): Promise<SavePostState> {
  try {
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;
    const content = formData.get("content") as string;
    const tags = formData.get("tags") as string;
    const image = formData.get("image") as string;

    // Validate form data
    const data = { title, description, content, tags, image };
    const errors = validatePost(data);

    if (Object.keys(errors).length > 0) {
      return { errors };
    }

    // Determine if this is a create or update by checking for postId
    const postId = formData.get("postId") as string | null;

    if (postId) {
      // Update existing post
      const id = parseInt(postId, 10);
      await updatePost(id, {
        title,
        description,
        content,
        tags,
        imageUrl: image,
        category,
      });

      return { success: true };
    } else {
      // Create new post
      const urlId = toUrlPath(title);
      await createPost({
        urlId,
        title,
        description,
        content,
        tags,
        imageUrl: image,
        category,
      });

      return { success: true };
    }
  } catch (error) {
    console.error("Error saving post:", error);
    return {
      errors: {
        submit: "Failed to save post. Please try again.",
      },
    };
  }
}