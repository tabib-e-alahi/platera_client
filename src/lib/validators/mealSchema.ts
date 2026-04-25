// src/validators/meal.validator.ts

import { z } from "zod";

const optionalIntFromInput = (min?: number, minMessage?: string) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      return value;
    },
    z
      .coerce
      .number()
      .int("Must be a whole number.")
      .refine((val) => (min !== undefined ? val >= min : true), {
        message: minMessage ?? `Must be at least ${min}.`,
      })
      .optional()
  );

const optionalNumberFromInput = (min?: number, minMessage?: string) =>
  z.preprocess(
    (value) => {
      if (value === "" || value === null || value === undefined) {
        return undefined;
      }
      return value;
    },
    z
      .coerce
      .number()
      .refine((val) => (min !== undefined ? val >= min : true), {
        message: minMessage ?? `Must be at least ${min}.`,
      })
      .optional()
  );

const optionalTrimmedString = (max: number, message: string) =>
  z.preprocess(
    (value) => {
      if (typeof value !== "string") return value;
      const trimmed = value.trim();
      return trimmed === "" ? undefined : trimmed;
    },
    z.string().max(max, message).optional()
  );

const mealSizeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Size name is required.")
    .max(30, "Size name too long."),
  extraPrice: z.coerce
    .number()
    .int("Must be a whole number.")
    .min(0, "Cannot be negative.")
    .default(0),
  isDefault: z.boolean().default(false),
});

const mealSpiceLevelSchema = z.object({
  level: z
    .string()
    .trim()
    .min(1, "Spice level name is required.")
    .max(30, "Too long."),
  isDefault: z.boolean().default(false),
});

const mealAddOnSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Add-on name is required.")
    .max(50, "Too long."),
  price: z.coerce
    .number()
    .int("Must be a whole number.")
    .min(1, "Price must be at least 1."),
});

const mealIngredientSchema = z.object({
  name: z.string().trim().min(1, "Ingredient name is required."),
});

const mealRemoveOptionSchema = z.object({
  name: z.string().trim().min(1, "Remove option is required."),
});

export const addMealSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Meal name is required.")
      .min(2, "Meal name must be at least 2 characters.")
      .max(100, "Meal name cannot exceed 100 characters."),

    categoryId: z
      .string()
      .min(1, "Please select a category.")
      .uuid("Invalid category."),

    subcategory: optionalTrimmedString(50, "Subcategory too long."),

    shortDescription: z
      .string()
      .trim()
      .min(1, "Short description is required.")
      .min(10, "Must be at least 10 characters.")
      .max(200, "Cannot exceed 200 characters."),

    fullDescription: optionalTrimmedString(2000, "Cannot exceed 2000 characters."),

    portionSize: optionalTrimmedString(50, "Too long."),

    basePrice: z.coerce
      .number({ message: "Base price is required." })
      .int("Must be a whole number.")
      .min(1, "Base price must be at least ৳1."),

    discountPrice: optionalIntFromInput(
      1,
      "Discount price must be at least ৳1."
    ),

    discountStartDate: z.preprocess(
      (value) => {
        if (typeof value !== "string") return value;
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
      },
      z.string().optional()
    ),

    discountEndDate: z.preprocess(
      (value) => {
        if (typeof value !== "string") return value;
        const trimmed = value.trim();
        return trimmed === "" ? undefined : trimmed;
      },
      z.string().optional()
    ),

    preparationTimeMinutes: z.coerce
      .number()
      .int("Must be a whole number.")
      .min(1, "Must be at least 1 minute.")
      .max(180, "Cannot exceed 180 minutes.")
      .default(15),

    deliveryFee: z.coerce
      .number()
      .int("Must be a whole number.")
      .min(0, "Cannot be negative.")
      .default(0),

    dietaryPreferences: z
      .array(
        z.enum([
          "VEGAN",
          "VEGETARIAN",
          "HALAL",
          "GLUTEN_FREE",
          "DAIRY_FREE",
          "NUT_FREE",
        ])
      )
      .default([]),

    allergens: z.array(z.string().trim().min(1)).default([]),

    tags: z
      .array(z.string().trim().min(1).max(30))
      .max(10, "Cannot have more than 10 tags.")
      .default([]),

    ingredients: z
      .array(mealIngredientSchema)
      .max(30, "Cannot have more than 30 ingredients.")
      .default([]),

    sizes: z
      .array(mealSizeSchema)
      .max(5, "Cannot have more than 5 sizes.")
      .default([]),

    spiceLevels: z
      .array(mealSpiceLevelSchema)
      .max(5, "Cannot have more than 5 spice levels.")
      .default([]),

    addOns: z
      .array(mealAddOnSchema)
      .max(10, "Cannot have more than 10 add-ons.")
      .default([]),

    removeOptions: z
      .array(mealRemoveOptionSchema)
      .max(10, "Cannot have more than 10 remove options.")
      .default([]),

    calories: optionalIntFromInput(0, "Calories cannot be negative."),
    protein: optionalNumberFromInput(0, "Protein cannot be negative."),
    fat: optionalNumberFromInput(0, "Fat cannot be negative."),
    carbohydrates: optionalNumberFromInput(
      0,
      "Carbohydrates cannot be negative."
    ),
  })
  .refine(
    (data) => {
      if (
        data.discountPrice !== undefined &&
        data.discountPrice >= data.basePrice
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Discount price must be less than base price.",
      path: ["discountPrice"],
    }
  )
  .refine(
    (data) => {
      if (data.discountStartDate && data.discountEndDate) {
        return new Date(data.discountEndDate) > new Date(data.discountStartDate);
      }
      return true;
    },
    {
      message: "End date must be after start date.",
      path: ["discountEndDate"],
    }
  )
  .refine(
    (data) => {
      if (data.discountEndDate) {
        return new Date(data.discountEndDate) > new Date();
      }
      return true;
    },
    {
      message: "Discount end date must be in the future.",
      path: ["discountEndDate"],
    }
  )
  .refine(
    (data) => {
      const hasDates = !!(data.discountStartDate || data.discountEndDate);
      const hasDiscount = data.discountPrice !== undefined;
      return !(hasDates && !hasDiscount);
    },
    {
      message: "Discount dates require a discount price to be set.",
      path: ["discountStartDate"],
    }
  )
  .refine(
    (data) => {
      if (data.sizes.length > 0) {
        return data.sizes.filter((s) => s.isDefault).length === 1;
      }
      return true;
    },
    {
      message: "Exactly one size must be marked as default.",
      path: ["sizes"],
    }
  )
  .refine(
    (data) => {
      if (data.spiceLevels.length > 0) {
        return data.spiceLevels.filter((s) => s.isDefault).length === 1;
      }
      return true;
    },
    {
      message: "Exactly one spice level must be marked as default.",
      path: ["spiceLevels"],
    }
  );

export type TAddMealFormInput = z.input<typeof addMealSchema>;
export type TAddMealForm = z.output<typeof addMealSchema>;