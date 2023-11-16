/**
 * Represents a request for a specific type and quantity of tickets.
 *
 * @class TicketTypeRequest
 */
export default class TicketTypeRequest {
  /**
   * Private type variable.
   *
   * @private
   * @type {string}
   */
  #type;

  /**
   * Private variable representing the number of tickets.
   *
   * @private
   * @type {number}
   */
  #noOfTickets;

  /**
   * Immutable array of valid ticket types.
   *
   * @private
   * @type {string[]}
   */
  #Type = ['ADULT', 'CHILD', 'INFANT'];

  /**
   * Creates an instance of TicketTypeRequest.
   *
   * @param  {string} type        - The type of the ticket (e.g., 'ADULT', 'CHILD', 'INFANT').
   * @param  {number} noOfTickets - The quantity of tickets requested.
   * @throws {TypeError}          - If the provided type is not valid
   *                                or if noOfTickets is not an integer.
   */
  constructor(type, noOfTickets) {
    if (!this.#Type.includes(type)) {
      throw new TypeError(`type must be one of ${this.#Type.slice(0, -1).join(', ')}, or ${this.#Type.slice(-1)}`);
    }

    if (!Number.isInteger(noOfTickets)) {
      throw new TypeError('noOfTickets must be an integer');
    }

    this.#type = type;
    this.#noOfTickets = noOfTickets;
  }

  /**
   * Gets the quantity of tickets requested.
   *
   * @returns {number} The quantity of tickets requested.
   */
  getNoOfTickets() {
    return this.#noOfTickets;
  }

  /**
   * Gets the type of the ticket.
   *
   * @returns {string} The type of the ticket.
   */
  getTicketType() {
    return this.#type;
  }
}
