import { NS, NodeStats } from "@ns";

export async function get_money(ns: NS) {
  return ns.getPlayer().money;
}

export async function setup_hacknet(ns: NS) {
  const numberOfNodes = ns.hacknet.numNodes();
  let xNodes: NodeStats[] = [];
  for (let i = 0; i < numberOfNodes; i++) {
    const currNode = ns.hacknet.getNodeStats(i);
    xNodes = xNodes.concat(currNode);
  }
  return xNodes;
}

export async function getMaxRam(ns: NS, nodes: NodeStats[]) {
  const sortFunc = function (a: NodeStats, b: NodeStats) {
    return b.ram - a.ram;
  };
  nodes = nodes.sort(sortFunc);
  return nodes[0].ram;
}

export async function getMaxCores(ns: NS, nodes: NodeStats[]) {
  const sortFunc = function (a: NodeStats, b: NodeStats) {
    return b.cores - a.cores;
  };
  nodes = nodes.sort(sortFunc);
  return nodes[0].cores;
}

export async function getMaxLevel(ns: NS, nodes: NodeStats[]) {
  const sortFunc = function (a: NodeStats, b: NodeStats) {
    return b.level - a.level;
  };
  nodes = nodes.sort(sortFunc);
  return nodes[0].level;
}

export async function getTotalBreakEven(
  ns: NS,
  lvls: number,
  ram: number,
  cores: number,
  num_nodes: number
) {
  const player = ns.getPlayer();
  let servers_base_cost = 0;
  const cores_cost =
    num_nodes *
    ns.formulas.hacknetServers.coreUpgradeCost(
      1,
      cores - 1,
      player.mults.hacknet_node_core_cost
    );
  const lvls_cost =
    num_nodes *
    ns.formulas.hacknetServers.levelUpgradeCost(
      1,
      lvls - 1,
      player.mults.hacknet_node_level_cost
    );
  const ram_cost =
    num_nodes *
    ns.formulas.hacknetServers.ramUpgradeCost(
      1,
      Math.log2(ram),
      player.mults.hacknet_node_ram_cost
    );

  for (let i = 0; i < num_nodes; i++) {
    servers_base_cost += ns.formulas.hacknetServers.hacknetServerCost(
      i,
      player.mults.hacknet_node_purchase_cost
    );
  }
  const total_cost = servers_base_cost + cores_cost + lvls_cost + ram_cost;
  ns.tprint("test");
  ns.tprint(total_cost);
  ns.exit();
}

export async function getCurrentBreakEvenTime(ns: NS) {
  let server_base_cost = 0;
  const player = ns.getPlayer();
  const num_nodes = ns.hacknet.numNodes();
  const base_node = ns.hacknet.getNodeStats(0);
  const lvls = base_node.level;
  const lvls_cost =
    num_nodes *
    ns.formulas.hacknetServers.levelUpgradeCost(
      1,
      lvls - 1,
      player.mults.hacknet_node_level_cost
    );
  const cores = base_node.cores;
  const cores_cost =
    num_nodes *
    ns.formulas.hacknetServers.coreUpgradeCost(
      1,
      cores - 1,
      player.mults.hacknet_node_core_cost
    );
  const ram = base_node.ram;
  const ram_cost =
    num_nodes *
    ns.formulas.hacknetServers.ramUpgradeCost(
      1,
      Math.log2(ram),
      player.mults.hacknet_node_ram_cost
    );
  //await ns.tprint(lvls_cost);
  let income = num_nodes * base_node.production;
  for (let i = 0; i < num_nodes; i++) {
    //const currNode = ns.hacknet.getNodeStats(i);
    server_base_cost += ns.formulas.hacknetServers.hacknetServerCost(
      i + 1,
      player.mults.hacknet_node_purchase_cost
    );
  }
  //ns.tprint(server_base_cost);
  const total = lvls_cost + cores_cost + ram_cost + server_base_cost;
  //await ns.tprint("Total: " + total);
  //await ns.tprint("Income: " + income);
  income = income * 250000;
  //await ns.tprint(total);
  const breakEvenTime = total / income;
  //ns.print("Total: " + total);
  //ns.print("Income: " + income);
  return breakEvenTime;
}

