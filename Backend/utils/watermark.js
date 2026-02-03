import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a watermark SVG with "Auric Krystal" branding
const createWatermarkSvg = (width, height) => {
    const base = Math.min(width, height);
    const fontSize = Math.max(26, base / 12);
    const centerFontSize = Math.max(40, base / 7.5);
    const textX = width / 2;
    const textY = height / 2;
    const patternW = fontSize * 8;
    const patternH = fontSize * 4.2;

    return `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <pattern id="wm-pattern" width="${patternW}" height="${patternH}" patternUnits="userSpaceOnUse">
                    <g transform="rotate(-30 ${patternW / 2} ${patternH / 2})">
                        <text x="${patternW / 2}" y="${patternH / 2}"
                              font-size="${fontSize}"
                              font-weight="700"
                              font-family="Arial, sans-serif"
                              fill="rgba(255,255,255,0.35)"
                              stroke="rgba(0,0,0,0.35)"
                              stroke-width="2"
                              text-anchor="middle"
                              dominant-baseline="middle"
                              letter-spacing="2">Auric Krystal</text>
                    </g>
                </pattern>
            </defs>

            <!-- Repeated diagonal pattern -->
            <rect x="0" y="0" width="100%" height="100%" fill="url(#wm-pattern)" />

            <!-- Center watermark mark for clarity -->
            <g>
                <circle cx="${textX}" cy="${textY}" r="${centerFontSize * 1.2}" fill="rgba(0,0,0,0.28)" />
                <text x="${textX}" y="${textY}"
                      font-size="${centerFontSize}"
                      font-weight="800"
                      font-family="Arial, sans-serif"
                      fill="rgba(255,255,255,0.75)"
                      stroke="rgba(0,0,0,0.55)"
                      stroke-width="3"
                      text-anchor="middle"
                      dominant-baseline="middle"
                      letter-spacing="3">Auric Krystal</text>
            </g>
        </svg>
    `;
};

/**
 * Apply watermark to an image
 * @param {string} inputPath - Path to the input image
 * @param {string} outputPath - Path to save the watermarked image
 * @returns {Promise<boolean>} - Returns true if successful
 */
export const applyWatermark = async (inputPath, outputPath) => {
    try {
        // Read the image and get its metadata
        const image = sharp(inputPath);
        const metadata = await image.metadata();
        
        const { width, height } = metadata;
        
        // Create watermark SVG
        const watermarkSvg = createWatermarkSvg(width, height);
        
        // Convert SVG to buffer
        const watermarkBuffer = Buffer.from(watermarkSvg);
        
        // Apply watermark and save
        await image
            .composite([
                {
                    input: watermarkBuffer,
                    top: 0,
                    left: 0,
                }
            ])
            .toFile(outputPath);
        
        return true;
    } catch (error) {
        console.error('Watermark error:', error);
        throw new Error(`Failed to apply watermark: ${error.message}`);
    }
};

/**
 * Apply watermark to image and replace the original
 * @param {string} imagePath - Path to the image file
 * @returns {Promise<boolean>} - Returns true if successful
 */
export const applyWatermarkInPlace = async (imagePath) => {
    try {
        const tempPath = `${imagePath}.temp`;
        
        // Apply watermark to a temporary file
        await applyWatermark(imagePath, tempPath);
        
        // Replace original with watermarked version
        fs.unlinkSync(imagePath);
        fs.renameSync(tempPath, imagePath);
        
        return true;
    } catch (error) {
        // Clean up temp file if it exists
        const tempPath = `${imagePath}.temp`;
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
        }
        throw error;
    }
};

export default {
    applyWatermark,
    applyWatermarkInPlace,
    createWatermarkSvg
};
