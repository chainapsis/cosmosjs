export function validateIdentifier(id: string, min: number, max: number): void {
  if (!id) {
    throw new Error("Empty id");
  }

  if (id.indexOf("/") >= 0) {
    throw new Error(`Identifier ${id} cannot contain separator '/'`);
  }

  if (id.length < min || id.length > max) {
    throw new Error(
      `Identifier ${id} has invalid length: ${
        id.length
      }, must be between ${min}-${max} characters`
    );
  }

  if (id !== id.toLowerCase()) {
    throw new Error(
      `Identifier ${id} must contain only lowercase alphabetic characters`
    );
  }
}
