export interface TicketGeneratorOptions {
  ticketId: string;
  eventTitle: string;
  eventCategory?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  userName?: string;
  userEmail?: string;
  qrCodeValue?: string;
  svgElement?: SVGElement | null;
}

function loadSvgAsImage(svgEl: SVGElement): Promise<HTMLImageElement | null> {
  return new Promise((resolve) => {
    try {
      const svgData = new XMLSerializer().serializeToString(svgEl);
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgData);
    } catch (e) {
      resolve(null);
    }
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  if (!text) return [];
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = words[0] || "";

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const width = ctx.measureText(currentLine + " " + word).width;
    if (width < maxWidth) {
      currentLine += " " + word;
    } else {
      lines.push(currentLine);
      currentLine = word;
    }
  }
  lines.push(currentLine);
  return lines;
}

export async function downloadTicketPassImage(options: TicketGeneratorOptions): Promise<void> {
  const width = 800;
  const height = 1200;

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // 1. Outer canvas background (Dark Slate)
  ctx.fillStyle = "#090d16";
  ctx.fillRect(0, 0, width, height);

  // 2. Card bounds
  const cardX = 40;
  const cardY = 40;
  const cardW = 720;
  const cardH = 1120;
  const cardRadius = 32;

  // Draw white rounded card background
  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  // Outer border
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#e2e8f0";
  ctx.stroke();
  ctx.restore();

  // 3. Top Header Banner (Dark Indigo / Slate Gradient)
  const headerH = 160;
  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.clip();

  const gradient = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY + headerH);
  gradient.addColorStop(0, "#020617");
  gradient.addColorStop(1, "#1e1b4b");
  ctx.fillStyle = gradient;
  ctx.fillRect(cardX, cardY, cardW, headerH);

  // Header Logo: TickeX
  ctx.font = "bold 32px sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("Ticke", cardX + 40, cardY + 65);

  const tickeWidth = ctx.measureText("Ticke").width;
  ctx.fillStyle = "#f97316";
  ctx.fillText("X", cardX + 40 + tickeWidth, cardY + 65);

  // Subtitle
  ctx.font = "600 13px sans-serif";
  ctx.fillStyle = "#94a3b8";
  ctx.fillText("OFFICIAL DIGITAL TICKET PASS", cardX + 40, cardY + 95);

  // Category Badge Pill
  const catText = (options.eventCategory || "PASS").toUpperCase();
  ctx.font = "bold 14px sans-serif";
  const badgeWidth = ctx.measureText(catText).width + 32;
  const badgeX = cardX + cardW - 40 - badgeWidth;
  const badgeY = cardY + 45;

  ctx.fillStyle = "rgba(249, 115, 22, 0.2)";
  drawRoundedRect(ctx, badgeX, badgeY, badgeWidth, 34, 17);
  ctx.fill();
  ctx.lineWidth = 1.5;
  ctx.strokeStyle = "#f97316";
  ctx.stroke();

  ctx.fillStyle = "#ffedd5";
  ctx.textAlign = "center";
  ctx.fillText(catText, badgeX + badgeWidth / 2, badgeY + 22);
  ctx.textAlign = "left";
  ctx.restore();

  // 4. Main Body Content
  const bodyY = cardY + headerH + 45;

  // Event Title (With multi-line wrapping)
  ctx.font = "bold 34px sans-serif";
  ctx.fillStyle = "#0f172a";
  const maxTitleWidth = cardW - 80;
  const titleLines = wrapText(ctx, options.eventTitle, maxTitleWidth);

  let currentY = bodyY;
  titleLines.forEach((line) => {
    ctx.fillText(line, cardX + 40, currentY);
    currentY += 42;
  });

  currentY += 10;

  // Divider line
  ctx.beginPath();
  ctx.moveTo(cardX + 40, currentY);
  ctx.lineTo(cardX + cardW - 40, currentY);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#e2e8f0";
  ctx.stroke();

  currentY += 35;

  // Information Rows
  const drawInfoBlock = (label: string, value: string) => {
    ctx.font = "bold 12px sans-serif";
    ctx.fillStyle = "#f97316";
    ctx.fillText(label.toUpperCase(), cardX + 40, currentY);

    currentY += 24;
    ctx.font = "bold 20px sans-serif";
    ctx.fillStyle = "#1e293b";
    
    const valLines = wrapText(ctx, value, maxTitleWidth);
    valLines.forEach(vl => {
      ctx.fillText(vl, cardX + 40, currentY);
      currentY += 26;
    });

    currentY += 16;
  };

  if (options.eventDate) {
    const fullDate = options.eventTime ? `${options.eventDate} @ ${options.eventTime}` : options.eventDate;
    drawInfoBlock("Date & Time", fullDate);
  }

  if (options.eventLocation) {
    drawInfoBlock("Venue & Location", options.eventLocation);
  }

  if (options.userName) {
    drawInfoBlock("Ticket Holder", options.userName);
  }

  // 5. Tear Line & Cutout Notches at y = cardY + 750
  const tearY = cardY + 740;

  // Bottom stub background fill
  ctx.save();
  drawRoundedRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.clip();
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(cardX, tearY, cardW, cardY + cardH - tearY);

  // Dashed Tear Line
  ctx.beginPath();
  ctx.setLineDash([12, 8]);
  ctx.moveTo(cardX + 30, tearY);
  ctx.lineTo(cardX + cardW - 30, tearY);
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#cbd5e1";
  ctx.stroke();
  ctx.setLineDash([]);

  // Cutout notches
  ctx.fillStyle = "#090d16";
  ctx.beginPath();
  ctx.arc(cardX, tearY, 24, 0, Math.PI * 2);
  ctx.fill();

  ctx.beginPath();
  ctx.arc(cardX + cardW, tearY, 24, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 6. Bottom Stub: QR Code & Monospace ID
  const stubContentY = tearY + 35;

  // QR Box Container
  const qrBoxSize = 240;
  const qrBoxX = cardX + (cardW - qrBoxSize) / 2;
  const qrBoxY = stubContentY;

  ctx.save();
  drawRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, qrBoxSize, 20);
  ctx.fillStyle = "#ffffff";
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#e2e8f0";
  ctx.stroke();

  // Draw QR Image
  let qrImg: HTMLImageElement | null = null;
  if (options.svgElement) {
    qrImg = await loadSvgAsImage(options.svgElement);
  }

  if (qrImg) {
    ctx.drawImage(qrImg, qrBoxX + 15, qrBoxY + 15, qrBoxSize - 30, qrBoxSize - 30);
  }
  ctx.restore();

  // Ticket ID Monospace text below QR
  const idY = qrBoxY + qrBoxSize + 40;
  ctx.font = "bold 18px monospace";
  ctx.fillStyle = "#334155";
  ctx.textAlign = "center";
  const formattedId = `PASS ID: ${(options.ticketId || "VALID-TICKET").toUpperCase()}`;
  ctx.fillText(formattedId, cardX + cardW / 2, idY);

  // Security Note
  ctx.font = "600 12px sans-serif";
  ctx.fillStyle = "#64748b";
  ctx.fillText("PRESENT THIS DIGITAL PASS AT GATE ENTRANCE", cardX + cardW / 2, idY + 28);

  // 7. Trigger PNG Download & Mobile Share
  const dataUrl = canvas.toDataURL("image/png");
  const fileName = `TickeX-Pass-${(options.ticketId || "Ticket").substring(0, 8).toUpperCase()}.png`;

  const link = document.createElement("a");
  link.download = fileName;
  link.href = dataUrl;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Native Mobile Share fallback
  try {
    if (navigator.canShare && typeof fetch !== "undefined") {
      const response = await fetch(dataUrl);
      const blob = await response.blob();
      const file = new File([blob], fileName, { type: "image/png" });
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: "TickeX Pass",
          text: `Digital Ticket Pass for ${options.eventTitle}`,
          files: [file],
        });
      }
    }
  } catch (e) {
    // Ignore share cancellation/errors
  }
}
