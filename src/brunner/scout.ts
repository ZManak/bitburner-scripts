import { NS } from "@ns";

export function main(ns: NS): void {
  const doing = ns.bladeburner.getCurrentAction();
  ns.tprint(doing.name);
}
