import React, { useState, useEffect, useRef } from "react";
import { 
  Recycle, 
  Leaf, 
  Trash2, 
  Flame, 
  Camera, 
  Upload, 
  History, 
  Info, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  AlertCircle, 
  RotateCcw, 
  Trash, 
  HelpCircle, 
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  TrendingUp,
  Award as CrownIcon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { TrashScanResult, TrashBinInfo, TrashHistory } from "./types";

const BIN_INFOS: Record<"เหลือง" | "เขียว" | "น้ำเงิน" | "แดง", TrashBinInfo> = {
  "เหลือง": {
    color: "เหลือง",
    name: "ขยะรีไซเคิล",
    englishName: "Recyclable Waste",
    description: "ขยะเหล่านี้นำไปขายหรือแปรรูปต่อเพื่อลดการสกัดทรัพยากรธรรมชาติใหม่ได้ มักนำกลับเข้าสู่กระบวนการโรงงานผลิตและหลอมซ้ำ",
    examples: ["ขวดพลาสติก PET ใส", "กระป๋องอลูมิเนียม", "เศษกระดาษลัง", "แก้วน้ำใส", "กระดาษหนังสือพิมพ์"],
    bgClass: "bg-amber-50 border-amber-200 text-amber-900",
    borderClass: "border-amber-300",
    textClass: "text-amber-800",
    badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
    darkBgClass: "bg-amber-500 text-white",
    iconName: "Recycle"
  },
  "เขียว": {
    color: "เขียว",
    name: "ขยะเปียก",
    englishName: "Organic / Biodegradable",
    description: "ขยะที่สามารถย่อยสลายได้ง่ายและรวดเร็ว เหมาะกับการคัดแยกนำไปกองทำปุ๋ยอินทรีย์ น้ำหมักชีวภาพ หรือเป็นอาหารสัตว์ในชุมชน",
    examples: ["เศษอาหารเหลือทาน", "เปลือกผลไม้", "เศษผักใบหญ้า", "เศษอาหารสัตว์", "เปลือกไข่สด"],
    bgClass: "bg-emerald-50 border-emerald-200 text-emerald-900",
    borderClass: "border-emerald-300",
    textClass: "text-emerald-800",
    badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
    darkBgClass: "bg-emerald-600 text-white",
    iconName: "Leaf"
  },
  "น้ำเงิน": {
    color: "น้ำเงิน",
    name: "ขยะทั่วไป",
    englishName: "General Waste",
    description: "ขยะที่มีคุณสมบัติย่อยสลายยาก ไม่เอื้อต่อการรีไซเคิลแบบประหยัด หรือไม่คุ้มค่าทางเศรษฐกิจ แต่ไม่มีสารเคมีปนเปื้อนเป็นพิษ",
    examples: ["กล่องโฟมเปื้อนอาหาร", "ซองขนมบะหมี่", "ถุงหิ้วพลาสติกสกปรก", "กระดาษทิชชู่ใช้แล้ว", "หลอดกาแฟพลาสติก"],
    bgClass: "bg-sky-50 border-sky-200 text-sky-900",
    borderClass: "border-sky-300",
    textClass: "text-sky-800",
    badgeBg: "bg-sky-100 text-sky-900 border-sky-300",
    darkBgClass: "bg-sky-600 text-white",
    iconName: "Trash2"
  },
  "แดง": {
    color: "แดง",
    name: "ขยะอันตราย",
    englishName: "Hazardous Waste",
    description: "ขยะที่ปนเปื้อนสารอันตราย วัตถุไวไฟ สารเคมีพิษ หรือสารกัดกร่อน ต้องคัดแยกเก็บให้มิดชิดเพื่อรอขนย้ายไปกำจัดอย่างถูกหลักกรรมวิธี",
    examples: ["ถ่านไฟฉายหมดอายุ", "หลอดไฟเสื่อมสภาพ", "แบตเตอรี่มือถือบวม", "กระป๋องสเปรย์", "ขวดยาฆ่าแมลง"],
    bgClass: "bg-red-50 border-red-200 text-red-900",
    borderClass: "border-red-300",
    textClass: "text-red-800",
    badgeBg: "bg-red-100 text-red-900 border-red-300",
    darkBgClass: "bg-red-600 text-white",
    iconName: "Flame"
  }
};

const RESULT_THEMES: Record<"เหลือง" | "เขียว" | "น้ำเงิน" | "แดง", {
  cardBg: string;
  cardBorder: string;
  textMain: string;
  textSecondary: string;
  badgeBorder: string;
  binColorHex: string;
  binDarkColorHex: string;
  binBgColor: string;
}> = {
  "เหลือง": {
    cardBg: "bg-[#FEF9C3]",
    cardBorder: "border-[#FDE68A]",
    textMain: "text-[#854D0E]",
    textSecondary: "text-[#713F12]",
    badgeBorder: "border-[#FDE68A]",
    binColorHex: "#EAB308",
    binDarkColorHex: "#CA8A04",
    binBgColor: "bg-[#EAB308]"
  },
  "เขียว": {
    cardBg: "bg-[#DCFCE7]",
    cardBorder: "border-[#BBF7D0]",
    textMain: "text-[#166534]",
    textSecondary: "text-[#14532D]",
    badgeBorder: "border-[#BBF7D0]",
    binColorHex: "#22C55E",
    binDarkColorHex: "#16A34A",
    binBgColor: "bg-[#22C55E]"
  },
  "น้ำเงิน": {
    cardBg: "bg-[#E0F2FE]",
    cardBorder: "border-[#BAE6FD]",
    textMain: "text-[#0369A1]",
    textSecondary: "text-[#0C4A6E]",
    badgeBorder: "border-[#BAE6FD]",
    binColorHex: "#3B82F6",
    binDarkColorHex: "#2563EB",
    binBgColor: "bg-[#3B82F6]"
  },
  "แดง": {
    cardBg: "bg-[#FEE2E2]",
    cardBorder: "border-[#FECACA]",
    textMain: "text-[#B91C1C]",
    textSecondary: "text-[#7F1D1D]",
    badgeBorder: "border-[#FECACA]",
    binColorHex: "#EF4444",
    binDarkColorHex: "#DC2626",
    binBgColor: "bg-[#EF4444]"
  }
};

export default function App() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [scanResult, setScanResult] = useState<TrashScanResult | null>(null);
  const [history, setHistory] = useState<TrashHistory[]>([]);
  const [activeTab, setActiveTab] = useState<"scan" | "guide" | "history">("scan");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [ecoPoints, setEcoPoints] = useState<number>(0);
  const [selectedGuideBin, setSelectedGuideBin] = useState<"เหลือง" | "เขียว" | "น้ำเงิน" | "แดง" | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Play micro synth sound effects to elevate UX
  const playAudioFeedback = (type: "click" | "success" | "error") => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      
      if (type === "click") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(450, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
        osc.start();
        osc.stop(ctx.currentTime + 0.08);
      } else if (type === "success") {
        // Double sweet environmental chime
        const now = ctx.currentTime;
        [523.25, 659.25, 783.99].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + idx * 0.08);
          gain.gain.setValueAtTime(0.04, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.15);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.15);
        });
      } else if (type === "error") {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(150, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(90, ctx.currentTime + 0.25);
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (e) {
      console.warn("Web Audio API is ignored or not supported", e);
    }
  };

  // Load localized points and history
  useEffect(() => {
    const savedHistory = localStorage.getItem("trash_scan_history");
    const savedPoints = localStorage.getItem("trash_eco_points");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error(e);
      }
    }
    if (savedPoints) {
      setEcoPoints(Number(savedPoints));
    }
  }, []);

  // Update loading step cycle texts
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isLoading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % 3);
      }, 1500);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [isLoading]);

  // Handle selected files (drag & drop / click selection)
  const processImageBytes = (file: File) => {
    // แสดงสถานะโหลดทันที เพื่อไม่ให้หน้าจอค้างระหว่างรอมือถือประมวลผลรูป
    setIsLoading(true);
    setErrorMessage(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // 1. กำหนดความกว้าง/ยาวสูงสุด (800px เพียงพอมากสำหรับให้ AI วิเคราะห์)
        const MAX_SIZE = 800;
        let width = img.width;
        let height = img.height;

        // 2. คำนวณสัดส่วนรูปภาพใหม่ไม่ให้เสียทรง
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }

        // 3. สร้าง Canvas เพื่อวาดรูปใหม่ที่เล็กลง
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          
          // 4. แปลงภาพเป็น JPEG และลดคุณภาพลงเหลือ 70% (0.7) เพื่อลดขนาดไฟล์ให้เล็กจิ๋ว (ประมาณ 100-200 KB)
          const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
          
          setImagePreview(compressedBase64);
          setScanResult(null);
          // ส่งภาพที่บีบอัดแล้วไปให้ AI
          triggerAIScan(compressedBase64, "image/jpeg");
        }
      };
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      setIsLoading(false);
      setErrorMessage("ไม่สามารถเปิดอ่านไฟล์รูปภาพได้สำเร็จ");
    };
    
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    playAudioFeedback("click");
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageBytes(files[0]);
    }
  };

  const triggerAIScan = async (base64Image: string, mimeType: string) => {
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const response = await fetch("/api/scan-trash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64Image, mimeType }),
      });

      if (!response.ok) {
        const errJson = await response.json();
        throw new Error(errJson.error || errJson.details || "เกิดข้อผิดพลาดในการรับข้อมูลจากเซิร์ฟเวอร์");
      }

      const result: TrashScanResult = await response.json();
      
      // Enforce model outputs validation mapping
      if (!result.bin_color || !["เหลือง", "เขียว", "น้ำเงิน", "แดง"].includes(result.bin_color)) {
        // Fallback or override just in case
        result.bin_color = "น้ำเงิน";
      }

      setScanResult(result);
      playAudioFeedback("success");

      // Auto update history
      const newHistoryItem: TrashHistory = {
        id: crypto.randomUUID(),
        item_name: result.item_name,
        bin_color: result.bin_color,
        confidence: result.confidence || 90,
        fun_message: result.fun_message,
        scanned_at: new Date().toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" }),
        imageUrl: base64Image
      };

      const updatedHistory = [newHistoryItem, ...history.slice(0, 19)];
      setHistory(updatedHistory);
      localStorage.setItem("trash_scan_history", JSON.stringify(updatedHistory));

      // Award Eco Green score points
      const extraPoints = result.confidence >= 90 ? 15 : 10;
      const newPointsCount = ecoPoints + extraPoints;
      setEcoPoints(newPointsCount);
      localStorage.setItem("trash_eco_points", String(newPointsCount));

    } catch (err: any) {
      playAudioFeedback("error");
      setErrorMessage(err?.message || "ไม่สามารถติดต่อกับเครื่องมือ AI ได้ กรุณาลองใหม่อีกครั้ง");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    playAudioFeedback("click");
    if (confirm("คุณแน่ใจหรือไม่ที่จะลบประวัติการแสกนทั้งหมดแอป?")) {
      setHistory([]);
      localStorage.removeItem("trash_scan_history");
      setEcoPoints(0);
      localStorage.removeItem("trash_eco_points");
    }
  };

  const getStepProgressText = () => {
    switch (loadingStep) {
      case 0: return "กำลังวิเคราะห์โครงร่างพื้นผิววัสดุ...";
      case 1: return "กำลังตรวจหาคู่สีถังขยะคู่ใจ...";
      case 2: return "AI กำลังสร้างสรรค์สโลแกนรักษ์โลก...";
      default: return "รอกลุ่ม AI ประมวลผลสักครู่...";
    }
  };

  const renderBinIcon = (color: "เหลือง" | "เขียว" | "น้ำเงิน" | "แดง", sizeClass = "w-6 h-6") => {
    switch (color) {
      case "เหลือง":
        return <Recycle className={`${sizeClass} text-amber-500`} id="icon-recycle" />;
      case "เขียว":
        return <Leaf className={`${sizeClass} text-emerald-500`} id="icon-leaf" />;
      case "น้ำเงิน":
        return <Trash2 className={`${sizeClass} text-sky-500`} id="icon-trash" />;
      case "แดง":
        return <Flame className={`${sizeClass} text-red-500`} id="icon-danger" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FBF9] flex flex-col antialiased text-[#344E41]" id="app-root">
      {/* Upper Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E5E9E5] py-3.5 px-4 shadow-sm" id="banner-header">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-[#588157] text-white p-2 rounded-xl shadow-sm">
              <Recycle className="w-6 h-6 animate-spin-slow" id="logo-icon" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#3A5A40]" id="app-title">AI Trash Sorter</h1>
              <p className="text-xs text-[#588157] font-medium">สแกนและแนะนำแยกถังขยะอัจฉริยะ</p>
            </div>
          </div>
          
          {/* Animated Eco Points */}
          <motion.div 
            className="flex items-center bg-[#F0F2F0] border border-[#DADED1] rounded-full py-1 px-3 space-x-1.5 shadow-xs text-[#3A5A40]"
            whileHover={{ scale: 1.05 }}
            id="eco-points-badge"
          >
            <CrownIcon className="w-4 h-4 text-[#588157]" />
            <span className="text-xs font-bold text-[#3A5A40]">
              {ecoPoints} <span className="font-normal text-[#588157]">คะแนน</span>
            </span>
          </motion.div>
        </div>
      </header>

      {/* Main Container framed like a Mobile Smartphone View on Desktops for cozy focus */}
      <main className="flex-grow w-full max-w-md mx-auto px-4 py-6 flex flex-col space-y-6" id="main-content-canvas">
        
        {/* Navigation Selector Tabs */}
        <div className="bg-[#E5E9E5]/70 p-1.5 rounded-2xl flex items-center w-full border border-[#DADED1]" id="navigation-tabs">
          <button 
            id="tab-scan"
            onClick={() => { playAudioFeedback("click"); setActiveTab("scan"); }}
            className={`flex-1 py-2 text-center text-sm font-bold rounded-xl transition-all duration-200 ${activeTab === 'scan' ? 'bg-[#588157] text-white shadow-xs' : 'text-[#344E41] hover:text-[#3A5A40]'}`}
          >
            สแกนขยะ
          </button>
          <button 
            id="tab-guide"
            onClick={() => { playAudioFeedback("click"); setActiveTab("guide"); }}
            className={`flex-1 py-2 text-center text-sm font-bold rounded-xl transition-all duration-200 ${activeTab === 'guide' ? 'bg-[#588157] text-white shadow-xs' : 'text-[#344E41] hover:text-[#3A5A40]'}`}
          >
            คู่มือสีถัง
          </button>
          <button 
            id="tab-history"
            onClick={() => { playAudioFeedback("click"); setActiveTab("history"); }}
            className={`flex-1 py-2 text-center text-sm font-bold rounded-xl transition-all duration-200 relative ${activeTab === 'history' ? 'bg-[#588157] text-white shadow-xs' : 'text-[#344E41] hover:text-[#3A5A40]'}`}
          >
            ประวัติสแกน
            {history.length > 0 && (
              <span className={`absolute top-1.5 right-2 w-2 h-2 rounded-full ring-2 ${activeTab === 'history' ? 'bg-white ring-[#588157]' : 'bg-[#588157] ring-[#E5E9E5]'}`} />
            )}
          </button>
        </div>

        {/* Tab content renders */}
        <div className="flex-grow" id="tab-outlet-box">
          <AnimatePresence mode="wait">
            
            {/* SCANNING WORKSPACE TAB */}
            {activeTab === "scan" && (
              <motion.div 
                key="scan-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                {/* Introductory ecological motivation header */}
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E9E5] flex items-start space-x-3" id="environmental-hero">
                  <div className="bg-[#F0F2F0] p-2.5 rounded-xl text-[#588157]">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-[#3A5A40]">เปลี่ยนขยะให้เป็นประโยชน์</h3>
                    <p className="text-xs text-[#588157] mt-0.5 leading-relaxed">
                      ถ่ายรูปสแกนเศษวัสดุ ถุงอาหาร หรือพลาสติก ด้วยโมเดล AI ทรงพลังระบบจะจำแนกและสอนวิธีทิ้งลงถังที่ถูกต้องอย่างรวดเร็ว
                    </p>
                  </div>
                </div>

                {/* Viewfinder or Camera Sandbox Canvas */}
                <div 
                  className="bg-[#F0F2F0] rounded-[40px] border-4 border-dashed border-[#DADED1] p-6 flex flex-col items-center justify-center text-center relative overflow-hidden aspect-square shadow-xs hover:border-[#588157] transition-colors duration-200 cursor-pointer group"
                  id="scanner-viewfinder"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    id="camera-input"
                    ref={fileInputRef} 
                    accept="image/*" 
                    capture="environment" 
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {imagePreview ? (
                    /* Display previews */
                    <div className="absolute inset-0 w-full h-full group" id="photo-preview-box">
                      <img 
                        src={imagePreview} 
                        alt="Trash preview" 
                        className="w-full h-full object-cover" 
                        referrerPolicy="no-referrer"
                      />
                      
                      {/* High-tech matrix visual scanners green line */}
                      {isLoading && (
                        <motion.div 
                          className="absolute left-0 right-0 h-1 bg-[#588157] shadow-xs z-20"
                          animate={{ top: ["0%", "100%", "0%"] }}
                          transition={{ repeat: Infinity, duration: 2.2, ease: "easeInOut" }}
                        />
                      )}
                      
                      {/* Dark shade inside preview screen on loading state */}
                      {isLoading && (
                        <div className="absolute inset-0 bg-[#344E41]/70 flex flex-col items-center justify-center space-y-4" id="viewfinder-loading-shade">
                          <div className="relative">
                            <div className="w-16 h-16 rounded-full border-4 border-[#588157] border-t-transparent animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Recycle className="w-6 h-6 text-[#588157] animate-pulse" />
                            </div>
                          </div>
                          <div className="px-4 text-center">
                            <p className="text-white font-medium text-sm animate-pulse">{getStepProgressText()}</p>
                            <p className="text-xs text-[#DADED1] mt-1">โมเดลประมวลผล Gemini 3.5 Flash</p>
                          </div>
                        </div>
                      )}

                      {/* Manual Overlay Trigger Buttons */}
                      {!isLoading && (
                        <div className="absolute bottom-4 inset-x-3 flex items-center justify-center" id="viewfinder-retrigger-group">
                          <button 
                            id="retake-button"
                            onClick={(e) => {
                              e.stopPropagation();
                              playAudioFeedback("click");
                              fileInputRef.current?.click();
                            }}
                            className="bg-[#588157] hover:bg-[#3A5A40] text-white font-bold text-xs py-2.5 px-5 rounded-full flex items-center space-x-1.5 shadow-lg backdrop-blur-xs transition-all active:scale-95"
                          >
                            <Camera className="w-4 h-4" />
                            <span>ถ่ายภาพแถบขยะใหม่</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* Blank camera selector state instructions */
                    <div className="flex flex-col items-center py-8" id="blank-camera-area">
                      <div className="w-20 h-20 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300 relative">
                        <Camera className="w-9 h-9 text-[#588157] relative z-10" />
                        <div className="absolute inset-0 rounded-full bg-[#588157]/10 animate-ping" />
                      </div>
                      
                      <h4 className="mt-6 text-base font-bold text-[#344E41]">แตะเพื่อถ่ายรูปขยะ</h4>
                      <p className="text-xs text-[#588157] mt-1.5 max-w-[240px] leading-relaxed">
                        เปิดใช้งานกล้องหลังมือถือเพื่อถ่ายรูปชิ้นวัตถุ หรือสแกนอัปโหลดจากคลังภาพ
                      </p>

                      <div className="mt-8 flex items-center space-x-2 bg-white/80 border border-[#E5E9E5] py-1.5 px-4 rounded-full text-[#588157] text-xs font-bold shadow-xs">
                        <Upload className="w-3.5 h-3.5" />
                        <span>รองรับการอัปโหลดไฟล์</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Error Indicator Panel */}
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start space-x-3"
                    id="scan-error-alert"
                  >
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-red-800">วิเคราะห์ข้อมูลล้มเหลว</h4>
                      <p className="text-xs text-red-600 mt-1 leading-relaxed">{errorMessage}</p>
                      <button 
                        id="retry-button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2.5 text-xs font-semibold text-red-800 hover:underline flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>ลองสแกนใหม่อีกซ้ำ</span>
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* ACTIVE SCANNED PRECISE RESULT DETAIL CARD */}
                {scanResult && !isLoading && (() => {
                  const theme = RESULT_THEMES[scanResult.bin_color];
                  const binInfo = BIN_INFOS[scanResult.bin_color];

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      id="active-result-card"
                      className={`overflow-hidden rounded-[40px] border p-6 flex flex-col space-y-5 shadow-xs transition-all duration-300 ${theme.cardBg} ${theme.cardBorder}`}
                    >
                      {/* Detailed Brand Header */}
                      <div className="flex justify-between items-start">
                        <div>
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMain} opacity-70`}>
                            ผลวิเคราะห์ขยะอัจฉริยะ
                          </span>
                          <h2 className={`text-3xl font-black tracking-tight leading-tight mt-1 ${theme.textMain}`}>
                            {scanResult.item_name}
                          </h2>
                        </div>
                        <div className={`bg-white/60 px-3.5 py-1.5 rounded-2xl border ${theme.cardBorder} flex flex-col items-center`}>
                          <span className={`text-xl font-bold ${theme.textMain}`}>{scanResult.confidence}%</span>
                          <span className="text-[9px] font-bold opacity-60 tracking-wider">มั่นใจ</span>
                        </div>
                      </div>

                      {/* Illustration and Advice center */}
                      <div className="flex flex-col items-center text-center py-2 space-y-4">
                        <div className="w-32 h-32 bg-white rounded-3xl shadow-inner flex items-center justify-center p-4 relative border border-white/50">
                          {/* Inner CSS Bin illustration matching the mock design style */}
                          <div className={`w-16 h-22 rounded-lg relative flex justify-center items-center shadow-md ${theme.binBgColor}`}>
                            {/* Lid lid bar */}
                            <div 
                              className="w-10 h-1.5 absolute top-1 rounded-full opacity-90"
                              style={{ backgroundColor: theme.binDarkColorHex }}
                            />
                            {/* Embedded matching icon representation */}
                            <div className="text-white opacity-95">
                              {renderBinIcon(scanResult.bin_color, "w-8 h-8 text-white")}
                            </div>
                          </div>
                        </div>

                        <div>
                          <div className={`text-lg font-black ${theme.textMain}`}>
                            ควรทิ้งที่: <span className="underline decoration-3 underline-offset-4">ถังสี{scanResult.bin_color} ({binInfo.name})</span>
                          </div>
                          <p className={`italic mt-2 text-xs font-bold leading-relaxed max-w-xs ${theme.textSecondary}`}>
                            "{scanResult.fun_message}"
                          </p>
                        </div>
                      </div>

                      {/* Educational information card segment */}
                      <div className="bg-white/45 rounded-2xl p-4 border border-white/40 space-y-3">
                        <div className="space-y-1">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMain} flex items-center space-x-1`}>
                            <Info className="w-3 h-3" />
                            <span>ข้อควรทราบ</span>
                          </span>
                          <p className={`text-[11px] leading-relaxed ${theme.textSecondary} font-medium`}>
                            {binInfo.description}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-black/5">
                          <span className={`text-[10px] font-bold uppercase tracking-widest ${theme.textMain}`}>
                            ตัวอย่างของชนิดนี้:
                          </span>
                          <div className="flex flex-wrap gap-1.5 mt-1.5">
                            {binInfo.examples.map((ex, idx) => (
                              <span 
                                key={idx} 
                                className={`bg-white/80 py-1 px-2.5 rounded-lg text-[10px] font-bold shadow-xs border ${theme.cardBorder} ${theme.textMain}`}
                              >
                                {ex}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Dynamic status log bar */}
                      <div className={`pt-3 border-t border-black/5 mt-auto flex items-center justify-between text-xs ${theme.textMain}`}>
                        <div className="flex items-center gap-2 font-bold text-[11px] opacity-90">
                          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: theme.binColorHex }} />
                          <span>ถังขยะ{binInfo.name}</span>
                        </div>
                        <span className="bg-[#588157] text-white rounded-lg py-1 px-2.5 font-sans font-black text-[10px] tracking-wide active:scale-95 transition-transform">
                          +{scanResult.confidence >= 90 ? 15 : 10} ECO POINTS!
                        </span>
                      </div>
                    </motion.div>
                  );
                })()}

              </motion.div>
            )}

            {/* EDUCATIONAL BIN DIRECTORY GUIDE TAB */}
            {activeTab === "guide" && (
              <motion.div 
                key="guide-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                <div className="bg-white rounded-2xl p-4 shadow-sm border border-[#E5E9E5] mb-2">
                  <h3 className="text-sm font-bold text-[#3A5A40]">คู่มือถังขยะ 4 ประเภทของประเทศไทย</h3>
                  <p className="text-xs text-[#588157] mt-1 leading-relaxed">
                    การทำความเข้าใจความสอดคล้องกันของสีถังขยะในชุมชน จะช่วยเพิ่มประสิทธิภาพในกระบวนการเดินทางต่อเพื่อกำจัดและนำวัสดุกลับมาสร้างคุณค่าใหม่
                  </p>
                </div>

                {/* 4 Colored list grids clickable to reveal detail bottom sheets-alike */}
                <div className="space-y-3" id="guide-bin-group">
                  {(Object.keys(BIN_INFOS) as Array<"เหลือง" | "เขียว" | "น้ำเงิน" | "แดง">).map((colorKey) => {
                    const bin = BIN_INFOS[colorKey];
                    const isSelected = selectedGuideBin === colorKey;
                    const theme = RESULT_THEMES[colorKey];

                    return (
                      <motion.div 
                        key={colorKey}
                        className={`rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs ${isSelected ? `${theme.cardBg} ${theme.cardBorder}` : 'border-[#DADED1] bg-white hover:border-[#588157]'}`}
                        id={`guide-card-${colorKey}`}
                        layout
                      >
                        {/* Header Panel click trigger */}
                        <div 
                           className="p-4 flex items-center justify-between cursor-pointer"
                           onClick={() => {
                             playAudioFeedback("click");
                             setSelectedGuideBin(isSelected ? null : colorKey);
                           }}
                        >
                          <div className="flex items-center space-x-3.5">
                            <div className={`p-2.5 rounded-xl ${isSelected ? 'bg-white shadow-sm' : 'bg-[#F0F2F0] text-[#588157]'}`}>
                              {renderBinIcon(colorKey, `w-6 h-6 ${isSelected ? '' : 'text-[#588157]'}`)}
                            </div>
                            <div>
                              <div className="flex items-center space-x-2">
                                <h4 className={`text-base font-bold ${isSelected ? theme.textMain : 'text-[#344E41]'}`}>
                                  ถังขยะ{bin.name}
                                </h4>
                                <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${isSelected ? 'bg-white/70' : 'bg-[#F0F2F0]'} ${theme.textMain}`}>
                                  สี{colorKey}
                                </span>
                              </div>
                              <p className={`text-xs font-medium mt-0.5 ${isSelected ? theme.textSecondary : 'text-[#588157]'}`}>{bin.englishName}</p>
                            </div>
                          </div>

                          <motion.div
                            animate={{ rotate: isSelected ? 90 : 0 }}
                            className={isSelected ? theme.textMain : "text-[#588157]"}
                          >
                            <ChevronRight className="w-5 h-5" />
                          </motion.div>
                        </div>

                        {/* Collapsible Details Panel */}
                        <AnimatePresence>
                          {isSelected && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              className="px-4 pb-4 border-t border-black/5"
                            >
                              <div className="pt-3 space-y-3 text-xs">
                                <p className={`leading-relaxed font-medium ${theme.textSecondary}`}>
                                  {bin.description}
                                </p>
                                
                                <div>
                                  <p className={`font-bold ${theme.textMain}`}>ตัวอย่างสิ่งของคัดแยกในถังสี{bin.color}:</p>
                                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                                    {bin.examples.map((item, idx) => (
                                      <span key={idx} className={`bg-white/80 font-bold border py-1 px-2.5 rounded-lg shadow-sm ${theme.textMain} ${theme.cardBorder}`}>
                                        {item}
                                      </span>
                                    ))}
                                  </div>
                                </div>

                                <div className="p-3 bg-white/40 rounded-xl border border-black/5 flex items-center space-x-2">
                                  <ShieldCheck className={`w-4 h-4 ${theme.textMain}`} />
                                  <span className={`font-bold ${theme.textSecondary}`}>เพิ่มความใส่ใจ ช่วยสิ่งแวดล้อมได้ยั่งยืน</span>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    );
                  })}
                </div>

                {/* FAQ section */}
                <div className="bg-[#E5E9E5]/50 border border-[#DADED1] rounded-2xl p-4 mt-6 space-y-3">
                  <h4 className="text-sm font-bold text-[#3A5A40] flex items-center space-x-2">
                    <HelpCircle className="w-4 h-4 text-[#588157]" />
                    <span>คำแนะนำเพิ่มเติมจากชุมชน</span>
                  </h4>
                  <ul className="space-y-2 text-xs text-[#344E41] leading-relaxed list-disc list-inside font-medium">
                    <li>ล้างขวดพลาสติกใสหรือแก้วน้ำก่อนทิ้ง เพื่อไม่ให้มีมดแมลงกวนใจในกระบวนการเก็บ</li>
                    <li>หากเป็นถุงแกงที่มีคราบมันค้างอยู่ ควรทิ้งลงขยะทั่วไปดีกว่าทิ้งลงในขยะรีไซเคิลเพราะสกปรกเกินกว่าจะทำความสะอาดหลอมซ้ำ</li>
                    <li>ถ่านไฟฉายและขั้วแบตเตอรี่ชำรุด ควรหุ้มด้วยกระดาษกาวก่อนทิ้งถังแดงเพื่อลดไฟฟ้าลัดวงจร</li>
                  </ul>
                </div>
              </motion.div>
            )}

            {/* LIVE SCANS HISTORY LIST TAB */}
            {activeTab === "history" && (
              <motion.div 
                key="history-tab"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between" id="history-header">
                  <div>
                    <h3 className="text-sm font-bold text-[#3A5A40]">ประวัติการสแกนส่วนบุคคล</h3>
                    <p className="text-xs text-[#588157] font-medium">บันทึกสะสมขยะที่คุณคัดแยกวันนี้</p>
                  </div>
                  {history.length > 0 && (
                    <button
                      id="clear-history-button"
                      onClick={handleClearHistory}
                      className="text-xs font-bold text-[#B91C1C] hover:bg-[#FEE2E2]/80 bg-[#FEE2E2] border border-[#FECACA] py-1.5 px-3.5 rounded-xl flex items-center space-x-1 transition-all active:scale-95"
                    >
                      <Trash className="w-3.5 h-3.5" />
                      <span>ลบทั้งหมด</span>
                    </button>
                  )}
                </div>

                {history.length > 0 ? (
                  <div className="space-y-3" id="history-items-list">
                    {history.map((item) => (
                      <div 
                        key={item.id}
                        className="bg-white rounded-2xl p-3 border border-[#E5E9E5] shadow-xs flex items-center justify-between"
                        id={`history-item-${item.id}`}
                      >
                        <div className="flex items-center space-x-3.5">
                          {/* Image preview in historical logs if present */}
                          <div className="w-12 h-12 rounded-xl bg-[#F0F2F0] overflow-hidden shrink-0 border border-[#DADED1]">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.item_name} 
                                className="w-full h-full object-cover" 
                                referrerPolicy="no-referrer"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Camera className="w-4 h-4 text-[#588157]" />
                              </div>
                            )}
                          </div>
                          
                          <div>
                            <h4 className="text-sm font-bold text-[#344E41]">{item.item_name}</h4>
                            <p className="text-[10px] text-[#588157] font-medium mt-0.5">สแกนเมื่อ {item.scanned_at}</p>
                            
                            <div className="flex items-center space-x-1.5 mt-1">
                              <span className={`w-2 h-2 rounded-full ${
                                item.bin_color === 'เหลือง' ? 'bg-[#EAB308]' :
                                item.bin_color === 'เขียว' ? 'bg-[#22C55E]' :
                                item.bin_color === 'น้ำเงิน' ? 'bg-[#3B82F6]' : 'bg-[#EF4444]'
                              }`} />
                              <span className="text-[10px] font-bold text-[#344E41]">
                                ถังขยะ{BIN_INFOS[item.bin_color].name}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end space-y-1">
                          <span className="text-[10px] font-bold bg-[#588157]/10 text-[#3A5A40] py-0.5 px-2 rounded-md border border-[#588157]/20 font-mono">
                            {item.confidence >= 90 ? "+15 pts" : "+10 pts"}
                          </span>
                          <span className="text-[9px] text-[#588157] font-bold">มั่นใจ {item.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  /* History is empty */
                  <div className="bg-white rounded-2xl p-8 border border-[#E5E9E5] text-center py-12" id="history-blank-box">
                    <div className="w-14 h-14 bg-[#F0F2F0] rounded-full flex items-center justify-center mx-auto text-[#588157]">
                      <History className="w-7 h-7" />
                    </div>
                    <h4 className="mt-4 text-sm font-bold text-[#344E41]">ยังไม่มีประวัติการคัดแยก</h4>
                    <p className="text-xs text-[#588157] mt-1.5 max-w-[200px] mx-auto leading-relaxed">
                      กล้องสแกนเพื่อจำแนกชิ้นวัตถุครั้งแรก แล้วขยะที่มีค่าจะสะสมประมวลรอยเท้าคาร์บอนที่นี่
                    </p>
                  </div>
                )}

                {/* Dashboard summary values */}
                <div className="bg-[#F0F2F0] rounded-2xl p-4 border border-[#DADED1] flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <TrendingUp className="w-4 h-4 text-[#588157]" />
                    <span className="text-xs text-[#3A5A40] font-bold">สรุปภารกิจสีเขียวของคุณ:</span>
                  </div>
                  <span className="text-xs bg-[#588157] text-white rounded-full py-0.5 px-3 font-bold">
                    คัดแยกชิ้นวัตถุสำเร็จ {history.length} รายการ
                  </span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </main>

      {/* Elegant, clean Footer */}
      <footer className="bg-white border-t border-[#E5E9E5] mt-auto py-5 text-center px-4" id="app-footer">
        <div className="max-w-md mx-auto space-y-2">
          <p className="text-xs text-[#588157] font-medium leading-relaxed" id="dev-project-description">
            โครงการชุมชนคัดแยกขยะอัจฉริยะวิจัยร่วมกัน พัฒนาบนแพลตฟอร์ม Google AI Studio
          </p>
          <div className="flex items-center justify-center space-x-3 text-[#344E41]/50 text-[10px] font-bold">
            <span>VERSION 1.0.0</span>
            <span>•</span>
            <span>GEMINI 3.5 FLASH ENGINE</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
