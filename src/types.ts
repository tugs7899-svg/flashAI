export interface TrashScanResult {
  item_name: string;
  confidence: number;
  bin_color: "เหลือง" | "เขียว" | "น้ำเงิน" | "แดง";
  fun_message: string;
  scanned_at: string;
  imageUrl?: string;
}

export interface TrashBinInfo {
  color: "เหลือง" | "เขียว" | "น้ำเงิน" | "แดง";
  name: string;
  englishName: string;
  description: string;
  examples: string[];
  bgClass: string;
  borderClass: string;
  textClass: string;
  badgeBg: string;
  darkBgClass: string;
  iconName: string;
}

export interface TrashHistory {
  id: string;
  item_name: string;
  bin_color: "เหลือง" | "เขียว" | "น้ำเงิน" | "แดง";
  confidence: number;
  fun_message: string;
  scanned_at: string;
  imageUrl?: string;
}
