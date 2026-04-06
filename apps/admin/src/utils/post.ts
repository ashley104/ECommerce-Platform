export function validatePost(fields: any) {
  const errors: any = {};

  if (!fields.title) errors.title = "Title is required";

  if (!fields.description) {
    errors.description = "Description is required";
  } else if (fields.description.length > 200) {
    errors.description =
      "Description is too long. Maximum is 200 characters";
  }

  if (!fields.content) errors.content = "Content is required";

  if (!fields.image) {
    errors.image = "Image URL is required";
  } else {
    try {
      new URL(fields.image);
    } catch {
      errors.image = "This is not a valid URL";
    }
  }

  if (!fields.tags) {
    errors.tags = "At least one tag is required";
  }

  return errors;
}