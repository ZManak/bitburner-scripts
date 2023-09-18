import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.disableLog("ALL");
    ns.clearLog();
    const numSleeves = 8;
    for (let i = 0; i < numSleeves; i++) {
      const clone = ns.sleeve.getSleeve(i);
      const task = ns.sleeve.getTask(i);
      ns.printf("Sleeve %d:", i);
      ns.printf("HP: %d / %d", clone.hp.current, clone.hp.max);
      if (task?.type === "BLADEBURNER") {
        ns.print(
          "Assignated " +
            task.actionName.toUpperCase() +
            " - " +
            task.actionType
        );
      } else {
        ns.print(task?.type || "Healing");
      }
      if (clone.hp.current < 5 && task?.type !== "RECOVERY") {
        ns.run("sleeves/heal.js");
        ns.toast(`Sleeve ${i} HP critical`, "error", 5000);
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
