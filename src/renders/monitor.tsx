// Type: TypeScript file
import React from "react";
import type { NS } from "@ns";
import { scanServers } from "/utils/helpers";
import renderCustomModal, { css, EventHandlerQueue } from "./helpers";

export async function main(ns: NS) {
  console.log("Started monitor");

  const eventQueue = new EventHandlerQueue();
  const toolbarStyles: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
  };
  const getColorScale = (value: number) => {
    const hue = (1 - value) * 120;
    return `hsl(${hue}, 100%, 50%)`;
  };

  const modal = (
    <div className="custom-monitor">
      <p>hello world</p>
    </div>
  );

  // eslint-disable-next-line no-constant-condition
  while (true) {
    ns.tail();
    console.log("Started monitor");

    let showNonRooted = true;
    let showNonHackable = false;

    const eventQueue = new EventHandlerQueue();

    //const servers = scanDeep(ns, { depthFirst: true });
    //servers.splice(0, 0, { hostname: "home", route: [] });
    const servers = scanServers(ns);
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const player = ns.getPlayer();

      ns.tail();
      renderCustomModal(
        ns,
        <div id="custom-monitor" style={{ fontSize: "0.75rem" }}>
          <style
            children={css`
              #custom-monitor th,
              #custom-monitor td {
                padding-right: 12px;
              }
              #custom-monitor th {
                text-align: left;
              }
              #custom-monitor thead > * {
                border-bottom: 1px solid green;
              }
              #custom-monitor tr:hover {
                background: rgba(255, 255, 255, 0.1);
              }
            `}
          />
          <div style={toolbarStyles}>
            <button onClick={() => (showNonRooted = !showNonRooted)}>
              {showNonRooted ? "Show" : "Hide"} non-rooted
            </button>
            <button onClick={() => (showNonHackable = !showNonHackable)}>
              {showNonHackable ? "Show" : "Hide"} non-hackable
            </button>
          </div>
          <table style={{ borderSpacing: 0, whiteSpace: "pre" }}>
            <thead>
              <th>Server</th>
              <th>R</th>
              <th>BD</th>
              <th>U-RAM</th>
              <th>M-RAM</th>
              <th>$</th>
              <th>Max $</th>
              <th>Sec</th>
              <th>MSec</th>
              <th>Tools</th>
            </thead>
            <tbody>
              {servers.map((hostname) => {
                const onKillAllClick = eventQueue.wrap(() => {
                  ns.ps(hostname).forEach((x) => ns.kill(x.pid));
                });
                const onConnectClick = eventQueue.wrap(() => {
                  //autoConnect(ns, hostname);
                });
                return (
                  <tr key={hostname}>
                    <th>{hostname}</th>
                    <td>{ns.getServerMaxRam(hostname)}</td>
                    <td
                      style={{
                        color: getColorScale(
                          ns.getServerMoneyAvailable(hostname) /
                            ns.getServerMaxMoney(hostname)
                        ),
                      }}
                    >
                      {ns.formatNumber(ns.getServerMoneyAvailable(hostname))}
                    </td>
                    <td>{ns.getServerUsedRam(hostname)}</td>
                    <td>
                      <button
                        onClick={onConnectClick}
                        title="Connect to this server"
                      >
                        C
                      </button>
                      <button
                        onClick={onKillAllClick}
                        title="Kill all scripts on this server"
                      >
                        K
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
      await eventQueue.executeEvents();
      await ns.sleep(1000);
    }
  }
}
