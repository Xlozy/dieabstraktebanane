// Variable für die Standardfarbe und das Set der gefärbten Pixel
let currentColor = "#FFFF00"; // Standardfarbe Gelb in Hex
let paintedPixels = new Map(); // Map, um gefärbte Pixel und ihre Farben zu verfolgen

// Event-Listener für den Farbregler und das Hex-Feld
document.getElementById('hue').addEventListener('input', updateColorFromHue);
document.getElementById('hexInput').addEventListener('input', updateColorFromHex);

// Start-Banane anzeigen und Regler sowie Hex-Feld zurücksetzen, sobald die Seite geladen wird
window.onload = function() {
    document.getElementById('hue').value = 60; // Setze den Regler auf Gelb
    document.getElementById('hexInput').value = currentColor; // Setze das Hex-Feld auf Gelb
    document.getElementById('colorDisplay').style.backgroundColor = currentColor; // Zeige Gelb im Vorschaufeld
    showDefaultBanana(); // Zeige die Standard-Banane
};

// Funktion zur Konvertierung von HSL zu RGB
function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    let c = (1 - Math.abs(2 * l - 1)) * s;
    let x = c * (1 - Math.abs((h / 60) % 2 - 1));
    let m = l - c / 2;
    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) { r = c; g = x; b = 0; }
    else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
    else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
    else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
    else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
    else if (300 <= h && h < 360) { r = c; g = 0; b = x; }

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return { r, g, b };
}

// Funktion zur Konvertierung von RGB zu Hex
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

// Funktion zur Aktualisierung der Farbe vom HSL-Regler
function updateColorFromHue() {
    const hue = document.getElementById('hue').value;
    const { r, g, b } = hslToRgb(hue, 100, 50);
    const hexValue = rgbToHex(r, g, b);
    document.getElementById('hexInput').value = hexValue;
    document.getElementById('colorDisplay').style.backgroundColor = hexValue;
    currentColor = hexValue; // Aktuelle Farbe auf den Hexwert setzen
}

// Funktion zur Aktualisierung der Farbe vom Hex-Feld
function updateColorFromHex() {
    const hexValue = document.getElementById('hexInput').value;
    if (/^#[0-9A-F]{6}$/i.test(hexValue)) {
        document.getElementById('colorDisplay').style.backgroundColor = hexValue;
        currentColor = hexValue; // Aktuelle Farbe auf den Hexwert setzen
    }
}

// Funktion zur Anzeige der Standard-Banane
function showDefaultBanana() {
    const grid = document.getElementById('pixel-grid');
    grid.innerHTML = '';

    paintedPixels.clear();
    const defaultPixels = [2, 5, 8]; // Default-Banane Felder

    for (let i = 1; i <= 9; i++) {
        let pixel = document.createElement('div');
        pixel.className = 'pixel';
        if (defaultPixels.includes(i)) {
            pixel.style.backgroundColor = currentColor;
            paintedPixels.set(i, currentColor);
        } else {
            pixel.style.backgroundColor = 'lightgray';
        }
        pixel.addEventListener('click', () => paintPixel(pixel, Math.floor((i - 1) / 3), (i - 1) % 3));
        grid.appendChild(pixel);
    }
}

// Der Rest deines Codes bleibt unverändert

