/* eslint-disable no-constant-condition */
import { NS } from "@ns";

export function main(ns: NS): void {
  //Hardcoded sleeves
  const crimes = ns.enums.CrimeType;
  const sleeves = 8;

  for (let i = 0; i < sleeves; i++) {
    const clone = ns.sleeve.getSleeve(i);
    ns.formulas.work.crimeSuccessChance(clone, crimes.homicide) > 0.45
      ? ns.sleeve.setToCommitCrime(i, crimes.homicide)
      : ns.sleeve.setToCommitCrime(i, crimes.mug);
  }
}
