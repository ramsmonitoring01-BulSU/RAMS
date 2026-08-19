// Pangalan ng bldgs for the dropdown menu

export const CAMPUS_BUILDINGS = [
    { id: "CON", name: "Pimentel Hall (CON)" },
    { id: "activity-center", name: "Activity Center (AC)" },
    { id: "CIT", name: "Alvarado Hall (CIT)" },
    { id: "NSTP", name: "Athletes Bldg (NSTP)" },
    { id: "CLAW", name: "College of Law" },
    { id: "LHS", name: "Carpio Hall (LHS)" },
    { id: "SRLC", name: "SRLC Bldg" },
    { id: "elibrary", name: "E-Library" },
    { id: "CBEA", name: "CBEA Bldg" },
    { id: "COE", name: "Natividad Hall (COE)" },
    { id: "COED", name: "Roxas Hall (COED)" },
    { id: "CHTM", name: "CHTM Bldg" },
    { id: "CS-CAL", name: "Federizo Hall (CS-CAL)" },
    { id: "floreshall", name: "Flores Hall" },
    { id: "valenciahall", name: "Valencia Hall" },
    { id: "CSSP", name: "Mendoza Hall (CSSP)" },
    { id: "CCJE", name: "CCJE Bldg" }
].sort((a, b) => a.name.localeCompare(b.name)); // Alphabetical sorting for better UX