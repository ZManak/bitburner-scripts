import { NS } from "@ns";

export function value(ns: NS): number {
  const symbols = ns.stock.getSymbols();
  let total =
    ns.stock.getMaxShares(symbols[0]) * ns.stock.getAskPrice(symbols[0]);
  for (const symbol of symbols) {
    total += ns.stock.sellStock(symbol, total);
  }
  return total;
}
