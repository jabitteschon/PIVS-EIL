// =============================================================================
//  EIL WEBMAP — CONFIGURATION FILE
//  Edit this file to deploy a new study area. Do not edit index.html.
// =============================================================================

const CONFIG = {

  // --------------------------------------------------------------------------
  //  STUDY AREA METADATA
  // --------------------------------------------------------------------------
  studyArea: {
    name:        "Davao del Norte",
    project:     "SLIP Project — EIL Component",
    description: "Deterministic EIL hazard mapping — Province-scale Newmark displacement analysis",
    reviewer:    "",
  },

  // --------------------------------------------------------------------------
  //  MAP VIEW
  // --------------------------------------------------------------------------
  map: {
    center:  [7.55, 125.65],
    zoom:    10,
    minZoom: 7,
    maxZoom: 18,
    basemapOpacity: 0.75,   // ← NEW: wire this up in index.html (see note below)
  },

  // --------------------------------------------------------------------------
  //  RASTER LAYERS
  // --------------------------------------------------------------------------
  rasters: [

    // -- Hillshade (base, below everything) -----------------------------------
    {
      id:          "hillshade",
      label:       "Hillshade",
      url:         "https://pub-39473771ea19483ba83e34fc40363051.r2.dev/DdN_Hillshade_WGS84.tif",
      opacity:     0.90,        // hillshade looks best near-opaque
      visible:     true,
      zIndex:      1,           // lowest → renders first, under hazard
      resolution:  256,
      pixelMap:    null,        // null = render raw grayscale, no remapping
      noDataValues: [0],        // typical hillshade NoData
      legend:      [],          // no legend entry needed
    },

    // -- EIL Hazard Map (above hillshade) ------------------------------------
    {
      id:          "hazard",
      label:       "EIL Hazard Map",
      url:         "https://pub-39473771ea19483ba83e34fc40363051.r2.dev/EIL_Hazard_Trial54_WGS84_v2_COG.tif",
      opacity:     0.75,
      visible:     true,
      zIndex:      2,
      resolution:  256,         // higher = finer pixels, fewer visible seams
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
  //  VECTOR LAYERS
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
      popup:   ["Name", "Date", "Area_ha", "Type"],
      visible: false,
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
      popup:   ["Event", "Magnitude", "Depth_km", "Date"],
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
      popup:   ["FaultName", "Segment", "Classification"],
      visible: false,
    },
  ],

  // --------------------------------------------------------------------------
  //  PINS / COMMENTS
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
  //  REVIEWER ACCESS
  // --------------------------------------------------------------------------
  auth: {
    requireName: true,
    prompt:      "Enter your name to begin reviewing:",
  },

};