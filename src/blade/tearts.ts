//Refactored code to TS by zmanak

/* eslint-disable no-constant-condition */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NS } from "@ns";

//===============================================================================
// BLADE v8.2: by Troff - ONLY 2.90GB RAM required - Sys code 4, 3, 9(4), 2(5)

// Tightened code for scanning missions and ops, improved Raids and Stings.
// Minor improvements include removing or replacing non-essential functions
// (to speed up script), COLOR HUD, display bug fixes & code optimising

// You can turn ON lines marked DEBUG to get a further understanding or
// for troubleshooting. Feel free to delete them (as they're not required)

// #### Set default GLOBAL variables START (DO NOT CHANGE anything here) ####
let stamina = 0;
let skpts = 0;
let skreq = 0;
let blrank = 0;
let healstatus = 0; // Are we healing? 0=no, 1=yes
let healstatnam = "."; // Name of healing status
let diplomacystatus = 0; // Are we are doing diplomacy?

// Hard-coded Contracts names (for future changes, update with below function)
// contracts = ns.bladeburner.getContractNames();
// var opdebug=contracts.toString(); ns.print(opdebug); // copy names from here
const contracts = ["Tracking", "Bounty Hunter", "Retirement"];

// Hard-coded Ops (for future changes, update with below function)
//operations = ns.bladeburner.getOperationNames();
//var opdebug=operations.toString(); ns.print(opdebug); // copy names from here
const operations = [
  "Investigation",
  "Undercover Operation",
  "Sting Operation",
  "Raid",
  "Stealth Retirement Operation",
  "Assassination",
];

// Hard-coded Black Ops (for future changes, update with below function)
//const blackops=await runCom1(ns,'ns.bladeburner.getBlackOpNames()','getBlOps');
//var txdebug=blackops.toString(); ns.print(txdebug); // copy names from here
const blackops = [
  "Operation Typhoon",
  "Operation Zero",
  "Operation X",
  "Operation Titan",
  "Operation Ares",
  "Operation Archangel",
  "Operation Juggernaut",
  "Operation Red Dragon",
  "Operation K",
  "Operation Deckard",
  "Operation Tyrell",
  "Operation Wallace",
  "Operation Shoulder of Orion",
  "Operation Hyron",
  "Operation Morpheus",
  "Operation Ion Storm",
  "Operation Annihilus",
  "Operation Ultron",
  "Operation Centurion",
  "Operation Vindictus",
  "Operation Daedalus",
];

const cityinfo: any[] = []; // Cities array to contain info
let citynam1 = "Sector-12"; // Starting city name variable
let citychos = 0; // Current city chaos
let citychos2 = 0; // City chaos history buffer
let citychos3 = 0; // More buffer for chaos history
let citypopu = 0; // Current city p0pulation
let citycomm = 0; // Current city communities
const Cont: any[] = []; // Create array for Contracts Info
const Oper: any[] = []; // Array for Operations Info
let BlOp = []; // Create array for Black Ops Info
let bestCon = []; // Create array for BEST C0ntract
let bestOp = []; // Array for BEST Operation
let bestBlackOp: {
  idx1: number;
  idx2: number;
  city: number;
  blcitnam: string;
  type: string;
  name: string;
  chance: number[];
  counts: number;
  rankok: number;
}; // Create array for BEST Black Ops
let concount = 0; // Contract number missions available
let opcount = 0; // Operation number missions available
let conspread = 0; // Contract spread chance (decimal)
let opspread = 0; // Operation spread chance (decimal)
let blspread = 0; // Black Ops spread chance (decimal)
let conper0 = 0; // Lower limit contract chance
let conper1 = 0; // High limit contract chance
let opper0 = 0; // Lower limit operation chance
let opper1 = 0; // High limit operation chance
let blacper0 = 0; // Lower limit blackop chance
let blacper1 = 0; // Higher limit blackop chance
let blacstart = 0; // Used to skip completed blackop results
let statuscity = ""; // Whether we changed citi for ra!ds/retirement
let statusline = "None"; // Status line showing action done
let skstat = false; // Default skill log status line
const citylist = [
  "Sector-12",
  "Aevum",
  "Volhaven",
  "Chongqing",
  "New Tokyo",
  "Ishima",
];
let cityCur = "Sector-12"; // Current citi residing in

// Below are skills-bought notification flags and manual skill slots (5 slots)
const sk = ["N/A", "N/A", "N/A", "N/A", "N/A"];
const sknam = ["x", "x", "x", "x", "x"];
let singularflag = false; // Auto-detect whether we using singularity (need BN 4.1)
let nodeDone = 0; //Have we completed the node?
let nodeNotice = 0; //Have we notified the node is done? (popup with below photo)
const nodeDoneUrl =
  "https://www.meme-arsenal.com/memes/662e20fc2bb75f443a6060533dc64319.jpg";
// #### Set default GLOBAL variables END ####

//############## SETTINGS START ###############################
// Change what you need here:
const minsuccess = 0.94; //Minimum success chance for Contracts & Ops
const minsucblac = 0.95; //Min. chance for BlackOps. (don't set it to 1.00)
const minspread = 0.04; //Min. chance spread (if we need field analysis)

const autolevelflag = true; //Sets mission auto-leveling (some might set this
//false at start of a node - better leave true)
const gymtime = 250333; //Time allocated for each spurt of training in gym (ms)
const crimetime = 3033; //Time to crime (in ms) for Homicide
const stammin = 50; //Minimum stamina to stop working (in percent %)
const raidstingpop = 1000111; //Lowest p0pulation allowed for Sting and Ra!d ops

//Note: Set maxchaos > chaoslow > maxchaosretire or weird stuff happens
const maxchaos = 50; //Max chaos in a citi before we need to do diplomacy
const chaoslow = 40; //Chaos level to stop diplomacy (don't set too low)
const maxchaosretire = 20; //Chaos above which we allow Stealth Retirement ops

//SHOW SKILL PURCHASES? - set to false to avoid skills bought line statuses
const skstatus = true;

//DEFAULT TASKS FOR REST (choose ONE only)
//"Training" is a safe bet, as doesn't involve clashes / singularity actions
//Category (restcat), Type (restype) & C0mment (restcom), add more if desired:

const restcat = "general";
const resttype = "Training";
const restcom = "Training (@rest)";
//var restcat="Gym"; var resttype="agility"; var restcom="GYM Agility (@rest)";
//var restcat="general"; var resttype="Recruitment"; var restcom="Recruit (@rest)";
//var restcat ="general"; var resttype ="Hyperbolic Regeneration Chamber"; var restcom = "Hy-Bol. Chamb. (@rest)";
//var restcat="Crime"; var resttype="homicide"; var restcom="CR>Homicide(@rest)";

//AUTO Skill Purchasing (if true it will make skill purchases automated)
//(Shouldn't need MANUAL, as auto skill purchase is quite good by itself)
const skautobuy = true;

//MANUAL Skill Purchasing - use for fine-tuning, or farming hack skill etc
//If auto skill buying above is turned off, this manages manual skill purchase
//Re-order/c0mment each line of list below to set up manual buy preferences
//Skills will auto-scale & auto-buy due to cost increases & order preferences

sknam[0] = "Blade's Intuition"; // Preferred 1st slot
sknam[1] = "Digital Observer"; // slot 2: Add more if you like,
sknam[2] = "Overclock"; // slot 3: but also expand the
sknam[3] = "Reaper"; // slot 4: sknam[] default array
sknam[4] = "Evasive System"; // slot 5: above too.

//########## SETTINGS END ###################################

// CAN WE WORK? function ====================
export async function canWork(ns: NS) {
  //Get 💘Stamina status in percent %
  const res = await runCom1(ns, "ns.bladeburner.getStamina()", "getStam");
  stamina = 100 * (parseFloat(res[0]) / parseFloat(res[1]));
  //ns.print("INFO Stamina % = " + stamina); //DEBUG (C0mment if not needed)

  //IF Stamina < Minimum stamina, set status to heal & change heal status icon
  if (stamina < stammin) {
    if (healstatus == 0) {
      //ns.print("INFO Heal Status: STARTED"); // DEBUG
      healstatnam = "🟢";
    }
    healstatus = 1;
    return false; // I.E. We can't work
  }

  // If we are in process of healing, do nothing
  if (stamina >= stammin && stamina < 99 && healstatus == 1) {
    //ns.print("WARN Heal Status: ON");  // DEBUG
    healstatnam = "✅";
    return false;
  }

  // If we are not healing BUT above minimum stamina, then do nothing
  if (stamina >= stammin && healstatus == 0) {
    //ns.print("WARN Heal Status: Off");  // DEBUG
    healstatnam = "❌";
    return true;
  }

  // If we are healed enough, stop healing
  if (stamina >= 99 && healstatus == 1) {
    healstatus = 0;
    //ns.print("INFO Heal Status: STOPPED");  // DEBUG
    healstatnam = "🔴";
    return true;
  }

  ns.print("ERROR SOMETHING WENT WRONG"); // means something not working
  return false;
}

