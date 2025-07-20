import { PDFDocument, rgb, StandardFonts, degrees } from 'pdf-lib';
import { logger } from '../utils/logger';

interface WatermarkOptions {
  text: string;
  fontSize?: number;
  opacity?: number;
  color?: { r: number; g: number; b: number };
  angle?: number;
  position?: 'diagonal' | 'header' | 'footer' | 'center';
}

export async function addWatermarkToPDF(
  pdfBuffer: Buffer,
  options: WatermarkOptions
): Promise<Buffer> {
  try {
    const {
      text,
      fontSize = 50,
      opacity = 0.3,
      color = { r: 0.5, g: 0.5, b: 0.5 },
      angle = 45,
      position = 'diagonal'
    } = options;

    // Load the PDF
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add watermark to each page
    for (const page of pages) {
      const { width, height } = page.getSize();
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = font.heightAtSize(fontSize);

      let x = 0;
      let y = 0;
      let rotation = 0;

      switch (position) {
        case 'diagonal':
          // Center and rotate diagonally
          x = width / 2;
          y = height / 2;
          rotation = angle;
          break;
        case 'header':
          // Top center
          x = (width - textWidth) / 2;
          y = height - textHeight - 20;
          break;
        case 'footer':
          // Bottom center
          x = (width - textWidth) / 2;
          y = 20;
          break;
        case 'center':
          // Center without rotation
          x = (width - textWidth) / 2;
          y = (height - textHeight) / 2;
          break;
      }

      // Draw the watermark
      page.drawText(text, {
        x,
        y,
        size: fontSize,
        font,
        color: rgb(color.r, color.g, color.b),
        opacity,
        rotate: degrees(rotation),
      });
    }

    // Serialize the PDF
    const watermarkedPdfBytes = await pdfDoc.save();
    return Buffer.from(watermarkedPdfBytes);
  } catch (error) {
    logger.error('Error adding watermark to PDF:', error);
    throw new Error('Failed to add watermark to PDF');
  }
}

export async function addPerusalWatermark(
  pdfBuffer: Buffer,
  theaterName: string,
  licenseeEmail: string
): Promise<Buffer> {
  try {
    // First, add main watermark
    let watermarkedPdf = await addWatermarkToPDF(pdfBuffer, {
      text: 'PERUSAL COPY - NOT FOR PERFORMANCE',
      position: 'diagonal',
      fontSize: 60,
      opacity: 0.3,
      color: { r: 1, g: 0, b: 0 }, // Red
    });

    // Load the PDF again to add footer
    const pdfDoc = await PDFDocument.load(watermarkedPdf);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add footer to each page
    for (const page of pages) {
      const { width } = page.getSize();
      const footerText = `Licensed to: ${theaterName} (${licenseeEmail})`;
      const footerFontSize = 10;
      const textWidth = font.widthOfTextAtSize(footerText, footerFontSize);

      page.drawText(footerText, {
        x: (width - textWidth) / 2,
        y: 10,
        size: footerFontSize,
        font,
        color: rgb(0.3, 0.3, 0.3),
        opacity: 0.7,
      });
    }

    const finalPdfBytes = await pdfDoc.save();
    return Buffer.from(finalPdfBytes);
  } catch (error) {
    logger.error('Error adding perusal watermark:', error);
    throw new Error('Failed to add perusal watermark');
  }
}

export async function addLicenseWatermark(
  pdfBuffer: Buffer,
  licenseInfo: {
    theaterName: string;
    licenseeEmail: string;
    licenseType: string;
    licenseId: string;
    performanceDates?: string[];
  }
): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    const pages = pdfDoc.getPages();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    // Add header to first page only
    if (pages.length > 0) {
      const firstPage = pages[0];
      const { width, height } = firstPage.getSize();
      
      const headerLines = [
        `Licensed to: ${licenseInfo.theaterName}`,
        `License Type: ${licenseInfo.licenseType.toUpperCase()}`,
        `License ID: ${licenseInfo.licenseId}`,
      ];

      if (licenseInfo.performanceDates && licenseInfo.performanceDates.length > 0) {
        headerLines.push(`Performance Dates: ${licenseInfo.performanceDates.join(', ')}`);
      }

      let yPosition = height - 30;
      const fontSize = 9;

      for (const line of headerLines) {
        firstPage.drawText(line, {
          x: 30,
          y: yPosition,
          size: fontSize,
          font,
          color: rgb(0.2, 0.2, 0.2),
        });
        yPosition -= fontSize + 3;
      }
    }

    // Add subtle diagonal watermark to all pages
    const watermarkedPdf = await pdfDoc.save();
    
    return addWatermarkToPDF(Buffer.from(watermarkedPdf), {
      text: `${licenseInfo.theaterName} - ${licenseInfo.licenseId}`,
      position: 'diagonal',
      fontSize: 30,
      opacity: 0.1,
      color: { r: 0.7, g: 0.7, b: 0.7 },
    });
  } catch (error) {
    logger.error('Error adding license watermark:', error);
    throw new Error('Failed to add license watermark');
  }
}

// Utility function to protect PDF from editing
export async function protectPDF(
  pdfBuffer: Buffer,
  options?: {
    userPassword?: string;
    ownerPassword?: string;
    permissions?: {
      printing?: boolean;
      modifying?: boolean;
      copying?: boolean;
      annotating?: boolean;
    };
  }
): Promise<Buffer> {
  try {
    const pdfDoc = await PDFDocument.load(pdfBuffer);
    
    // Note: pdf-lib doesn't support password protection directly
    // This would require a different library like HummusJS or qpdf
    // For now, we'll just return the PDF as is
    // In production, you'd want to use a more robust solution
    
    logger.warn('PDF protection not implemented - returning unprotected PDF');
    return pdfBuffer;
  } catch (error) {
    logger.error('Error protecting PDF:', error);
    throw new Error('Failed to protect PDF');
  }
}