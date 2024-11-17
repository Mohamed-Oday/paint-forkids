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
// 
menuButton = document.querySelector(".title");
options = document.querySelector(".options");
colors = document.querySelector(".colors");
shapes = document.querySelector(".shapes");
functions = document.querySelector(".functions");
optionsBar = document.querySelector(".options-bar")
//
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
width = canvas.offsetWidth;
height = canvas.offsetHeight;

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
  const rect = canvas.getBoundingClientRect();
  if (!fillColor.checked) {
    return ctx.strokeRect(
      prevMouseX,
      prevMouseY,
      e.clientX - rect.left - prevMouseX,
      e.clientY - rect.top - prevMouseY
    );
  }
  ctx.fillRect(
    prevMouseX,
    prevMouseY,
    e.clientX - rect.left - prevMouseX,
    e.clientY - rect.top - prevMouseY
  );
};

const drawCircle = (e) => {
  const rect = canvas.getBoundingClientRect();
  ctx.beginPath(); // Start a new path to draw the circle
  // Calculate the radius of the circle
  let radius = Math.sqrt(
    Math.pow(prevMouseX - (e.clientX - rect.left), 2) + Math.pow(prevMouseY - (e.clientY - rect.top), 2)
  );
  ctx.arc(prevMouseX, prevMouseY, radius, 0, 2 * Math.PI);
  fillColor.checked ? ctx.fill() : ctx.stroke(); // Fill or stroke the circle based on the checkbox
};

const drawTriangle = (e) => {
  const rect = canvas.getBoundingClientRect();
  const thirdPointX = prevMouseX - (e.clientX - rect.left - prevMouseX); // Mirror the x-coordinate for the third point

  ctx.beginPath(); // Start drawing the triangle
  ctx.moveTo(prevMouseX, prevMouseY); // Start point
  ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top); // Second point
  ctx.lineTo(thirdPointX, e.clientY - rect.top); // Third point
  ctx.closePath(); // Close the triangle

  if (fillColor.checked) {
    ctx.fill(); // Fill the triangle
  } else {
    ctx.stroke(); // Draw the triangle outline
  }
};
  
const startDrawing = (e) => {
  isDrawing = true;
  const rect = canvas.getBoundingClientRect(); // Ensure to get the latest bounds
  prevMouseX = e.clientX - rect.left; // Adjust based on current canvas position
  prevMouseY = e.clientY - rect.top;

  ctx.beginPath(); // Start a new path
  ctx.lineWidth = brushWidth; // Set the line width
  ctx.strokeStyle = selectedTool === "eraser"? "#fff" : selectedColor; // Set the stroke color
  ctx.fillStyle = selectedColor; // Set the fill color
  
  undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
  
  // ADJUSTMENT: Update snapShot here to ensure it matches the current canvas state
  snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
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

  const rect = canvas.getBoundingClientRect();
  if (selectedTool === "brush" || selectedTool === "eraser") {
    ctx.strokeStyle = selectedTool === "eraser"? "#fff" : selectedColor; // Set the stroke color
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top); // Draw a line from the last point to the current point
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

menuButton.addEventListener("click", () => {
  menuButton.classList.toggle("display");

  const saveCanvas = ctx.getImageData(0, 0, canvas.width, canvas.height); 

  if (!menuButton.classList.contains("display")){
    const rect = canvas.getBoundingClientRect();
    options.style.display = "none";
    colors.style.display = "none";
    shapes.style.display = "none";
    functions.style.display = "none";
    optionsBar.style.border = "none";
    optionsBar.style.padding = 0;
    menuButton.style.padding = '5px 30px';
    menuButton.style.transform = 'rotate(-90deg)';
    menuButton.style.marginRight = '-112px';
    menuButton.style.marginTop = '108px';

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
  }else{
    const rect = canvas.getBoundingClientRect();
    options.style.display = "flex";
    colors.style.display = "grid";
    shapes.style.display = "flex";
    functions.style.display = "flex";
    optionsBar.style.border = "2px solid #e0e0e0";
    optionsBar.style.padding = '15px';
    menuButton.style.padding = '5px';
    menuButton.style.transform = 'rotate(0deg)'
    menuButton.style.margin = '0';

    canvas.width = width;
    canvas.height = height;
  }

  ctx.putImageData(saveCanvas, 0, 0);
});

canvas.addEventListener("mousedown", startDrawing);
canvas.addEventListener("mousemove", drawing);
canvas.addEventListener("mouseup", () => (isDrawing = false));
