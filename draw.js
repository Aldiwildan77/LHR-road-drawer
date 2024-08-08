const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');

let isDrawing = false;
let startX = 0;
let startY = 0;
let lastX = null;
let lastY = null;
let lines = [];

const gridSize = 50;
const drawingColor = '#FF0000';
const distanceThreshold = 100; // Distance threshold to complete the shape

canvas.addEventListener('mousedown', (e) => {
  if (!isDrawingAllowed()) return;
  isDrawing = true;
  startX = e.offsetX;
  startY = e.offsetY;

  if (lastX === null || lastY === null) {
    lastX = startX;
    lastY = startY;
  }

  console.log('mousedown');
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing || !isDrawingAllowed()) return;
  const currentX = e.offsetX;
  const currentY = e.offsetY;

  // Clear the canvas and redraw the grid and all existing lines
  clearCanvas();

  // Draw the current line preview
  ctx.strokeStyle = drawingColor;
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(currentX, currentY);
  ctx.stroke();
});

canvas.addEventListener('mouseup', (e) => {
  if (!isDrawingAllowed()) return;
  isDrawing = false;
  const endX = e.offsetX;
  const endY = e.offsetY;

  // Save the line
  lines.push({ x1: lastX, y1: lastY, x2: endX, y2: endY });

  lastX = endX;
  lastY = endY;

  // Check if the new endpoint is near the start of the first line to complete the shape
  if (lines.length > 1) {
    const firstLine = lines[0];
    const distanceToFirstLineStart = Math.hypot(lastX - firstLine.x1, lastY - firstLine.y1);

    if (distanceToFirstLineStart <= distanceThreshold) {
      ctx.beginPath();
      ctx.moveTo(lastX, lastY);
      ctx.lineTo(firstLine.x1, firstLine.y1);
      ctx.stroke();
      firstLine.x2 = firstLine.x1;
      firstLine.y2 = firstLine.y1;
      isDrawing = false; // Stop drawing as the shape is closed
      lines.push({ x1: lastX, y1: lastY, x2: firstLine.x1, y2: firstLine.y1 });
      lastX = null;
      lastY = null;
      logLines();
      lines = []; // Clear the lines array
      return;
    }
  }

  console.log('mouseup');
  logLines();
});

canvas.addEventListener('mouseout', () => {
  if (!isDrawingAllowed()) return;
  isDrawing = false;
  console.log('mouseout');
});

function logLines() {
  console.log('Points stored:');
  lines.forEach((line, index) => {
    console.log(`Line ${index + 1}: Start(${line.x1}, ${line.y1}) - End(${line.x2}, ${line.y2})`);
  });
}

const isDrawingAllowed = () => true;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  redrawLines();
}

function resetCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGrid();
  lines = [];
  lastX = null;
  lastY = null;
}

function drawGrid() {
  ctx.strokeStyle = '#e0e0e0'; // Light gray color for grid lines
  ctx.lineWidth = 1;
  ctx.font = '10px Arial';
  ctx.fillStyle = '#000000'; // Black color for text

  // Draw vertical lines and coordinates
  for (let x = 0; x <= canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
    if (x !== 0) ctx.fillText(x, x + 2, 10); // Skip (0,0) coordinate text to avoid overlap
  }

  // Draw horizontal lines and coordinates
  for (let y = 0; y <= canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    if (y !== 0) ctx.fillText(y, 2, y - 2); // Skip (0,0) coordinate text to avoid overlap
  }

  ctx.strokeStyle = drawingColor; // Reset the line color to red for drawing
  ctx.lineWidth = 2;
}

function markCoordinates(x, y) {
  ctx.fillStyle = '#FF0000'; // Red color for marking coordinates
  ctx.fillText(`(${x}, ${y})`, x + 5, y - 5);
  ctx.fillStyle = '#000000'; // Reset text color to black
}

function redrawLines() {
  ctx.strokeStyle = drawingColor;
  ctx.lineWidth = 2;
  lines.forEach(line => {
    ctx.beginPath();
    ctx.moveTo(line.x1, line.y1);
    ctx.lineTo(line.x2, line.y2);
    ctx.stroke();
  });
}
