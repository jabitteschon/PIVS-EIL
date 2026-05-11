// =============================================================================
//  EIL WEBMAP — CONFIGURATION FILE
//  Edit this file to deploy a new study area. Do not edit index.html.
// =============================================================================

const CONFIG = {

  // --------------------------------------------------------------------------
  //  STUDY AREA METADATA
  // --------------------------------------------------------------------------
  studyArea: {
    name:        "Davao del Norte",          // Displayed in header and page title
    project:     "SLIP Project — EIL Component",  // Subtitle shown in header
    description: "Deterministic EIL hazard mapping — Province-scale Newmark displacement analysis",
    reviewer:    "",                         // Optional: shown in footer ("For review by: ...")
  },

  // --------------------------------------------------------------------------
  //  MAP VIEW — Initial center and zoom on load
  //  Use geographic coords (decimal degrees, WGS84)
  // --------------------------------------------------------------------------
  map: {
    center: [7.55, 125.65],   // [latitude, longitude] — Davao del Norte
    zoom:   10,
    minZoom: 7,
    maxZoom: 18,
    basemapOpacity: 0.75,     // Tile layer opacity (0–1). Hillshade renders beneath.
  },

  // --------------------------------------------------------------------------
  //  RASTER LAYERS — GeoTIFF files (ideally COG-formatted)
  //
  //  url: Direct link to a publicly accessible GeoTIFF.
  //       Leave as "" to show the layer in the panel as unavailable (grayed out).
  //
  //  CRS: Rasters may be in PRS92/UTM Zone 51N or WGS84 geographic.
  //       georaster-layer-for-leaflet reads the embedded projection and
  //       reprojects automatically — no extra configuration needed.
  //
  //  pixelMap: { pixelValue: [R, G, B, A], ... }
  //    Exact integer pixel value → RGBA color (0–255).
  //    Values not listed → transparent.
  //  pixelMap: null → raw grayscale passthrough (for hillshade / continuous).
  //  noDataValues: [N, ...]  Additional values to force transparent.
  //  zIndex: lower numbers render below higher numbers.
  //  legend: [{ label, color }]  Shown in the Layers panel.
  // --------------------------------------------------------------------------
  rasters: [

    // -- Hillshade (bottommost — below all thematic rasters) ------------------
    {
      id:           "hillshade",
      label:        "Hillshade",
      url:          "https://pub-39473771ea19483ba83e34fc40363051.r2.dev/DdN_Hillshade_WGS84.tif",
      opacity:      0.90,
      visible:      true,
      zIndex:       1,
      pixelMap:     null,        // null = raw grayscale passthrough
      noDataValues: [0],
      legend:       [],
    },

    // -- Depositional Zone ----------------------------------------------------
    {
      id:           "depositional",
      label:        "Depositional Zone",
      url:          "",          // ← paste R2 link here when available
      opacity:      0.75,
      visible:      false,
      zIndex:       2,
      pixelMap: {
        1: [69, 123, 157, 200],
      },
      noDataValues: [],
      legend: [
        { label: "Depositional Zone", color: "#457b9d" },
      ],
    },

    // -- EIL Hazard Map (topmost thematic layer) ------------------------------
    {
      id:           "hazard",
      label:        "EIL Hazard Map",
      url:          "https://pub-39473771ea19483ba83e34fc40363051.r2.dev/EIL_Hazard_Trial54_WGS84_v2.tif",
      opacity:      0.75,
      visible:      true,
      zIndex:       3,
      pixelMap: {
        0: [214,  40,  40, 220],   // High     → red
        1: [123,  45, 139, 220],   // Moderate → purple
        2: [244, 211,  94, 220],   // Low      → yellow
      },
      noDataValues: [5, 15],
      legend: [
        { label: "High",     color: "#d62828" },
        { label: "Moderate", color: "#7b2d8b" },
        { label: "Low",      color: "#f4d35e" },
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
      label:    "Earthquake Epicenters",
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
    apiKey:    "AIzaSyB_E1teg071HwUZ66LGdtUfpjE51OuBayw",
    scriptUrl: "https://script.google.com/macros/s/AKfycbzs2OXDMHNdd23s4h1Ms4vZGrUYD_pLwt1VHUyUm5KnVGMgdUq5qpdsS4A__jaPbgdOVQ/exec",
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
