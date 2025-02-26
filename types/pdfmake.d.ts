// types/pdfmake.d.ts
declare module "pdfmake/build/pdfmake" {
  interface TDocumentDefinitions {
    content: any;
    styles?: Record<string, any>;
    defaultStyle?: Record<string, any>;
    pageSize?: string | { width: number; height: number };
    pageMargins?: [number, number, number, number];
    header?: any;
    footer?: any;
    [key: string]: any;
  }

  interface TFontFamilyTypes {
    [key: string]: {
      normal?: string;
      bold?: string;
      italics?: string;
      bolditalics?: string;
    };
  }

  interface PdfMakeStatic {
    vfs: Record<string, string>;
    fonts: TFontFamilyTypes;
    createPdf(documentDefinition: TDocumentDefinitions): {
      download: (filename: string) => void;
      getBase64: (callback: (base64: string) => void) => void;
      getBuffer: (callback: (buffer: Uint8Array) => void) => void;
      getBlob: (callback: (blob: Blob) => void) => void;
      getDataUrl: (callback: (dataUrl: string) => void) => void;
    };
  }

  const pdfMake: PdfMakeStatic;
  export default pdfMake;
}

declare module "pdfmake/build/vfs_fonts" {
  import pdfMake from "pdfmake/build/pdfmake";

  const pdfFonts: {
    pdfMake: {
      vfs: Record<string, string>;
    };
  };

  export default pdfFonts;
}
