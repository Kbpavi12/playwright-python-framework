const jsforce = require("jsforce");
const XLSX = require("xlsx");
require("dotenv").config();

const conn = new jsforce.Connection({
    loginUrl: "https://test.salesforce.com"
});

const RECORD_TYPES = [
    {
        recordTypeId: "0125A000001Am93QAC", // COC Case
        recordTypeName: "COC Case",
        sheetName: "COC",
        fields: {
            content2: "Reason",
            content3: "Category_Level3__c",
            content4: "Category_Level4__c",
            content1: "Category_Level_1__c"
        }
    },
    {
        recordTypeId: "0125A0000013PxfQAE", // CPC Case
        recordTypeName: "CPC Case",
        sheetName: "CPC",
        fields: {
            content2: "Reason",
            content3: "Category_Level3__c",
            content4: "Category_Level_4_CPC__c",
            content1: "Category_Level_1_CPC__c"
        }
    },
    {
        recordTypeId: "0125A000001AlslQAC", // CSC Case
        recordTypeName: "CSC Case",
        sheetName: "CSC",
        fields: {
            content2: "Reason",
            content3: "Category_Level3__c",
            content4: "Category_Level4__c",
            content1: "Category_Level_1__c"
        }
    }
];

async function getPicklists(recordTypeId, language) {
    return await conn.request({
        method: "GET",
        url: `/services/data/v59.0/ui-api/object-info/Case/picklist-values/${recordTypeId}`,
        headers: {
            "Accept-Language": language
        }
    });
}

