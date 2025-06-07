import { GangMemberAscension, NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const gangName = "Slum Snakes";
  const recruitTask = "Train Combat";
  const upgradeTask = "Terrorism";
  const augmentType = "Augmentation";
  const minAscendAgi = 7;
  const minAugmentAgiMult = 7;
  const maxTerrorists = 3;

  // Create gang if it doesn't exist
  if (!ns.gang.inGang()) {
    try {
      ns.gang.createGang(gangName);
      ns.print("Gang created");
    } catch (e) {
      ns.tprint("Gang already exists");
    }
  }

  // Define the main function to be called periodically
  function recruit() {
    const members = ns.gang.getMemberNames();
    const funds = ns.getServerMoneyAvailable("home");
    const canRecruit = ns.gang.canRecruitMember();
    const terrorist = members.filter(
      (member) => ns.gang.getMemberInformation(member).task === upgradeTask
    );

    if (canRecruit) {
      const id = crypto.randomUUID();
      ns.gang.recruitMember(`Unit-${id}`);
      ns.gang.setMemberTask(`Unit-${id}`, "Train Combat");
    }

    for (const member of members) {
      const memberInfo = ns.gang.getMemberInformation(member);
      const ascendResults = <GangMemberAscension>(
        ns.gang.getAscensionResult(member)
      );
      if (ascendResults?.agi >= minAscendAgi) {
        ns.gang.ascendMember(member);
      }
      if (memberInfo.agi > 600 && memberInfo.task === recruitTask) {
        ns.gang.setMemberTask(member, upgradeTask);
      }
      if (memberInfo.agi_asc_mult > minAugmentAgiMult) {
        const installedAugs = new Set(memberInfo.augmentations);
        const equipment = ns.gang.getEquipmentNames();
        const augs = equipment.filter(
          (item) => ns.gang.getEquipmentType(item) === augmentType
        );
        const combatAugs = augs.filter(
          (item) =>
            ns.gang.getEquipmentStats(item).str ||
            ns.gang.getEquipmentStats(item).def ||
            ns.gang.getEquipmentStats(item).dex ||
            ns.gang.getEquipmentStats(item).agi
        );
        for (const aug of combatAugs) {
          if (
            funds > ns.gang.getEquipmentCost(aug) &&
            !installedAugs.has(aug)
          ) {
            ns.gang.purchaseEquipment(member, aug);
            installedAugs.add(aug);
          }
        }
        if (installedAugs.size > memberInfo.augmentations.length) {
          ns.print(`Succesfully installed augs in ${member}`);
        }
      }
    }

    // Set members to a lucrative task if there are enough terrorists
    if (members.length >= 4 && terrorist.length > maxTerrorists) {
      ns.gang.setMemberTask(terrorist[0], "Human Trafficking");
    }

    // Print gang info
    const gangInfo = ns.gang.getGangInformation();
    ns.printf("Gang size: " + members.length);
    ns.printf("Gang power: " + gangInfo.power);
  }

  // Call the main function periodically
  setTimeout(recruit, 1000);
}
