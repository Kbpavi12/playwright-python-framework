const jsforce = require("jsforce");
const XLSX = require("xlsx");
require("dotenv").config();

// ✅ CONNECTION
const conn = new jsforce.Connection({
  loginUrl: "https://test.salesforce.com"
});

(async () => {
  try {

    // ✅ LOGIN
    await conn.login(
      process.env.SF_USERNAME,
      process.env.SF_PASSWORD
    );

    console.log("✅ Logged in to Salesforce");

    // ✅ GET RECORD TYPE
    const describe = await conn.sobject("Case").describe();

    const recordType = describe.recordTypeInfos.find(
      rt => rt.name === "Latam Quality"
    );

    if (!recordType) throw new Error("Record Type not found");

    const recordTypeId = recordType.recordTypeId;

    // ✅ FETCH PICKLIST METADATA
    const res = await conn.request(
      `/services/data/v59.0/ui-api/object-info/Case/picklist-values/${recordTypeId}`
    );

    const picklists = res.picklistFieldValues;

    // ✅ FIELD API NAMES
    const caseReasonField = picklists["Reason"];
    const catL3Field = picklists["Category_Level3__c"];
    const catL4Field = picklists["Category_Level4__c"];
    const channelField = picklists["Origin"];
    const subChannelField = picklists["Sub_Channel__c"];

    // ✅ VALUES
    const caseReasons = caseReasonField.values || [];
    const catL3 = catL3Field.values || [];
    const catL4 = catL4Field.values || [];
    const channels = channelField.values || [];
    const subChannels = subChannelField.values || [];

    // ✅ CONTROLLER MAPS
    const l3Controller = catL3Field.controllerValues;
    const l4Controller = catL4Field.controllerValues;
    const subChannelController = subChannelField.controllerValues;

    // ✅ STATIC VALUES
    const plant = "SUBHAN SAFAT";
    const status = "Closed";

    const priorities = ["Low", "Medium", "High", "Very High"];
    const risks = ["High Risk", "Low Risk", "Medium Risk", "No Risk"];
    const countries = ["PS", "KW"];
    const products = ["CAPPY Cherry", "CAPPY VİŞNELİM", "Coca-Cola Coca-Cola", "Gemini", "Sprite"];
    const channelOfAnswer = ["Phone", "Web", "Email", "Social Media", "Chat", "Corporate Channels", "Bottler Channels"];

    const randomItem = arr => arr[Math.floor(Math.random() * arr.length)];

    function randomString(len) {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      return [...Array(len)]
        .map(() => chars[Math.floor(Math.random() * chars.length)])
        .join("");
    }

    // ✅ GLOBAL UNIQUE ID (ACROSS RUNS)
    let counter = 0;

    function getUniqueId() {
      const timePart = Date.now().toString().slice(-5);
      const counterPart = (counter++ % 1000).toString().padStart(3, "0");
      return parseInt(timePart + counterPart);
    }

    let allValidCombinations = [];

    // ✅ BUILD VALID COMBINATIONS (DEPENDENCY SAFE)
    caseReasons.forEach(reason => {

      if (!reason.value) return;

      const reasonIndex = l3Controller[reason.value];

      catL3.forEach(l3 => {

        if (!l3.value) return;

        if (
          reasonIndex !== undefined &&
          l3.validFor &&
          !l3.validFor.includes(reasonIndex)
        ) return;

        const l3Index = l4Controller[l3.value];

        catL4.forEach(l4 => {

          if (!l4.value) return;

          if (
            l3Index !== undefined &&
            l4.validFor &&
            !l4.validFor.includes(l3Index)
          ) return;

          channels.forEach(channel => {

            if (!channel.value) return;

            const chIndex = subChannelController[channel.value];

            subChannels.forEach(sub => {

              if (!sub.value) return;

              if (
                chIndex !== undefined &&
                sub.validFor &&
                !sub.validFor.includes(chIndex)
              ) return;

              // ✅ STORE VALID COMBINATION ONLY
              allValidCombinations.push({
                reason: reason.label,
                l3: l3.label,
                l4: l4.label,
                channel: channel.label,
                subChannel: sub.label
              });

            });

          });

        });

      });

    });

    console.log(`✅ Total valid combinations: ${allValidCombinations.length}`);

    // ✅ SHUFFLE DATA
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    shuffleArray(allValidCombinations);

    // ✅ GET INPUT COUNT
    const requestedCount = process.argv[2] ? parseInt(process.argv[2]) : 100;

    if (requestedCount > allValidCombinations.length) {
      console.warn("⚠️ Requested > available combinations, limiting output");
    }

    const selected = allValidCombinations.slice(0, requestedCount);

    // ✅ BUILD FINAL RECORDS
    const finalRecords = selected.map(rec => ({
      "Case External ID": getUniqueId(),
      "Case Reason": rec.reason,
      "Category Level-3": rec.l3,
      "Category Level-4": rec.l4,
      "Plant": plant,
      "Product": randomItem(products),
      "Status": status,
      "High Potential Risk": randomItem(risks),
      "Priority": randomItem(priorities),
      "Channel": rec.channel,
      "Sub-Channel": rec.subChannel,
      "Channel of Answer": randomItem(channelOfAnswer),
      "Country Code": randomItem(countries),
      "Subject": randomString(20),
      "Description": randomString(50)
    }));

    console.log(`✅ Generated ${finalRecords.length} records`);

    // ✅ EXPORT TO EXCEL
    const sheet = XLSX.utils.json_to_sheet(finalRecords);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, sheet, "Test Data");

    XLSX.writeFile(wb, "Salesforce_Test_Data.xlsx");

    console.log("✅ Excel generated successfully!");

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
})();