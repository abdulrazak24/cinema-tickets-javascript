/**
 * Custom exception for invalid ticket purchases.
 *
 * @class InvalidPurchaseException
 * @extends Error
 */
export default class InvalidPurchaseException extends Error {
  /**
   * Creates an instance of InvalidPurchaseException.
   * @param {string} message - The error message.
   */
  constructor(message) {
    super(message);
    this.name = 'InvalidPurchaseException';
  }
}
