const fs = require("fs");
const vm = require("vm");

const context = { console, Date };
vm.createContext(context);
vm.runInContext(fs.readFileSync("shared.js", "utf8"), context);

console.assert(context.validateTripValues({ from: "2026-07-12", to: "2026-07-13", adults: 2, children: 0 }) === "", "valid trip should pass");
console.assert(/Check-out/.test(context.validateTripValues({ from: "2026-07-13", to: "2026-07-12", adults: 2, children: 0 })), "bad dates should fail");
console.assert(/Adults/.test(context.validateTripValues({ from: "2026-07-12", to: "2026-07-13", adults: "1.5", children: 0 })), "adults must be whole");
console.log("shared trip check passed");
