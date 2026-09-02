const jsforce = require("jsforce");
require("dotenv").config();

const conn = new jsforce.Connection({
  loginUrl: "https://test.salesforce.com"
});

(async () => {
  try {

    await conn.login(
      process.env.SF_USERNAME,
      process.env.SF_PASSWORD
    );

    console.log("✅ Logged in");

    const result = await conn.query(`
      SELECT Id,
             Name,
             DeveloperName,
             SobjectType,
             IsActive
      FROM RecordType
      WHERE SobjectType = 'Case'
      ORDER BY DeveloperName
    `);

    console.log("\n===== CASE RECORD TYPES =====\n");

    result.records.forEach(rt => {
      console.log(
        `Id: ${rt.Id}
Name: ${rt.Name}
DeveloperName(API): ${rt.DeveloperName}
Active: ${rt.IsActive}
----------------------------------`
      );
    });

  } catch (err) {
    console.error("❌ Error:", err.message);
  }
})();
``