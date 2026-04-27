/**
 * Generates a high-quality PNG from the current state using the Canvas API.
 */
export const generateComicStrip = async (
  images: (string | null)[],
  title: string,
  watermark: string,
  backgroundColor: string,
  titleFont: string,
  borderColor: string,
  borderWidth: number
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Could not get canvas context'));
      return;
    }

    // Configuration for a 1:1 Square Export
    const CANVAS_SIZE = 1600;
    const PANEL_SIZE = 650;
    const GAP = 40;
    const GRID_SIZE = PANEL_SIZE * 2 + GAP;
    
    // Calculate offsets to center the grid
    const OFFSET_X = (CANVAS_SIZE - GRID_SIZE) / 2;
    // Push the grid down slightly to leave more room for title
    const OFFSET_Y = (CANVAS_SIZE - GRID_SIZE) / 2 + 40; 

    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // Background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

    // Draw Title (Centered in the top area)
    if (title) {
      ctx.fillStyle = '#1e293b'; // Slate-800
      ctx.font = `bold 90px "${titleFont}", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      // Position title in the middle of the top margin
      ctx.fillText(title, CANVAS_SIZE / 2, OFFSET_Y / 2);
    }

    // Draw Watermark (Bottom Left)
    if (watermark) {
      ctx.fillStyle = '#64748b'; // Slate-500
      ctx.font = 'bold 35px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(watermark, 60, CANVAS_SIZE - 60);
    }

    // Load and Draw Images
    const imageElements: HTMLImageElement[] = new Array(4).fill(null);
    let loadedCount = 0;

    const drawGrid = () => {
      images.forEach((_, i) => {
        const row = Math.floor(i / 2);
        const col = i % 2;
        const x = OFFSET_X + col * (PANEL_SIZE + GAP);
        const y = OFFSET_Y + row * (PANEL_SIZE + GAP);

        // Draw Panel Background
        ctx.fillStyle = '#f1f5f9'; // Slate-100
        ctx.fillRect(x, y, PANEL_SIZE, PANEL_SIZE);
        
        const img = imageElements[i];
        if (img) {
          const scale = Math.max(PANEL_SIZE / img.width, PANEL_SIZE / img.height);
          const w = img.width * scale;
          const h = img.height * scale;
          const left = x + (PANEL_SIZE - w) / 2;
          const top = y + (PANEL_SIZE - h) / 2;

          ctx.save();
          ctx.beginPath();
          ctx.rect(x, y, PANEL_SIZE, PANEL_SIZE);
          ctx.clip();
          ctx.drawImage(img, left, top, w, h);
          ctx.restore();
        } else {
          ctx.fillStyle = '#cbd5e1';
          ctx.font = 'bold 120px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText((i + 1).toString(), x + PANEL_SIZE / 2, y + PANEL_SIZE / 2);
        }

        // Draw Panel Border
        if (borderWidth > 0) {
          ctx.strokeStyle = borderColor;
          ctx.lineWidth = borderWidth;
          ctx.strokeRect(x, y, PANEL_SIZE, PANEL_SIZE);
        }
      });

      resolve(canvas.toDataURL('image/png'));
    };

    const activeImages = images.filter(Boolean);
    if (activeImages.length === 0) {
      drawGrid();
      return;
    }

    images.forEach((src, index) => {
      if (src) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          imageElements[index] = img;
          loadedCount++;
          if (loadedCount === activeImages.length) {
            drawGrid();
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === activeImages.length) {
            drawGrid();
          }
        };
        img.src = src;
      }
    });
  });
};