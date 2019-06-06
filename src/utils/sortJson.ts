export function sortJSON(json: string): string {
  const obj = JSON.parse(json);
  if (obj && typeof obj === "object") {
    if (!Array.isArray(obj)) {
      let result = "{";
      const keys = Object.keys(obj).sort();
      let writeComma = false;
      for (const key of keys) {
        if (writeComma) {
          result += ",";
          writeComma = false;
        }
        result += `"${key}":`;
        result += sortJSON(JSON.stringify(obj[key]));
        writeComma = true;
      }
      result += "}";
      return result;
    } else {
      let result = "[";
      let writeComma = false;
      for (const o of obj) {
        if (writeComma) {
          result += ",";
          writeComma = false;
        }
        result += sortJSON(JSON.stringify(o));
        writeComma = true;
      }
      result += "]";
      return result;
    }
  }
  return json;
}
