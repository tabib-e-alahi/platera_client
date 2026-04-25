export type TImageDimensionRule = {
  minWidth?: number;
  minHeight?: number;
  exactWidth?: number;
  exactHeight?: number;
  tolerance?: number; // allowed ratio difference
};

export const getImageDimensions = (
  file: File
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      resolve({
        width: img.width,
        height: img.height,
      });
      URL.revokeObjectURL(objectUrl);
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Failed to read image dimensions"));
    };

    img.src = objectUrl;
  });
};

export const validateImageDimensions = async (
  file: File,
  rule: TImageDimensionRule
): Promise<{ valid: boolean; message?: string }> => {
  const { width, height } = await getImageDimensions(file);

  if (
    rule.exactWidth &&
    rule.exactHeight &&
    (width !== rule.exactWidth || height !== rule.exactHeight)
  ) {
    return {
      valid: false,
      message: `Image must be exactly ${rule.exactWidth}x${rule.exactHeight}px.`,
    };
  }

  if (rule.minWidth && width < rule.minWidth) {
    return {
      valid: false,
      message: `Image width must be at least ${rule.minWidth}px.`,
    };
  }

  if (rule.minHeight && height < rule.minHeight) {
    return {
      valid: false,
      message: `Image height must be at least ${rule.minHeight}px.`,
    };
  }

  return { valid: true };
};