export const cursorComparison = [
  {
    title: "Cursor Design Mode",
    points: [
      "Integrated with Cursor.",
      "Runs in the browser inside Cursor’s Agents Window.",
      "Sends the element, its source identity, and a screenshot to Cursor’s agent.",
      "You can send the next edit while an earlier one is still running.",
    ],
  },
  {
    title: "EditUI",
    points: [
      "Runs in normal Chrome.",
      "Agent independent.",
      "Designed around collecting edits.",
      "Batch review workflow: finish the pass, then copy one prompt.",
    ],
  },
];

export const contextFlow = {
  before: ["Browser", "Screenshot", "Explain where the problem is", "Agent", "Wrong element", "Explain again"],
  after: ["Browser", "Point", "Intent + context", "Agent"],
};
