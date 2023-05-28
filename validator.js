const fs = require("fs");

// Usage example
const outputFilePath = "./X222-COB-claim-from-billing-provider-to-payer-a.edi";
let ediJSON = fs.readFileSync(outputFilePath, "utf8");

const validateEDI = (ediJSON) => {
  // Logic to find correct edit config for ediJSON
  // Read in edit config
  // run edits against ediJSON
  // Return array of errors or an accepted response
};
const output = validateEDI(ediData);
console.log(JSON.stringify(output, null, 2));
