const board = document.querySelector(".container");
const gridSlider = document.querySelector(".grid-slider");
const sliderValue = document.querySelector(".slider-value");
const sizeButton = document.querySelector(".size-button");
const colorPicker = document.getElementById('color-picker');
const bwButton = document.getElementById('bw');
const rgbButton = document.getElementById('rgb');
const shadowsButton = document.getElementById('shadows');
const lightsButton = document.getElementById('lights');
const pickColorButton = document.getElementById('pick-color');
const modeButtons= document.querySelectorAll('.inactive');
let root = document.documentElement;
const cells = document.querySelectorAll(".cell");
let isDrawing = false;
let mode = 'bw';  // default drawing mode black and white
let customColor= "#6BDBBA";


//INITIAL SETUP
drawBoard(gridSlider.value);

// Drawing mode selection
modeButtons.forEach(function(button) {
  button.addEventListener('click', function() {
    // Toggle the active class on the clicked button
    button.classList.toggle('active');
    // Remove the active class from the other buttons
    modeButtons.forEach(function(otherButton) {
      if (otherButton !== button) {
        otherButton.classList.remove('active');
      }
    });
    // Set the mode variable to the value of the clicked button
    mode = button.value;
  });
});
//Sets a custom color when the color picker is used
colorPicker.addEventListener('input', () => {
  customColor = colorPicker.value;
});

//Slider value update
gridSlider.oninput = () => {
  sliderValue.innerHTML = `${gridSlider.value} x ${gridSlider.value} `;
};

//Board clearing and new board creation when user clicks apply
sizeButton.addEventListener("click", () => {
  eraseBoard();
  drawBoard(gridSlider.value);
});

//FUNCTIONS
//Cleans the board
function eraseBoard() {
  board.innerHTML = "";
}
//Paints the cells according to user holding the mouse
function drawBoard(x) {
  root.style.setProperty("--board-columns", x);
  root.style.setProperty("--board-rows", x);
  let i=0;
  for (i = 0; i < x * x; i++) {
    let cell = document.createElement("div");
    board.appendChild(cell).className = "cell";
    cell.addEventListener("mousedown", () => {
      isDrawing = true;
    });
  
    cell.addEventListener("mouseup", () => {
      isDrawing = false;
    });
    //Paints the cells according to user selection
    cell.addEventListener("mouseover", () => {
      if (isDrawing) {
        cell.style.setProperty(
          "--paint-color",
          selectionHandling(
            mode,
            getComputedStyle(cell).getPropertyValue("--paint-color")
          )
        );
      }
    });
  
  }
}
  
function selectionHandling(mode, cellColor) {
  
  if (mode === 'bw') {
    // Return a solid black color value with an alpha channel value of FF (fully opaque).
    return "#000000FF";
  }
  if (mode === 'rgb') {
    // Return a random color with a random alpha channel value.
    return randomHex();
  }
  if (mode === 'shadows') {
    // Use the darkener function to increase the alpha channel value of the cellColor argument.
    if (cellColor === customColor) {
      return darkener(customColor,10);
    } else {
      return darkener(cellColor,10);
    }
  }
  if (mode === 'lights') {
    // Return the selected color.
    if (cellColor === customColor) {
      return lightener(customColor,10);
    } else {
      return lightener(cellColor,10);
    }
  }
  if (mode === 'pick-color') {
    return customColor;
  }
}

  
  
  function randomHex() {
    // Generate a random color value.
    const randomColor = "#" + Math.floor((Math.random() * 0xffffff) << 0).toString(16);
    // Generate a random alpha channel value.
    const randomAlpha = Math.floor((Math.random() * 255)).toString(16).toUpperCase();
    // Return the random color value with the random alpha channel value.
    return randomColor + randomAlpha;
  }
  
  function darkener(color, factor) {
    // Extract the current alpha channel value from the color argument.
    const currentAlpha = color.substr(-2);
    // Convert the alpha channel value to a number.
    const alpha = parseInt(currentAlpha, 16);
    // Increase the alpha channel value by the factor.
    const newAlpha = Math.min(255, alpha + factor);
    // Convert the new alpha channel value to a hexadecimal string.
    const newAlphaHex = newAlpha.toString(16).toUpperCase();
    // Pad the new alpha channel value with zeros if necessary.
    const paddedNewAlpha = "0".repeat(2 - newAlphaHex.length) + newAlphaHex;
    // Replace the old alpha channel value with the new alpha channel value.
    const newColor = color.substr(0, color.length - 2) + paddedNewAlpha;
    // Return the modified color value.
    return newColor;
  }
  
 

function lightener(color, factor) {
  // Extract the current alpha channel value from the color argument.
  const currentAlpha = color.substr(-2);
  // Convert the alpha channel value to a number.
  const alpha = parseInt(currentAlpha, 16);
  // Decrease the alpha channel value by the factor.
  const newAlpha = Math.max(0, alpha - factor);
  // Convert the new alpha channel value to a hexadecimal string.
  const newAlphaHex = newAlpha.toString(16).toUpperCase();
  // Pad the new alpha channel value with zeros if necessary.
  const paddedNewAlpha = "0".repeat(2 - newAlphaHex.length) + newAlphaHex;
  // Replace the old alpha channel value with the new alpha channel value.
  const newColor = color.substr(0, color.length - 2) + paddedNewAlpha;
  // Return the modified color value.
  return newColor;
}