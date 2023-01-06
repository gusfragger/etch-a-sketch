const board = document.querySelector(".container");
const gridSlider = document.querySelector(".grid-slider");
const sliderValue = document.querySelector(".slider-value");
const sizeButton = document.querySelector(".size-button");
const mode = document.forms[0];
let root = document.documentElement;
const cells = document.querySelectorAll(".cell");
let isDrawing = false;

//INITIAL SETUP
drawBoard(gridSlider.value);

//SLIDER DIV VALUE UPDATE
gridSlider.oninput = () => {
  sliderValue.innerHTML = `${gridSlider.value} x ${gridSlider.value} `;
};

//USER BUTTONS
//BOARD CREATION
sizeButton.addEventListener("click", () => {
  eraseBoard();
  drawBoard(gridSlider.value);
});

cells.forEach((cell) => {
  cell.addEventListener("mousedown", () => {
    isDrawing = true;
  });

  cell.addEventListener("mouseup", () => {
    isDrawing = false;
  });

  cell.addEventListener("mouseenter", () => {
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
    cell.addEventListener("mouseenter", () => {
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
    if (mode[0].checked) {
      // Return a solid black color value with an alpha channel value of FF (fully opaque).
      return "#000000FF";
    }
    if (mode[1].checked) {
      // Return a random color with a random alpha channel value.
      return randomHex();
    }
    if (mode[2].checked) {
      // Use the darkener function to increase the alpha channel value of the cellColor argument.
      return darkener(cellColor, 10);
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
    // Convert the current alpha channel value to a decimal number.
    const currentAlphaDec = parseInt(currentAlpha, 16);
    // Increase the current alpha channel value by the factor, but limit it to FF (fully opaque).
    const newAlphaDec = Math.min(currentAlphaDec + factor, 255);
    // If the new alpha channel value is fully opaque, return a solid black color value with an alpha channel value of FF (fully opaque).
    if (newAlphaDec === 255) {
      return "#000000FF";
    }
    // Convert the new alpha channel value to a hexadecimal value.
    const newAlpha = newAlphaDec.toString(16).toUpperCase();
    // Return the color argument with the increased alpha channel value.
    return color.slice(0, -2) + newAlpha;
  }