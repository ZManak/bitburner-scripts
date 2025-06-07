import { NS } from "@ns";

function getAvailableHashes(ns: NS) {
  const availableHashes = ns.hacknet.numHashes();
  return availableHashes;
}

function analyzeServer(ns: NS, server: string): string {
  let serverMinSecurity = ns.getServerMinSecurityLevel(server);
  serverMinSecurity = serverMinSecurity * 0.98;
  /*ns.print(
    server +
      " " +
      serverMinSecurity +
      " " +
      ns.formatNumber(serverMaxMoney) +
      " after buff"
  );*/
  const costSecurity = ns.hacknet.hashCost("Reduce Minimum Security");
  const costMaxMoney = ns.hacknet.hashCost("Increase Maximum Money");
  const maxHashes = ns.hacknet.hashCapacity();
  let choice = "";
  if (maxHashes < costSecurity && maxHashes < costMaxMoney) {
    choice = "Not enough hashes to buff";
  } else if (serverMinSecurity > 1) {
    costSecurity < costMaxMoney
      ? (choice = "Reduce Minimum Security")
      : (choice = "Increase Maximum Money");
  }

  return choice;
}

/*function buffServer(ns: NS, server: string, choice: string): void {
  const serverMaxMoney = ns.getServerMaxMoney(server);
  if (choice === "Not enough hashes to buff") {
    ns.print("Not enough hashes to buff " + server);
    ns.exit();
  } else if (
    choice === "Reduce Minimum Security" &&
    getAvailableHashes(ns) > ns.hacknet.hashCost("Reduce Minimum Security")
  ) {
    ns.hacknet.spendHashes("Reduce Minimum Security", server);
    ns.print(
      "Reduced security on " +
        server +
        " Current security: " +
        ns.getServerMinSecurityLevel(server)
    );
  } else if (
    choice === "Increase Maximum Money" &&
    getAvailableHashes(ns) > ns.hacknet.hashCost("Increase Maximum Money")
  ) {
    ns.hacknet.spendHashes("Increase Maximum Money", server);
    ns.print(
      "Increased money on " +
        server +
        " Current money: " +
        ns.formatNumber(serverMaxMoney)
    );
  } else {
    ns.print("Not enough hashes to buff " + server);
  }
}*/

async function buffServer(
  ns: NS,
  server: string,
  choice: string
): Promise<void> {
  const serverMaxMoney = ns.getServerMaxMoney(server);
  switch (choice) {
    case "Not enough hashes to buff":
      ns.print("Not enough hashes to buff " + server);
      await ns.sleep(15000);
      break;
    case "Reduce Minimum Security":
      if (
        getAvailableHashes(ns) > ns.hacknet.hashCost("Reduce Minimum Security")
      ) {
        ns.hacknet.spendHashes("Reduce Minimum Security", server);
        ns.print(
          "Reduced security on " +
            server +
            " Current security: " +
            ns.getServerMinSecurityLevel(server)
        );
      } /* else {
        ns.print("Not enough hashes to buff " + server);
      } */
      break;
    case "Increase Maximum Money":
      if (
        getAvailableHashes(ns) > ns.hacknet.hashCost("Increase Maximum Money")
      ) {
        ns.hacknet.spendHashes("Increase Maximum Money", server);
        ns.print(
          "Increased money on " +
            server +
            " Current money: " +
            ns.formatNumber(serverMaxMoney)
        );
      }
      break;
    default:
      ns.print("Invalid choice: " + choice);
      break;
  }
}

export async function main(ns: NS): Promise<void> {
  ns.disableLog("ALL");
  const server = <string>ns.args[0];
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const choice = analyzeServer(ns, server);
    await buffServer(ns, server, choice);
    await ns.sleep(1000);
  }
}
