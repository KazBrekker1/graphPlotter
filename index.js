/* 
   _____ _   _ ______          _  ____     __     __
  / ____| \ | |  ____|   /\   | |/ /\ \   / /  _  \ \
 | (___ |  \| | |__     /  \  | ' /  \ \_/ /  (_)  | |
  \___ \| . ` |  __|   / /\ \ |  <    \   /        | |
  ____) | |\  | |____ / ____ \| . \    | |     _   | |
 |_____/|_| \_|______/_/    \_\_|\_\   |_|    ( )  | |
                                              |/  /_/

  Good Luck With The Project! Best Regards, Yousseif Elshahawy
  If There are bugs send at: ye1800846@qu.edu.qa
*/

let counter = 0
let x = 0;
let y = 0;
let array1 = []
let currentCount = document.getElementById("count")
let redCount = document.getElementById("redCount")
let blueCount = document.getElementById("blueCount")
let currentLabel = document.getElementById("currentLabel")
let canvas = document.getElementById("canvas")
let reset = document.getElementById("reset")
let switchLabel = document.getElementById("switchLabel")
let rect = canvas.getBoundingClientRect();
let ctx = canvas.getContext("2d");
let option = false
let RED_COLOR = "#ff2626"
let BLUE_COLOR = "#012e96"
let isDrawing = false;
let gridOptions = {
  color: '#ccedee',
  GridSize: 10,
  LinesSize: 0.5
};
let displayGrid = () => {
  let i, Height, Width, GridSize;
  if (canvas.getContext) {
    let Height = canvas.height;
    let Width = canvas.width;
    ctx.strokeStyle = gridOptions.color;
    ctx.lineWidth = parseInt(gridOptions.LinesSize);
    GridSize = 0;
    GridSize = parseInt(gridOptions.GridSize);
    for (i = 0; i < Height; i += GridSize) {
      ctx.moveTo(0, i);
      ctx.lineTo(Width, i);
      ctx.stroke();
    }
    for (i = 0; i < Width; i += GridSize) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, Height);
      ctx.stroke();
    }
  }
}
switchLabel.addEventListener('click', e => {
  option = !option
  currentLabel.innerText = `Current Label: ${option ? 'Red' : 'Blue'}`
})
canvas.addEventListener('mousedown', e => {
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
  drawCoordinates(x, y)
  isDrawing = true;
});
canvas.addEventListener('mousemove', e => {
  counter += 1
  if (isDrawing === true) {
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
    counter % 2 == 0 ? drawCoordinates(x, y) : null
  }
});
canvas.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    x = 0;
    y = 0;
    isDrawing = false;
  }
});
window.addEventListener('mouseup', e => {
  if (isDrawing === true) {
    x = 0;
    y = 0;
    isDrawing = false;
  }
});
reset.addEventListener("click", e => {
  array1 = []
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  displayGrid()
  redCount.innerText = `Red Count: 0`
  blueCount.innerText = `Blue Count: 0`
  currentCount.innerText = `Count: 0`
})


// ==================================Touch Combatibility================================== //

var element;
canvas.addEventListener('touchstart', (e) => {
  e.preventDefault();
  let touch = e.touches[0];
  element = document.elementFromPoint(touch.pageX, touch.pageY);
  x = touch.pageX - rect.left;
  y = touch.pageY - rect.top;
  counter % 2 == 0 ? drawCoordinates(x, y) : null
  isDrawing = true;
}, false);

canvas.addEventListener('touchmove', (e) => {
  e.preventDefault();
  counter += 1
  if (isDrawing === true) {
    let touch = e.touches[0];
    x = touch.pageX - rect.left;
    y = touch.pageY - rect.top;
    counter % 2 == 0 ? drawCoordinates(x, y) : null
    if (element !== document.elementFromPoint(touch.pageX, touch.pageY)) {
      touchleave();
    }
  }

}, false);

let touchleave = () => {
  if (isDrawing === true) {
    x = 0;
    y = 0;
    isDrawing = false;
  }
}

displayGrid()
drawCoordinates = (x, y) => {
  let x_axis = (x / canvas.width) * 10
  let y_axis = ((canvas.height - y) / canvas.height) * 10
  array1.push([x_axis.toFixed(1), y_axis.toFixed(1), option ? 1 : 0])
  currentCount.innerText = `Count: ${array1.length}`
  redCount.innerText = `Red Count: ${array1.filter(item => item[2] == 1).length}`
  blueCount.innerText = `Blue Count: ${array1.filter(item => item[2] == 0).length}`
  let pointSize = 3; // Change according to the size of the point.
  ctx.fillStyle = option ? RED_COLOR : BLUE_COLOR; // Red color
  ctx.beginPath(); //Start path
  ctx.arc(x, y, pointSize, 0, Math.PI * 2, true); // Draw a point using the arc function of the canvas with a point structure.
  ctx.fill(); // Close the path and fill.
}

// ==================================Downloading================================== //

let downloadData = document.getElementById("downloadData")
downloadData.addEventListener('click', () => {
  exportToCsv("my_data.csv", array1)
})
// from: https://jsfiddle.net/jossef/m3rrLzk0/
let exportToCsv = (filename, rows) => {
  let processRow = (row) => {
    let finalVal = '';
    for (let j = 0; j < row.length; j++) {
      let innerValue = row[j] === null ? '' : row[j].toString();
      if (row[j] instanceof Date) {
        innerValue = row[j].toLocaleString();
      };
      let result = innerValue.replace(/"/g, '""');
      if (result.search(/("|,|\n)/g) >= 0)
        result = '"' + result + '"';
      if (j > 0)
        finalVal += ',';
      finalVal += result;
    }
    return finalVal + '\n';
  };

  let csvFile = '';
  for (let i = 0; i < rows.length; i++) {
    csvFile += processRow(rows[i]);
  }

  let blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  if (navigator.msSaveBlob) { // IE 10+
    navigator.msSaveBlob(blob, filename);
  } else {
    let link = document.createElement("a");
    if (link.download !== undefined) { // feature detection
      // Browsers that support HTML5 download attribute
      let url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}