//REST function =====================
export async function rest(ns: NS) {
  //@@@@@ CHECK CITI CHAOS LEVELS Start @@@@@
  //ns.print("INFO ## City chaos = " + citychos );  // DEBUG

  //IF citi chaos is more than maximum allowed, turn Diplomacy ON
  if (citychos > maxchaos) {
    // Check Retirement chance in current city
    const idxtem = Oper.findIndex(
      (x) => x.opcitnam === cityCur && x.name === "Stealth Retirement Operation"
    );
    const retirecount = Oper[idxtem].counts;
    const retirechance = Oper[idxtem].chance;
    //ns.print(">REST Retire #:" + retirecount + "  🔮:"+ns.nFormat( retirechance[0],"0.0%")+"/ "+retispread); // DEBUG
    // See if we can do Stealth Retirement instead to lower chaos
    if (
      retirechance[0] >= minsuccess &&
      retirecount > 0 &&
      cityinfo[idxtem].pop > raidstingpop
    ) {
      statuscity = "[Retirement to lower Chaos]";
      return await doAct(
        ns,
        "operation",
        "Stealth Retirement Operation",
        "Stlh Retire (rest)"
      );
    }
    // Otherwise do normal Diplomacy...
    if (diplomacystatus == 0) {
      statusline = "Diplomacy: TURNED ON> 60s";
    }
    diplomacystatus = 1;
    return await doAct(ns, "general", "Diplomacy", "Diplomacy ON", "y");
  }

  // If we are in process of Diplomancy, continue to do diplomacy
  if (citychos <= maxchaos && citychos > chaoslow && diplomacystatus == 1) {
    statusline = "INFO Diplomacy Target:" + chaoslow + " >60s";
    return await doAct(ns, "general", "Diplomacy", "Diplomacy...");
  }

  // If we not doing diplomacy but below Chaos minimum, do nothing
  if (citychos <= maxchaos && diplomacystatus == 0) {
    //ns.print("INFO Diplomacy: Still off...");  // DEBUG
  }

  // If City Chaos is below minimum, stop Diplomacy-ing
  if (citychos <= chaoslow && diplomacystatus == 1) {
    diplomacystatus = 0;
    statusline = "Diplomacy: FINISHED";
  }
  //@@@@@ CHECK CITY CHAOS LEVELS End @@@@@

  // If chance spread is too large, then set "rest action" to field analysis
  if (conspread > minspread || opspread > minspread || blspread > minspread) {
    const restCat = "general";
    const resType = "Field Analysis";
    const restCom = "Field An. (@rest)";
  }

  // Do the REST task selected (transfer settings & capitalise letters)
  const miscat = restcat.charAt(0).toUpperCase() + restcat.substring(1);
  const mistype = resttype.charAt(0).toUpperCase() + resttype.substring(1);
  const miscom = restcom.charAt(0).toUpperCase() + restcom.substring(1);

  //###If Singularity action is GYM then do it ###
  if (miscat == "Gym") {
    // Travel to Sector-12
    await runCom1(ns, "ns.singularity.travelToCity(ns.args[0])", "goCity", [
      "Sector-12",
    ]);
    const miscat = "Powerhouse Gym"; // Best Gym

    statusline = "🚶: " + miscom.substring(0, 23);
    await runCom1(
      ns,
      "ns.singularity.gymWorkout(ns.args[0],ns.args[1],ns.args[2])",
      "goGym",
      [miscat, mistype, false]
    );
    return gymtime; //in 1000's;
  }

  //#####Singularity action - CRIME ######
  if (miscat == "Crime") {
    statusline = "🚶: " + miscom.substring(0, 23);
    await runCom1(ns, "ns.singularity.commitCrime(ns.args[0])", "goCrime", [
      mistype,
    ]);
    return crimetime; // in 1000's;
  }

  //Do the REST action and output to console
  return await doAct(ns, miscat, mistype, miscom.substring(0, 23));
}
//============ REST FUNCTION END ============

