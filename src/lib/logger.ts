type LogLevel = "info" | "warn" | "error";
type LogEvent =
  | "auth.login"
  | "auth.login.fail"
  | "auth.register"
  | "auth.register.fail"
  | "auth.logout"
  | "couple.create"
  | "couple.join"
  | "couple.join.fail"
  | "couple.reset"
  | "couple.reset.fail"
  | "couple.info"
  | "date.list"
  | "date.get"
  | "date.create"
  | "photo.list"
  | "photo.upload"
  | "request"
  | "error";

interface LogMeta {
  userId?: string | null;
  username?: string | null;
  coupleId?: string | null;
  event: LogEvent;
  message: string;
  duration?: number;
  ip?: string;
  path?: string;
  method?: string;
  status?: number;
  error?: string;
  [key: string]: unknown;
}

export function logger(level: LogLevel, meta: LogMeta) {
  const entry = {
    timestamp: new Date().toISOString(),
    level,
    ...meta,
  };
  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export function logInfo(event: LogEvent, message: string, extra?: Partial<LogMeta>) {
  logger("info", { event, message, ...extra });
}

export function logWarn(event: LogEvent, message: string, extra?: Partial<LogMeta>) {
  logger("warn", { event, message, ...extra });
}

export function logError(event: LogEvent, message: string, extra?: Partial<LogMeta>) {
  logger("error", { event, message, ...extra });
}
