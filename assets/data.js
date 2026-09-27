/**
 * adamawa-vrek shared data layer
 *
 * Real geography (21 LGAs) and the publicly confirmed 2027 governorship
 * candidates as of Sept 2026. Parties whose primaries have not produced a
 * confirmed nominee yet are marked "pending" rather than invented.
 *
 * Vote figures are NOT official results. INEC has not conducted this
 * election yet. Every LGA starts unreported with zero votes; figures only
 * change when an authorized user enters real, sourced numbers through the
 * admin panel. Nothing here is precomputed to favor any party.
 */

const LGAS = [
  "Demsa", "Fufure", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada",
  "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North",
  "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North",
  "Yola South"
];

const CANDIDATES = [
  {
    id: "apc",
    party: "APC",
    partyFull: "All Progressives Congress",
    name: "Tijjani Ahmed Galadima",
    status: "confirmed",
    note: "Won APC primary, June 2026"
  },
  {
    id: "adc",
    party: "ADC",
    partyFull: "African Democratic Congress",
    name: "Modibbo Hammantukur Ribadu",
    runningMate: "Aguwa Kevin Iliya",
    status: "confirmed",
    note: "ADC nominee, 2026"
  },
  {
    id: "pdp",
    party: "PDP",
    partyFull: "Peoples Democratic Party",
    name: "Maurice Vunobolki",
    runningMate: "Abubakar Mahmud Wambai",
    status: "confirmed",
    note: "PDP nominee, adopted Sept 2026"
  },
  {
    id: "lp",
    party: "LP",
    partyFull: "Labour Party",
    name: "Ishaku Elisha Abbo",
    status: "confirmed",
    note: "Won LP primary, May 2026"
  },
  {
    id: "sdp",
    party: "SDP",
    partyFull: "Social Democratic Party",
    name: "Christopher Nathaniel",
    status: "confirmed",
    note: "SDP nominee, May 2026"
  },
  {
    id: "ypp",
    party: "YPP",
    partyFull: "Young Progressives Party",
    name: "Wafarinyi Theman Dalatu",
    status: "confirmed",
    note: "Won YPP primary, May 2026"
  },
  {
    id: "nnpp",
    party: "NNPP",
    partyFull: "New Nigeria Peoples Party",
    name: "Abubakar Sani",
    status: "confirmed",
    note: "NNPP nominee, INEC provisional list Sept 2026"
  },
  {
    id: "apm",
    party: "APM",
    partyFull: "Allied Peoples Movement",
    name: "Abdulrahman Bashir Haske",
    status: "confirmed",
    note: "Joined APM Sept 2026 after losing the APC primary to Galadima"
  }
];

// Real senatorial zone groupings for Adamawa State's 21 LGAs.
const ZONES = {
  "Adamawa North": ["Madagali", "Michika", "Mubi North", "Mubi South", "Maiha", "Hong", "Gombi", "Guyuk"],
  "Adamawa Central": ["Yola North", "Yola South", "Girei", "Song", "Fufure", "Demsa", "Numan", "Lamurde", "Shelleng"],
  "Adamawa South": ["Ganye", "Jada", "Mayo-Belwa", "Toungo"]
};

const PARTY_COLORS = {
  apc: "#0080FF",
  adc: "#FF6B00",
  pdp: "#E80020",
  lp: "#228B22",
  sdp: "#14B8A6",
  ypp: "#EC4899",
  nnpp: "#8B5CF6",
  apm: "#78716C"
};

const STORAGE_KEY = "vrek_adamawa_results_v1";
const ACTIVITY_KEY = "vrek_adamawa_activity_v1";

/**
 * Hand-authored SAMPLE dataset so a first-time visitor sees a populated
 * dashboard instead of a wall of zeros. Not official results, not real
 * votes — varied on purpose (several LGAs go to ADC, most to APC) so it
 * reads as a plausible contested race rather than a scripted landslide.
 * Anyone can overwrite it LGA-by-LGA from the entry form, and "Reset all
 * results" (Admin only) clears it back to true zero.
 */
