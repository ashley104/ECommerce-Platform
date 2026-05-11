export interface ProductValidationInput {
  name: string;
  category: string;
  description: string;
  imageUrl: string;
  price: number;
  stock: number;
}

export function validateProduct(input: ProductValidationInput): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!input.name?.trim()) {
    errors.name = "Product name is required.";
  }

  if (!input.category?.trim()) {
    errors.category = "Category is required.";
  }

  if (!input.description?.trim()) {
    errors.description = "Description is required.";
  }

  if (!input.imageUrl?.trim()) {
    errors.imageUrl = "Image URL is required.";
  } else {
    try {
      const url = new URL(input.imageUrl);

      if (!["http:", "https:"].includes(url.protocol)) {
        errors.imageUrl = "Image URL must start with http or https.";
      }
    } catch {
      errors.imageUrl = "Enter a valid image URL.";
    }
  }

  if (!Number.isFinite(input.price) || input.price < 0) {
    errors.price = "Price must be a positive number.";
  }

  if (!Number.isFinite(input.stock) || !Number.isInteger(input.stock) || input.stock < 0) {
    errors.stock = "Stock must be a whole number of 0 or more.";
  }

  return errors;
}
