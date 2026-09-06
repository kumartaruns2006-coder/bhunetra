import { ExtractedDocumentFields, AiProcessingStep } from '../types/document';

export interface IDocumentAiEngine {
  processDocument(
    file: File | { name: string; size?: number },
    onProgress: (step: AiProcessingStep, percentage: number, message: string) => void
  ): Promise<ExtractedDocumentFields>;
}

// Tesseract-ready architecture bridge
class TesseractBridgeAdapter implements IDocumentAiEngine {
  private hasNativeTesseract(): boolean {
    return typeof window !== 'undefined' && ('Tesseract' in window || (window as any).__tesseractWorker);
  }

  public async processDocument(
    file: File | { name: string; size?: number },
    onProgress: (step: AiProcessingStep, percentage: number, message: string) => void
  ): Promise<ExtractedDocumentFields> {
    // If native Tesseract.js worker is registered in window, it can be plugged in here.
    if (this.hasNativeTesseract()) {
      try {
        onProgress('OCR', 30, 'Tesseract.js native WASM worker recognizing characters...');
      } catch (e) {
        console.warn('Native Tesseract invocation error, falling back to simulated neural engine', e);
      }
    }

    // Step 1: Upload (0 -> 20%)
    onProgress('UPLOAD', 15, `Streaming document payload [${file.name}] into NIC isolated sandbox...`);
    await new Promise(r => setTimeout(r, 400));

    // Step 2: OCR (20 -> 45%)
    onProgress('OCR', 35, 'Executing Optical Character Recognition & De-skewing algorithm...');
    await new Promise(r => setTimeout(r, 500));

    // Step 3: Classification (45 -> 65%)
    onProgress('CLASSIFICATION', 55, 'Classifying statutory document category under RFCTLARR / NH Act...');
    await new Promise(r => setTimeout(r, 450));

    // Step 4: Field extraction (65 -> 85%)
    onProgress('FIELD_EXTRACTION', 75, 'Extracting 7 mandatory entities: Document Type, Project, Parcel, Khasra, Date, Area, Amount...');
    await new Promise(r => setTimeout(r, 500));

    // Step 5: Validation (85 -> 95%)
    onProgress('VALIDATION', 90, 'Validating mathematical circle rate multiplier and cross-checking Khatiyan...');
    await new Promise(r => setTimeout(r, 350));

    // Step 6: Link to project/parcel (95 -> 100%)
    onProgress('LINK_PARCEL', 100, 'Linking extracted metadata with Patna Ring Road Project & Parcel K-125/2...');
    await new Promise(r => setTimeout(r, 300));

    // Determine tailored results based on file name or generic fallback
    const fileName = file.name.toLowerCase();

    if (fileName.includes('award') || fileName.includes('125') || fileName.includes('1252')) {
      return {
        documentType: { value: 'Section 3G Compensation Award Decree', confidence: 98.4, verified: true },
        projectId: { value: 'PRR-PH2-2026 (Patna Ring Road Phase II)', confidence: 99.1, verified: true },
        parcelId: { value: 'K-125/2', confidence: 97.2, verified: true },
        khasra: { value: '125/2 (Mauza Kanhauli)', confidence: 96.8, verified: true },
        date: { value: '2026-03-01', confidence: 95.5, verified: true },
        area: { value: '0.48 Hectares (4,800 m²)', confidence: 94.8, verified: true },
        amount: { value: '₹4,98,39,800 (including 100% solatium)', confidence: 97.6, verified: true },
        overallConfidence: 96.5
      };
    }

    if (fileName.includes('gazette') || fileName.includes('notification') || fileName.includes('3a')) {
      return {
        documentType: { value: 'Section 3A Preliminary Gazette Notification', confidence: 99.0, verified: true },
        projectId: { value: 'PRR-PH2-2026 (Patna Ring Road Expansion)', confidence: 98.5, verified: true },
        parcelId: { value: 'Corridor Alignment Schedule', confidence: 95.0, verified: true },
        khasra: { value: 'Mauza Kanhauli, Naubatpur & Danapur', confidence: 96.2, verified: true },
        date: { value: '2024-04-12', confidence: 98.2, verified: true },
        area: { value: '340.0 Hectares (RoW 60m)', confidence: 94.0, verified: true },
        amount: { value: 'Preliminary Statutory Notice (N/A)', confidence: 99.5, verified: true },
        overallConfidence: 97.2
      };
    }

    // Generic realistic document extraction
    return {
      documentType: { value: 'Cadastral Khatiyan & Jamabandi RoR Extract', confidence: 96.5, verified: true },
      projectId: { value: 'PRR-PH2-2026 (Patna Ring Road)', confidence: 97.0, verified: true },
      parcelId: { value: 'K-412/1', confidence: 95.8, verified: true },
      khasra: { value: '412/1 (Kanhauli Bihta)', confidence: 95.2, verified: true },
      date: { value: '2025-11-20', confidence: 94.3, verified: true },
      area: { value: '0.62 Hectares (6,200 m²)', confidence: 93.9, verified: true },
      amount: { value: '₹1,98,40,000', confidence: 95.1, verified: true },
      overallConfidence: 95.4
    };
  }
}

export const documentAiService: IDocumentAiEngine = new TesseractBridgeAdapter();

export const DOCUMENT_AI_DISCLAIMER = 
  "DEMONSTRATION AI ENGINE: Simulated OCR & entity extraction for prototype demonstration. Not an official legal certification under the Indian Evidence Act or Revenue Court Rules.";
