"use strict";

const crypto = require("node:crypto");

module.exports = function dashboardAuth(req, res, next) {
  const expected = process.env.DASHBOARD_PASSWORD;
  if (!expected) {
    return res.status(503).send("Dashboard is locked: set DASHBOARD_PASSWORD in the environment.");
  }

  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) {
    res.set("WWW-Authenticate", 'Basic realm="B2B Bot Dashboard"');
    return res.status(401).send("Authentication required.");
  }

  let supplied = "";
  try {
    supplied = Buffer.from(header.slice(6), "base64").toString("utf8");
  } catch {
    return res.status(401).send("Invalid authentication.");
  }

  const separator = supplied.indexOf(":");
  if (separator < 0) return res.status(401).send("Invalid authentication.");
  const password = Buffer.from(supplied.slice(separator + 1), "utf8");
  const expectedBuffer = Buffer.from(expected, "utf8");

  if (password.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(password, expectedBuffer)) {
    res.set("WWW-Authenticate", 'Basic realm="B2B Bot Dashboard"');
    return res.status(401).send("Invalid password.");
  }

  next();
};
