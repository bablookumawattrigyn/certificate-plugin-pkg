import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

/**
 * Preloads all images inside an element to ensure they're available for canvas capture.
 * Converts cross-origin images to data URLs to avoid CORS issues with html2canvas.
 */
async function preloadImages(element: HTMLElement): Promise<void> {
  const images = element.querySelectorAll('img');
  const promises = Array.from(images).map(async (img) => {
    if (!img.src || img.complete) return;

    // For cross-origin images, convert to data URL
    if (img.src.startsWith('http') && !img.src.startsWith(window.location.origin)) {
      try {
        const response = await fetch(img.src, { mode: 'cors' });
        const blob = await response.blob();
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(blob);
        });
        img.src = dataUrl;
      } catch {
        // If fetch fails, try loading normally
        await new Promise<void>((resolve) => {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        });
      }
    } else {
      // Wait for local images to load
      await new Promise<void>((resolve) => {
        if (img.complete) {
          resolve();
        } else {
          img.onload = () => resolve();
          img.onerror = () => resolve();
        }
      });
    }
  });

  await Promise.all(promises);
}

/**
 * Captures a DOM element as a PDF and triggers download.
 * Uses landscape orientation matching certificate layout.
 */
export async function downloadElementAsPdf(
  element: HTMLElement,
  filename: string = 'certificate-template.pdf',
  paperSize: 'A5' | 'A4' | 'A3' = 'A4'
): Promise<void> {
  // Preload all images first
  await preloadImages(element);

  // Small delay to ensure images are rendered
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Capture the element as a canvas
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    imageTimeout: 15000,
  });

  // Paper dimensions in mm (landscape)
  const paperDimensions = {
    A5: { width: 210, height: 148 },
    A4: { width: 297, height: 210 },
    A3: { width: 420, height: 297 },
  };

  const { width, height } = paperDimensions[paperSize];

  // Create PDF in landscape
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: paperSize.toLowerCase() as 'a3' | 'a4' | 'a5',
  });

  // Convert canvas to image and fit to page
  const imgData = canvas.toDataURL('image/png');
  pdf.addImage(imgData, 'PNG', 0, 0, width, height);

  // Download
  pdf.save(filename);
}
