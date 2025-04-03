export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_DESCRIPTION_LENGTH = 2000;
export const MAX_LINK_LENGTH = 500;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const validateCarData = (data) => {
  const errors = {};

  // Required fields
  const requiredFields = [
    "make",
    "model",
    "year",
    "price",
    "carClass",
    "drive",
    "fuel_type",
    "transmission",
    "kph",
    "mileage",
    "description",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      errors[field] = `${field} is required`;
    }
  }

  // Numeric validations
  if (data.year) {
    const year = Number(data.year);
    const currentYear = new Date().getFullYear();
    if (isNaN(year) || year < 1900 || year > currentYear + 1) {
      errors.year = "Invalid year";
    }
  }

  if (data.price) {
    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
      errors.price = "Invalid price";
    }
  }

  if (data.kph) {
    const kph = Number(data.kph);
    if (isNaN(kph) || kph < 0 || kph > 500) {
      errors.kph = "Invalid speed";
    }
  }

  if (data.mileage) {
    const mileage = Number(data.mileage);
    if (isNaN(mileage) || mileage < 0) {
      errors.mileage = "Invalid mileage";
    }
  }

  // Text length validations
  if (data.description && data.description.length > MAX_DESCRIPTION_LENGTH) {
    errors.description = `Description must be less than ${MAX_DESCRIPTION_LENGTH} characters`;
  }

  if (data.link) {
    if (data.link.length > MAX_LINK_LENGTH) {
      errors.link = `Link must be less than ${MAX_LINK_LENGTH} characters`;
    }
    try {
      new URL(data.link);
    } catch {
      errors.link = "Invalid URL format";
    }
  }

  if (data.images) {
    if (data.images.length === 0) {
      errors.images = "At least one image is required";
    }

    for (const imageUrl of data.images) {
      if (!isValidImageUrl(imageUrl)) {
        errors.images = "Invalid image URL format";
        break;
      }
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const validateImageFile = (file) => {
  const errors = {};

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    errors.type = "Invalid file type. Only JPEG, PNG, GIF and WebP are allowed";
  }

  if (file.size > MAX_FILE_SIZE) {
    errors.size = `File size must be less than ${
      MAX_FILE_SIZE / 1024 / 1024
    }MB`;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
