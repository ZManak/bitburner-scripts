/* eslint-disable @typescript-eslint/no-unused-vars */
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.disableLog("ALL");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const server: any = ns.args[0];
  const maxM = ns.getServerMaxMoney(server);
  const minS = ns.getServerMinSecurityLevel(server);
  let level = ns.getServerSecurityLevel(server);
  let money = ns.getServerMoneyAvailable(server);
  let aux = 0;
  let numM = 0;
  let numS = 0;
  while (money < maxM) {
    await ns.grow(server);
    money = ns.getServerMoneyAvailable(server);
    aux = parseFloat(((money / maxM) * 100).toFixed(1));
    if (numM != aux) {
      numM = aux;
      ns.print(numM + "% grow");
    }
  }
  while (level > minS) {
    await ns.weaken(server);
    level = ns.getServerSecurityLevel(server);
    aux = parseFloat(((minS / level) * 100).toFixed(1));
    if (numS != aux) {
      numS = aux;
      ns.print(numS + "% lowSecurity");
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function autocomplete(
  data: { servers: string[]; scripts: string[] },
  args: any
) {
  return [...data.servers, ...data.scripts]; // Autocomplete servers and scripts
}
