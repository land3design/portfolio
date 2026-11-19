/*
 * Project photo register for LAND3 DESIGN.
 * Photos are grouped by location and stage (before / during / after), matching
 * assets/projects/<location>/<stage>/<id>.jpg. Curtain photos have no confirmed
 * location, so they live under "curtains" and are shown only on the curtains page.
 * Before/after pairs marked confirmed: false are visual matches still to be verified.
 */
window.LAND3_PROJECTS = {
  locations: {
    "block-7": {
      name: "Block 7",
      stages: {
        before: ["b7-02", "b7-03", "b7-04", "b7-05", "b7-06", "b7-07"],
        during: ["b7-08", "b7-09", "b7-10", "b7-11", "b7-12", "b7-13", "b7-14", "b7-15", "b7-16", "b7-17", "b7-18", "b7-20", "b7-21", "b7-22", "b7-23", "b7-24", "b7-25", "b7-26", "b7-27", "b7-28", "b7-29", "b7-30", "b7-31"],
        after: ["b7-32", "b7-33", "b7-34", "b7-35"]
      },
      interiors: ["b7-02", "b7-03", "b7-04", "b7-07", "b7-33", "b7-34", "b7-35"],
      pairs: [
        { before: "b7-02", after: "b7-33", confirmed: true },
        { before: "b7-07", after: "b7-35", confirmed: true }
      ]
    },
    "boate-1": {
      name: "Boatle 1",
      stages: {
        before: ["b1-06", "b1-07", "b1-16", "b1-17", "b1-18", "b1-19", "b1-20", "b1-22", "b1-23", "b1-24", "b1-26", "b1-27", "b1-29", "b1-30", "b1-33", "b1-34", "b1-36", "b1-37", "b1-41", "b1-42"],
        during: ["b1-02", "b1-03", "b1-04", "b1-08", "b1-09", "b1-10", "b1-11", "b1-12", "b1-13", "b1-14", "b1-15", "b1-21", "b1-25", "b1-28", "b1-35", "b1-38", "b1-39", "b1-40", "b1-43", "b1-44", "b1-45", "b1-46"],
        after: ["b1-01", "b1-05", "b1-31", "b1-32", "b1-47", "b1-48", "b1-49", "b1-50", "b1-51", "b1-52", "b1-53", "b1-54", "b1-55", "b1-56", "b1-57", "b1-58", "b1-59", "b1-60"]
      },
      interiors: ["b1-10", "b1-40"],
      pairs: [
        { before: "b1-16", after: "b1-59", confirmed: false }
      ]
    },
    "boate-2": {
      name: "Boatle 2",
      stages: {
        before: ["b2-01", "b2-02", "b2-03", "b2-04", "b2-05"],
        during: [],
        after: ["b2-06", "b2-07", "b2-08", "b2-09", "b2-10", "b2-11", "b2-12", "b2-13", "b2-14", "b2-15", "b2-16", "b2-17", "b2-18", "b2-19", "b2-20", "b2-21", "b2-22", "b2-23", "b2-24", "b2-25", "b2-26", "b2-27"]
      },
      interiors: ["b2-06", "b2-07", "b2-09", "b2-10", "b2-11", "b2-13", "b2-17", "b2-20", "b2-21", "b2-22", "b2-23", "b2-24", "b2-25", "b2-26", "b2-27"],
      pairs: [
        { before: "b2-04", after: "b2-24", confirmed: false }
      ]
    }
  },
  curtains: {
    name: "Curtains and Interiors",
    items: [
      { id: "cu-01", category: "Curtain installations" },
      { id: "cu-02", category: "Curtain installations" },
      { id: "cu-03", category: "Curtain installations" },
      { id: "cu-04", category: "Curtain installations" },
      { id: "cu-05", category: "Curtain installations" },
      { id: "cu-06", category: "Window treatments" },
      { id: "cu-07", category: "Interior spaces" },
      { id: "cu-08", category: "Interior spaces" },
      { id: "cu-09", category: "Interior spaces" }
    ]
  }
};
