/* eslint-disable no-constant-condition */
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const sleeves = ns.sleeve.getNumSleeves();
  while (1 === 1) {
    for (let i = 0; i < sleeves; i++) {
      if (ns.sleeve.getSleeve(i).skills.strength < 50) {
        ns.sleeve.setToGymWorkout(i, "Iron Gym", "strength");
      } else {
        ns.sleeve.setToCommitCrime(i, "Mug");
      }
    }
    await ns.sleep(1000);
  }
}
