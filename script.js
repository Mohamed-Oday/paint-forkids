const canvas = document.querySelector("canvas");
toolBtns = document.querySelectorAll(".tool");
fillColor = document.querySelector("#fillColor");
sizeSlider = document.querySelector("#sizeSlider");
colorBtns = document.querySelectorAll(".colors .color");
colorPicker = document.querySelector("#color-picker");
clearCanvas = document.querySelector(".clear-canvas");
saveImage = document.querySelector(".save-img");
uploadImage = document.querySelector(".upload-img");
underArrow = document.querySelector("#undo");
redoArrow = document.querySelector("#redo");
arcadeBtn = document.querySelector(".arcade");
ctx = canvas.getContext("2d");

let undoStack = [];
let redoStack = [];

// Global variables with default values
let prevMouseX, prevMouseY, snapShot;
isDrawing = false;
selectedTool = "brush";
brushWidth = sizeSlider.value;
selectedColor = "#000";
canvas.style.cursor = selectedTool === "brush" ? "url('./assets/t1.png'), crosshair" : "crosshair";

const setCanvasBackground = () => {
  ctx.fillStyle = "#fff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = selectedColor;
};

window.addEventListener("load", () => {
  // Set the canvas size to the window size
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

const drawRectangle = (e) => {
  if (!fillColor.checked) {
    return ctx.strokeRect(
      prevMouseX,
      prevMouseY,
      e.offsetX - prevMouseX,
      e.offsetY - prevMouseY
    );
  }
  ctx.fillRect(
    prevMouseX,
    prevMouseY,
    e.offsetX - prevMouseX,
    e.offsetY - prevMouseY
  );
};

const drawCircle = (e) => {
  ctx.beginPath(); // Start a new path to draw the circle
  // Calculate the radius of the circle
  let radius = Math.sqrt(
    Math.pow(prevMouseX - e.offsetX, 2) + Math.pow(prevMouseY - e.offsetY, 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke(); // Fill or stroke the circle based on the checkbox
};

const drawTriangle = (e) => {
    const thirdPointX = prevMouseX - (e.offsetX - prevMouseX); // Mirror the x-coordinate for the third point
  
    ctx.beginPath(); // Start drawing the triangle
    ctx.moveTo(prevMouseX, prevMouseY); // Start point
    ctx.lineTo(e.offsetX, e.offsetY); // Second point
    ctx.lineTo(thirdPointX, e.offsetY); // Third point
    ctx.closePath(); // Close the triangle
  
    if (fillColor.checked) {
      ctx.fill(); // Fill the triangle
    } else {
      ctx.stroke(); // Draw the triangle outline
    }
  };
  
const startDrawing = (e) => {
  isDrawing = true;
  prevMouseX = e.offsetX; // Get the x coordinate of the mouse
  prevMouseY = e.offsetY; // Get the y coordinate of the mouse
  ctx.beginPath(); // Start a new path
  ctx.lineWidth = brushWidth; // Set the line width
  ctx.strokeStyle = selectedColor; // Set the stroke color
  ctx.fillStyle = selectedColor; // Set the fill color

  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));

  snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height); // Take a snapshot of the canvas
};

underArrow.addEventListener("click", () => {
  if (undoStack.length > 0) {
    let lastState = undoStack.pop();

    redoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // Save current state to redo stack

    ctx.putImageData(lastState, 0, 0);
  } else {
    console.log("Nothing to undo");
  }
});

redoArrow.addEventListener("click", () => {
  if (redoStack.length > 0) {
    let redoState = redoStack.pop();

    undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height)); // Save current state to undo stack

    ctx.putImageData(redoState, 0, 0);
  } else {
    console.log("Nothing to redo");
  }
});

const drawing = (e) => {
  if (!isDrawing) return; // If the mouse is not clicked, don't draw anything
  ctx.putImageData(snapShot, 0, 0); // Restore the canvas to the last snapshot

  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser" ? "#fff" : selectedColor; // Set the stroke color
    ctx.lineTo(e.offsetX, e.offsetY); // Draw a line from the last point to the current point
    ctx.stroke(); // Draw the line
  } else if (selectedTool === "rectangle") {
    drawRectangle(e);
  } else if (selectedTool === "circle") {
    drawCircle(e);
  } else if (selectedTool === "triangle") {
    drawTriangle(e);
  }
};

function setCursor(id) {
  console.log(`Setting cursor for tool: ${id}`);
  if (id === "brush") {
    canvas.style.cursor = "url('./assets/t1.png'), crosshair";
  } else if (id === "eraser") {
    canvas.style.cursor = "url('./assets/eraser2.png'), auto";
  } else {
    canvas.style.cursor = "crosshair";
  }
  console.log(`Cursor set to: ${canvas.style.cursor}`);
}

toolBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove the active class from all the buttons and add it to the clicked button
    document.querySelector(".active").classList.remove("active");
    btn.classList.add("active");
    selectedTool = btn.id;
    setCursor(btn.id);
    console.log(selectedTool);
  });
});

sizeSlider.addEventListener("change", () => (brushWidth = sizeSlider.value));

colorBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    // Remove the active class from all the buttons and add it to the clicked button
    document.querySelector(".selected").classList.remove("selected");
    btn.classList.add("selected");
    // Get the background color of the clicked button
    selectedColor = window
      .getComputedStyle(btn)
      .getPropertyValue("background-color");
  });
});

colorPicker.addEventListener("change", () => {
  // Set the color picker value to the selected color
  colorPicker.parentElement.style.backgroundcolor = colorPicker.value;
  selectedColor = colorPicker.value;
  colorBtns.parentElement.click();
});

clearCanvas.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

saveImage.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});

uploadImage.addEventListener("click", () =>{
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    input.addEventListener("change", () => {
        const file = input.files[0];
        const reader = new FileReader();
        reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        };
        };
        reader.readAsDataURL(file);
    });
})

arcadeBtn.addEventListener("click", () => {
  window.location.href = 'http://127.0.0.1:5500/game/';
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
