type LogLevel = "log" | "info" | "warn" | "error";

const isDevelopment = process.env.NODE_ENV === "development";

function shouldLog(level: LogLevel): boolean {
  return isDevelopment || level === "error" || level === "warn";
}

const logger = {
  log: (...args: unknown[]) => {
    if (shouldLog("log")) {
      console.log(...args);
    }
  },
  info: (...args: unknown[]) => {
    if (shouldLog("info")) {
      console.info(...args);
    }
  },
  warn: (...args: unknown[]) => {
    if (shouldLog("warn")) {
      console.warn(...args);
    }
  },
  error: (...args: unknown[]) => {
    if (shouldLog("error")) {
      console.error(...args);
    }
  },
};

export default logger;