//=============== WORK FUNCTION START ================
export async function work(ns: NS) {
  let idxcon = 0; // Master index counter for Contracts array
  let idxop = 0; // Master index counter for Operations array
  let idxbl = 0; // Master index counter for Black Ops array

  BlOp = []; // Initialise Black Ops array (as it needs updating)

  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&
  // &&&&&&&&&&& Check each city mission info START &&&&&&&&&&&&
  for (let cx = 0; cx < citylist.length; cx++) {
    citynam1 = citylist[cx];

    //Switch and travel to the city
    const switchCityOk = await runCom1(
      ns,
      "ns.bladeburner.switchCity(ns.args[0])",
      "switchCity",
      [citynam1]
    );

    // Get that city's population, chaos, number of communities info
    const tempop = await runCom1(
      ns,
      "ns.bladeburner.getCityEstimatedPopulation(ns.args[0])",
      "getPop",
      [citynam1]
    );
    const temchaos = await runCom1(
      ns,
      "ns.bladeburner.getCityChaos(ns.args[0])",
      "getChaos",
      [citynam1]
    );
    const temcomm = await runCom1(
      ns,
      "ns.bladeburner.getCityCommunities(ns.args[0])",
      "getComm",
      [citynam1]
    );

    // Map city info and put it into cities array
    const Tem = {
      idx1: cx,
      name: citylist[cx],
      pop: tempop,
      chaos: temchaos,
      comm: temcomm,
    };
    //cityinfo.push(Tem);
    cityinfo.splice(cx, 1, Tem); // Use Splice to insert & update, not push
    //ns.print(cityinfo[cx].idx1 ,". ", cityinfo[cx].name,", Pop:", ns.nFormat( cityinfo[cx].pop,"0.00a"),", 🔥:", ns.nFormat( cityinfo[cx].chaos,"0"),", 💏:", cityinfo[cx].comm ); // List city info DEBUG 🤷‍♂️ Lists city info

    // ****** Extract City's Contract Mission Info START ******
    for (let cj = 0; cj < contracts.length; cj++) {
      const ConTem = {
        idx1: idxcon, // Master array index
        idx2: cj, // Contract index
        city: cx, // City index
        concitnam: citylist[cx], // City name
        type: "Contract", // Mission Type
        name: contracts[cj], // Contract Name
        chance: await getChance("contract", contracts[cj], ns), // Success %
        counts: await getCounts("contract", contracts[cj], ns), // # Count
      };

      //Cont.push(ConTem); // Push entry into Contract array
      Cont.splice(idxcon, 1, ConTem); // Insert at specific position in array
      //ns.print(Cont[idxcon].idx1 ,". ", citylist[cx]," > ",cj,". ",Cont[idxcon].name," %",Cont[idxcon].chance," #",Cont[idxcon].counts); // List contracts DEBUG

      idxcon = idxcon + 1; // Increment contracts index counter
    }
    // ****** Extract Contract Mission Info END ******

    // ****** Extract City's Operations Mission Info START ******
    for (let oj = 0; oj < operations.length; oj++) {
      const OpTem = {
        idx1: idxop, // Master array index
        idx2: oj, // Operation index
        city: cx, // City index
        opcitnam: citylist[cx], // City name
        type: "Operation", // Mission Type
        name: operations[oj], // Contract Name
        chance: await getChance("operation", operations[oj], ns),
        counts: await getCounts("operation", operations[oj], ns),
      };
      Oper.splice(idxop, 1, OpTem); // Insert at specific position in array
      //ns.print(Oper[idxop].idx1 ,". ", citylist[cx]," > ",oj,". ",Oper[idxop].name," %",Oper[idxop].chance," #",Oper[idxop].counts); // List operations DEBUG

      idxop = idxop + 1; // Increment op index counter
    }
    // ****** Extract City's Operations Mission Info END ******

    // ****** Extract city BLACK OP data into BlackOps array START *****
    let lowestrank = 450111; // Default Black Op rank to compare
    for (let bj = blacstart; bj < blackops.length; bj++) {
      const BlacTem = {
        idx1: idxbl, // Master index in array
        idx2: bj, // Black Op list index
        city: cx, // City index
        blcitnam: citylist[cx], // City name
        type: "Blackop", // Mission type
        name: blackops[bj], // Black Op name
        chance: await getChance("blackop", blackops[bj], ns),
        counts: await runCom1(
          ns,
          "ns.bladeburner.getActionCountRemaining(ns.args[0], ns.args[1])",
          "getCounts",
          ["blackop", blackops[bj]]
        ),
        rankok: await runCom1(
          ns,
          "ns.bladeburner.getBlackOpRank(ns.args[0])",
          "getBlOpRnk",
          [blackops[bj]]
        ),
      };

      // If available Black Op is equal or lower ranked, add to array
      if (lowestrank >= parseFloat(BlacTem.rankok) && BlacTem.counts == "1") {
        lowestrank = parseFloat(BlacTem.rankok);
        BlOp.push(BlacTem); // Add entry to Black Op array
        //ns.print(BlOp[idxbl].idx1,". ",BlOp[idxbl].blcitnam,": ",BlOp[idxbl].name," %",BlOp[idxbl].chance[0]," #",BlOp[idxbl].counts," k:",BlOp[idxbl].rankok); // List Black Ops info DEBUG
        idxbl = idxbl + 1; // Increment bl op index counter
      }

      // If blackop is completed, don't scan it in future (speeds up scanning)
      if (BlacTem.counts == "0" && idxbl < 21) {
        blacstart = blacstart + 1;
      }
      //ns.print("blacstart: ", blacstart); //DEBUG
    }
    //ns.print("WARN Lowest Rank of Black Op: ", lowestrank); //DEBUG
    // ****** Extract city Black Op data into BlackOps array END *****
  }
  // &&&&&&&&& Check each city mission info END &&&&&&&&
  // &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&

  //REDUCE CONTRACTS: If 1st one's chance is greater than the 2nd one (no 'or
  //equals' thus later cities will get priority) & has missions, choose it
  bestCon = Cont.reduce((a, b) =>
    a.chance[0] > b.chance[0] && a.counts > 0 ? a : b
  );

  //REDUCE OPERATIONS: If 1st one's chance is higher AND has missions left,
  //choose it OR the 2nd one is Sting/Raid/has no missions, choose 1st one
  //Note: We reject STINGS, RAIDS, STEALTH RETIREMENT first (for now)
  bestOp = Oper.reduce((a, b) =>
    (a.chance[0] > b.chance[0] && a.counts > 0) ||
    b.name == "Sting Operation" ||
    b.name == "Raid" ||
    b.name == "Stealth Retirement" ||
    b.counts < 1
      ? a
      : b
  );

  // If we've completed Node, insert fake sample into BlOp to continue script
  if (BlOp.length == 0) {
    const sample: {
      idx1: number;
      idx2: number;
      city: number;
      blcitnam: string;
      type: string;
      name: string;
      chance: number[];
      counts: number;
      rankok: number;
    } = {
      idx1: -1,
      idx2: -1,
      city: 1,
      blcitnam: "Sector-12",
      type: "Blackop",
      name: "Sample Name",
      chance: [0, 0],
      counts: 0,
      rankok: 0,
    };
    BlOp.push(sample); // Push to Array & set node done status to yes
    nodeDone = 1;
  }

  //Show Node complete pop-up? (from Cat Viewer code by Sysroot)
  if (nodeDone == 1 && nodeNotice == 0) {
    nodeNotice = 1; // Show only once
    const imageHTML = `<center><h1>NODE COMPLETED</h1><h3>Complete World Da3m0n in Blade Burner Black Op Menu</h3></center><img src=${nodeDoneUrl}</img>`;
    ns.alert(imageHTML);
  }

  // REDUCE Black Ops: (If 1st one has better chance, then select it.
  //Note: Ops difficulty increases in farther cities, so choose nearer ones
  //bestBlackOp = BlOp.reduce( (a, b) => ( a.chance[0] >= b.chance[0] && a.counts>0 && a.rankok <= b.rankok && a.idx2 < b.idx2 ) ? a : b ); // Previous version
  bestBlackOp = BlOp.reduce((a, b) => (a.chance[0] >= b.chance[0] ? a : b)) as {
    idx1: number;
    idx2: number;
    city: number;
    blcitnam: string;
    type: string;
    name: string;
    chance: [number, number];
    counts: number;
    rankok: number;
  };

  //DEBUG - these 3 lines print out the best Contract, Operation & Black Op
  //ns.print("\n*Best ", bestCon.type.substring(0,8), " @",citylist[bestCon.city].substring(0,12), " #",bestCon.counts, "\n>> ", bestCon.name.substring(0,14), ": ", ns.nFormat( (bestCon.chance[0] * 100 ) ,"0.0"), "-", ns.nFormat( bestCon.chance[1]*100,"0.0"), "%" );
  //ns.print("\n*Best ", bestOp.type.substring(0,9)," @",citylist[bestOp.city].substring(0,12), " #",bestOp.counts, "\n>> ", bestOp.name.substring(0,14), ":", ns.nFormat( (bestOp.chance[0] * 100 ) ,"0.0"), "-", ns.nFormat( bestOp.chance[1]*100,"0.0"), "%" );
  //ns.print("INFO\n*Best ", bestBlackOp.type.substring(0,9)," @", citylist[bestBlackOp.city].substring(0,9), " #",bestBlackOp.counts, "\n>> ", bestBlackOp.name.substring(0,14), ":", ns.nFormat( (bestBlackOp.chance[0] * 100 ) ,"0.0"), "-", ns.nFormat( bestBlackOp.chance[1]*100,"0.0"), "%" );

  //Extract chances, spreads & counts of best C0ntract, 0perations, bl@ck ops
  conper0 = bestCon.chance[0] * 100; // Low contract chance
  conper1 = bestCon.chance[1] * 100; // High contract chance
  conspread = Number((bestCon.chance[1] - bestCon.chance[0]).toFixed(2));
  concount = bestCon.counts;

  opper0 = bestOp.chance[0] * 100; // Low op chance
  opper1 = bestOp.chance[1] * 100; // High op chance
  opspread = Number((bestOp.chance[1] - bestOp.chance[0]).toFixed(3));
  opcount = bestOp.counts;

  blacper0 = bestBlackOp.chance[0] * 100; // Low chance %
  blacper1 = bestBlackOp.chance[1] * 100; // High chance %
  blspread = Number((bestBlackOp.chance[1] - bestBlackOp.chance[0]).toFixed(3));

  const blcount = bestBlackOp.counts;

  // $$$$$$$$$$$$$$$$$$$ BLACK OPS CHECK $$$$$$$$$$$$$$$$$$$$$
  const blackOpReqRank = bestBlackOp.rankok; // Get required rank for Black Op

  // If Black Op success is achievable & ranked enough & has missions, do it
  if (
    bestBlackOp.chance[0] >= minsucblac &&
    blrank >= blackOpReqRank &&
    blcount > 0
  ) {
    //Note: Optimally, we do analysis checks AFTER checking EACH mission chances
    //ns.print("blspread: ", blspread, " minspread: ", minspread); //DEBUG

    // Check if need to do field analysis for best Black Op
    if (blspread > minspread) {
      cityCur = bestBlackOp.blcitnam; // Update status HUD city name
      const switchCityOk = await runCom1(
        ns,
        "ns.bladeburner.switchCity(ns.args[0])",
        "switchCity",
        []
      ); //Go city
      statuscity =
        "🚩" +
        cityCur +
        ">> BLACK OP: " +
        ns.nFormat(bestBlackOp.chance[0] * 100, "0.0") +
        "-" +
        ns.nFormat(bestBlackOp.chance[1] * 100, "0.0") +
        "%";
      return await doAct(
        ns,
        "general",
        "Field Analysis",
        "Field A. (Black Ops)"
      );
    }

    // Do Black Op if all above is ok
    const skilnam = bestBlackOp.name; // Black Op name
    const skiltyp = bestBlackOp.type; // Black Op type
    cityCur = bestBlackOp.blcitnam; // Update status HUD city
    const switchCityOk = await runCom1(
      ns,
      "ns.bladeburner.switchCity(ns.args[0])",
      "switchCity",
      [cityCur]
    ); //Go to the city
    // Update additional info line
    statuscity =
      "🚩" +
      cityCur +
      ">> BLACK OP: " +
      ns.nFormat(bestBlackOp.chance[0] * 100, "0.0") +
      "%";
    let comm = "B>" + skilnam.substring(0, 22);
    comm = comm.replace("eration", ""); // Shorten "Operation" to "Op"
    return await doAct(ns, skiltyp, skilnam, comm); // Do black op!
  }

  //$$$$$$$ NEW RAID / STING Extra Check SECTION - START (new feature) $$$$$$
  //The aim of this new section is to tap on the previously unused Raids
  //  and Stings (since they had adverse chaos, pop and mission count
  //  effects). This section will conduct raids and stings where necessary,
  //  and where applicable will use Stealth Retirement to keep Chaos down.
  //As your increase stats & lower spre@ds for Contracts - Operation missions
  //  in other cities slowly become available and open up for execution.
  //
  //This section will automatically stop/skip if Chaos levels of the city
  //  get too high, or the p0pulation drops below a certain amount. Both
  //  of these can be adjusted in the settings.

  //ns.print("🚩 Checking Raids/Stings..."); // DEBUG

  // $$$$$$ LOOP CITIES START $$$$$$ for raids/stings (ra!ds are higher priority)
  statuscity = "[No extra actions]"; // Reset change city status
  for (let ij = 0; ij < citylist.length; ij++) {
    // Get info of the city
    citynam1 = cityinfo[ij].name; // City we are checking
    const stiId = ij * 6 + 2; // Index of St!ng in Operations array
    const raiId = ij * 6 + 3; // Index of Raid in Operations array
    const retId = ij * 6 + 4; // Index of Retirement in Ops array
    const assId = ij * 6 + 5; // Index of Assassinate in Ops array
    const stingcount = Oper[stiId].counts;
    const stingchance = Oper[stiId].chance;
    const raidcount = Oper[raiId].counts;
    const raidchance = Oper[raiId].chance;
    const retirecount = Oper[retId].counts;
    const retirechance = Oper[retId].chance;
    const asscount = Oper[assId].counts;
    const asschance = Oper[assId].chance;
    const stingspread = ns.nFormat(stingchance[1] - stingchance[0], "0.000");
    const raidspread = ns.nFormat(raidchance[1] - raidchance[0], "0.000");
    const retispread = ns.nFormat(retirechance[1] - retirechance[0], "0.000");
    // DEBUG LINES to show city st!ng/raid/retirement mission info
    //ns.print("🚩Checking City: " + citynam1 + "🚩"); // DEBUG
    //ns.print(">STING #:" + stingcount + "  🔮:"+ns.nFormat( stingchance[0],"0.0%")+" / "+stingspread); // DEBUG
    //ns.print(">Raid #:" + raidcount + "  🔮:"+ns.nFormat( raidchance[0],"0.0%")+" / "+raidspread); // DEBUG
    //ns.print(">Retire #:" + retirecount + "  🔮:"+ns.nFormat( retirechance[0],"0.0%")+"/ "+retispread); // DEBUG

    // Do Stealth Retiremnt (lowers chaos) if there's too much chaos. Check
    // count, success rate, pop, and less missions available than assassinate
    if (
      cityinfo[ij].chaos > maxchaosretire &&
      retirecount > 0 &&
      retirechance[0] >= minsuccess &&
      asscount < retirecount &&
      cityinfo[ij].pop > raidstingpop
    ) {
      cityCur = citynam1; // Update status HUD city name
      const switchCityOk = await runCom1(
        ns,
        "ns.bladeburner.switchCity(ns.args[0])",
        "switchCity",
        [citynam1]
      ); //Go to the city
      // Show city travelled to, and p0pulation
      citypopu = cityinfo[ij].pop;
      statuscity = "🚩" + citynam1 + " 👥:" + ns.nFormat(citypopu, "0.0a");
      return await doAct(
        ns,
        "operation",
        "Stealth Retirement Operation",
        "Stl Retire (new)"
      );
    }

    //Skip to next city if p0pulation too low (thus don't want Stings & Raids)
    if (cityinfo[ij].pop < raidstingpop) {
      //ns.print("Pop 👥: "+ns.nFormat(Cityinfo[ij].pop,"0.0a") + "< RaidstingPop?: "+ ns.nFormat(raidstingpop,"0.0a") + ">SKIPPED CITY"); //DEBUG
      continue;
    }

    //If any SPREADS for Sting, Raids and Retiremnt are too large, and the
    //  chances are below the minimum success level, AND there are few
    //  contract and operation missions left, then do Field Analysis.
    if (
      (parseFloat(stingspread) > minspread ||
        parseFloat(raidspread) > minspread ||
        parseFloat(retispread) > minspread) &&
      (stingchance[0] >= minsuccess ||
        raidchance[0] >= minsuccess ||
        retirechance[0] >= minsuccess) &&
      concount < 5 &&
      opcount < 5
    ) {
      cityCur = citynam1;
      const switchCityOk = await runCom1(
        ns,
        "ns.bladeburner.switchCity(ns.args[0])",
        "switchCity",
        [citynam1]
      ); //Go to the city
      // Show city went to, and spreads for s-Sting, R-R@id, r-Retiremnt
      statuscity =
        "🚩" +
        citynam1.substring(0, 7) +
        "⛗⛗ s" +
        ns.nFormat(parseFloat(stingspread) * 100, "0.0") +
        "% R" +
        ns.nFormat(parseFloat(raidspread) * 100, "0.0") +
        "% r" +
        ns.nFormat(parseFloat(retispread) * 100, "0.0") +
        "%";
      return await doAct(ns, "general", "Field Analysis", "Field Ana (new)");
    }

    // Do ra!d if rules met (counts, success chance, chaos & communities)
    if (
      raidcount > 0 &&
      raidchance[0] >= minsuccess &&
      cityinfo[ij].chaos < maxchaos &&
      cityinfo[ij].comm > 0 &&
      raidcount > asscount
    ) {
      cityCur = citynam1;
      const switchCityOk = await runCom1(
        ns,
        "ns.bladeburner.switchCity(ns.args[0])",
        "switchCity",
        [citynam1]
      ); //Go to the city
      // Show city travelled to, and communities left for R@id
      statuscity =
        "🚩" +
        (ij + 1) +
        "-" +
        citynam1.substring(0, 9) +
        " " +
        ns.nFormat(raidchance[0] * 100, "0.0") +
        "% 💏" +
        cityinfo[ij].comm;
      return await doAct(ns, "operation", "Raid", "RAID (new)");
    }

    // Do Sting if conditions met(counts, success chance, retire chaos level, pop)
    if (
      stingcount > 0 &&
      stingchance[0] >= minsuccess &&
      cityinfo[ij].chaos < maxchaosretire &&
      cityinfo[ij].pop > raidstingpop
    ) {
      cityCur = citynam1;
      const switchCityOk = await runCom1(
        ns,
        "ns.bladeburner.switchCity(ns.args[0])",
        "switchCity",
        [citynam1]
      ); //Go to the city
      // Show city travelled to, and p0pulation
      citypopu = cityinfo[ij].pop;
      statuscity = "🚩" + citynam1 + " 👥:" + ns.nFormat(citypopu, "0.0a");
      return await doAct(ns, "operation", "Sting Operation", "STING (new)");
    }

    // DEBUG City Info, Sting counts, chance and spre@ds:
    //ns.print("🔴 " + ij + ". Going city: " + citynam1 ); // DEBUG
    //ns.print("🚩 City 🔥: " +ns.nFormat(citychos, "0.00") ); //DEBUG Chaos
    //ns.print(">> MaxChaosRetire: "+ns.nFormat(maxchaosretire, "0.00") );//D
    //ns.print("🚩 City pop 👥: "+ns.nFormat(citypopu,"0.000a"));//DEBUG
    //ns.print("@@ City commmunity 💏 is " + cityinfo[ij].comm ); // DEBUG
  } // %%% LOOP CITIES END %%%
  //$$$$$$$$$$$$$$$ RAID / STING SECTION Extra Check - END $$$$$$$$$$$$$$$$$$

  //Code Part 3c: Work (Ops/Cons)
  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // $$$$$$$$$$$$$$$$$$$ OPERATIONS CHECK $$$$$$$$$$$$$$$$$$$$$

  // $$$$$$$ Check if city ch@os for best operation is too high START $$$$$$$
  const opcitychos = ns.nFormat(cityinfo[bestOp.city].chaos, "0.0");
  //ns.print("🔥OPS Chaos: ",bestOp.opcitnam," : ", opcitychos , " Max: ",maxchaos); // DEBUG
  if (parseFloat(opcitychos) > maxchaos) {
    // Check Retirement chance in Best Operation city
    const rettem = bestOp.city * 6 + 4; //Index of Ops best retirement mission
    const retirecount = Oper[rettem].counts;
    const retirechance = Oper[rettem].chance;
    //ns.print(rettem, ".DIPLOMACY Retire #:" + retirecount + "  🔮:"+ns.nFormat( retirechance[0],"0.0%")+"/ "+retispread); // DEBUG
    if (retirechance[0] >= minsuccess && retirecount > 0) {
      const switchCityOk = await runCom1(
        ns,
        "ns.bladeburner.switchCity(ns.args[0])",
        "switchCity",
        [bestOp.opcitnam]
      ); // go city
      statuscity = "🚩" + bestOp.opcitnam + " 🔥:" + opcitychos;
      return await doAct(
        ns,
        "operation",
        "Stealth Retirement Operation",
        "Retire (Ops-work)"
      );
    }

    diplomacystatus = 1; // Otherwise do normal Diplomacy...
    const switchCityOk = await runCom1(
      ns,
      "ns.bladeburner.switchCity(ns.args[0])",
      "switchCity",
      [bestOp.opcitnam]
    ); // go city
    statuscity = "🚩" + bestOp.opcitnam + " 🔥:" + opcitychos;
    return await doAct(ns, "general", "Diplomacy", "Diplomacy ON (Op-work)");
  }
  //$$$$$$$ Check if city chaos is too high for best operation END $$$$$$$$

  // Since we prefer Operations as a higher priority, we check operations first
  // If b3st Op chance is better than contract's, or is above min. success rate
  if (bestOp.chance[0] >= bestCon.chance[0] || bestOp.chance[0] > minsuccess) {
    // Check operation spre@d & do field analysis if we over minimum spre@d
    if (opspread > minspread) {
      const skilcity = bestOp.opcitnam;
      cityCur = skilcity;
      statuscity =
        "🚩" +
        skilcity +
        ": " +
        ns.nFormat(opper0, "0.0") +
        "-" +
        ns.nFormat(opper1, "0.0") +
        "%";
      const switchCityOk = await runCom1(
        ns,
        "ns.bladeburner.switchCity(ns.args[0])",
        "switchCity",
        [skilcity]
      );
      return await doAct(ns, "general", "Field Analysis", "Field An (Ops)");
    }

    //If chance is too low, then do training
    if (bestOp.chance[0] <= minsuccess) {
      return await doAct(ns, "general", "Training", "Training (Ops)");
    }

    // Otherwise START the Operation!
    const skilnam = bestOp.name;
    const skiltyp = bestOp.type;
    const comm = "Op>" + skilnam.substring(0, 10);
    const skilcity = bestOp.opcitnam;
    cityCur = skilcity;
    statuscity = "🚩" + skilcity + ": " + ns.nFormat(opper0, "0.0") + "%";
    const switchCityOk = await runCom1(
      ns,
      "ns.bladeburner.switchCity(ns.args[0])",
      "switchCity",
      [skilcity]
    );
    return await doAct(ns, skiltyp, skilnam, comm);
  }

  // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  // $$$$$$$$$$$$$$$$$$$$ CONTRACTS CHECK  $$$$$$$$$$$$$$$$$$$$$

  // $$$$$$ Check ch@os for best C0NTRACT city START $$$$$$
  const concitychos = ns.nFormat(cityinfo[bestCon.city].chaos, "0.0");
  //ns.print("🔥CON Chaos: ",bestCon.concitnam," : ", concitychos , " Max: ",maxchaos); // DEBUG
  // Check Retirement chance in Best C0ntract city
  if (parseFloat(concitychos) > maxchaos) {
    const rettem2 = bestCon.city * 6 + 4;
    ns.print(">DIPLOMACY Retire rettem2:" + rettem2);
    const retirecount = Oper[rettem2].counts;
    const retirechance = Oper[rettem2].chance;
    //ns.print(">DIPLOMACY Retire #:" + retirecount + "  🔮:"+ns.nFormat( retirechance[0],"0.0%")+"/ "+retispread); // DEBUG
    if (retirechance[0] >= minsuccess && retirecount > 0) {
      const switchCityOk = await runCom1(
        ns,
        "ns.bladeburner.switchCity(ns.args[0])",
        "switchCity",
        [bestCon.concitnam]
      ); // go city
      statuscity = "🚩" + bestOp.concitnam + " 🔥:" + concitychos;
      return await doAct(
        ns,
        "operation",
        "Stealth Retirement Operation",
        "Retire (Con-work)"
      );
    }

    diplomacystatus = 1; // Otherwise do normal Diplomacy...
    const switchCityOk = await runCom1(
      ns,
      "ns.bladeburner.switchCity(ns.args[0])",
      "switchCity",
      [bestCon.concitnam]
    ); // go city
    statuscity = "🚩" + bestOp.concitnam + " 🔥:" + concitychos;
    return await doAct(ns, "general", "Diplomacy", "Diplomacy ON (Con-work)");
  }
  // $$$$$$ Check ch@os for best C0NTRACT city END $$$$$$

  // If Contract Spre@d is high then do Field Analysis
  if (conspread > minspread) {
    const skilcity = bestCon.concitnam;
    cityCur = skilcity; // Update console
    statuscity =
      "🚩" +
      skilcity +
      ": " +
      ns.nFormat(conper0, "0.0") +
      "-" +
      ns.nFormat(conper1, "0.0") +
      "%";
    const switchCityOk = await runCom1(
      ns,
      "ns.bladeburner.switchCity(ns.args[0])",
      "switchCity",
      [skilcity]
    ); // Go to that city
    return await doAct(ns, "general", "Field Analysis", "Field An (Contract)");
  }

  //If success chance is too low, then do training
  if (bestCon.chance[0] <= minsuccess) {
    return await doAct(ns, "general", "Training", "Training (Contract)");
  } else {
    // Else if chance is ok then continue...

    // Do the contract (once all rules above fail)
    const skilnam = bestCon.name;
    const skiltyp = bestCon.type;
    const comm = "Con>" + skilnam.substring(0, 11);
    const skilcity = bestCon.concitnam;
    cityCur = skilcity; // Update console
    statuscity = "🚩" + skilcity + ": " + ns.nFormat(conper0, "0.0") + "%";
    const switchCityOk = await runCom1(
      ns,
      "ns.bladeburner.switchCity(ns.args[0])",
      "switchCity",
      [skilcity]
    ); // Go to that city
    return await doAct(ns, skiltyp, skilnam, comm);
  }
} //=============== WORK FUNCTION END  ================
//============= BUY SKILLS FUNCTION START ==============
export async function checkSkills(ns: NS) {
  skstat = false; // Default skill log status
  const breakout = false; // Default 'do we stop checking' variable

  // Label to BREAK out of
  skillbuying: while (true) {
    //if (breakout === true) break skillbuying; //If told to stop buying skills, break

    //@@@@@@@@@@@ AUTO SKILL BUY START @@@@@@@@@@@@@@@@
    //Set default skill to auto-buy, "skautonam" is currently chosen skill to buy
    //Feel free to set your own rulesets. Here, we focus on the skills that are
    //most needed to complete the node (ie. ignore stuff like Cloak)
    let skautonam = "Blade's Intuition"; // Set default skill to buy
    if (skautobuy == true) {
      //ns.print("ERROR *Skill buying AUTO start");// DEBUG
      // Get retirement chance
      const contractchance = await getChance("contract", "Retirement", ns);

      // Get levels of skills most important to beating the node
      const lvlbladein = await getSkillLearn("Blade's Intuition", ns);
      const lvlreaper = await getSkillLearn("Reaper", ns);
      const lvlevasive = await getSkillLearn("Evasive System", ns);
      const lvldigital = await getSkillLearn("Digital Observer", ns);
      const lvloverc = await getSkillLearn("Overclock", ns);

      //await ns.print("Retire Con%: " + (contractchance[0]*100) +"%" );// DEBUG
      //await ns.print("Blade Intuition skill level: " +lvlbladein );// DEBUG
      //await ns.print("      Overclock skill level: " +lvloverc );// DEBUG

      //If retirement contract chance is maxed, we prefer Observer or Overclock
      if (parseFloat(contractchance[0]) >= 1.0) {
        //If overclock skill higher (by extra), or overclock maxed, buy observer
        if (
          parseFloat(lvlbladein) * 2 < parseFloat(lvloverc) ||
          parseFloat(lvldigital) * 2 < parseFloat(lvloverc) ||
          lvloverc == "90"
        ) {
          skautonam = "Digital Observer";
        } else {
          skautonam = "Overclock";
        }
        //If chosen skill higher than Blade's Intuition, choose Blade
        if (
          parseFloat(lvldigital) * 3 > parseFloat(lvlbladein) * 4 ||
          lvloverc > lvlbladein
        ) {
          skautonam = "Blade's Intuition";
        } else {
          skautonam = "Digital Observer";
        }
      }

      // Spread & even out levels of "evasive" and "reaper" skills
      // Put 300% more emphasis on "evasive" due to stamina and speed gains
      const lvltem = await runCom1(
        ns,
        "ns.bladeburner.getSkillLevel(ns.args[0])",
        "getSkLev",
        [skautonam]
      );
      if (
        parseFloat(lvlreaper) * 3.0 < parseFloat(lvltem) ||
        lvlevasive < lvltem
      ) {
        if (parseFloat(lvlreaper) * 3.0 < parseFloat(lvlevasive)) {
          skautonam = "Reaper";
        } else {
          skautonam = "Evasive System";
        }
      }

      //Buy the skill
      //await ns.print("WARN CHOSEN skautonam: " +skautonam );// DEBUG
      const sksk = await runCom1(
        ns,
        "ns.bladeburner.upgradeSkill(ns.args[0])",
        "getUpSk",
        [skautonam]
      );
      if (sksk == "true") {
        skstat = true;
        if (skstatus == true) {
          //print skill bought status
          ns.print(
            "🌟👜:" +
              skautonam.substring(0, 15) +
              " " +
              Math.floor(Math.random() * (99 - 1) + 1)
          ); // Random number used to show visible scrolling in long lists
        }
      }

      // BREAK While loop if we have no more points (prevents points buildup)
      const curskillpts = await runCom1(
        ns,
        "ns.bladeburner.getSkillPoints()",
        "getSkPts"
      );
      const requiredpts = await runCom1(
        ns,
        "ns.bladeburner.getSkillUpgradeCost(ns.args[0])",
        "getSkUp",
        [skautonam]
      );
      //await ns.print("curskill: "+curskillpts+" required: "+requiredpts);// DEBUG
      if (skreq < parseFloat(requiredpts)) {
        skreq = parseFloat(requiredpts);
      }
      if (curskillpts < requiredpts) {
        break skillbuying;
      }
    }
    // @@@@@@@@@@@ END AUTO SKILL BUY @@@@@@@@@@@@@@@@

    // ########### MANUAL SKILL BUY SECTION START  #################
    /* if (skautobuy == false) {
      //Buys the skills in rank order & stores outcome in variables
      //(Skills will buy automatically in preference order because if we don't
      //have enough points for that skill the next line will execute and so on)
      // ns.print("      sknam.length: " + sknam.length ); // DEBUG
      for (let ij = 0; ij < sknam.length; ij++) {
        sk[ij] = await runCom1(
          ns,
          "ns.bladeburner.upgradeSkill(ns.args[0])",
          "upgSk",
          [sknam[ij]]
        );
        if (sk[ij] == true) {
          skstat = true;
          if (skstatus == true) {
            //print skill bought status
            ns.print(
              "🌟👜:" +
                sknam[ij].substring(0, 15) +
                " " +
                (Math.random() + 1).toString(36).substring(11)
            ); // Random letters used to show visible scrolling in long lists
          }
        }
      } */

    // BREAK loop if we have no more skill points (prevents points overflowing)
    /* var curskillpts = await runCom1(
        ns,
        "ns.bladeburner.getSkillPoints()",
        "getSkPts"
      );
      //ns.print("Cur skill pts: " + curskillpts );  // DEBUG
      const skcost = [];
      for (let sj = 0; sj < sknam.length; sj++) {
        skcost[sj] = await runCom1(
          ns,
          "ns.bladeburner.getSkillUpgradeCost(ns.args[0])",
          "getSkUpCost",
          [sknam[sj]]
        );
        if (skreq < skcost[sj]) {
          skreq = skcost[sj];
        }
        //ns.print("      skcost["+ sj + "]: " + skcost[sj] ); // DEBUG
        if (curskillpts < skcost[sj]) {
          break skillbuying;
        }
      }
    } */
    // ########### MANUAL SKILL BUY SECTION END #################
  } // END WHILE TRUE
}

