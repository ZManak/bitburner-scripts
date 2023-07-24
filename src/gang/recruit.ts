import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.clearLog();
    let i = 0;
    let canRecruit = true;
    while (canRecruit) {
      ns.gang.recruitMember("Unit-0" + i);
      if (ns.gang.getMemberInformation("Unit-0" + i).task === "Idle") {
        ns.gang.setMemberTask("Unit-0" + i, "Train Combat");
      }
      i++;
      canRecruit = ns.gang.canRecruitMember();
      await ns.sleep(10000);
    }

    const crew = ns.gang.getMemberNames();
    const gangInfo = ns.gang.getGangInformation();
    ns.printf("Gang size: " + crew.length);
    ns.printf("Gang power: " + gangInfo.power);

    for (const member of crew) {
      const memberInfo = ns.gang.getMemberInformation(member);
      if (
        (memberInfo.agi && memberInfo.def && memberInfo.str && memberInfo.dex) >
          170 &&
        memberInfo.str_asc_mult < 1.5
      ) {
        ns.gang.ascendMember(member);
      }
      if (memberInfo.agi > 600 && memberInfo.task === "Train Combat") {
        ns.gang.setMemberTask(member, "Terrorism");
      }
    }

    //const allEquipment = ns.gang.getEquipmentNames();

    await ns.sleep(1000);
  }
}
