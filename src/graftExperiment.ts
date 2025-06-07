//Script to automate the grafting process in Bitburner

import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  ns.disableLog("ALL");
  ns.clearLog();
  const augments: { name: string; price: number }[] = [];
  const graftableAugs = ns.grafting.getGraftableAugmentations();
  //asign the graftable augmentations to the augments array
  graftableAugs.forEach((aug) => {
    augments.push({
      name: aug,
      price: ns.grafting.getAugmentationGraftPrice(aug),
    });
  });
  //sort the augments array by price
  augments.sort((a, b) => a.price - b.price);
  //print the augments array
  ns.tprint("Graftable augmentations:");
  augments.forEach((aug) => {
    ns.tprint(`${aug.name} - $${aug.price.toLocaleString()}`);
  });
  //ask the user to select an augmentation
  const selectedAug = await ns.prompt("Select an augmentation to graft:", {
    type: "select",
    choices: augments
      .map((aug) => aug.name) // Add a None option to allow the user to exit without selecting an augmentation
      .concat(["None"]),
  });
  // Ensure selectedAug is a string before proceeding
  if (typeof selectedAug !== "string" || selectedAug === "None") {
    ns.tprint("No augmentation selected. Exiting.");
    return;
  }
  //check if the player can afford the augmentation
  const graftPrice = ns.grafting.getAugmentationGraftPrice(selectedAug);
  if (ns.getServerMoneyAvailable("home") < graftPrice) {
    ns.tprint(
      `You cannot afford the grafting price of $${graftPrice.toLocaleString()}. Exiting.`
    );
    return;
  }
  //graft the augmentation
  const graftResult = ns.grafting.graftAugmentation(selectedAug);
  if (graftResult) {
    ns.tprint(`Successfully grafted ${selectedAug}.`);
  } else {
    ns.tprint(`Failed to graft ${selectedAug}.`);
  }
}
