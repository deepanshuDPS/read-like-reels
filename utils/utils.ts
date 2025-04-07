import { redirect } from "next/navigation";


enum PostgresErrorCode {
  UniqueViolation = '23505',
  ForeignKeyViolation = '23503',
  NotNullViolation = '23502',
  CheckViolation = '23514',
  // Add other error codes as needed
}

/**
 * Redirects to a specified path with an encoded message as a query parameter.
 * @param {('error' | 'success')} type - The type of message, either 'error' or 'success'.
 * @param {string} path - The path to redirect to.
 * @param {string} message - The message to be encoded and added as a query parameter.
 * @returns {never} This function doesn't return as it triggers a redirect.
 */
export function encodedRedirect(
  type: "error" | "success",
  path: string,
  message: string,
) {
  return redirect(`${path}?${type}=${encodeURIComponent(message)}`);
}


export const removeKeys = (obj: any, keysToRemove: string[]): any => {
  // Create a shallow copy of the object to avoid mutating the original
  const newObj = { ...obj };

  // Loop through the keys and remove each key
  keysToRemove.forEach((key) => {
    delete newObj[key];
  });

  return newObj;
};


export const handlePostgresError = (error: any) => {
  if (error.code) {
    switch (error.code) {
      case PostgresErrorCode.UniqueViolation:
        return {
          status: 409,
          message: 'A record with the same unique field already exists.',
        };
      case PostgresErrorCode.ForeignKeyViolation:
        return {
          status: 400,
          message: 'The referenced record does not exist.',
        };
      case PostgresErrorCode.NotNullViolation:
        return {
          status: 400,
          message: 'A required field cannot be null.',
        };
      case PostgresErrorCode.CheckViolation:
        return {
          status: 400,
          message: 'Data does not meet the specified constraints.',
        };
      default:
        return {
          status: 500,
          message: 'An unexpected error occurred.',
        };
    }
  }

  return {
    status: 500,
    message: 'An unexpected error occurred.',
  };
};
