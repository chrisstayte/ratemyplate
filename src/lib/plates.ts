export interface Plate {
  state: string;
  plateNumber: string;
}

/** Route params may still contain escapes for spaces in legacy plate numbers. */
export function decodePlateNumber(value: string): string {
  try {
    return decodeURIComponent(value).toUpperCase();
  } catch {
    // Leave malformed escapes for the existing plate validator to reject.
    return value.toUpperCase();
  }
}

export function validateLicensePlate(
  plate: string | null,
  country: string
): boolean {
  if (!plate) return false;

  let regex: RegExp;
  switch (country) {
    case 'US':
      regex = /^(?!\s*$)[A-Z0-9]{1,7}(\s[A-Z0-9]{1,7})*$/;
      break;
    case 'UK':
      regex = /^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$/;
      break;
    case 'DE':
      regex = /^[A-ZÄÖÜ]{1,3}-[A-Z]{1,2}\s[0-9]{1,4}$/;
      break;
    default:
      return false; // Unsupported country format
  }
  return regex.test(plate);
}
