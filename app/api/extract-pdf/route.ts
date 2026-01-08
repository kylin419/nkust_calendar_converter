import PDFParser from "pdf2json";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) return NextResponse.json({ error: "無檔案" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfParser = new (PDFParser as any)(null, 1);

    return new Promise((resolve) => {
      pdfParser.on("pdfParser_dataError", (err: any) => {
        resolve(NextResponse.json({ error: "解析失敗" }, { status: 500 }));
      });

      pdfParser.on("pdfParser_dataReady", () => {
        // getRawTextContent() 會回傳純文字，非常適合解析課表內容
        const text = pdfParser.getRawTextContent();
        resolve(NextResponse.json({ text }));
      });

      pdfParser.parseBuffer(buffer);
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