export async function getOptimalUpgrade(ns: NS, node_index: number) {
  const player = ns.getPlayer();
  const hacknetGainMult = player.mults.hacknet_node_money;
  const upCoreMult = player.mults.hacknet_node_core_cost;
  const upRamMult = player.mults.hacknet_node_ram_cost;
  const upLvlMult = player.mults.hacknet_node_level_cost;
  const currNode = ns.hacknet.getNodeStats(node_index);
  const startCores = currNode.cores;
  const startRam = currNode.ram;
  const startLevel = currNode.level;
  let efficiencies: Array<{
    name: string;
    efficiency: number;
    cost: number;
    node: number;
    break_even: number;
  }> = [];
  // core upgrade efficiency
  const coreUpCost = ns.formulas.hacknetServers.coreUpgradeCost(
    startCores,
    1,
    upCoreMult
  );
  const coreUpEffect =
    ns.formulas.hacknetServers.hashGainRate(
      startLevel,
      0,
      startRam,
      startCores + 1,
      hacknetGainMult
    ) - currNode.production;
  //let coreTotalGainRate;
  const coreUpGainRate = 4 / coreUpEffect;
  const coreBreakEven = coreUpCost / coreUpGainRate;
  efficiencies = efficiencies.concat({
    name: "core",
    efficiency: coreUpEffect / coreUpCost,
    cost: coreUpCost,
    node: node_index,
    break_even: coreBreakEven,
  });
  // level upgrade efficiency
  const lvlUpCost = ns.formulas.hacknetServers.levelUpgradeCost(
    startLevel,
    1,
    upLvlMult
  );
  const lvlUpEffect =
    ns.formulas.hacknetServers.hashGainRate(
      startLevel + 1,
      0,
      startRam,
      startCores,
      hacknetGainMult
    ) - currNode.production;
  const lvlUpGainRate = 4 / lvlUpEffect;
  const lvlBreakEven = lvlUpCost / lvlUpGainRate;
  efficiencies = efficiencies.concat({
    name: "level",
    efficiency: lvlUpEffect / lvlUpCost,
    cost: lvlUpCost,
    node: node_index,
    break_even: lvlBreakEven,
  });
  // ram upgrade efficiency
  const ramUpCost = ns.formulas.hacknetServers.ramUpgradeCost(
    startRam,
    1,
    upRamMult
  );
  const ramUpEffect =
    ns.formulas.hacknetServers.hashGainRate(
      startLevel,
      0,
      startRam * 2,
      startCores,
      hacknetGainMult
    ) - currNode.production;
  const ramUpGainRate = 4 / ramUpEffect;
  const ramBreakEven = ramUpCost / ramUpGainRate;
  efficiencies = efficiencies.concat({
    name: "ram",
    efficiency: ramUpEffect / ramUpCost,
    cost: ramUpCost,
    node: node_index,
    break_even: ramBreakEven,
  });
  return efficiencies.sort((a, b) => b.efficiency - a.efficiency)[0];
}

export async function getOptimalPurchase(ns: NS) {
  const player = ns.getPlayer();
  const upLvlMult = player.mults.hacknet_node_level_cost;
  const hacknetGainMult = player.mults.hacknet_node_money;
  const upCoreMult = player.mults.hacknet_node_core_cost;
  const upRamMult = player.mults.hacknet_node_ram_cost;
  const purchaseServerMult = player.mults.hacknet_node_purchase_cost;
  const myNodes = await setup_hacknet(ns);
  const maxRam = await getMaxRam(ns, myNodes);
  const maxCores = await getMaxCores(ns, myNodes);
  const maxLevel = await getMaxLevel(ns, myNodes);
  // purchase new server efficiency
  const numCurrServers = ns.hacknet.numNodes();
  const purchaseServerCost = ns.formulas.hacknetServers.hacknetServerCost(
    numCurrServers + 1,
    purchaseServerMult
  );
  const upgradeCoresCost = ns.formulas.hacknetServers.coreUpgradeCost(
    1,
    maxCores - 1,
    upCoreMult
  );
  const upgradeRamCost = ns.formulas.hacknetServers.ramUpgradeCost(
    1,
    Math.log2(maxRam),
    upRamMult
  );
  const upgradeLvlCost = ns.formulas.hacknetServers.levelUpgradeCost(
    1,
    maxLevel - 1,
    upLvlMult
  );
  const upgradeTotalCost =
    upgradeCoresCost + upgradeLvlCost + upgradeRamCost + purchaseServerCost;
  let efficiencies = [
    {
      name: "purchase_node",
      efficiency:
        ns.formulas.hacknetServers.hashGainRate(
          maxLevel,
          0,
          maxRam,
          maxCores,
          hacknetGainMult
        ) / upgradeTotalCost,
      cost: purchaseServerCost,
      node: numCurrServers,
    },
  ];
  for (let i = 0; i < numCurrServers; i++) {
    efficiencies = efficiencies.concat(await getOptimalUpgrade(ns, i));
  }
  efficiencies = efficiencies.sort((a, b) => b.efficiency - a.efficiency);
  return efficiencies[0];
}

