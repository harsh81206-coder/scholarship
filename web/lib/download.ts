export type DownloadRow = Record<string, unknown>;

export function downloadCsv(filename: string, rows: DownloadRow[]) {
  if (!rows.length) return;
  const columns = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const escape = (value: unknown) => {
    const raw = value == null ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
    return `"${raw.replaceAll('"', '""')}"`;
  };
  const content = [columns.map(escape).join(","), ...rows.map((row) => columns.map((key) => escape(row[key])).join(","))].join("\r\n");
  const url = URL.createObjectURL(new Blob([`\uFEFF${content}`], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function downloadJson(filename: string, value: unknown) {
  const url = URL.createObjectURL(new Blob([JSON.stringify(value, null, 2)], { type: "application/json" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
