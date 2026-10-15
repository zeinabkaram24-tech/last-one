import { createCanvas, GlobalFonts } from '@napi-rs/canvas';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

// Register fonts
GlobalFonts.registerFromPath('/tmp/Amiri-Bold.ttf', 'AmiriBold');
GlobalFonts.registerFromPath('/tmp/Amiri-Regular.ttf', 'Amiri');

const W = 2480;
const H = 3508;

function drawPageBorder(ctx: any) {
  // Outer double border
  ctx.strokeStyle = '#0284c7'; // Sky/Blue school tone
  ctx.lineWidth = 14;
  ctx.strokeRect(60, 60, W - 120, H - 120);

  ctx.strokeStyle = '#0369a1';
  ctx.lineWidth = 4;
  ctx.strokeRect(84, 84, W - 168, H - 168);

  // Decorative corner accents
  const corners = [
    [60, 60],
    [W - 60, 60],
    [60, H - 60],
    [W - 60, H - 60],
  ];
  ctx.fillStyle = '#0284c7';
  for (const [cx, cy] of corners) {
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawHeader(ctx: any, pageNum: number) {
  // School and Ministry info header
  ctx.fillStyle = '#0f172a';
  ctx.font = '38px AmiriBold';
  ctx.textAlign = 'right';
  ctx.direction = 'rtl';

  ctx.fillText('جمهورية مصر العربية', W - 120, 150);
  ctx.fillText('وزارة التربية والتعليم والتعليم الفني', W - 120, 205);
  ctx.fillText('مدرسة النيل المصرية الدولية - فرع المنيا', W - 120, 260);

  // Left side: Student metadata box
  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.font = '36px Amiri';
  ctx.fillText('Grade 2 — Social Studies', 120, 150);
  ctx.fillText('Block (2) — Unit (2) Homework 1', 120, 205);
  ctx.fillText('Time Allowed: 10 Minutes', 120, 260);

  // Center title badge
  ctx.save();
  ctx.fillStyle = '#f0f9ff';
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 4;
  ctx.beginPath();
  // Rounded rect for badge
  const bx = W / 2 - 420;
  const by = 110;
  const bw = 840;
  const bh = 170;
  const r = 24;
  ctx.roundRect(bx, by, bw, bh, r);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#0369a1';
  ctx.font = '50px AmiriBold';
  ctx.textAlign = 'center';
  ctx.fillText('شيت واجب الدراسات الاجتماعية', W / 2, 185);

  ctx.fillStyle = '#0f172a';
  ctx.font = '36px AmiriBold';
  ctx.fillText('درس: الاتجاهات الأصلية ووردة البوصلة', W / 2, 245);
  ctx.restore();

  // Divider line
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(120, 310);
  ctx.lineTo(W - 120, 310);
  ctx.stroke();

  // Student info bar
  ctx.fillStyle = '#f8fafc';
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.fillRect(120, 330, W - 240, 90);
  ctx.strokeRect(120, 330, W - 240, 90);

  ctx.fillStyle = '#1e293b';
  ctx.font = '34px AmiriBold';
  ctx.textAlign = 'right';
  ctx.direction = 'rtl';
  ctx.fillText('اسم الطالب: .............................................................', W - 160, 390);
  ctx.fillText('الفصل: ................... ( 2A / 2B / 2C )', W - 1300, 390);
  ctx.fillText('الدرجة: [      / 10 ]', 350, 390);
}

function drawFooter(ctx: any, pageNum: number, totalPages: number) {
  // Footer divider
  ctx.strokeStyle = '#cbd5e1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(120, H - 160);
  ctx.lineTo(W - 120, H - 160);
  ctx.stroke();

  ctx.fillStyle = '#64748b';
  ctx.font = '30px Amiri';
  ctx.textAlign = 'right';
  ctx.direction = 'rtl';
  ctx.fillText('مادة الدراسات الاجتماعية — الصف الثاني الابتدائي (Block 2 Week 1)', W - 140, H - 110);

  ctx.textAlign = 'left';
  ctx.direction = 'ltr';
  ctx.fillText(`الصفحة ${pageNum} من ${totalPages}`, 140, H - 110);
}

// Draw a beautiful vector Compass Rose with 4 arrows and student entry boxes
function drawCompassRose(ctx: any, cx: number, cy: number, radius: number) {
  ctx.save();

  // Outer circles
  ctx.strokeStyle = '#0284c7';
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, radius * 0.72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Compass Rose 8-point star points
  // 4 Main Cardinal Points (North, South, East, West)
  const mainPoints = [
    { angle: -Math.PI / 2, label: 'N', color: '#dc2626' }, // North (Red pointer)
    { angle: Math.PI / 2, label: 'S', color: '#0284c7' },  // South
    { angle: 0, label: 'E', color: '#0284c7' },           // East
    { angle: Math.PI, label: 'W', color: '#0284c7' },      // West
  ];

  // Secondary 45 degree sub points
  for (let i = 0; i < 4; i++) {
    const angle = -Math.PI / 4 + (i * Math.PI) / 2;
    const len = radius * 0.65;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(angle);

    // Left half (shaded)
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.lineTo(-len * 0.15, 0);
    ctx.closePath();
    ctx.fill();

    // Right half (white)
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.lineTo(len * 0.15, 0);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }

  // Draw 4 Main Cardinal arrows
  for (const pt of mainPoints) {
    const len = radius * 0.95;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(pt.angle + Math.PI / 2); // rotate so top is 0

    // Left half (color)
    ctx.fillStyle = pt.color;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.lineTo(-len * 0.22, 0);
    ctx.closePath();
    ctx.fill();

    // Right half (darker/white)
    ctx.fillStyle = pt.color === '#dc2626' ? '#991b1b' : '#0369a1';
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -len);
    ctx.lineTo(len * 0.22, 0);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }

  // Center hub
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(cx, cy, 32, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#0369a1';
  ctx.lineWidth = 5;
  ctx.stroke();

  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  ctx.arc(cx, cy, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  // Helper to draw input answer box for students
  function drawAnswerBox(boxX: number, boxY: number, boxW: number, boxH: number, hint: string) {
    ctx.save();
    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.roundRect(boxX, boxY, boxW, boxH, 16);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#94a3b8';
    ctx.font = '32px Amiri';
    ctx.textAlign = 'center';
    ctx.fillText(hint, boxX + boxW / 2, boxY + boxH / 2 + 10);
    ctx.restore();
  }

  // Boxes around Compass Rose
  const bw = 260;
  const bh = 80;

  // North (Above)
  drawAnswerBox(cx - bw / 2, cy - radius - 110, bw, bh, '( ..................... )');
  // South (Below)
  drawAnswerBox(cx - bw / 2, cy + radius + 30, bw, bh, '( ..................... )');
  // East (Right)
  drawAnswerBox(cx + radius + 30, cy - bh / 2, bw, bh, '( ..................... )');
  // West (Left)
  drawAnswerBox(cx - radius - bw - 30, cy - bh / 2, bw, bh, '( ..................... )');
}

export async function generateWorksheetPdf(): Promise<string> {
  const doc = await PDFDocument.create();

  // PAGE 1
  const canvas1 = createCanvas(W, H);
  const ctx1 = canvas1.getContext('2d');
  ctx1.fillStyle = '#ffffff';
  ctx1.fillRect(0, 0, W, H);

  drawPageBorder(ctx1);
  drawHeader(ctx1, 1);

  // Question 1 banner
  ctx1.save();
  ctx1.fillStyle = '#0284c7';
  ctx1.roundRect(120, 460, W - 240, 75, 16);
  ctx1.fill();

  ctx1.fillStyle = '#ffffff';
  ctx1.font = '40px AmiriBold';
  ctx1.textAlign = 'right';
  ctx1.direction = 'rtl';
  ctx1.fillText('السؤال الأول: (4 درجات)', W - 160, 515);

  ctx1.fillStyle = '#0f172a';
  ctx1.font = '38px AmiriBold';
  ctx1.fillText(
    'أمامك رسم توضيحي لـ "وردة البوصلة". اكتب الاتجاهات الأصلية الأربعة في مكانها الصحيح:',
    W - 140,
    590
  );

  // Options pill box
  ctx1.fillStyle = '#f0fdf4';
  ctx1.strokeStyle = '#22c55e';
  ctx1.lineWidth = 3;
  ctx1.roundRect(W / 2 - 500, 630, 1000, 80, 20);
  ctx1.fill();
  ctx1.stroke();

  ctx1.fillStyle = '#15803d';
  ctx1.font = '40px AmiriBold';
  ctx1.textAlign = 'center';
  ctx1.fillText('【 الشَّمَال   —   الجَنُوب   —   الشَّرْق   —   الغَرْب 】', W / 2, 685);
  ctx1.restore();

  // Draw Compass Rose in Center
  drawCompassRose(ctx1, W / 2, 1200, 360);

  // Fill in the blanks section below compass
  ctx1.save();
  ctx1.fillStyle = '#f8fafc';
  ctx1.strokeStyle = '#cbd5e1';
  ctx1.lineWidth = 3;
  ctx1.roundRect(160, 1720, W - 320, 520, 20);
  ctx1.fill();
  ctx1.stroke();

  ctx1.fillStyle = '#0369a1';
  ctx1.font = '36px AmiriBold';
  ctx1.textAlign = 'right';
  ctx1.direction = 'rtl';
  ctx1.fillText('أكمل العبارات التالية مستعيناً بالرسم أعلاه:', W - 200, 1780);

  const subQuestions = [
    '1. الاتجاه الذي يشير إليه السهم في أعلى وردة البوصلة هو اتجاه ............................',
    '2. الاتجاه الذي يشير إليه السهم في أسفل وردة البوصلة هو اتجاه ............................',
    '3. جهة اليمين التي تشرق منها الشمس كل صباح هي جهة ............................',
    '4. جهة اليسار التي تغرب فيها الشمس في نهاية اليوم هي جهة ............................',
  ];

  ctx1.fillStyle = '#1e293b';
  ctx1.font = '36px Amiri';
  subQuestions.forEach((q, idx) => {
    ctx1.fillText(q, W - 220, 1860 + idx * 85);
  });
  ctx1.restore();

  drawFooter(ctx1, 1, 2);

  // Convert Page 1 to PNG image buffer and embed in PDFDocument
  const page1Png = canvas1.toBuffer('image/png');
  const embeddedPage1 = await doc.embedPng(page1Png);
  const pdfPage1 = doc.addPage([595.28, 841.89]); // A4 in PDF points (72 DPI)
  pdfPage1.drawImage(embeddedPage1, {
    x: 0,
    y: 0,
    width: 595.28,
    height: 841.89,
  });

  // PAGE 2
  const canvas2 = createCanvas(W, H);
  const ctx2 = canvas2.getContext('2d');
  ctx2.fillStyle = '#ffffff';
  ctx2.fillRect(0, 0, W, H);

  drawPageBorder(ctx2);
  drawHeader(ctx2, 2);

  // Question 2: Multiple Choice
  ctx2.save();
  ctx2.fillStyle = '#0284c7';
  ctx2.roundRect(120, 460, W - 240, 75, 16);
  ctx2.fill();

  ctx2.fillStyle = '#ffffff';
  ctx2.font = '40px AmiriBold';
  ctx2.textAlign = 'right';
  ctx2.direction = 'rtl';
  ctx2.fillText('السؤال الثاني: اختر الإجابة الصحيحة مما بين القوسين (3 درجات)', W - 160, 515);

  const mcq = [
    {
      q: '1. عدد الاتجاهات الأصلية التي نحدد بها المواقع هو:',
      opts: '(  ثلاثة اتجاهات   —   أربعة اتجاهات   —   خمسة اتجاهات  )',
    },
    {
      q: '2. تشرق الشمس كل صباح من جهة:',
      opts: '(  الشرق   —   الغرب   —   الشمال  )',
    },
    {
      q: '3. الاتجاه الذي يقابل جهة الشمال مباشرة هو جهة:',
      opts: '(  الشرق   —   الجنوب   —   الغرب  )',
    },
    {
      q: '4. تغرب الشمس في نهاية اليوم من جهة:',
      opts: '(  الشمال   —   الغرب   —   الجنوب  )',
    },
  ];

  ctx2.fillStyle = '#0f172a';
  mcq.forEach((item, idx) => {
    const yQ = 600 + idx * 160;
    ctx2.font = '36px AmiriBold';
    ctx2.fillText(item.q, W - 160, yQ);

    ctx2.font = '36px Amiri';
    ctx2.fillStyle = '#0369a1';
    ctx2.fillText(item.opts, W - 220, yQ + 65);
    ctx2.fillStyle = '#0f172a';
  });
  ctx2.restore();

  // Question 3: True or False
  ctx2.save();
  const q3StartY = 1300;
  ctx2.fillStyle = '#0284c7';
  ctx2.roundRect(120, q3StartY, W - 240, 75, 16);
  ctx2.fill();

  ctx2.fillStyle = '#ffffff';
  ctx2.font = '40px AmiriBold';
  ctx2.textAlign = 'right';
  ctx2.direction = 'rtl';
  ctx2.fillText('السؤال الثالث: ضع علامة ( ✓ ) أو علامة ( ✗ ) أمام العبارات الآتية (3 درجات)', W - 160, q3StartY + 55);

  const tf = [
    '1. نستخدم وردة البوصلة لمعرفة وتحديد الاتجاهات على الخريطة.',
    '2. تشرق الشمس كل يوم من جهة الغرب وتغرب من جهة الشرق.',
    '3. إذا وقفت متجهاً نحو الشمال، يكون الجنوب خلفي والشرق عن يميني.',
    '4. الاتجاهات الأصلية هي: الشمال، والجنوب، والشرق، والغرب.',
    '5. جهة الشرق يقابلها مباشرة جهة الجنوب.',
  ];

  tf.forEach((statement, idx) => {
    const yRow = q3StartY + 150 + idx * 120;

    // Row background
    ctx2.fillStyle = idx % 2 === 0 ? '#f8fafc' : '#ffffff';
    ctx2.strokeStyle = '#e2e8f0';
    ctx2.lineWidth = 2;
    ctx2.fillRect(160, yRow - 65, W - 320, 95);
    ctx2.strokeRect(160, yRow - 65, W - 320, 95);

    // Question text
    ctx2.fillStyle = '#0f172a';
    ctx2.font = '36px Amiri';
    ctx2.textAlign = 'right';
    ctx2.direction = 'rtl';
    ctx2.fillText(statement, W - 200, yRow);

    // Parentheses box for answer on left
    ctx2.fillStyle = '#ffffff';
    ctx2.strokeStyle = '#0284c7';
    ctx2.lineWidth = 3;
    ctx2.roundRect(200, yRow - 50, 110, 70, 14);
    ctx2.fill();
    ctx2.stroke();

    ctx2.fillStyle = '#94a3b8';
    ctx2.font = '36px Amiri';
    ctx2.textAlign = 'center';
    ctx2.fillText('(      )', 255, yRow);
  });
  ctx2.restore();

  // Teacher feedback box at bottom
  ctx2.save();
  const boxY = 2050;
  ctx2.fillStyle = '#fefce8';
  ctx2.strokeStyle = '#eab308';
  ctx2.lineWidth = 4;
  ctx2.roundRect(160, boxY, W - 320, 200, 20);
  ctx2.fill();
  ctx2.stroke();

  ctx2.fillStyle = '#854d0e';
  ctx2.font = '36px AmiriBold';
  ctx2.textAlign = 'right';
  ctx2.direction = 'rtl';
  ctx2.fillText('تقييم المعلم وملاحظاته:', W - 210, boxY + 65);

  ctx2.font = '34px Amiri';
  ctx2.fillStyle = '#713f12';
  ctx2.fillText('مستوى ممتاز! تم إتقان درس الاتجاهات الأصلية وتحديدها بنجاح. بارك الله فيك يا بطل! ⭐⭐⭐⭐⭐', W - 210, boxY + 130);
  ctx2.restore();

  drawFooter(ctx2, 2, 2);

  const page2Png = canvas2.toBuffer('image/png');
  const embeddedPage2 = await doc.embedPng(page2Png);
  const pdfPage2 = doc.addPage([595.28, 841.89]);
  pdfPage2.drawImage(embeddedPage2, {
    x: 0,
    y: 0,
    width: 595.28,
    height: 841.89,
  });

  const pdfBytes = await doc.save();
  const outputPath = path.join(process.cwd(), 'public', 'materials', 'SocialStudies-Grade2-B2-W1-U2-HomeWork1 - Extra- (Minia).pdf');
  fs.writeFileSync(outputPath, pdfBytes);

  // Also write to dist/materials if it exists
  const distDir = path.join(process.cwd(), 'dist', 'materials');
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'SocialStudies-Grade2-B2-W1-U2-HomeWork1 - Extra- (Minia).pdf'), pdfBytes);
    fs.writeFileSync(path.join(distDir, 'SocialStudies-Grade2-B2-Week1-HomeWork.pdf'), pdfBytes);
    fs.writeFileSync(path.join(distDir, 'SocialStudies-Grade2-B2-Week2-HomeWork.pdf'), pdfBytes);
  }

  // Also copy to all corresponding names in public/materials
  fs.writeFileSync(path.join(process.cwd(), 'public', 'materials', 'SocialStudies-Grade2-B2-Week1-HomeWork.pdf'), pdfBytes);
  fs.writeFileSync(path.join(process.cwd(), 'public', 'materials', 'SocialStudies-Grade2-B2-Week2-HomeWork.pdf'), pdfBytes);

  // Also save sample images for review
  fs.writeFileSync('public/directions_sheet_page1.png', page1Png);
  fs.writeFileSync('public/directions_sheet_page2.png', page2Png);

  console.log(`Generated Directions Worksheet PDF: ${outputPath} (${pdfBytes.length} bytes)`);
  return outputPath;
}

generateWorksheetPdf();
