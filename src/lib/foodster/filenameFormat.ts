export type DriveImage = {
  id: string;
  url: string;
  name: string;
};

export type ParsedMenu = DriveImage & {
  displayName: string;
  type: string;
  price: number;
  status: "AVB" | "EMP" | "UNK";
  available: boolean;
};

function decodeStatus(code?: string): "AVB" | "EMP" | "UNK" {
  if (!code) return "UNK";
  const c = code.toUpperCase();
  if (c === "AVB") return "AVB";
  if (c === "EMP") return "EMP";
  return "UNK";
}

export function parseFilename(file: DriveImage): ParsedMenu {
  const base = file.name.replace(/\.[^/.]+$/, "");
  const parts = base.split("_");

  const rawStatus = parts.pop();         // AVB / EMP
  const priceStr = parts.pop();          // 7000
  const type = parts.pop() || "Unknown"; // Drinks
  const rawName = parts.join("_");

  const status = decodeStatus(rawStatus);
  const available = status === "AVB";

  const price = Number(priceStr) || 0;

  const displayName = rawName
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/_/g, " ");

  return {
    ...file,
    displayName,
    type,
    price,
    status,
    available,
  };
}
