import PDFParser from "pdf2json";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "未找到檔案" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfParser = new (PDFParser as any)(null, 1);
    return new Promise<NextResponse>((resolve) => {
      pdfParser.on("pdfParser_dataError", (errData: any) => {
        console.error("PDF 解析錯誤:", errData);
        resolve(NextResponse.json({ error: "解析 PDF 失敗" }, { status: 500 }));
      });

      pdfParser.on("pdfParser_dataReady", () => {
        const text = (pdfParser as any).getRawTextContent();
        resolve(NextResponse.json({ text }));
      });

      pdfParser.parseBuffer(buffer);
    });
  } catch (error: any) {
    console.error("伺服器錯誤:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