//============= END SKILLS FUNCTION ==============

//===============================================================================
//START MAIN ASYNC FUNCTION
export async function main(ns: NS): Promise<void> {
  const myArray: {
    idx1: number;
    idx2: number;
    city: number;
    blcitnam: string;
    type: string;
    name: string;
    chance: [number, number];
    counts: number;
    rankok: number;
  }[] = [];

  // Now you can push objects with the required properties to the array without any errors
  myArray.push({
    idx1: 1,
    idx2: 2,
    city: 3,
    blcitnam: "city name",
    type: "type",
    name: "name",
    chance: [1, 2],
    counts: 3,
    rankok: 4,
  });
  ns.disableLog("disableLog");
  ns.disableLog("exec");
  ns.disableLog("asleep");
  ns.disableLog("bladeburner.startAction");
  ns.disableLog("bladeburner.upgradeSkill");
  ns.disableLog("sleep");
  ns.disableLog("bladeburner.getSkillUpgradeCost");
  ns.disableLog("singularity.gymWorkout");
  ns.disableLog("singularity.travelToCity");
  ns.disableLog("singularity.commitCrime");
  ns.disableLog("singularity.stopAction");

  ns.print("|<=====  RESIZE LOG WINDOW  =====>|");

  //ns.clearLog();
  ns.tail(); // Open console window to view status
  ns.print("Please wait, script starting...");
  ns.print("\nIf you see (Script Killed), with");
  ns.print("  no crash, wait a loop or two.\n");

  // @@@@@@@ AUTO-CHECKING SINGULARITY START @@@@@@@@
  // This makes singularity detection automatic. We are looking for "The
  // Blade's Simulacrum" augment - if we own the aug then turn singularity off
  const augcheck = false;
  const augsowned = await runCom1(
    ns,
    "ns.singularity.getOwnedAugmentations(ns.args[0])",
    "getAugs",
    [false]
  );
  await sleep(200);

  // Loop through all owned augments, looking for Blade's Simulacrum
  for (let ij = 0; ij < augsowned.length; ij++) {
    //ns.print( augsowned[ij] + ","); // DEBUG
    if (augsowned[ij] == "The Blade's Simulacrum") {
      const augcheck = true;
    }
  }

  if (augcheck == false) {
    singularflag = true;
    ns.print("❌Simulacrum Aug. Singularity ON");
  } else {
    singularflag = false;
    ns.print("Found Simulacrum: Singularity OFF");
  }
  // @@@@@@@ AUTO-CHECKING SINGULARITY END @@@@@@@@@@

  //If we using Singularities, then STOP study, work, program, crime actions
  //Needed as before we get Simulacrum aug, they will override Blade actions
  if (singularflag == true) {
    await runCom1(ns, "ns.singularity.stopAction()", "stopAct");
  }

  // JOIN the BladeBurner Faction automatically
  const joinblades = await runCom1(
    ns,
    "ns.bladeburner.joinBladeburnerFaction()",
    "joinBlade"
  );
  ns.print("Joined BB Faction? = ", joinblades);

  // Auto skill buy status
  if (skautobuy == true) {
    ns.print("INFO: AUTO Skill-buy is ON");
  } else {
    ns.print("INFO: AUTO Skill-buy is OFF");
  }

  // $$$$$$ SET AUTOLEVEL in all mission types if set to do so $$$$$$$
  if (autolevelflag == true) {
    ns.print("WARN Setting Auto-Levelling ON");

    for (let ij = 0; ij < contracts.length; ij++) {
      await runCom1(
        ns,
        "ns.bladeburner.setActionAutolevel(ns.args[0],ns.args[1],ns.args[2])",
        "setActAuto",
        ["contract", contracts[ij], true]
      );
    }

    for (let ij = 0; ij < operations.length; ij++) {
      await runCom1(
        ns,
        "ns.bladeburner.setActionAutolevel(ns.args[0],ns.args[1],ns.args[2])",
        "setActAuto",
        ["operation", operations[ij], true]
      );
    }
  }

  //Run work function first to populate information arrays
  await work(ns);

  // ##################################
  // ######## START MAIN LOOP #########
  while (true) {
    // Get Blade Ranking and current city name & p0pulation
    blrank = parseFloat(
      await runCom1(ns, "ns.bladeburner.getRank()", "getRank")
    );
    cityCur = await runCom1(ns, "ns.bladeburner.getCity()", "getCity");

    //Store previous Chaos values (need 2 values to see visible differences)
    citychos2 = citychos3;
    citychos = parseFloat(
      await runCom1(ns, "ns.bladeburner.getCityChaos(ns.args[0])", "getChaos", [
        cityCur,
      ])
    );
    citychos3 = citychos; //store Chaos value for next loop

    //Get status: 📖Blade Skill points owned...
    skpts = parseFloat(
      await runCom1(ns, "ns.bladeburner.getSkillPoints()", "getSkPts")
    );

    // Check if we can work?
    const can1 = await canWork(ns);
    //ns.print("INFO Can we work? = " + can1); //DEBUG

    //If we can work then work, else we rest
    let snoozeTime;
    if (can1 == true) {
      const work1 = await work(ns);
      snoozeTime = parseFloat(work1);
    } else {
      const rest1 = await rest(ns);
      if (typeof rest1 !== "number") {
        snoozeTime = parseFloat(rest1);
      }
      snoozeTime = rest1;
    }

    // @@@@@@@@ PRINT STATUS START @@@@@@@@@@@@@@@@@@
    // ##Print ACTION line
    //await middText(statusline, null, ns); //OLD Status Line
    let len = 1 + statusline.toString().length;
    let suctext =
      TxtTr.apply("%%", [TxtTr.Col.White, TxtTr.Tran.Bold]) +
      ":" +
      TxtTr.apply(minsuccess.toString(), [TxtTr.Col.DGreen, TxtTr.Tran.Under]) +
      " " +
      TxtTr.apply("%b", [TxtTr.Col.White, TxtTr.Tran.Bold]) +
      ":" +
      TxtTr.apply(minsucblac.toString(), [TxtTr.Col.DGreen, TxtTr.Tran.Under]) +
      " " +
      TxtTr.apply("#c", [TxtTr.Col.White, TxtTr.Tran.Bold]) +
      ":" +
      TxtTr.apply(concount.toString(), [TxtTr.Col.Yellow]) +
      " " +
      TxtTr.apply("#o", [TxtTr.Col.White, TxtTr.Tran.Bold]) +
      ":" +
      TxtTr.apply(opcount.toString(), [TxtTr.Col.Blue]);
    if (statusline.indexOf("Con>") != -1) {
      suctext = TxtTr.apply(statusline, [TxtTr.Col.Yellow]);
    } else if (statusline.indexOf("Op>") != -1) {
      suctext = TxtTr.apply(statusline, [TxtTr.Col.Blue]);
    } else if (statusline.indexOf("B>") != -1) {
      suctext = TxtTr.apply(statusline, [TxtTr.Col.Purple, TxtTr.Tran.Bold]);
    } else {
      suctext = TxtTr.apply(statusline, [TxtTr.Col.Orange, TxtTr.Tran.Under]);
    }
    await middText(suctext, len, ns);

    // @@@@@@@@ PRINT STATUS END @@@@@@@@@@@@@@@@@@
    // Get chaos, population and communities of current city
    citychos = cityinfo[cityinfo.findIndex((x) => x.name === cityCur)].chaos;
    citypopu = cityinfo[cityinfo.findIndex((x) => x.name === cityCur)].pop;
    citycomm = cityinfo[cityinfo.findIndex((x) => x.name === cityCur)].comm;

    // Blank Line to divide loops, show stars if skills were bought
    if (skstat != false) {
      ns.print("░░░🌟░░🌟░░🌟░░🌟░░🌟░░🌟░░🌟░░░░");
    } else {
      ns.print("░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░");
    }

    //##Show 💘 health, owned skill points / points to next skill
    await middText(
      "█ 💘" +
        ns.nFormat(stamina, "0.0") +
        "% █ 📖" +
        skpts +
        "/" +
        skreq +
        " █",
      null,
      ns
    );

    //Show 🗡Rank: current Blade rank & 🩸:HEAL STATUS
    await middText(
      "🏠" +
        cityCur.substring(0, 9) +
        " █ 🗡" +
        ns.nFormat(blrank, "0,0.") +
        " █" +
        " 🩸" +
        healstatnam +
        "",
      null,
      ns
    );

    //##Show @:CITY NAME (shortened), 🔥:Chaos + history + city pop
    await middText(
      "🔥" +
        ns.nFormat(citychos, "0.0") +
        "<" +
        ns.nFormat(citychos2, "0.0") +
        " 👥" +
        ns.nFormat(citypopu, "0.0a") +
        " 💏" +
        citycomm,
      null,
      ns
    ); // OLD Status Line

    // Success chance %% set, b: Blk Ops, o: Ops, c: Contracts, counts for c & o
    //await middText("%%:"+minsuccess+" %b:"+minsucblac+" #c:"+concount+" #o:"+opcount,null,ns); //OLD Status Line
    len =
      2 +
      minsuccess.toString().length +
      4 +
      minsucblac.toString().length +
      4 +
      concount.toString().length +
      4 +
      opcount.toString().length;
    //ns.print("Len: ", len); // DEBUG
    await middText(suctext, len, ns);

    // ##Show %🔮 success spre@d chance ranges for c=Contracts, o=Ops, b=Black Ops
    //await middText("c" + ns.nFormat(conper0, "0.0") + "-" + ns.nFormat(conper1, "0.0") + " o" + ns.nFormat(opper0, "0.0") + "-" + ns.nFormat(opper1, "0.0") + " b" + ns.nFormat(blacper0, "0.0"), "",ns); // OLD Status Line
    len =
      1 +
      Math.ceil(Math.log10(parseFloat(ns.formatNumber(conper0) + 1))) +
      2 +
      1 +
      Math.ceil(Math.log10(parseFloat(ns.formatNumber(conper1) + 1))) +
      2 +
      1 +
      1 +
      Math.ceil(Math.log10(parseFloat(ns.formatNumber(opper0) + 1))) +
      2 +
      1 +
      Math.ceil(Math.log10(parseFloat(ns.formatNumber(opper1) + 1))) +
      2 +
      1 +
      1 +
      Math.ceil(Math.log10(parseFloat(ns.formatNumber(blacper0) + 1))) +
      2;
    suctext =
      TxtTr.apply("c", [TxtTr.Col.White, TxtTr.Tran.Bold]) +
      TxtTr.apply(ns.nFormat(conper0, "0.0"), [TxtTr.Col.Yellow]) +
      "-" +
      TxtTr.apply(ns.nFormat(conper1, "0.0"), [TxtTr.Col.Yellow]) +
      " " +
      TxtTr.apply("o", [TxtTr.Col.White, TxtTr.Tran.Bold]) +
      TxtTr.apply(ns.nFormat(opper0, "0.0"), [TxtTr.Col.Blue]) +
      "-" +
      TxtTr.apply(ns.nFormat(opper1, "0.0"), [TxtTr.Col.Blue]) +
      " " +
      TxtTr.apply("b", [TxtTr.Col.White, TxtTr.Tran.Bold]) +
      TxtTr.apply(ns.nFormat(blacper0, "0.0"), [TxtTr.Col.Purple]);
    await middText(suctext, len, ns);

    // ##Show SPREADS ⛗⛗:Set spre@d & spre@ds for c,o,b (for field analysis)
    //await middText("⛗⛗"+ minspread + " c" + ns.nFormat(conspread*100, "0.0") + "% o" + ns.nFormat(opspread*100, "0.0") + "% b" + ns.nFormat(blspread*100, "0.0") + "%", null,ns); // OLD Status Line
    len =
      2 +
      minspread.toString().length +
      1 +
      1 +
      ns.nFormat(conspread * 100, "0.0").toString().length +
      1 +
      1 +
      1 +
      ns.nFormat(opspread * 100, "0.0").toString().length +
      1 +
      1 +
      1 +
      ns.nFormat(blspread * 100, "0.0").toString().length +
      1;
    suctext =
      TxtTr.apply("⛗⛗", [TxtTr.Col.White, TxtTr.Tran.Bold]) +
      TxtTr.apply(minspread.toString(), [TxtTr.Col.DGreen, TxtTr.Tran.Under]) +
      " " +
      TxtTr.apply("c", [TxtTr.Col.White, TxtTr.Tran.Bold]) +
      TxtTr.apply(ns.formatPercent(conspread), [TxtTr.Col.Yellow]) +
      "% " +
      TxtTr.apply("o", [TxtTr.Col.White, TxtTr.Tran.Bold]) +
      TxtTr.apply(ns.formatNumber(opspread * 100), [TxtTr.Col.Blue]) +
      "% " +
      TxtTr.apply("b", [TxtTr.Col.White, TxtTr.Tran.Bold]) +
      TxtTr.apply(ns.formatNumber(blspread * 100), [TxtTr.Col.Purple]) +
      "% ";
    await middText(suctext, len - 1, ns);

    // ##Inform if we have skipped original city
    let text;
    if (statuscity != "") {
      text = statuscity;
    } else {
      text = "[no extra info]";
    }
    len = 1 + text.toString().length;
    suctext = TxtTr.apply(text, [TxtTr.Col.White]);
    //await middText(text, null,ns); // OLD Status Line
    await middText(suctext, len, ns);

    // Wait for assigned task or action to stop
    //await ns.asleep(snoozeTime); // sl33p doesn't work! Use asl33p
    await sleep(Number(snoozeTime)); // asl33p & sl33p doesn't work!

    // Stop Blade Actions (in case we go on to other non-Blade actions)
    //ns.print("Stopping blade action");  // DEBUG
    await runCom1(ns, "ns.bladeburner.stopBladeburnerAction()", "stopBBAct");

    // If we using Singularities, stop study, work, program, crime actions
    if (singularflag == true) {
      await runCom1(ns, "ns.singularity.stopAction()", "stopAct");
    }

    // Check if can upgrade skills
    //ns.print("Checking skills");  // DEBUG
    await checkSkills(ns);
  }
  // ######### END MAIN LOOP ########
}
//END MAIN ASYNC FUNCTION
//===============================================================================

