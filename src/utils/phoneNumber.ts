export const formatPhoneNumber = (input: string): string => {
  // Remove all non-digit characters
  const cleaned = input.replace(/\D/g, '');
  
  // Format based on length
  if (cleaned.length >= 11) {
    const countryCode = cleaned.slice(0, 2); // Allow for 2-digit country codes
    const areaCode = cleaned.slice(2, 5);
    const middle = cleaned.slice(5, 8);
    const last = cleaned.slice(8, 12);
    return `+${countryCode} ${areaCode} ${middle} ${last}`;
  }
  
  return `+${cleaned}`;
};

export const isValidPhoneNumber = (phoneNumber: string): boolean => {
  const cleaned = phoneNumber.replace(/\D/g, '');
  // Updated validation: should be between 11-15 digits to accommodate various international formats
  // This allows for:
  // - Country code (1-3 digits)
  // - Area code (2-4 digits)
  // - Local number (6-8 digits)
  return cleaned.length >= 11 && cleaned.length <= 15;
};