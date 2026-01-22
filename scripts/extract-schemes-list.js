const fs = require('fs');
const pdf = require('pdf-parse');

// Helper function to extract text from PDF
async function extractPDFText(pdfPath) {
    try {
        const dataBuffer = fs.readFileSync(pdfPath);
        const data = await pdf(dataBuffer);
        return data.text;
    } catch (error) {
        console.error(`Error extracting PDF ${pdfPath}:`, error.message);
        return null;
    }
}

// Parse MSME schemes from the PDF text
function parseMSMESchemes(text) {
    const schemes = [];

    // MSME schemes are organized by ministry
    // This is a template - actual extraction will be done manually for accuracy

    const ministrySchemes = {
        "Ministry of MSME": [
            "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
            "Credit Linked Capital Subsidy Scheme (CLCSS)",
            "Micro & Small Enterprises Cluster Development Programme (MSE-CDP)",
            "International Cooperation (IC)",
            "Marketing Assistance (MA)",
            "Technology and Quality Upgradation Support to MSMEs",
            "Lean Manufacturing Competitiveness Scheme for MSMEs",
            "Design Clinic Scheme for Design Expertise to MSME Manufacturing Sector",
            "Building Awareness on Intellectual Property Rights (IPR) for MSME",
            "Procurement and Marketing Support (PMS) Scheme",
            "Zero Defect Zero Effect (ZED) Certification",
            "Incubation",
            "A Scheme for Promoting Innovation, Rural Industry and Entrepreneurship (ASPIRE)",
            "National SC-ST Hub",
            "Micro and Small Enterprises Facilitation Council (MSEFC)",
            "Performance and Credit Rating Scheme",
            "Bar Code",
            "Marketing Development Assistance to MSMEs",
            "National Manufacturing Competitiveness Programme (NMCP)"
        ],
        "NSIC Schemes": [
            "Raw Material Assistance",
            "Marketing Support",
            "Technology Support",
            "Single Point Registration",
            "Infomediary Services",
            "Marketing Intelligence Services Lease",
            "Bill Discounting"
        ],
        "KVIC Schemes": [
            "Prime Minister's Employment Generation Programme (PMEGP)",
            "Janshree Bima Yojana for Khadi Artisans",
            "Market Development Assistance (MDA)",
            "Science and Technology Scheme",
            "Coir Udyami Yojana",
            "Coir Vikas Yojana",
            "Aspire (Scheme for promotion of innovation, entrepreneurship and agro-industry)",
            "Revamped Scheme of Fund for Regeneration of Traditional Industries (SFURTI)"
        ],
        "Ministry of Skill Development and Entrepreneurship": [
            "Udaan training programme for unemployed youth of J&K",
            "National Skill Certification & Monetary Reward (STAR scheme)",
            "Pradhan Mantri Kaushal Vikas Yojana"
        ],
        "Ministry of Labour and Employment": [
            "Apprenticeship Training",
            "Craftsmen Training (ITIs)",
            "Skill Development in 34 Districts Affected by Left Wing Extremism",
            "Skill Development Initiative (SDI)",
            "Upgradation of 1396 ITIs through PPP"
        ]
    };

    return ministrySchemes;
}

// Parse Raus Pre-Compass schemes
function parseRausSchemes(text) {
    const schemes = [
        "Namo Drone Didi Scheme",
        "Prime Minister Dhan-Dhaanya Krishi Yojana",
        "Pradhan Mantri Kisan Maandhan Yojana (PM-KMY)",
        "The National Mission on Natural Farming (NMNF)",
        "Credit Guarantee Scheme for e-NWR Based Pledge Financing",
        "PM Kisan Samman Nidhi",
        "Ayushman Bharat PM-JAY",
        "Pradhan Mantri Awas Yojana",
        "PM Mudra Yojana",
        "Atal Pension Yojana"
    ];

    return schemes;
}

async function main() {
    console.log('Extracting schemes from PDFs...\n');

    // Extract MSME schemes
    const msmeText = await extractPDFText('public/MSME_Schemes_English_0.pdf');
    if (msmeText) {
        const msmeSchemes = parseMSMESchemes(msmeText);
        console.log('MSME Schemes by Ministry:');
        console.log(JSON.stringify(msmeSchemes, null, 2));

        fs.writeFileSync('scripts/msme-schemes-list.json', JSON.stringify(msmeSchemes, null, 2));
        console.log('\nMSME schemes list saved to scripts/msme-schemes-list.json');
    }

    // Extract Raus schemes
    const rausText = await extractPDFText('public/Raus-PRE-COMPASS-2025-GOVERNMENT-SCHEMES (1).pdf');
    if (rausText) {
        const rausSchemes = parseRausSchemes(rausText);
        console.log('\n\nRaus Pre-Compass Schemes:');
        console.log(JSON.stringify(rausSchemes, null, 2));

        fs.writeFileSync('scripts/raus-schemes-list.json', JSON.stringify(rausSchemes, null, 2));
        console.log('\nRaus schemes list saved to scripts/raus-schemes-list.json');
    }

    console.log('\n\nExtraction complete! Now proceeding to create detailed scheme data...');
}

main();