//@@@@@@@@@@@ MISC FUNCTIONS START @@@@@@@@@@@@@

// Function: Sl33p (seems superior than sl33p or asl33p)
export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// FUNCTION: Get Mission chance (returns array)
export async function getChance(type: string, name: string, ns: NS) {
  return await runCom1(
    ns,
    "ns.bladeburner.getActionEstimatedSuccessChance(ns.args[0], ns.args[1])",
    "getChance",
    [type, name]
  );
}

// FUNCTION: Get number of mission contracts remaining
export async function getCounts(type: string, name: string, ns: NS) {
  return await runCom1(
    ns,
    "ns.bladeburner.getActionCountRemaining(ns.args[0], ns.args[1])",
    "getCounts",
    [type, name]
  );
}

// FUNCTION: Get skill level of skill learned
export async function getSkillLearn(name: string, ns: NS) {
  return await runCom1(
    ns,
    "ns.bladeburner.getSkillLevel(ns.args[0])",
    "getSkLearn",
    [name]
  );
}

// FUNCTION: Display text centered in HUD display
export async function middText(
  text: string,
  lengthtext: number | null,
  ns: NS
) {
  const w = 35; // width of window to center text in
  let l = 0; // length of text to center
  if (lengthtext != null) {
    l = lengthtext;
  } else {
    l = text.length;
  }
  const w2 = Math.abs(Math.floor((w - l) / 2));
  //await ns.print("Text length = ", text.length); // DEBUG
  const s = new Array(w2 + 1).join(" ");
  if (l <= w) {
    const text2 = s + text;
    ns.print(text2);
  } // use w-1 to fine-tune odd widths
}

