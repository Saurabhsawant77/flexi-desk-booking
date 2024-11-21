const { createLogger, transports, format } = require("winston");
require("winston-mongodb");

const logger = createLogger({
  transports: [
    new transports.MongoDB({
      level: "info",
      db: process.env.MONGODB_URL,
      collection: "infoLogs",
      format: format.combine(format.timestamp(), format.json()),
    }).on("error", (err) => {
      console.error("MongoDB connection error:", err);
    }),
    new transports.MongoDB({
      level: "error",
      db: process.env.MONGODB_URL,
      collection: "errorLogs",
      format: format.combine(format.timestamp(), format.json()),
    }).on("error", (err) => {
      console.error("MongoDB connection error:", err);
    }),
  ],
});


module.exports = logger;

