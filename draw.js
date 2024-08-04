const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let lines = [];
let undoStack = [];
let redoStack = [];

const gridSize = 50;
const drawingColor = '#FF0000';

canvas.addEventListener('mousedown', (e) => {
  if (!isDrawingAllowed()) return;
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
  lines.push({ x: lastX, y: lastY });
  undoStack.push({ action: 'add', line: { x1: lastX, y1: lastY, x2: null, y2: null } });
  console.log('mousedown');
});

canvas.addEventListener('mousemove', (e) => {
  if (!isDrawing || !isDrawingAllowed()) return;
  ctx.strokeStyle = drawingColor;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
});

canvas.addEventListener('mouseup', (e) => {
  if (!isDrawingAllowed()) return;
  isDrawing = false;
  const [firstX, firstY] = [e.offsetX, e.offsetY];
  lines.push({ x: firstX, y: firstY });
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
  lines.forEach((point, index) => {
    console.log(`Point ${index + 1}: (${point.x}, ${point.y})`);
  });

  console.log('Lines formed:');
  for (let i = 0; i < lines.length - 1; i++) {
    if ((i + 1) % 2 === 1) {
      const lineOutput = i + 1;
      console.log(`Line ${lineOutput}: Start(${lines[i].x}, ${lines[i].y}) - End(${lines[i + 1].x}, ${lines[i + 1].y})`);
    }
  }
}

const isDrawingAllowed = () => lines.length < 4;

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  lines = [];
  loadImage();
}

function loadImage() {
  const img = new Image();
  img.src = 'assets/images/example.jpg';
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    drawGrid(); // Draw the grid on top of the image
  };
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

// Initial setup
loadImage();