// FUNCTION: Execute action and return time needed with c0mment
//If field "levopt" is NOT empty (e.g. "y"), means we want to show level info
//Eg. return await d0Act(ns,"operation","Sting Operation","STING(xtra)","y");
export async function doAct(
  ns: NS,
  type: string,
  mission: string,
  comment: string,
  levopt?: string
) {
  // Get time for action
  const actime = await runCom1(
    ns,
    "ns.bladeburner.getActionTime(ns.args[0],ns.args[1])",
    "getActTime",
    [type, mission]
  );

  // Initialise variables
  let levelact = "";
  let leveltext = "";

  // If level option is set, add mission/action level to c0mment
  if (levopt != undefined) {
    // Get level of mission or action
    levelact = await runCom1(
      ns,
      "ns.bladeburner.getActionCurrentLevel(ns.args[0],ns.args[1])",
      "getActLevel",
      [type, mission]
    );
    //await ns.print("WARN Level of action: " +levelact );  // DEBUG
    leveltext = "-Lv" + levelact;
  }

  //C0mment status to log, and return the time required for action
  statusline =
    "🚶: " + comment + leveltext + " >" + parseFloat(actime) / 1000 + "s";
  await runCom1(
    ns,
    "ns.bladeburner.startAction(ns.args[0],ns.args[1])",
    "startAct",
    [type, mission]
  );

  return actime;
}

