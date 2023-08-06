/* eslint-disable no-constant-condition */
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const crimes = ns.enums.CrimeType;
  const sleeves = ns.sleeve.getNumSleeves();

  for (let i = 0; i < sleeves; i++) {
    const clone = ns.sleeve.getSleeve(i);
    ns.formulas.work.crimeSuccessChance(clone, crimes.homicide) > 0.45
      ? ns.sleeve.setToCommitCrime(i, crimes.homicide)
      : ns.sleeve.setToCommitCrime(i, crimes.mug);
  }
}
