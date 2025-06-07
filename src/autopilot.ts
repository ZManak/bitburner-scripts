import { FactionName, NS } from "@ns";

export async function main(ns: NS): Promise<void> {
  // Define helper functions once
  function checkIfOwnedAugs(ns: NS, faction: FactionName): boolean {
    const ownedAugs = ns.singularity.getOwnedAugmentations(true);
    const factionAugs = ns.singularity.getAugmentationsFromFaction(faction);
    ns.print(factionAugs);
    ns.print(ownedAugs);
    let checked = 0;
    for (const aug of factionAugs) {
      if (ownedAugs.includes(aug)) {
        checked = checked + 1;
      }
    }
    ns.print(checked);
    return factionAugs.length !== checked;
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
  }

  // Main logic
  const exes = [
    "BruteSSH.exe",
    "FTPCrack.exe",
    "relaySMTP.exe",
    "HTTPWorm.exe",
    "SQLInject.exe",
    "AutoLink.exe",
    "ServerProfiler.exe",
  ];
  const canonServers = ["CSEC", "avmnite-02h", "I.I.I.I", "run4theh111z"];
  const serverList = [
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

  let serversRam = 64;
  ns.setTitle("Singularity Automation");
  ns.disableLog("ALL");
  ns.print("Automation started");

  /* if (ns.fileExists("4s.js", "home") && !ns.isRunning("4s.js", "home")) {
    ns.run("4s.js", 1, "home");
  } */

  while (true) {
    //ns.clearLog();
    //const netWorh = ns.getServerMoneyAvailable("home") + value(ns);
    const player = ns.getPlayer();
    const factionOffers = ns.singularity.checkFactionInvitations();

    if (ns.getHackingLevel() < 25 && !ns.singularity.isBusy()) {
      ns.singularity.universityCourse(
        "Rothman University",
        "Computer Science"
      );
      ns.printf("Taking computer classess");
      while (ns.getHackingLevel() < 50) {
        await ns.sleep(1000);
      }
      ns.singularity.stopAction(); // Wait for the class to finish
    }

    //Create Programs
    await createProgram(ns, "BruteSSH.exe");
    await createProgram(ns, "FTPCrack.exe");

    //Buy nickofolas Congruity Implant
    if (
      !ns.singularity.isBusy() &&
      !ns.singularity
        .getOwnedAugmentations()
        .includes("nickofolas Congruity Implant") &&
      ns.grafting
        .getGraftableAugmentations()
        .includes("nickofolas Congruity Implant") &&
      ns.getServerMoneyAvailable("home") > 150e12
    ) {
      ns.singularity.travelToCity("New Tokyo");
      ns.grafting.graftAugmentation("nickofolas Congruity Implant");
    }

    //Buy programs
    if (player.money > 300000 && !ns.hasTorRouter()) {
      ns.singularity.purchaseTor();
      ns.printf("Purchased TOR");
      ns.toast("Purchased TOR");
    }
    if (
      ns.getHackingLevel() > 550 &&
      player.money > ns.singularity.getDarkwebProgramCost(exes[2]) &&
      ns.hasTorRouter() &&
      !ns.fileExists(exes[2], "home")
    ) {
      ns.singularity.purchaseProgram(exes[2]);
      ns.printf("Purchased RELAY");
    }
    if (
      ns.getHackingLevel() > 550 &&
      player.money > ns.singularity.getDarkwebProgramCost(exes[3]) &&
      ns.hasTorRouter() &&
      !ns.fileExists(exes[3], "home")
    ) {
      ns.singularity.purchaseProgram(exes[3]);
      ns.printf("Purchased WORM");
    }
    if (
      ns.getHackingLevel() > 700 &&
      player.money > ns.singularity.getDarkwebProgramCost(exes[4]) &&
      ns.hasTorRouter() &&
      !ns.fileExists(exes[4], "home")
    ) {
      ns.singularity.purchaseProgram(exes[4]);
      ns.printf("Purchased SQLInject");
    }

    //Join relevant factions
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
    if (!ns.singularity.isBusy() && player.factions.includes("Daedalus")) {
      ns.singularity.workForFaction("Daedalus", "hacking", false);
    } else if (!ns.singularity.isBusy()) {
      for (const faction of player.factions) {
        if (canonFactions.includes(faction) && checkIfOwnedAugs(ns, faction)) {
          ns.singularity.workForFaction(faction, "hacking", false);
          ns.printf("Working for " + faction);
        }
      }
    }

    //Buy && Install the Red Pill---
    if (
      ns.singularity.getFactionRep("Daedalus") > 2.5e6 &&
      !ns.singularity.getOwnedAugmentations(true).includes("The Red Pill")
    ) {
      ns.singularity.purchaseAugmentation("Daedalus", "The Red Pill");
      //ns.run("/singularity/installAugs.js");
    }

    // Sync works
    if (player.money > 300000 && !ns.hasTorRouter()) {
      ns.singularity.purchaseTor();
      ns.printf("Purchased TOR");
      ns.toast("Purchased TOR");
    }

    //Upgrade servers & increase next upgrade ram
    if (
      ns.getPurchasedServers().length > 0 &&
      ns.getPurchasedServerUpgradeCost(
        ns.getPurchasedServers()[0],
        ns.getServer(ns.getPurchasedServers()[14]).maxRam
      ) <
        ns.getServerMoneyAvailable("home") * 1.4
    ) {

      ns.singularity.purchaseProgram("relaySMTP.exe");
      ns.printf("Purchased RELAY");
    }
    if (
      ns.getHackingLevel() > 700 &&
      player.money > ns.singularity.getDarkwebProgramCost("HTTPWorm.exe") &&
      ns.hasTorRouter() &&
      !ns.fileExists("HTTPWorm.exe", "home")
    ) {
      ns.singularity.purchaseProgram("HTTPWorm.exe");
      ns.printf("Purchased Worm");
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

    for (const serverName of canonServers) {
      const server = ns.getServer(serverName);
      if (ns.hasRootAccess(serverName) && !server.backdoorInstalled) {
        ns.run("findServer.js", 1, serverName);
        ns.printf("Installing backdoor on " + serverName);
        await ns.singularity.installBackdoor();
        ns.printf("Backdoor on " + serverName);
        ns.toast("Backdoor on " + serverName);
        ns.singularity.connect("home");
      }
    }

    if (!ns.stock.has4SDataTixApi() && player.money > 35e9) {
      ns.stock.purchaseWseAccount();
      upgradeServers(ns, ns.getServer(ns.getPurchasedServers()[14]).maxRam * 2);
    }

    //Install backdoors on canon servers
    await installBackdoor(canonServers);

    //Backdoor useful servers
    await installBackdoor(serverList);

    //Get into Stock Market
    if (!ns.stock.has4SDataTIXAPI() && player.money > 35e9) {
      ns.stock.purchaseWseAccount();
      ns.stock.purchase4SMarketData();
      ns.stock.purchaseTixApi();
      ns.stock.purchase4SMarketDataTixApi();
      ns.print("Purchased 4S Data and TIX API");
      //ns.exec("4s.js", "home");
    }

    if (ns.stock.has4SDataTixApi() && !ns.isRunning("4s.js", "home")) {
      ns.exec("4s.js", "home");
    }

    await ns.sleep(1000);
  }
}
// This script automates the process of joining factions, working for them, and managing resources in Bitburner.
