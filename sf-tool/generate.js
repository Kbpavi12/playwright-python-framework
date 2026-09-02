const jsforce = require("jsforce");
const XLSX = require("xlsx");
require("dotenv").config();

const conn = new jsforce.Connection({
  loginUrl: "https://test.salesforce.com"
});

(async () => {
  try {

    console.log("Username:", process.env.SF_USERNAME);

    //  LOGIN
    await conn.login(
      process.env.SF_USERNAME,
      process.env.SF_PASSWORD
    );

    console.log(" Logged in successfully");

    //  GET RECORD TYPE
    const describe = await conn.sobject("Case").describe();

    const recordType = describe.recordTypeInfos.find(
      rt => rt.name === "Quality"
    );

    if (!recordType) {
      throw new Error("Useless Record Type not found");
    }

    console.log(" RecordTypeId:", recordType.recordTypeId);

    //  UI API CALL
    const res = await conn.request(
      `/services/data/v59.0/ui-api/object-info/Case/picklist-values/${recordType.recordTypeId}`
    );

    const picklists = res.picklistFieldValues;

    //  FIELD API NAMES
    const caseReasonField = picklists["Reason"];
    const catL3Field = picklists["NA1_Category_Level_3__c"];
    const catL4Field = picklists["NA1_Category_Level_4_Quality__c"];

    const caseReason = caseReasonField?.values || [];
    const catL3 = catL3Field?.values || [];
    const catL4 = catL4Field?.values || [];

    const l3Controller = catL3Field.controllerValues || {};
    const l4Controller = catL4Field.controllerValues || {};

    let results = [];

    //  MAIN LOGIC
    caseReason.forEach((reason) => {

      if (!reason.value) return;

      const reasonIndex = l3Controller[reason.value];
      let hasValidL3 = false;

      catL3.forEach((l3) => {

        if (!l3.value) return;

        //  Reason → L3 dependency
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

        catL4.forEach((l4) => {

          if (!l4.value) return;

          //  L3 → L4 dependency
          if (
            l3Index !== undefined &&
            l4.validFor &&
            !l4.validFor.includes(l3Index)
          ) {
            return;
          }

          hasValidL4 = true;

          results.push({
            RecordType: recordType.name,

            //  LABELS (FIXED)
            CaseReason: reason.label,
            CategoryLevel3: l3.label,
            CategoryLevel4: l4.label
          });

        });

        //  L3 exists but no L4
        if (!hasValidL4) {
          results.push({
            RecordType: recordType.name,
            CaseReason: reason.label,
            CategoryLevel3: l3.label,
            CategoryLevel4: ""
          });
        }

      });

      //  No L3 exists
      if (!hasValidL3) {
        results.push({
          RecordType: recordType.name,
          CaseReason: reason.label,
          CategoryLevel3: "",
          CategoryLevel4: ""
        });
      }

    });

    console.log(" Total combinations:", results.length);

    //  CREATE EXCEL
    const sheet = XLSX.utils.json_to_sheet(results);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, sheet, "Quality Data");

    XLSX.writeFile(wb, "Quality_Combinations.xlsx");

    console.log(" Excel generated successfully!");

  } catch (error) {
    console.error(" Error:", error.message);
  }
})();