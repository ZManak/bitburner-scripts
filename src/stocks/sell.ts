/* eslint-disable no-constant-condition */
import { NS } from "@ns";

export function main(ns: NS): void {
  const symbols = ns.stock.getSymbols();

  if (ns.isRunning("4s.js", "home")) {
    ns.kill("4s.js", "home");
  }
  for (const symbol of symbols) {
    ns.stock.sellStock(symbol, ns.stock.getMaxShares(symbol));
  }
}
