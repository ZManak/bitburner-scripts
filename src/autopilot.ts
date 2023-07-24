/* eslint-disable no-constant-condition */
import { NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  const exes = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "RelaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
    "AutoLink.exe",
    "ServerProfiler.exe",
  ];
  const canonServers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"];
  const usefulServers = [
    "iron-gym",
    "powerhouse-fitness",
    "snap-fitness",
    "crush-fitness",
    "rothman-uni",
    "zb-institute",
    "summit-uni",
    "nwo",
    "fulcrumassets",
    "fulcrumtech",
  ];
  const canonFactions = [
    "CyberSec",
    "NiteSec",
    "The Black Hand",
    "BitRunners",
    "Daedalus",
    "The Dark Army",
    "The Syndicate",
    "Tian Di Hui",
    "Slum Snakes",
    "The Covenant",
    "Speakers for the Dead",
    "Silhouette",
  ];

  ns.disableLog("ALL");
  ns.print("Automation started");

  if (
    ns.fileExists("4s.js", "home") &&
    !ns.isRunning("4s.js", "home") &&
    ns.stock.has4SDataTIXAPI()
  ) {
    ns.run("4s.js", 1, "home");
  }

  while (true) {
    const player = ns.getPlayer();
    const factionOffers = ns.singularity.checkFactionInvitations();

    if (ns.getHackingLevel() < 25 && !ns.singularity.isBusy()) {
      ns.singularity.universityCourse(
        "rothman university",
        "Computer Sciences"
      );
      ns.printf("Taking computer classess");
      while (ns.getHackingLevel() < 50) {
        await ns.sleep(1000);
        ns.getHackingLevel();
      }
      ns.singularity.stopAction(); // Wait for the class to finish
    }

    //Create Programs
    await createProgram(ns, "BruteSSH.exe");
    await createProgram(ns, "FTPCrack.exe");

    //Join relevant factions and work for them
    for (const faction of factionOffers) {
      if (
        canonFactions.includes(faction) &&
        !player.factions.includes(faction)
      ) {
        ns.singularity.joinFaction(faction);
        ns.printf("Joined " + faction);
      }
    }

    //Work for factions
    if (!ns.singularity.isBusy()) {
      for (const faction of player.factions) {
        if (canonFactions.includes(faction) && checkIfOwnedAugs(ns, faction)) {
          ns.singularity.workForFaction(faction, "hacking", false);
          ns.printf("Working for " + faction);
        }
      }
    }

    //Buy the Red Pill---
    if (
      ns.singularity.getFactionRep("Daedalus") > 2.5e6 &&
      !ns.singularity.getOwnedAugmentations(true).includes("The Red Pill")
    ) {
      ns.singularity.purchaseAugmentation("Daedalus", "The Red Pill");
      ns.exec("/singularity/installAugs.js", "home");
    }

    //Sync works

    if (player.money > 300000 && !ns.hasTorRouter()) {
      ns.singularity.purchaseTor();
      ns.printf("Purchased TOR");
      ns.toast("Purchased TOR");
    }
    if (
      ns.getHackingLevel() > 390 &&
      player.money > ns.singularity.getDarkwebProgramCost("relaySMTP.exe") &&
      ns.hasTorRouter() &&
      !ns.fileExists("relaySMTP.exe", "home")
    ) {
      ns.singularity.purchaseProgram("relaySMTP.exe");
      ns.printf("Purchased RELAY");
    }
    if (
      ns.getHackingLevel() > 550 &&
      player.money > ns.singularity.getDarkwebProgramCost("relaySMTP.exe") &&
      ns.hasTorRouter() &&
      !ns.fileExists("HTTPWorm.exe", "home")
    ) {
      ns.singularity.purchaseProgram("HTTPWorm.exe");
      ns.printf("Purchased WORM");
    }
    if (
      ns.getHackingLevel() > 700 &&
      player.money > ns.singularity.getDarkwebProgramCost("SQLInject.exe") &&
      ns.hasTorRouter() &&
      !ns.fileExists("SQLInject.exe", "home")
    ) {
      ns.singularity.purchaseProgram("SQLInject.exe");
      ns.printf("Purchased SQLInject");
    }
    /* if (
      ns.formulas.work.crimeSuccessChance(player, "Larceny") < 0.75 &&
      !ns.singularity.isBusy()
    ) {
      ns.singularity.commitCrime("Shoplift", false);
    } else if (!ns.singularity.isBusy()) {
      ns.singularity.commitCrime(    if (!ns.singularity.isBusy()) {"Larceny", false);
    } */

    for (let i = 0; i < canonServers.length; i++) {
      const server = ns.getServer(canonServers[i]);
      if (
        ns.hasRootAccess(canonServers[i]) &&
        server.backdoorInstalled === false
      ) {
        ns.printf("Installing backdoor on " + canonServers[i]);
        ns.run("findServer.js", 1, canonServers[i]);
        await ns.sleep(5000);
        await ns.singularity.installBackdoor();
        await ns.sleep(5000);
        ns.printf("Backdoor on " + canonServers[i]);
        ns.singularity.connect("home");
      }
    }

    if (!ns.stock.has4SDataTIXAPI() && player.money > 35e9) {
      ns.stock.purchaseWseAccount();
      ns.stock.purchase4SMarketData();
      ns.stock.purchaseTixApi();
      ns.stock.purchase4SMarketDataTixApi();
      ns.exec("4s.js", "home");
    }

    await ns.sleep(0);
  }

  //Checks if owned all augs from faction
  function checkIfOwnedAugs(ns: NS, faction: string): boolean {
    const ownedAugs = ns.singularity.getOwnedAugmentations(true);
    const factionAugs = ns.singularity.getAugmentationsFromFaction(faction);
    let checked = 0;
    for (const aug of factionAugs) {
      if (ownedAugs.includes(aug)) {
        checked = checked + 1;
      }
    }
    ns.print(
      "Owns " +
        checked +
        " out of " +
        factionAugs.length +
        " augs from " +
        faction
    );
    if (factionAugs.length === checked) {
      return false;
    } else {
      return true;
    }
  }

  async function createProgram(ns: NS, exe: string): Promise<void> {
    if (!ns.fileExists(exe, "home") && !ns.singularity.isBusy()) {
      ns.singularity.createProgram(exe);
      while (!ns.fileExists(exe, "home")) {
        await ns.sleep(1000);
      }
      ns.print("Created " + exe);
      ns.toast("Created " + exe);
    }
    await ns.sleep(0);
  }
}

//rate augmentations
/* for (const [ , ] of ) */
