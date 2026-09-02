const jsforce = require("jsforce");
const XLSX = require("xlsx");
require("dotenv").config();

const conn = new jsforce.Connection({
  loginUrl: "https://test.salesforce.com"
});

(async () => {
  try {

    console.log("Username:", process.env.SF_USERNAME);

    // LOGIN
    await conn.login(
      process.env.SF_USERNAME,
      process.env.SF_PASSWORD
    );

    console.log("Logged in successfully");

    // GET RECORD TYPE
    const describe = await conn.sobject("Case").describe();

    const recordType = describe.recordTypeInfos.find(
      rt => rt.name === "CSC Case"
    );

    if (!recordType) {
      throw new Error("Record Type not found");
    }

    console.log("RecordTypeId:", recordType.recordTypeId);

    // UI API CALL
    const res = await conn.request(
      `/services/data/v59.0/ui-api/object-info/Case/picklist-values/${recordType.recordTypeId}`
    );

    const picklists = res.picklistFieldValues;

    // PICKLIST FIELDS
    const caseReasonField = picklists["Reason"];
    const catL3Field = picklists["Category_Level3__c"];
    const catL4Field = picklists["Category_Level4__c"];
    const catL1Field = picklists["Category_Level_1__c"]; // may or may not exist

    // VALUES
    const caseReason = caseReasonField?.values || [];
    const catL3 = catL3Field?.values || [];
    const catL4 = catL4Field?.values || [];
    const catL1 = catL1Field?.values || [];

    // CONTROLLERS
    const l3Controller = catL3Field?.controllerValues || {};
    const l4Controller = catL4Field?.controllerValues || {};
    const l1Controller = catL1Field?.controllerValues || {};

    // CHECK IF L1 EXISTS FOR THIS RECORD TYPE
    const hasL1 = catL1.length > 0;

    let results = [];

    // MAIN LOOP
    caseReason.forEach((reason) => {

      if (!reason.value) return;

      const reasonIndex = l3Controller[reason.value];
      let hasValidL3 = false;

      // -------- L3 LOOP --------
      catL3.forEach((l3) => {

        if (!l3.value) return;

        // Reason → L3 dependency
        if (
          reasonIndex !== undefined &&
          l3.validFor &&
          !l3.validFor.includes(reasonIndex)
        ) {
          return;
        }

        hasValidL3 = true;

        const l3Index = l4Controller[l3.value];
        let hasValidL4 = false;

        // -------- L4 LOOP --------
        catL4.forEach((l4) => {

          if (!l4.value) return;

          // L3 → L4 dependency
          if (
            l3Index !== undefined &&
            l4.validFor &&
            !l4.validFor.includes(l3Index)
          ) {
            return;
          }

          hasValidL4 = true;

          //  IF L1 EXISTS → PROCESS IT
          if (hasL1) {

            const l4Index = l1Controller[l4.value];
            let hasValidL1 = false;

            // -------- L1 LOOP --------
            catL1.forEach((l1) => {

              if (!l1.value) return;

              // L4 → L1 dependency
              if (
                l4Index !== undefined &&
                l1.validFor &&
                !l1.validFor.includes(l4Index)
              ) {
                return;
              }

              hasValidL1 = true;

              results.push({
                RecordType: recordType.name,
                CaseReason: reason.label,
                CategoryLevel3: l3.label,
                CategoryLevel4: l4.label,
                CategoryLevel1: l1.label
              });

            });

            //  L4 exists but no L1
            if (!hasValidL1) {
              results.push({
                RecordType: recordType.name,
                CaseReason: reason.label,
                CategoryLevel3: l3.label,
                CategoryLevel4: l4.label,
                CategoryLevel1: ""
              });
            }

          } else {
            // NO L1 → directly push
            results.push({
              RecordType: recordType.name,
              CaseReason: reason.label,
              CategoryLevel3: l3.label,
              CategoryLevel4: l4.label,
              CategoryLevel1: "" // empty
            });
          }

        });

        //  L3 exists but no L4
        if (!hasValidL4) {
          results.push({
            RecordType: recordType.name,
            CaseReason: reason.label,
            CategoryLevel3: l3.label,
            CategoryLevel4: "",
            CategoryLevel1: ""
          });
        }

      });

      //  No L3 exists
      if (!hasValidL3) {
        results.push({
          RecordType: recordType.name,
          CaseReason: reason.label,
          CategoryLevel3: "",
          CategoryLevel4: "",
          CategoryLevel1: ""
        });
      }

    });

    console.log("Total combinations:", results.length);

    // CREATE EXCEL
    const sheet = XLSX.utils.json_to_sheet(results);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, sheet, "Quality Data");

    XLSX.writeFile(wb, "CSC.xlsx");

    console.log("Excel generated successfully!");

  } catch (error) {
    console.error("Error:", error.message);
  }
})();