//==============================================================================
// External SCRIPT RUNNER START (adapted/shortened from ALAIN BRYDEN)
// Use:let members = await runCom1(ns, 'ns.gang.getMemberNames()','getMemNam');
// let curCash = await runCom1(ns, 'ns.getServerMoneyAvailable(ns.args[0])', 'getSerMon', ["home"]);
// var gangbuy = await runCom1(ns, 'ns.gang.purchaseEquipment(ns.args[0], ns.args[1])','getEqCost', [member, equipment]);

export async function runCom1(
  ns: NS,
  command: string,
  fileName: string,
  args: Array<string | boolean> = []
) {
  const precursor = "blade7-"; //Front filename part of temp script (e.g. gang-)
  fileName = "/Temp/" + precursor + fileName + ".txt";
  const fileName2 = fileName + ".js";
  //ns.print ("fileName: ", fileName, "| fileName2: ", fileName2) //DEBUG

  // Create SCRIPT to be written to external file
  const script =
    `export async function main(ns) {` +
    `let r;try{r=JSON.stringify(\n` +
    `    ${command}\n` +
    `);}catch(e){r="ERROR: "+(typeof e=='string'?e:e.message||JSON.stringify(e));}\n` +
    `const f="${fileName}"; if(ns.read(f)!==r) await ns.write(f,r,'w') } `;

  // If file already exists don't write it again (speeds program up)
  let oldContents = ns.read(fileName2);
  while (oldContents != script) {
    ns.write(fileName2, script, "w"); //Wait for it to be readable
    oldContents = ns.read(fileName2);
  }

  // Fill in arguments with "0" if not specified
  for (let ij = 0; ij < 5; ij++) {
    if (args[ij] == null) args[ij] = "0";
    //ns.print ("args[",ij,"] = ", args[ij]) // DEBUG
  }

  //Run the script! And convert output to related format
  ns.exec(fileName2, "home", 1, args[0], args[1], args[2], args[3]);
  await sleep(1); // superior to sl33p and asl33p

  // We 'try' to catch JSON errors (they vanish after 1-2 loops)
  const fileData = ns.read(fileName);
  let fileData2 = "ERROR: JSON error";
  try {
    fileData2 = JSON.parse(fileData);
  } catch (e) {
    //await ns.print("ERROR STOPPED: "+command +" "+args[0]); //DEBUG
    console.log("Unable to parse the string.");
  }

  return fileData2; // Return the data
}
// External SCRIPT RUNNER END===================================================

