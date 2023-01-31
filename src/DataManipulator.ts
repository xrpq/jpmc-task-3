import { ServerRespond } from './DataStreamer';

export interface Row {
  price_first_stock: number,
  price_second_stock: number,
  ratio: number,
  upper_bound: number,
  lower_bound: number,
  ratio_line: number | undefined,
  timestamp: Date,
}


export class DataManipulator {
   /**
   * Generates a Row object from an array of ServerRespond objects.
   *
   * @param serverResponds - An array of ServerRespond objects
   * @returns A Row object with properties for prices, ratio, timestamp, upper and lower bounds, and ratio line
   */
  static generateRow(serverResponds: ServerRespond[]): Row {
    // Calculate average prices for first and second stock
    const firstPrice = (serverResponds[0].top_ask.price + serverResponds[0].top_bid.price) / 2;
    const secondPrice = (serverResponds[1].top_ask.price + serverResponds[1].top_bid.price) /2;
    // Calculate ratio of first stock price to second stock price
    const ratio = firstPrice / secondPrice;

    // Set 10% upper and lower bounds for ratio
    const upperBound = 1 + 0.1;
    const lowerBound = 1 - 0.1
      return {
        price_first_stock: firstPrice,
        price_second_stock: secondPrice,
        ratio,
        // Determine timestamp of most recent ServerRespond
        timestamp: serverResponds[0].timestamp > serverResponds[1].timestamp ? serverResponds[0].timestamp : serverResponds[1].timestamp,
        upper_bound: upperBound,
        lower_bound: lowerBound,
        // Determine if ratio is outside of bounds
        ratio_line: (ratio > upperBound || ratio < lowerBound) ? ratio : undefined,
      };

  }
}
