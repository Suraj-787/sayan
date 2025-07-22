const mongoose = require('mongoose');

// Sample scheme structure based on existing schema
const schemeTemplate = {
  title: "",
  description: "",
  category: "",
  eligibility: "",
  benefits: "",
  application_process: "",
  documents: [],
  deadline: "",
  website: "",
  created_at: new Date().toISOString(),
};

// Generate valid MongoDB ObjectIDs for new schemes
function generateSchemeIds(count) {
  const ids = {};
  for (let i = 1; i <= count; i++) {
    ids[`scheme${i}`] = new mongoose.Types.ObjectId().toString();
  }
  return ids;
}

// Enhanced scheme data extracted from PDF with proper categorization
const newSchemes = [
  {
    title: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Crop insurance scheme providing financial support to farmers in the event of crop failure due to natural calamities, pests & diseases",
    category: "Agriculture",
    eligibility: "All farmers including loanee and non-loanee farmers, tenant farmers, and sharecroppers",
    benefits: "Insurance coverage with uniform premium rates: 2% for Kharif crops, 1.5% for Rabi crops, 5% for commercial/horticultural crops. No upper limit on government subsidy",
    application_process: "Register through designated insurance companies, banks, or Common Service Centres. Area-based insurance unit approach",
    documents: ["Aadhaar Card", "Land Records", "Bank Account Details", "Crop Details"],
    deadline: "Season-wise registration before sowing",
    website: "https://pmfby.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "Agriculture Infrastructure Fund (AIF)",
    description: "Medium-long term debt financing facility for investment in viable post-harvest management infrastructure and community farming assets",
    category: "Agriculture",
    eligibility: "PACS, FPOs, SHGs, JLGs, Cooperatives, Agriculture entrepreneurs, start-ups",
    benefits: "Rs 1,00,000 crore funding with interest subvention and credit guarantee support",
    application_process: "Apply through designated banks and financial institutions with project proposals",
    documents: ["Project Report", "Land Documents", "Registration Certificate", "Financial Statements"],
    deadline: "Ongoing scheme",
    website: "https://agriinfra.dac.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "AgriSURE Fund",
    description: "Fund for Start-ups and Rural Enterprises supporting innovative, technology-driven activities in agriculture and allied sectors",
    category: "Agriculture",
    eligibility: "Start-ups working in agriculture & rural development sectors like Agritech, Food Processing, Animal husbandry, Fisheries",
    benefits: "Investment support through Rs 750 crores corpus fund with equity and debt financing",
    application_process: "Apply through NABVENTURES Ltd. with business plan and technology proposals",
    documents: ["Business Plan", "Technology Details", "Registration Certificate", "Financial Projections"],
    deadline: "10 years fund duration with rolling applications",
    website: "https://www.nabard.org/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM-AASHA (Pradhan Mantri Annadata Aay Sanrakshan Abhiyan)",
    description: "Comprehensive scheme to ensure remunerative prices for farmers and control price volatility",
    category: "Agriculture",
    eligibility: "All farmers producing notified crops",
    benefits: "Remunerative prices through Price Support Scheme, Market Intervention, and Price Deficiency Payment",
    application_process: "Register with designated procurement agencies and follow MSP guidelines",
    documents: ["Aadhaar Card", "Land Records", "Crop Production Details", "Bank Account"],
    deadline: "Season-wise registration",
    website: "https://pmfby.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "Namo Drone Didi Scheme",
    description: "Empowering women-led Self-Help Groups by equipping them with drone technology for agricultural services",
    category: "Agriculture",
    eligibility: "Women SHGs in rural areas under DAY-NRLM",
    benefits: "80% financial assistance up to Rs 8 lakhs for drone and accessories, plus 3% interest subvention",
    application_process: "Apply through rural development departments and SHG networks",
    documents: ["SHG Registration", "Training Certificate", "Bank Account Details", "Aadhaar Card"],
    deadline: "2024-25 to 2025-26 period",
    website: "https://rural.nic.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM Dhan-Dhaanya Krishi Yojana",
    description: "Comprehensive scheme to enhance agricultural productivity and adopt sustainable agriculture practices",
    category: "Agriculture",
    eligibility: "Farmers in 100 districts with low productivity and below-average credit parameters",
    benefits: "Enhanced productivity support, crop diversification, improved irrigation, and credit facilitation",
    application_process: "Convergence of existing schemes through district-level implementation",
    documents: ["Land Records", "Aadhaar Card", "Bank Account Details", "Crop Details"],
    deadline: "February 2025 launch",
    website: "https://agricoop.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM Kisan Maandhan Yojana (PM-KMY)",
    description: "Voluntary contributory pension scheme for small and marginal farmers",
    category: "Agriculture",
    eligibility: "Small and marginal farmers aged 18-40 years with land holdings up to 2 hectares",
    benefits: "Monthly pension of Rs 3,000 after age 60 with equal government contribution",
    application_process: "Register through Common Service Centres or State Governments with LIC management",
    documents: ["Aadhaar Card", "Land Records", "Bank Account Details", "Age Proof"],
    deadline: "Ongoing registration",
    website: "https://pmkmy.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "National Mission on Natural Farming (NMNF)",
    description: "Promoting natural farming practices to reduce input costs and improve soil health",
    category: "Agriculture",
    eligibility: "All farmers interested in adopting natural farming methods",
    benefits: "Training, technical support, and financial assistance for natural farming adoption",
    application_process: "Apply through agriculture departments and extension services",
    documents: ["Aadhaar Card", "Land Records", "Bank Account Details"],
    deadline: "Ongoing mission",
    website: "https://naturalfarming.dac.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM Garib Kalyan Anna Yojana (PMGKAY)",
    description: "Food security scheme providing free food grains to beneficiaries",
    category: "Food Security",
    eligibility: "All ration card holders under National Food Security Act",
    benefits: "5 kg free food grains per person per month",
    application_process: "Automatic coverage for existing ration card holders",
    documents: ["Ration Card", "Aadhaar Card"],
    deadline: "Ongoing scheme",
    website: "https://dfpd.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM Internship Scheme",
    description: "Providing internship opportunities to enhance employability skills",
    category: "Employment",
    eligibility: "Young graduates and diploma holders aged 21-24 years",
    benefits: "Stipend during internship period and skill development",
    application_process: "Apply through designated portal with corporate partnerships",
    documents: ["Educational Certificates", "Aadhaar Card", "Bank Account Details"],
    deadline: "Rolling applications",
    website: "https://mca.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM-WANI (Prime Minister WiFi Network Interface)",
    description: "Creating public WiFi network infrastructure across the country",
    category: "Digital Infrastructure",
    eligibility: "Public WiFi providers and entrepreneurs",
    benefits: "License-free WiFi network deployment with simplified registration",
    application_process: "Register as Public Data Office (PDO) and deploy WiFi networks",
    documents: ["Business Registration", "Technical Specifications", "Location Details"],
    deadline: "Ongoing implementation",
    website: "https://dot.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "UDAN 5.5 Scheme",
    description: "Regional connectivity scheme for affordable air travel to remote areas",
    category: "Transportation",
    eligibility: "Airlines and helicopter operators",
    benefits: "Financial support for operations to unserved and underserved airports",
    application_process: "Bid through competitive bidding process",
    documents: ["Airline License", "Route Proposals", "Financial Details"],
    deadline: "Periodic bidding rounds",
    website: "https://moca.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM-DEVINE (Development Initiative for North East)",
    description: "Infrastructure development and capacity building for North Eastern region",
    category: "Regional Development",
    eligibility: "North Eastern states and institutions",
    benefits: "Financial support for infrastructure and human resource development",
    application_process: "Apply through North Eastern Council and state governments",
    documents: ["Project Proposals", "State Government Endorsement", "Budget Details"],
    deadline: "Annual planning cycle",
    website: "https://doner.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM-SHRI (Pradhan Mantri Schools for Rising India)",
    description: "Upgrading schools to exemplary models with modern infrastructure and pedagogy",
    category: "Education",
    eligibility: "Government and government-aided schools",
    benefits: "Comprehensive upgrade including infrastructure, technology, and teacher training",
    application_process: "Selection through state education departments",
    documents: ["School Registration", "Infrastructure Assessment", "Academic Performance"],
    deadline: "Phase-wise implementation",
    website: "https://education.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM Vidyalaxmi Scheme",
    description: "Educational loan scheme for higher education",
    category: "Education",
    eligibility: "Students seeking higher education with family income criteria",
    benefits: "Collateral-free loans with interest subsidies",
    application_process: "Apply through participating banks and financial institutions",
    documents: ["Admission Letter", "Income Certificate", "Academic Records", "Aadhaar Card"],
    deadline: "Ongoing applications",
    website: "https://vidyalakshmi.co.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "Bhashini Initiative",
    description: "AI-powered language translation platform for digital inclusion",
    category: "Digital Services",
    eligibility: "All citizens and organizations needing language services",
    benefits: "Free access to translation and language tools",
    application_process: "Access through digital platforms and mobile applications",
    documents: ["No specific documents required"],
    deadline: "Continuous service",
    website: "https://bhashini.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "IndiaAI Mission",
    description: "National mission for artificial intelligence development and adoption",
    category: "Technology",
    eligibility: "Researchers, startups, institutions working on AI",
    benefits: "Research funding, infrastructure access, and skill development",
    application_process: "Apply through designated AI portals and institutions",
    documents: ["Research Proposal", "Institution Registration", "Team Details"],
    deadline: "Continuous applications",
    website: "https://indiaai.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "National Clean Air Programme",
    description: "Comprehensive plan to reduce air pollution in cities",
    category: "Environment",
    eligibility: "Cities and states with air quality issues",
    benefits: "Technical and financial support for pollution control measures",
    application_process: "Prepare city action plans and submit to pollution control boards",
    documents: ["Air Quality Data", "Action Plan", "Budget Proposals"],
    deadline: "Ongoing implementation",
    website: "https://moef.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "Green Credit Programme",
    description: "Market-based mechanism for environmental conservation activities",
    category: "Environment",
    eligibility: "Individuals, communities, private sector, institutions",
    benefits: "Green credits for environmental activities that can be traded",
    application_process: "Register activities on Green Credit platform",
    documents: ["Activity Proposal", "Verification Documents", "Location Details"],
    deadline: "Continuous registration",
    website: "https://greenindia.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "MISHTI Scheme (Mangrove Initiative for Shoreline Habitats)",
    description: "Mangrove conservation and restoration for coastal protection",
    category: "Environment",
    eligibility: "Coastal states and communities",
    benefits: "Financial support for mangrove plantation and conservation",
    application_process: "Submit proposals through forest departments",
    documents: ["Site Assessment", "Plantation Plan", "Community Participation"],
    deadline: "Annual planning cycle",
    website: "https://moef.gov.in/",
    created_at: new Date().toISOString(),
  }
];