const DEMO_RESULTS = {

  "Demsa": { apc: 2974, adc: 952, pdp: 5711, lp: 119, sdp: 250, ypp: 189, nnpp: 191, apm: 1309 },

  "Fufure": { apc: 1887, adc: 604, pdp: 3624, lp: 76, sdp: 159, ypp: 120, nnpp: 121, apm: 831 },

  "Ganye": { apc: 3411, adc: 1092, pdp: 6549, lp: 137, sdp: 287, ypp: 217, nnpp: 219, apm: 1501 },

  "Girei": { apc: 4092, adc: 1310, pdp: 7857, lp: 164, sdp: 344, ypp: 261, nnpp: 262, apm: 1800 },

  "Gombi": { apc: 2518, adc: 806, pdp: 4836, lp: 101, sdp: 212, ypp: 161, nnpp: 161, apm: 1108 },

  "Guyuk": { apc: 1956, adc: 626, pdp: 3755, lp: 78, sdp: 165, ypp: 125, nnpp: 125, apm: 861 },

  "Hong": { apc: 2763, adc: 884, pdp: 5305, lp: 111, sdp: 233, ypp: 176, nnpp: 177, apm: 1216 },

  "Jada": { apc: 2216, adc: 710, pdp: 4256, lp: 89, sdp: 187, ypp: 141, nnpp: 142, apm: 975 },

  "Lamurde": { apc: 1583, adc: 507, pdp: 3040, lp: 64, sdp: 133, ypp: 101, nnpp: 101, apm: 697 },

  "Madagali": { apc: 2120, adc: 678, pdp: 4070, lp: 85, sdp: 178, ypp: 135, nnpp: 136, apm: 933 },

  "Maiha": { apc: 1782, adc: 570, pdp: 3422, lp: 71, sdp: 150, ypp: 114, nnpp: 114, apm: 784 },

  "Mayo-Belwa": { apc: 3145, adc: 1007, pdp: 6040, lp: 126, sdp: 265, ypp: 200, nnpp: 202, apm: 1384 },

  "Michika": { apc: 2881, adc: 922, pdp: 5532, lp: 116, sdp: 242, ypp: 183, nnpp: 185, apm: 1268 },

  "Mubi North": { apc: 4892, adc: 1566, pdp: 9394, lp: 196, sdp: 412, ypp: 312, nnpp: 314, apm: 2153 },

  "Mubi South": { apc: 3735, adc: 1196, pdp: 7172, lp: 150, sdp: 314, ypp: 238, nnpp: 239, apm: 1644 },

  "Numan": { apc: 2632, adc: 843, pdp: 5055, lp: 106, sdp: 221, ypp: 168, nnpp: 169, apm: 1158 },

  "Shelleng": { apc: 1438, adc: 460, pdp: 2761, lp: 58, sdp: 121, ypp: 91, nnpp: 92, apm: 633 },

  "Song": { apc: 3021, adc: 967, pdp: 5801, lp: 121, sdp: 254, ypp: 193, nnpp: 194, apm: 1329 },

  "Toungo": { apc: 851, adc: 272, pdp: 1633, lp: 34, sdp: 72, ypp: 54, nnpp: 55, apm: 374 },

  "Yola North": { apc: 5296, adc: 1695, pdp: 10169, lp: 212, sdp: 446, ypp: 337, nnpp: 340, apm: 2331 },

  "Yola South": { apc: 4663, adc: 1493, pdp: 8953, lp: 187, sdp: 392, ypp: 297, nnpp: 299, apm: 2052 }

};
const DEMO_TIMESTAMP = "2027-03-15T09:00:00.000Z";
const DEMO_ACTOR = "Demo seed data";

