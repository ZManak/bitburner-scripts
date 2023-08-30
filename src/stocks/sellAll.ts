/* eslint-disable no-constant-condition */
import { NS } from "@ns";

export function main(ns: NS): number {
  //Sell all
  const symbols = ns.stock.getSymbols();
  let totalWorth = 0;
  for (const symbol of symbols) {
    totalWorth =
      totalWorth + ns.stock.sellStock(symbol, ns.stock.getMaxShares(symbol));
  }
  return totalWorth;
}