//==============================================================================
// Transform Text START (adapted/shortened from reddit/u/GeneralZero)
// Usage: ns.print(TextTransforms.apply('Hello World',[TextTransforms.Highlight.Red,TextTransforms.Color.White,TextTransforms.Transform.Underline]));
export class TxtTr {
  static #escapeCode = "\x1b[";
  static #foreground = "38;5;";
  static #background = "48;5;";
  static #endCode = "m";
  static #reset = `${this.#escapeCode}0${this.#endCode}`;
  // For more colors, see full color chart at:
  // https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
  static Col = {
    Test: { Type: "Color", Value: 46 }, // Use this to find/test new colors
    Black: { Type: "Color", Value: 16 },
    LBrown: { Type: "Color", Value: 130 },
    DRed: { Type: "Color", Value: 52 },
    Red: { Type: "Color", Value: 124 },
    LRed: { Type: "Color", Value: 196 },
    Orange: { Type: "Color", Value: 202 },
    Yellow: { Type: "Color", Value: 226 },
    LYellow: { Type: "Color", Value: 229 },
    DGreen: { Type: "Color", Value: 34 },
    Green: { Type: "Color", Value: 46 },
    LGreen: { Type: "Color", Value: 155 },
    DBlue: { Type: "Color", Value: 21 },
    Blue: { Type: "Color", Value: 33 },
    LBlue: { Type: "Color", Value: 111 },
    Cyan: { Type: "Color", Value: 30 },
    LCyan: { Type: "Color", Value: 122 },
    Magenta: { Type: "Color", Value: 53 },
    DPurple: { Type: "Color", Value: 55 },
    Purple: { Type: "Color", Value: 201 },
    LPurple: { Type: "Color", Value: 206 },
    White: { Type: "Color", Value: 188 },
    LWhite: { Type: "Color", Value: 231 },
  };
  static High = {
    Black: { Type: "Highlight", Value: 16 },
    Red: { Type: "Highlight", Value: 52 },
    Green: { Type: "Highlight", Value: 22 },
    Yellow: { Type: "Highlight", Value: 58 },
    Blue: { Type: "Highlight", Value: 17 },
    Magenta: { Type: "Highlight", Value: 53 },
    Cyan: { Type: "Highlight", Value: 30 },
    White: { Type: "Highlight", Value: 231 },
  };
  static Tran = {
    Bold: { Type: "Transform", Value: 1 },
    Under: { Type: "Transform", Value: 4 },
  };

  //Apply xTerm Text Modifications
  static apply(text: string, transforms: any[]) {
    const prefix = [];
    const code = [];
    let apply = "";

    for (const transform of transforms) {
      if (transform.Type != undefined && Number.isFinite(transform.Value)) {
        if (transform.Type === "Highlight") {
          code.push(`${this.#background}${transform.Value};`);
        } else if (transform.Type === "Transform") {
          prefix.push(`${transform.Value};`);
        } else if (transform.Type === "Color") {
          code.push(`${this.#foreground}${transform.Value};`);
        }
      }
    }
    if (prefix.length > 0) {
      apply += prefix.join("");
    }
    if (code.length > 0) {
      apply += code.join("");
    }
    if (apply.length > 0) {
      apply = `${this.#escapeCode}${apply}${this.#endCode}`;
    }
    apply += `${text}${this.#reset}`;

    return `${apply}`;
  }
}
// Transform Text END===========================================================

//End Of Line
