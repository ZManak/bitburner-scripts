import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const doing = ns.bladeburner.getCurrentAction();
  ns.tprint(doing.name);
}
