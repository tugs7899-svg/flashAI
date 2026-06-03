import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Body parser with 50mb limit for base64 images uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Initialize Gemini client (Lazy evaluation to avoid server startup crash if key missing)
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  };

  // API endpoints
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      hasApiKey: !!process.env.GEMINI_API_KEY,
    });
  });

  // POST endpoint to scan waste images
  app.post("/api/scan-trash", async (req, res) => {
    try {
      const { image, mimeType } = req.body;

      if (!image) {
        return res.status(400).json({ error: "กรุณาส่งรูปภาพขยะที่ต้องการสแกน" });
      }

      // Extract raw base64 data if it contains a data URI prefix
      let base64Data = image;
      let finalMimeType = mimeType || "image/jpeg";

      if (image.startsWith("data:")) {
        const matches = image.match(/^data:([^;]+);base64,(.+)$/);
        if (matches && matches.length === 3) {
          finalMimeType = matches[1];
          base64Data = matches[2];
        }
      }

      const ai = getGeminiClient();

      // System instruction for professional trash sifting rules
      const systemInstruction = 
        "คุณคือ 'ผู้เชี่ยวชาญการคัดแยกขยะและสิ่งแวดล้อม' หน้าที่ของคุณคือวิเคราะห์รูปภาพขยะที่ผู้ใช้อัปโหลดเข้ามา " +
        "แล้วระบุว่าขยะชิ้นนั้นคืออะไร และต้องแยกทิ้งลงถังขยะสีอะไรตามมาตรฐานข้อกำหนดการจัดการขยะในประเทศไทยอย่างเป็นขั้นเป็นตอน\n\n" +
        "กฎในการระบุสีถังขยะหลัก 4 ประเภท:\n" +
        "- 'เหลือง' สำหรับ ขยะรีไซเคิล (เช่น ขวดเครื่องดื่มพลาสติก, ขวดแก้ว, กระดาษกล่อง, กระป๋องอลูมิเนียม, ซองจดหมาย)\n" +
        "- 'เขียว' สำหรับ ขยะเปียก/ขยะอินทรีย์ย่อยสลายง่าย (เช่น เศษอาหาร, เปลือกผลไม้, ซากสลัด, หัวหอม, เศษผัก)\n" +
        "- 'น้ำเงิน' สำหรับ ขยะทั่วไป ที่ไม่เหมาะสมกับการรีไซเคิลแต่ไม่มีอันตราย (เช่น กล่องโฟมบรรจุอาหาร, ซองบะหมี่, ถุงขนมขบเคี้ยว, เปลือกไข่, ทิชชู่เช็ดสกปรก)\n" +
        "- 'แดง' สำหรับ ขยะอันตราย (เช่น ถ่านไฟฉาย, แบตเตอรี่, หลอดไฟแสงสว่าง, หลอดไฟฟลูออเรสเซนต์, ยาหมดอายุ, เครื่องสำอางเคมี, กระป๋องสีสเปรย์)\n\n" +
        "กรุณาตอบกลับเป็นรูปแบบ JSON เสมอ และกรอกข้อมูลให้ครบถ้วนในภาษาไทย";

      const imagePart = {
        inlineData: {
          mimeType: finalMimeType,
          data: base64Data,
        },
      };

      const promptPart = {
        text: "วิเคราะห์ภาพขยะชิ้นนี้ ค้นหาว่าเป็นวัตถุประเภทใด และบอกสีถังขยะที่ถูกต้องที่สุดตามระบบขยะประเทศไทย",
      };

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: { parts: [imagePart, promptPart] },
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              item_name: {
                type: Type.STRING,
                description: "ชื่อสิ่งของในขยะนั้นเป็นไทยให้ชัดเจน เช่น 'ขวดพลาสติกใสบรรจุน้ำ', 'เปลือกกล้วยหอม', 'ซองมันฝรั่งทอดกรอบ', 'หลอดนีออนเสื่อมสภาพ'"
              },
              confidence: {
                type: Type.INTEGER,
                description: "ระดับความมั่นใจในการประเมินและคัดแยกเป็นเปอร์เซ็นต์ (0 - 100)"
              },
              bin_color: {
                type: Type.STRING,
                description: "สีถังขยะปลายทางสำหรับประเทศไทย ต้องเป็นค่าใดค่าหนึ่งใน 4 สีนี้เท่านั้น: 'เหลือง', 'เขียว', 'น้ำเงิน', 'แดง'"
              },
              fun_message: {
                type: Type.STRING,
                description: "ข้อความภาษาไทยสั้นๆ ชักชวนให้ทิ้งวัตถุชิ้นนี้ลงถังขยะดังกล่าวอย่างสนุกสนาน เป็นมิตร และสุภาพ"
              }
            },
            required: ["item_name", "confidence", "bin_color", "fun_message"]
          }
        }
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText.trim());

      res.json(parsedData);
    } catch (error: any) {
      console.error("Error processing scan-trash:", error);
      res.status(500).json({ 
        error: "เกิดข้อผิดพลาดในการรันระบบแยกขยะอัจฉริยะด้วย AI", 
        details: error?.message || String(error)
      });
    }
  });

  // Vite dev server vs static serving middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer();