export async function makeOptimalPurchase(
  ns: NS,
  break_even: number
): Promise<void> {
  const myOptimalPurchase = await getOptimalPurchase(ns);
  const breakEvenTime = await getCurrentBreakEvenTime(ns);
  //ns.tprint(break_even / breakEvenTime);
  if (breakEvenTime >= break_even) {
    ns.tprint("done ");
    return ns.exit();
  }
  switch (myOptimalPurchase.name) {
    case "purchase_node":
      if ((await get_money(ns)) < myOptimalPurchase.cost) {
        ns.print(
          "Waiting for " +
            ns.formatNumber(myOptimalPurchase.cost) +
            "$ to purchase hacknet-node-" +
            myOptimalPurchase.node
        );
      }
      while ((await get_money(ns)) < myOptimalPurchase.cost) {
        await ns.sleep(1000);
      }
      if (ns.hacknet.purchaseNode() >= 0) {
        ns.print("Purchased hacknet-node-" + myOptimalPurchase.node);
      }
      return;
    case "ram":
      if ((await get_money(ns)) < myOptimalPurchase.cost) {
        ns.print(
          "Waiting for " +
            ns.formatNumber(myOptimalPurchase.cost) +
            "$ to upgrade RAM of hacknet-node-" +
            myOptimalPurchase.node
        );
      }
      while ((await get_money(ns)) < myOptimalPurchase.cost) {
        await ns.sleep(1000);
      }
      if (ns.hacknet.upgradeRam(myOptimalPurchase.node, 1)) {
        ns.print("Upgraded RAM on hacknet-node-" + myOptimalPurchase.node);
      }
      return;
    case "level":
      if ((await get_money(ns)) < myOptimalPurchase.cost) {
        ns.print(
          "Waiting for " +
            ns.formatNumber(myOptimalPurchase.cost) +
            "$ to upgrade level of hacknet-node-" +
            myOptimalPurchase.node
        );
      }
      while ((await get_money(ns)) < myOptimalPurchase.cost) {
        await ns.sleep(1000);
      }
      if (ns.hacknet.upgradeLevel(myOptimalPurchase.node, 1)) {
        ns.print("Upgraded level on hacknet-node-" + myOptimalPurchase.node);
      }
      return;
    case "core":
      if ((await get_money(ns)) < myOptimalPurchase.cost) {
        ns.print(
          "Waiting for " +
            ns.formatNumber(myOptimalPurchase.cost) +
            "$ to upgrade cores of hacknet-node-" +
            myOptimalPurchase.node
        );
      }
      while ((await get_money(ns)) < myOptimalPurchase.cost) {
        await ns.sleep(1000);
      }
      if (ns.hacknet.upgradeCore(myOptimalPurchase.node, 1)) {
        ns.print("Upgraded cores on hacknet-node-" + myOptimalPurchase.node);
      }
      return;
  }
}

export async function main(ns: NS) {
  //ns.tprint(ns.hacknet.getNodeStats(1));
  //ns.tprint(entries);
  ns.disableLog("sleep");
  //var test = await getCurrentBreakEvenTime(ns);
  //ns.tprint(test);
  //await ns.exit();
  //await getTotalBreakEven(ns, 56, 256, 14, 10);
  //await ns.exit();
  const break_even = 1 * 24 * 3600; // break even time in seconds
  if (ns.hacknet.numNodes() == 0) {
    ns.hacknet.purchaseNode();
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    await makeOptimalPurchase(ns, break_even);
    await ns.sleep(100);
  }
}