// Funktion zur Generierung einer neuen Banane
function generateBanana() {
    const grid = document.getElementById('pixel-grid');
    grid.innerHTML = '';
    paintedPixels.clear(); // Clear painted pixels

    const positionMap = {
        1: [0, 0], 2: [0, 1], 3: [0, 2],
        4: [1, 0], 5: [1, 1], 6: [1, 2],
        7: [2, 0], 8: [2, 1], 9: [2, 2]
    };

    const allowedMoves = {
        1: [2, 4, 5], 2: [1, 3, 4, 5, 6], 3: [2, 5, 6],
        4: [1, 2, 5, 7, 8], 5: [1, 2, 3, 4, 6, 7, 8, 9], 6: [2, 3, 5, 8, 9],
        7: [4, 5, 8], 8: [4, 5, 6, 7, 9], 9: [5, 6, 8]
    };

    let currentNumber = Math.floor(Math.random() * 9) + 1;
    let sequence = [currentNumber];
    let visited = { [currentNumber]: true };

    while (sequence.length < 9) {
        let possibleNextMoves = allowedMoves[currentNumber].filter(num => !visited[num]);
        if (possibleNextMoves.length === 0) break;

        let endProbability = 1 / (possibleNextMoves.length + 1);
        if (Math.random() < endProbability) break;

        currentNumber = possibleNextMoves[Math.floor(Math.random() * possibleNextMoves.length)];
        sequence.push(currentNumber);
        visited[currentNumber] = true;
    }

    let field = Array.from({ length: 3 }, () => Array(3).fill(false));
    sequence.forEach(num => {
        const [x, y] = positionMap[num];
        field[x][y] = true;
        paintedPixels.set(num, currentColor);
    });

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            let pixel = document.createElement('div');
            pixel.className = 'pixel';
            pixel.style.backgroundColor = field[i][j] ? currentColor : 'lightgray';
            pixel.addEventListener('click', () => paintPixel(pixel, i, j));
            grid.appendChild(pixel);
        }
    }
}

// Funktion zur Farbgebung einzelner Pixel
function paintPixel(pixel, row, col) {
    const position = row * 3 + col + 1;

    const neighbors = {
        1: [2, 4, 5], 2: [1, 3, 4, 5, 6], 3: [2, 5, 6],
        4: [1, 2, 5, 7, 8], 5: [1, 2, 3, 4, 6, 7, 8, 9], 6: [2, 3, 5, 8, 9],
        7: [4, 5, 8], 8: [4, 5, 6, 7, 9], 9: [5, 6, 8]
    };

    function isStillConnected(paintedSet, positionToRemove) {
        let newSet = new Set(paintedSet.keys());
        newSet.delete(positionToRemove);

        if (newSet.size === 0) return true;

        let start = newSet.values().next().value;
        let stack = [start];
        let visited = new Set([start]);

        while (stack.length > 0) {
            let pos = stack.pop();
            neighbors[pos].forEach(neighbor => {
                if (newSet.has(neighbor) && !visited.has(neighbor)) {
                    visited.add(neighbor);
                    stack.push(neighbor);
                }
            });
        }

        return visited.size === newSet.size;
    }

    function isConnected(position) {
        return Array.from(paintedPixels.keys()).some(paintedPos =>
            neighbors[paintedPos].includes(position)
        );
    }

    if (paintedPixels.has(position)) {
        if (isStillConnected(paintedPixels, position)) {
            pixel.style.backgroundColor = 'lightgray';
            paintedPixels.delete(position);
        }
    } else {
        if (paintedPixels.size === 0 || isConnected(position)) {
            pixel.style.backgroundColor = currentColor;
            paintedPixels.set(position, currentColor);
        }
    }
}

// Funktion zum Herunterladen des Bildes
function downloadImage() {
    const pixelSize = 60; // Größe eines Pixels
    const gap = 5; // Abstand zwischen den Pixeln
    const borderSize = 5; // Neuer Rand von 5px
    const gridSize = 3 * pixelSize + 2 * gap; // Größe des Rasters (180px)
    const canvasSize = gridSize + 2 * borderSize; // Gesamtgröße des Canvas (190px)

    const canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');

    // Hintergrund auf weiß setzen
    ctx.fillStyle = '#151515';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Zeichne die gefärbten Felder ohne Rasterlinien
    paintedPixels.forEach((color, position) => {
        const row = Math.floor((position - 1) / 3);
        const col = (position - 1) % 3;
        ctx.fillStyle = color;
        ctx.fillRect(
            col * (pixelSize + gap) + borderSize,
            row * (pixelSize + gap) + borderSize,
            pixelSize,
            pixelSize
        );
    });

    const link = document.createElement('a');
    link.download = 'abstrakte_banane.png';
    link.href = canvas.toDataURL();
    link.click();
}