(async () => {

    try {

        await conn.login(
            process.env.SF_USERNAME,
            process.env.SF_PASSWORD
        );

        console.log("✅ Logged in");

        const workbook = XLSX.utils.book_new();

        for (const cfg of RECORD_TYPES) {

            console.log(`\n==============================`);
            console.log(`Processing ${cfg.recordTypeName}`);
            console.log(`==============================`);

            const jpRes = await getPicklists(
                cfg.recordTypeId,
                "ja"
            );

            const enRes = await getPicklists(
                cfg.recordTypeId,
                "en-US"
            );

            const jpPicklists =
                jpRes.picklistFieldValues;

            const enPicklists =
                enRes.picklistFieldValues;

            const jpContent2Field =
                jpPicklists[cfg.fields.content2];

            const jpContent3Field =
                jpPicklists[cfg.fields.content3];

            const jpContent4Field =
                jpPicklists[cfg.fields.content4];

            const jpContent1Field =
                jpPicklists[cfg.fields.content1];

            const enContent2Field =
                enPicklists[cfg.fields.content2];

            const enContent3Field =
                enPicklists[cfg.fields.content3];

            const enContent4Field =
                enPicklists[cfg.fields.content4];

            const enContent1Field =
                enPicklists[cfg.fields.content1];

            console.log("Field Validation");

            console.log(
                cfg.fields.content2,
                !!jpContent2Field
            );

            console.log(
                cfg.fields.content3,
                !!jpContent3Field
            );

            console.log(
                cfg.fields.content4,
                !!jpContent4Field
            );

            console.log(
                cfg.fields.content1,
                !!jpContent1Field
            );

            if (
                !jpContent2Field ||
                !jpContent3Field ||
                !jpContent4Field
            ) {
                console.log(
                    `⚠️ Skipping ${cfg.sheetName} because one or more fields do not exist`
                );

                continue;
            }

            const content2JP =
                jpContent2Field.values || [];

            const content3JP =
                jpContent3Field.values || [];

            const content4JP =
                jpContent4Field.values || [];

            const content1JP =
                jpContent1Field?.values || [];

            const content2ENMap = {};
            const content3ENMap = {};
            const content4ENMap = {};
            const content1ENMap = {};

            (enContent2Field?.values || []).forEach(v => {
                content2ENMap[v.value] = v.label;
            });

            (enContent3Field?.values || []).forEach(v => {
                content3ENMap[v.value] = v.label;
            });

            (enContent4Field?.values || []).forEach(v => {
                content4ENMap[v.value] = v.label;
            });

            (enContent1Field?.values || []).forEach(v => {
                content1ENMap[v.value] = v.label;
            });

            const ctrl3 =
                jpContent3Field.controllerValues || {};

            const ctrl4 =
                jpContent4Field.controllerValues || {};

            const ctrl1 =
                jpContent1Field?.controllerValues || {};

            const rows = [];

            content2JP.forEach(c2 => {

                if (!c2.value) return;

                const c2Index =
                    ctrl3[c2.value];

                let hasL3 = false;

                content3JP.forEach(c3 => {

                    if (!c3.value) return;

                    if (
                        c2Index !== undefined &&
                        c3.validFor &&
                        !c3.validFor.includes(c2Index)
                    ) {
                        return;
                    }

                    hasL3 = true;

                    const c3Index =
                        ctrl4[c3.value];

                    let hasL4 = false;

                    content4JP.forEach(c4 => {

                        if (!c4.value) return;

                        if (
                            c3Index !== undefined &&
                            c4.validFor &&
                            !c4.validFor.includes(c3Index)
                        ) {
                            return;
                        }

                        hasL4 = true;

                        const c4Index =
                            ctrl1[c4.value];

                        let hasL1 = false;

                        content1JP.forEach(c1 => {

                            if (!c1.value) return;

                            if (
                                c4Index !== undefined &&
                                c1.validFor &&
                                !c1.validFor.includes(c4Index)
                            ) {
                                return;
                            }

                            hasL1 = true;

                            rows.push({
                                RecordType: cfg.recordTypeName,

                                Content2_EN:
                                    content2ENMap[c2.value] || "",

                                Content2_JP:
                                    c2.label || "",

                                Content3_EN:
                                    content3ENMap[c3.value] || "",

                                Content3_JP:
                                    c3.label || "",

                                Content4_EN:
                                    content4ENMap[c4.value] || "",

                                Content4_JP:
                                    c4.label || "",

                                Content1_EN:
                                    content1ENMap[c1.value] || "",

                                Content1_JP:
                                    c1.label || ""
                            });

                        });

                        if (!hasL1) {

                            rows.push({
                                RecordType: cfg.recordTypeName,

                                Content2_EN:
                                    content2ENMap[c2.value] || "",

                                Content2_JP:
                                    c2.label || "",

                                Content3_EN:
                                    content3ENMap[c3.value] || "",

                                Content3_JP:
                                    c3.label || "",

                                Content4_EN:
                                    content4ENMap[c4.value] || "",

                                Content4_JP:
                                    c4.label || "",

                                Content1_EN: "",
                                Content1_JP: ""
                            });

                        }

                    });

                    if (!hasL4) {

                        rows.push({
                            RecordType: cfg.recordTypeName,

                            Content2_EN:
                                content2ENMap[c2.value] || "",

                            Content2_JP:
                                c2.label || "",

                            Content3_EN:
                                content3ENMap[c3.value] || "",

                            Content3_JP:
                                c3.label || "",

                            Content4_EN: "",
                            Content4_JP: "",

                            Content1_EN: "",
                            Content1_JP: ""
                        });

                    }

                });

                if (!hasL3) {

                    rows.push({
                        RecordType: cfg.recordTypeName,

                        Content2_EN:
                            content2ENMap[c2.value] || "",

                        Content2_JP:
                            c2.label || "",

                        Content3_EN: "",
                        Content3_JP: "",

                        Content4_EN: "",
                        Content4_JP: "",

                        Content1_EN: "",
                        Content1_JP: ""
                    });

                }

            });

            console.log(
                `✅ ${cfg.sheetName}: ${rows.length} rows`
            );

            const sheet =
                XLSX.utils.json_to_sheet(rows);

            XLSX.utils.book_append_sheet(
                workbook,
                sheet,
                cfg.sheetName
            );
        }

        XLSX.writeFile(
            workbook,
            "Japan_All_RecordTypes_EN_JP.xlsx"
        );

        console.log(
            "\n✅ Japan_All_RecordTypes_EN_JP.xlsx generated successfully"
        );

    } catch (error) {
        console.error(
            "❌ Error:",
            error.message
        );
    }

})();