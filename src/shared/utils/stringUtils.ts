/**
 * Extracts initials from a full name.
 * Returns up to 2 initials (first and last name).
 *
 * @param fullName - The full name to extract initials from
 * @returns A string containing the initials (1-2 characters)
 *
 * @example
 * getInitials("John Doe") // "JD"
 * getInitials("John") // "J"
 * getInitials("John Michael Doe") // "JD"
 * getInitials("") // ""
 */
export const getInitials = (fullName: string): string => {
  if (!fullName || fullName.trim() === '') {
    return '';
  }

  const names = fullName.trim().split(/\s+/);

  if (names.length === 1) {
    // Single name - return first character
    return names[0].charAt(0).toUpperCase();
  }

  // Multiple names - return first char of first and last name
  const firstInitial = names[0].charAt(0).toUpperCase();
  const lastInitial = names[names.length - 1].charAt(0).toUpperCase();

  return `${firstInitial}${lastInitial}`;
};
