/* eslint-disable no-constant-condition */
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const symbols = ns.stock.getSymbols();
  while (true) {
    if (!ns.isRunning("4s.js", "home") && ns.stock.has4SDataTIXAPI()) {
      for (const symbol of symbols) {
        ns.stock.sellStock(symbol, ns.stock.getMaxShares(symbol));
      }
    }
    await ns.sleep(1000); //
  }
}