// Add more schemes from other ministries...
const additionalSchemes = [
  {
    title: "Unified Pension Scheme",
    description: "Assured pension scheme for government employees",
    category: "Finance",
    eligibility: "Central government employees",
    benefits: "Assured pension of 50% of average basic pay with family pension",
    application_process: "Automatic enrollment for eligible employees",
    documents: ["Employment Records", "Service Details", "Bank Account"],
    deadline: "Automatic for eligible employees",
    website: "https://pension.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM Mudra Yojana",
    description: "Micro credit scheme for small business enterprises",
    category: "Finance",
    eligibility: "Non-corporate, non-farm small/micro enterprises",
    benefits: "Collateral-free loans up to Rs 10 lakhs in three categories",
    application_process: "Apply through banks, MFIs, and NBFCs",
    documents: ["Business Plan", "Aadhaar Card", "Bank Account", "Business Registration"],
    deadline: "Ongoing scheme",
    website: "https://mudra.org.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "Atal Pension Yojana",
    description: "Pension scheme for unorganized sector workers",
    category: "Finance",
    eligibility: "Citizens aged 18-40 years with bank account",
    benefits: "Guaranteed pension between Rs 1,000 to Rs 5,000 per month after 60 years",
    application_process: "Enroll through banks and post offices",
    documents: ["Aadhaar Card", "Bank Account", "Age Proof"],
    deadline: "Ongoing enrollment",
    website: "https://npscra.nsdl.co.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PMJAY)",
    description: "Health insurance scheme providing coverage up to Rs 5 lakhs per family per year",
    category: "Healthcare",
    eligibility: "Families identified through SECC database",
    benefits: "Free treatment at empaneled hospitals with coverage up to Rs 5 lakhs",
    application_process: "Automatic enrollment based on SECC data or apply for new inclusion",
    documents: ["Aadhaar Card", "Family Details", "Income Certificate"],
    deadline: "Continuous enrollment",
    website: "https://pmjay.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM E-DRIVE Scheme",
    description: "Electric mobility promotion scheme for sustainable transportation",
    category: "Transportation",
    eligibility: "Individuals and organizations purchasing electric vehicles",
    benefits: "Financial incentives for electric vehicle purchase and charging infrastructure",
    application_process: "Apply through dealers and online portals",
    documents: ["Vehicle Registration", "Purchase Invoice", "Aadhaar Card"],
    deadline: "Scheme period based",
    website: "https://heavyindustries.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM Awas Yojana (Urban)",
    description: "Housing for all in urban areas by providing affordable housing",
    category: "Housing",
    eligibility: "EWS, LIG, and MIG families without pucca house",
    benefits: "Interest subsidy and direct financial assistance for house construction/purchase",
    application_process: "Apply through PMAY-U portal or municipal offices",
    documents: ["Income Certificate", "Aadhaar Card", "Bank Account", "Property Documents"],
    deadline: "Extended till 2024",
    website: "https://pmaymis.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM SVANidhi (Street Vendor AtmaNirbhar Nidhi)",
    description: "Micro-credit scheme for street vendors",
    category: "Employment",
    eligibility: "Street vendors with Certificate of Vending/Letter of Recommendation",
    benefits: "Collateral-free loans starting from Rs 10,000 with digital payment incentives",
    application_process: "Apply through mobile app or designated lending institutions",
    documents: ["Vending Certificate", "Aadhaar Card", "Bank Account"],
    deadline: "Ongoing scheme",
    website: "https://pmsvanidhi.mohua.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "Jal Jeevan Mission",
    description: "Providing tap water connection to every rural household",
    category: "Infrastructure",
    eligibility: "Rural households without tap water connection",
    benefits: "Functional household tap connection with assured water supply",
    application_process: "Village-level planning through gram panchayats",
    documents: ["Household Survey", "Village Action Plan", "Community Participation"],
    deadline: "Target 2024",
    website: "https://jaljeevanmission.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "Swachh Bharat Mission",
    description: "Clean India mission for sanitation and waste management",
    category: "Sanitation",
    eligibility: "All citizens and institutions",
    benefits: "Financial support for toilet construction and waste management infrastructure",
    application_process: "Apply through local bodies and SBM portals",
    documents: ["Household Details", "Construction Proposal", "Bank Account"],
    deadline: "Ongoing mission",
    website: "https://swachhbharatmission.gov.in/",
    created_at: new Date().toISOString(),
  },
  {
    title: "PM Vishwakarma Yojana",
    description: "Skill development and financial support for traditional artisans",
    category: "Skill Development",
    eligibility: "Traditional artisans and craftspeople in specified trades",
    benefits: "Skill training, toolkit incentive, and collateral-free credit support",
    application_process: "Register through Common Service Centers and skill training providers",
    documents: ["Aadhaar Card", "Skill Assessment", "Bank Account", "Caste Certificate"],
    deadline: "Ongoing registration",
    website: "https://pmvishwakarma.gov.in/",
    created_at: new Date().toISOString(),
  }
];

