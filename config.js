// =============================================================================
//  EIL WEBMAP — CONFIGURATION FILE
//  Edit this file to deploy a new study area. Do not edit index.html.
// =============================================================================

const CONFIG = {

  // --------------------------------------------------------------------------
  //  STUDY AREA METADATA
  // --------------------------------------------------------------------------
  studyArea: {
    name:        "Leyte Province",           // Displayed in header and page title
    project:     "SLIP-EIL / OMEGA Project", // Subtitle shown in header
    description: "Deterministic EIL hazard mapping — Province-scale Newmark displacement analysis",
    reviewer:    "",                         // Optional: shown in footer ("For review by: ...")
  },

  // --------------------------------------------------------------------------
  //  MAP VIEW — Initial center and zoom on load
  //  Use geographic coords (decimal degrees, WGS84)
  // --------------------------------------------------------------------------
  map: {
    center: [10.85, 124.85],  // [latitude, longitude]
    zoom:   10,
    minZoom: 7,
    maxZoom: 18,
  },

  // --------------------------------------------------------------------------
  //  RASTER LAYERS — GeoTIFF files stored in Google Drive
  //  Each file must be shared: "Anyone with the link can view"
  //  Ideally COG-formatted (see GDAL command: gdal_translate -of COG)
  //
  //  CRS: Rasters are in PRS92 / UTM Zone 51N. georaster-layer-for-leaflet
  //  reads the embedded projection and reprojects to WGS84 automatically.
  //  Map view coords (center, clicks, pins) remain WGS84 geographic as
  //  required by Leaflet — no extra configuration needed.
  //
  //  pixelMap: { pixelValue: [R, G, B, A], ... }
  //    Exact integer pixel value → RGBA color (0–255).
  //    Values not listed → transparent. Use A=0 to explicitly mark NoData.
  //  noDataValues: [N, ...]  Additional values to force transparent.
  //  zIndex: lower numbers render below higher numbers.
  //  legend: [{ label, color }]  Shown in the Layers panel.
  // --------------------------------------------------------------------------
  rasters: [
    {
      id:          "hazard",
      label:       "EIL Hazard Map",
      url:         "https://raw.githubusercontent.com/jabitteschon/PIVS-EIL/main/rasters/DDN_EIL_Hazard_cog.tif",
      opacity:     0.75,
      visible:     true,
      zIndex:      2,
      pixelMap: {
        0: [214,  40,  40, 220],   // High     → red
        1: [123,  45, 139, 220],   // Moderate → purple
        2: [244, 211,  94, 220],   // Low      → yellow
        5: [  0,   0,   0,   0],   // NoData   → transparent
        15:[  0,   0,   0,   0],   // NoData   → transparent
      },
      noDataValues: [5, 15],
      legend: [
        { label: "High",     color: "#d62828" },
        { label: "Moderate", color: "#7b2d8b" },
        { label: "Low",      color: "#f4d35e" },
      ],
    },
    {
      id:          "depositional",
      label:       "Depositional Zone",
      url:         "https://raw.githubusercontent.com/jabitteschon/PIVS-EIL/main/rasters/DDN_Runout_cog.tif",
      opacity:     0.70,
      visible:     true,
      zIndex:      1,
      pixelMap: {
        1: [69, 123, 157, 200],
      },
      noDataValues: [],
      legend: [
        { label: "Depositional Zone", color: "#457b9d" },
      ],
    },
  ],

  // --------------------------------------------------------------------------
  //  VECTOR LAYERS — GeoJSON files (local or Google Drive)
  //  Add one object per dataset. Remove entries to hide layers.
  //
  //  source options:
  //    { type: "local", path: "layers/filename.geojson" }  ← file in repo
  //    { type: "drive", fileId: "YOUR_FILE_ID" }           ← Drive-hosted GeoJSON
  //
  //  geometry: "point" | "line" | "polygon"
  // --------------------------------------------------------------------------
  layers: [
    {
      id:       "landslide_inventory",
      label:    "Landslide Inventory",
      geometry: "polygon",
      source:   { type: "local", path: "layers/landslide_inventory.geojson" },
      style: {
        color:       "#e63946",
        fillColor:   "#e63946",
        fillOpacity: 0.25,
        weight:      1.5,
      },
      popup: ["Name", "Date", "Area_ha", "Type"],
      visible: true,
    },
    {
      id:       "trigger_points",
      label:    "Earthquake Trigger Points",
      geometry: "point",
      source:   { type: "local", path: "layers/trigger_points.geojson" },
      style: {
        color:       "#f4a261",
        radius:      5,
        fillOpacity: 0.8,
        weight:      1,
      },
      popup: ["Event", "Magnitude", "Depth_km", "Date"],
      visible: true,
    },
    {
      id:       "fault_traces",
      label:    "Active Fault Traces",
      geometry: "line",
      source:   { type: "local", path: "layers/fault_traces.geojson" },
      style: {
        color:     "#9b2226",
        weight:    2,
        dashArray: "6 4",
      },
      popup: ["FaultName", "Segment", "Classification"],
      visible: false,
    },
  ],

  // --------------------------------------------------------------------------
  //  PINS / COMMENTS — Google Sheets database
  //
  //  READ  (refreshPins) → Sheets API v4 with apiKey
  //                         Sheet must be "Anyone with link can view"
  //
  //  WRITE (appendPin)   → Google Apps Script web app (no OAuth required)
  //    Setup:
  //      1. Open your Google Sheet → Extensions → Apps Script
  //      2. Paste this function and save:
  //
  //           function doPost(e) {
  //             const sheet = SpreadsheetApp
  //               .getActiveSpreadsheet().getSheetByName('Pins');
  //             const p = e.parameter;
  //             sheet.appendRow([p.id, p.lat, p.lng, p.category,
  //                              p.comment, p.timestamp, p.author]);
  //             return ContentService.createTextOutput('ok');
  //           }
  //
  //      3. Deploy → New deployment → Web app
  //         Execute as: Me | Who has access: Anyone
  //      4. Copy the deployment URL → paste as scriptUrl below
  //
  //  Sheet tab name must be exactly: Pins
  //  Header row (Row 1): id | lat | lng | category | comment | timestamp | author
  // --------------------------------------------------------------------------
  pins: {
    sheetId:   "1_2mDXGv7sUEZv_HcQYSnlnFe3JC7iyG8MnrhcJwbZTE",
    apiKey:    "AIzaSyB_E1teg071HwUZ66LGdtUfpjE51OuBayw",  // Google Cloud → Credentials → API Key (Sheets API enabled)
    scriptUrl: "https://script.google.com/macros/s/AKfycbzs2OXDMHNdd23s4h1Ms4vZGrUYD_pLwt1VHUyUm5KnVGMgdUq5qpdsS4A__jaPbgdOVQ/exec", // Apps Script deployment URL (for writes)
    categories: [
      { label: "EIL Hazard",        color: "#e63946", icon: "▲" },
      { label: "Depositional Zone",  color: "#f4a261", icon: "◆" },
      { label: "Other",              color: "#8b949e", icon: "●" },
    ],
  },

  // --------------------------------------------------------------------------
  //  REVIEWER ACCESS — Optional author name prompt on first load
  // --------------------------------------------------------------------------
  auth: {
    requireName: true,
    prompt:      "Enter your name to begin reviewing:",
  },

};
