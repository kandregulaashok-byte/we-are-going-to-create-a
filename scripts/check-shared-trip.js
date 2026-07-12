const fs = require("fs");
const vm = require("vm");

const context = { console, Date };
vm.createContext(context);
vm.runInContext(fs.readFileSync("shared.js", "utf8"), context);

console.assert(context.validateTripValues({ from: "2026-07-12", to: "2026-07-13", adults: 2, children: 0 }) === "", "valid trip should pass");
console.assert(/Check-out/.test(context.validateTripValues({ from: "2026-07-13", to: "2026-07-12", adults: 2, children: 0 })), "bad dates should fail");
console.assert(/Adults/.test(context.validateTripValues({ from: "2026-07-12", to: "2026-07-13", adults: "1.5", children: 0 })), "adults must be whole");
console.assert(context.minRoomsForAdults(3, 8) === 3, "8 adults at max 3 per room should need 3 rooms");
console.assert(context.normalizeTripDetails({ adults: 8, rooms: 1 }, 3).rooms === 3, "trip details should auto-fit rooms");
console.log("shared trip check passed");