// Combine all schemes
const allNewSchemes = [...newSchemes, ...additionalSchemes];

// Generate IDs for all schemes
const schemeIds = generateSchemeIds(allNewSchemes.length);

// Add IDs to schemes
const schemesWithIds = allNewSchemes.map((scheme, index) => ({
  id: Object.values(schemeIds)[index],
  ...scheme
}));

console.log('Generated', schemesWithIds.length, 'new schemes from PDF data');
console.log('Schemes by category:');

// Group by category for summary
const schemesByCategory = schemesWithIds.reduce((acc, scheme) => {
  acc[scheme.category] = (acc[scheme.category] || 0) + 1;
  return acc;
}, {});

console.log(schemesByCategory);

// Export the schemes for use in seed script
module.exports = {
  newSchemes: schemesWithIds,
  schemeIds
};

// If run directly, write to JSON file
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');
  const outputFile = path.join(__dirname, '../lib/new-schemes-data.json');
  
  fs.writeFileSync(outputFile, JSON.stringify({
    schemes: schemesWithIds,
    totalCount: schemesWithIds.length,
    categorySummary: schemesByCategory,
    generatedAt: new Date().toISOString()
  }, null, 2));
  
  console.log(`\nSchemes data written to: ${outputFile}`);
  console.log('Ready to be imported into the database!');
}
