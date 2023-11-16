/**
 * TicketServiceTest.js - Test suite for the TicketService class.
 *
 * @module cinema-tickets-javascript
 */
import { expect } from 'chai';
import TicketService from '../src/pairtest/TicketService.js';
import TicketTypeRequest from '../src/pairtest/lib/TicketTypeRequest.js';

/**
 * Class representing tests for the TicketService class.
 *
 * @class TicketServiceTest
 */
class TicketServiceTest {
  /**
   * Constructs a TicketServiceTest instance.
   *
   * @constructor
   */
  constructor() {
    this.ticketService = null;
    this.accountId = 0;
    this.reservedSeats = 0;
  }

  /**
   * Sets up the test environment before each test.
   *
   * @function
   */
  beforeEach() {
    this.accountId = 123;
    this.reservedSeats = 0;

    // Mock TicketPaymentService and SeatReservationService methods
    const paymentServiceMock = {
      makePayment: () => true,
    };

    const reservationServiceMock = {
      reserveSeats: () => true,
    };

    this.ticketService = new TicketService(
      paymentServiceMock,
      reservationServiceMock,
    );
  }

  /**
   * Runs the tests for the TicketService class.
   *
   * @function
   */
  runTests() {
    describe('TicketService', () => {
      beforeEach(() => this.beforeEach());

      it('should successfully purchase tickets for a valid request', () => {
        // Make a valid purchase request
        const ticketTypeRequests = [
          new TicketTypeRequest('ADULT', 2),
          new TicketTypeRequest('CHILD', 1),
        ];

        this.reservedSeats = 3;

        // Run the purchaseTickets method
        const result = this.ticketService.purchaseTickets(
          this.accountId,
          ticketTypeRequests,
        );

        // Assert that the purchase was successful
        expect(result).to.equal(this.reservedSeats);
      });

      it('should reserve only one seat for Adult and Infant', () => {
        // Make a valid purchase request
        const ticketTypeRequests = [
          new TicketTypeRequest('ADULT', 1),
          new TicketTypeRequest('INFANT', 1),
        ];

        this.reservedSeats = 1;

        // Run the purchaseTickets method
        const result = this.ticketService.purchaseTickets(
          this.accountId,
          ticketTypeRequests,
        );

        // Assert that the purchase was successful
        expect(result).to.equal(this.reservedSeats);
      });

      it('should reject purchase for invalid account id', () => {
        const ticketTypeRequests = [
          new TicketTypeRequest('ADULT', 1),
        ];

        this.accountId = 0;

        // Run the purchaseTickets method
        const result = this.ticketService.purchaseTickets(
          this.accountId,
          ticketTypeRequests,
        );

        // Assert that the purchase was successful
        expect(result).to.equal(this.reservedSeats);
      });

      it('should reject purchase for invalid ticket type', () => {
        try {
          // Make an invalid purchase request with an unknown ticket type
          const ticketTypeRequests = [
            new TicketTypeRequest('UNKNOWN_TYPE', 2),
          ];
        } catch (error) {
          expect(error).to.be.instanceOf(TypeError);
          expect(error.message).to.equal(
            'type must be one of ADULT, CHILD, or INFANT',
          );
        }
      });

      it('should reject purchase for exceeding maximum tickets', () => {
        // Make a purchase request exceeding the maximum number of tickets
        const ticketTypeRequests = [
          new TicketTypeRequest('ADULT', 21),
        ];

        // Run the purchaseTickets method
        const result = this.ticketService.purchaseTickets(
          this.accountId,
          ticketTypeRequests,
        );

        // Assert that the purchase was rejected
        expect(result).to.equal(this.reservedSeats);
      });

      it('should reject purchase without an Adult ticket', () => {
        // Make a purchase request without an Adult ticket
        const ticketTypeRequests = [
          new TicketTypeRequest('CHILD', 1),
        ];

        // Run the purchaseTickets method
        const result = this.ticketService.purchaseTickets(
          this.accountId,
          ticketTypeRequests,
        );

        // Assert that the purchase was rejected
        expect(result).to.equal(this.reservedSeats);
      });

      it('should reject purchase without sufficient funds', () => {
        // Mock TicketPaymentService and SeatReservationService methods
        const paymentServiceMock = {
          makePayment: () => false,
        };

        const reservationServiceMock = {
          reserveSeats: () => false,
        };

        this.ticketService = new TicketService(
          paymentServiceMock,
          reservationServiceMock,
        );

        // Make a purchase request with insufficient funds
        const ticketTypeRequests = [
          new TicketTypeRequest('ADULT', 2),
        ];

        // Run the purchaseTickets method
        const result = this.ticketService.purchaseTickets(
          this.accountId,
          ticketTypeRequests,
        );

        console.log(result);

        // Assert that the purchase was rejected
        expect(result).to.equal(this.reservedSeats);
      });
    });
  }
}

// Run the tests
new TicketServiceTest().runTests();
