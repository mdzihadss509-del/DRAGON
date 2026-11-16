"use strict";

// Logging disabled: no log history is kept in memory or written to disk.
// Keep these exports so the bot's existing code remains compatible.
function addLog() {}

function getLogs() {
  return [];
}

module.exports = { addLog, getLogs };