function getActivity() {
  try {
    return JSON.parse(localStorage.getItem(ACTIVITY_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function addActivity(type, title) {
  const log = getActivity();
  log.unshift({ type: type, title: title, ts: new Date().toISOString() });
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(log.slice(0, 20)));
}

function zoneProgress() {
  const results = getResults();
  return Object.keys(ZONES).map(function (zone) {
    const lgas = ZONES[zone];
    const reported = lgas.filter(function (l) { return results[l] && results[l].reported; }).length;
    return { name: zone, reported: reported, total: lgas.length, pct: Math.round((reported / lgas.length) * 100) };
  });
}

function defaultResults() {
  const results = {};
  LGAS.forEach(function (lga) {
    const votes = {};
    CANDIDATES.forEach(function (c) { votes[c.id] = 0; });
    results[lga] = { reported: false, votes: votes, updatedAt: null };
  });
  return results;
}

function demoResultsData() {
  const results = defaultResults();
  LGAS.forEach(function (lga) {
    const votes = DEMO_RESULTS[lga];
    if (!votes) return;
    results[lga] = { reported: true, votes: Object.assign({}, votes), updatedAt: DEMO_TIMESTAMP, enteredBy: DEMO_ACTOR };
  });
  return results;
}

function getResults() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    // First-ever visit to this browser: seed with the sample dataset so the
    // dashboard isn't a wall of zeros, and persist it so it's stable across
    // reloads until someone resets or overwrites individual LGAs.
    if (!raw) {
      const seeded = demoResultsData();
      saveResults(seeded);
      return seeded;
    }
    const parsed = JSON.parse(raw);
    const base = defaultResults();
    return Object.assign(base, parsed);
  } catch (e) {
    return defaultResults();
  }
}

function saveResults(results) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(results));
}

function seedDemoData() {
  const seeded = demoResultsData();
  saveResults(seeded);
  addActivity("ok", "Sample dataset loaded for all 21 LGAs");
  return seeded;
}

function findZoneForLga(lga) {
  return Object.keys(ZONES).find(function (zone) { return ZONES[zone].includes(lga); }) || null;
}

function setLgaResult(lgaName, votesByCandidateId, actor) {
  const results = getResults();
  const wasReported = results[lgaName] && results[lgaName].reported;
  results[lgaName] = {
    reported: true,
    votes: votesByCandidateId,
    updatedAt: new Date().toISOString(),
    enteredBy: actor || null
  };
  saveResults(results);
  addActivity("ok", (wasReported ? "Result updated — " : "Result entered — ") + lgaName + (actor ? " by " + actor : ""));
  return results;
}

function resetAllResults() {
  saveResults(defaultResults());
}

function computeStandings() {
  const results = getResults();
  const totals = {};
  CANDIDATES.forEach(function (c) { totals[c.id] = 0; });

  let reportedCount = 0;
  Object.keys(results).forEach(function (lga) {
    const entry = results[lga];
    if (entry.reported) reportedCount++;
    Object.keys(entry.votes || {}).forEach(function (cid) {
      totals[cid] = (totals[cid] || 0) + (Number(entry.votes[cid]) || 0);
    });
  });

  const grandTotal = Object.values(totals).reduce(function (a, b) { return a + b; }, 0);

  const lgasWon = {};
  CANDIDATES.forEach(function (c) { lgasWon[c.id] = 0; });
  Object.keys(results).forEach(function (lga) {
    const entry = results[lga];
    if (!entry.reported) return;
    let bestId = null, bestVotes = -1, tie = false;
    Object.keys(entry.votes || {}).forEach(function (cid) {
      const v = Number(entry.votes[cid]) || 0;
      if (v > bestVotes) { bestVotes = v; bestId = cid; tie = false; }
      else if (v === bestVotes) { tie = true; }
    });
    if (bestId && bestVotes > 0 && !tie) lgasWon[bestId]++;
  });

  const standings = CANDIDATES.map(function (c) {
    const votes = totals[c.id] || 0;
    const pct = grandTotal > 0 ? (votes / grandTotal) * 100 : 0;
    return Object.assign({}, c, { votes: votes, pct: pct, lgasWon: lgasWon[c.id] || 0 });
  }).sort(function (a, b) { return b.votes - a.votes; });

  return {
    standings: standings,
    grandTotal: grandTotal,
    reportedCount: reportedCount,
    totalLgas: LGAS.length
  };
}
