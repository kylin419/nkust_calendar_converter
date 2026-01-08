import { NextRequest, NextResponse } from "next/server";
import * as pdfjs from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextContent, TextItem } from "pdfjs-dist/types/src/display/api";
import "pdfjs-dist/legacy/build/pdf.worker.mjs";

function isTextItem(item: unknown): item is TextItem {
  return typeof item === "object" && item !== null && "str" in item;
}
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "尚未選擇 PDF 檔案" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();

    const loadingTask = pdfjs.getDocument({
      data: arrayBuffer,
      useSystemFonts: true,
      disableFontFace: true,
    });

    const pdf = await loadingTask.promise;
    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent: TextContent = await page.getTextContent();

      const pageText = textContent.items
        .filter(isTextItem)
        .map((item) => item.str)
        .join(" ");

      fullText += pageText + "\n";
    }

    return NextResponse.json({ text: fullText });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "未知錯誤";
    console.error("PDF 解析失敗:", errorMessage);
    return NextResponse.json(
      { error: `解析失敗: ${errorMessage}` },
      { status: 500 }
    );
  }
}
