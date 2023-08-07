import { NS } from "@ns";
import { colors } from "utils/palette.js";

//Sleeves number is hardcoded
//Track the status of each sleeve
//Shows INT
//Shows stored cycles
//Shows current task

export async function main(ns: NS): Promise<void> {
  ns.setTitle("Sleeves Status");
  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.disableLog("ALL");
    ns.clearLog();
    const numSleeves = 7;
    for (let i = 0; i < numSleeves; i++) {
      const clone = ns.sleeve.getSleeve(i);
      const cloneTask = ns.sleeve.getTask(i);
      ns.printf("Sleeve %d:", i);
      ns.printf(colors.red + "HP: %d / %d", clone.hp.current, clone.hp.max);
      ns.printf(
        colors.white + "Str: %d Def: %d Dex: %d Agi: %d",
        clone.skills.strength,
        clone.skills.defense,
        clone.skills.dexterity,
        clone.skills.agility
      );
      ns.printf(
        colors.green + "Hack: %d " + colors.magenta + "Cha: %d",
        clone.skills.hacking,
        clone.skills.charisma
      );
      ns.printf(colors.cyan + "Int: %d", clone.skills.intelligence);
      ns.printf("Cycles: %d", clone.storedCycles);
      if (cloneTask?.type === "CRIME") {
        ns.printf(
          "Task: %s %s",
          cloneTask.type,
          cloneTask.crimeType.toUpperCase()
        );
      } else if (cloneTask?.type === "CLASS") {
        ns.printf(
          "Task: %s %s",
          cloneTask.type,
          cloneTask.classType.toUpperCase()
        );
      } else if (cloneTask?.type === "COMPANY") {
        ns.printf("Task: %s", cloneTask.companyName.toUpperCase());
      } else {
        ns.printf("Task: %s", cloneTask?.type);
      }
      ns.print("_______________________________");
    }
    await ns.sleep(0);
  }
}
//  - Print out the current HP of each sleeve.This slee
//  - Print out the current task of each sleeve.
//  - If a sleeve's HP is below 5, set it to idle and display a toast message.
//  - Call this function from the main function.
