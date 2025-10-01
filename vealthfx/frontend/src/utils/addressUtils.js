/**
 * Safely formats an Aptos address for display
 * @param {any} address - The address to format (could be string, object, or undefined)
 * @param {string} fallback - Fallback text if address is invalid
 * @returns {string} Formatted address or fallback
 */
export const formatAddress = (address, fallback = "Connected") => {
  // Handle different address formats
  let addressStr = null;

  if (typeof address === "string") {
    addressStr = address;
  } else if (address && typeof address === "object") {
    // Some wallets return address as an object with .toString() method
    if (typeof address.toString === "function") {
      addressStr = address.toString();
    } else if (address.address && typeof address.address === "string") {
      addressStr = address.address;
    }
  }

  // Validate and format the address string
  if (addressStr && addressStr.length >= 10) {
    return `${addressStr.slice(0, 6)}...${addressStr.slice(-4)}`;
  }

  return fallback;
};

/**
 * Safely gets the address string from an account object
 * @param {any} account - The account object
 * @returns {string|null} The address string or null
 */
export const getAccountAddress = (account) => {
  if (!account) return null;

  if (typeof account.address === "string") {
    return account.address;
  } else if (
    account.address &&
    typeof account.address.toString === "function"
  ) {
    return account.address.toString();
  }

  return null;
};

/**
 * Checks if an account has a valid address
 * @param {any} account - The account object to check
 * @returns {boolean} True if account has valid address
 */
export const hasValidAddress = (account) => {
  return getAccountAddress(account) !== null;
};
