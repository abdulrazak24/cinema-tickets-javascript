/**
 * TicketService.js - Implementation of the TicketService class.
 *
 * @module cinema-tickets-javascript
 */
import InvalidPurchaseException from './lib/InvalidPurchaseException.js';

/**
 * The TicketService class responsible for handling ticket purchases.
 *
 * @class TicketService
 */
export default class TicketService {
  /**
   * Constructs a TicketService instance.
   *
   * @constructor
   * @param {object} paymentService     - The service for handling payments.
   * @param {object} reservationService - The service for seat reservations.
   */
  constructor(paymentService, reservationService) {
    this.paymentService = paymentService;
    this.reservationService = reservationService;
    // Business rules
    this.ticketPrices = {
      INFANT: 0,
      CHILD: 10,
      ADULT: 20,
    };
    this.maxTicketsPerPurchase = 20;
  }

  /**
   * Method for purchasing tickets.
   *
   * @param   {number}              accountId          - The Account ID.
   * @param   {TicketTypeRequest[]} ticketTypeRequests - Array of ticket type requests.
   * @returns {number}                                 - The number of seats reserved.
   */
  purchaseTickets(accountId, ticketTypeRequests) {
    let numSeatsToReserve = 0;

    if (accountId <= 0) {
      console.log('Please provide a valid Account ID');
      return numSeatsToReserve;
    }

    try {
      // Validate ticket purchase request
      if (!this.#isValidPurchaseRequest(ticketTypeRequests)) {
        console.log('Not a valid Ticket Request. Please check the rules');
        return numSeatsToReserve;
      }

      // Calculate total amount
      const totalAmount = this.#calculateTotalAmount(ticketTypeRequests);

      // Make payment request to TicketPaymentService
      if (this.paymentService.makePayment(accountId, totalAmount)) {
        // Make seat reservation request to SeatReservationService
        numSeatsToReserve = this.#calculateNumSeatsToReserve(ticketTypeRequests);
        this.reservationService.reserveSeats(accountId, numSeatsToReserve);

        console.log('Ticket purchase successful!');
      } else {
        console.log('Payment failed. Ticket purchase unsuccessful.');
      }
    } catch (error) {
      if (error instanceof InvalidPurchaseException) {
        console.error(`InvalidPurchaseException: ${error.message}`);
      } else {
        console.error(`An unexpected error occurred: ${error.message}`);
      }
    }
    return numSeatsToReserve;
  }

  /**
   * Validates the ticket type request.
   *
   * @private
   * @param   {TicketTypeRequest[]} ticketTypeRequests - Array of ticket type requests.
   * @returns {boolean}                                - True if the request is valid.
   */
  #isValidPurchaseRequest(ticketTypeRequests) {
    // Check total quantity
    const totalQuantity = ticketTypeRequests.reduce(
      (total, request) => total + request.getNoOfTickets(),
      0,
    );
    if (totalQuantity > this.maxTicketsPerPurchase) {
      return false;
    }

    // Check if Child or Infant tickets are purchased without an Adult ticket
    const hasAdultTicket = ticketTypeRequests.some(
      (request) => request.getTicketType() === 'ADULT',
    );
    const hasChildOrInfantWithoutAdult = ticketTypeRequests.some(
      (request) => (request.getTicketType() === 'CHILD'
      || request.getTicketType() === 'INFANT')
      && !hasAdultTicket,
    );

    return hasAdultTicket && !hasChildOrInfantWithoutAdult;
  }

  /**
   * Calculates the total amount to pay for tickets.
   *
   * @private
   * @param   {TicketTypeRequest[]} ticketTypeRequests - Array of ticket type requests.
   * @returns {number}                                 - The total amount to pay.
   */
  #calculateTotalAmount(ticketTypeRequests) {
    return ticketTypeRequests.reduce((total, request) => {
      const ticketType = request.getTicketType();
      const ticketQuantity = request.getNoOfTickets();
      return total + this.ticketPrices[ticketType] * ticketQuantity;
    }, 0);
  }

  /**
   * Calculates the number of seats to reserve.
   *
   * @private
   * @param   {TicketTypeRequest[]} ticketTypeRequests - Array of ticket type requests.
   * @returns {number}                                 - The number of seats to reserve.
   */
  #calculateNumSeatsToReserve(ticketTypeRequests) {
    return ticketTypeRequests.reduce((total, request) => {
      const ticketType = request.getTicketType();
      const ticketQuantity = request.getNoOfTickets();
      return total + (ticketType !== 'INFANT' ? ticketQuantity : 0);
    }, 0);
  }
}
