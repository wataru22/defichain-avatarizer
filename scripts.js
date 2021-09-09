// ************************ Drag and drop ***************** //
let dropArea = document.getElementById("upload-zone")
let root = document.getElementById("root")

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
})

// Highlight drop area when item is dragged over it
;['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
})

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('active')
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
  files = [...files]
  loadCanvas(files[0])
//   files.forEach(previewFile)
}

//https://stackoverflow.com/questions/8126623/downloading-canvas-element-to-an-image

var dataURL;

var canvas = new fabric.StaticCanvas('canvas');
let design = null

function stepChange(step) {
  root.classList.remove('current-step-1')
  root.classList.remove('current-step-2')
  root.classList.remove('current-step-3')
  root.classList.add('current-step-'+step)
  if (step===1) {
    document.getElementById('fileElem').value = '';
    canvas.clear();
    dropArea.classList.remove('highlight')
  }
}

function loadCanvas(file) {
  if (!file) return

  dropArea.classList.add('loaded')
  stepChange(2)

  var reader = new FileReader();
 
  reader.onload = function (f) {
    canvas.clear();
    var data = f.target.result;
    
    // Logo
    selectDesign(0)
  
    //Image
    fabric.Image.fromURL(data, function (img) {
      var oImg = img.set({
        left: 0,
        top: 0
      });
      if (oImg.width > oImg.height) {
        oImg.scaleToHeight(500);
      } else {
        oImg.scaleToWidth(500);
      }
      canvas
        .add(oImg)
        .centerObject(oImg)
        .sendToBack(oImg)
        .renderAll();
    });
  };
  reader.readAsDataURL(file);
}

document.getElementById('fileElem').addEventListener("change", function (e) {
  var file = e.target.files[0];
  loadCanvas(file);
});

document.getElementById('select-btn').addEventListener("click", function (e) {
  stepChange(3)
});

document.getElementById('back-btn-1').addEventListener("click", function (e) {
  stepChange(1)
});

document.getElementById('back-btn-2').addEventListener("click", function (e) {
  stepChange(2)
});

document.getElementById('select-next-btn').addEventListener("click", function (e) {
  selectDesign(1)
});

document.getElementById('select-prev-btn').addEventListener("click", function (e) {
  selectDesign(-1)
});

document.getElementById('download-btn').addEventListener("click", function (e) {
  var dataURL = canvas.toDataURL({format: 'png', quality: 0.8});
  // this can be used to download any image from webpage to local disk
  var xhr = new XMLHttpRequest();
  xhr.responseType = 'blob';
  xhr.onload = function () {
    let a = document.createElement('a');
    a.href = window.URL.createObjectURL(xhr.response);
    a.download = 'image_name.png';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    a.remove()
  };
  xhr.open('GET', dataURL); // This is to download the canvas Image
  xhr.send();
});

let currentDesign = 1
const designCount = 4
var svg = '<svg xmlns="http://www.w3.org/2000/svg" height="500px" id="logo" preserveAspectRatio="xMidYMid meet" viewBox="0 0 480 480" width="480pt" ><path fill="#FF00AF" d="m2237 4794c-1-1-33-5-72-8-87-8-163-20-286-47l-95-21-74-227c-41-124-76-228-78-231-1-2-101 45-221 104l-218 109-44-27c-24-15-53-32-64-39s-22-15-25-18-27-20-54-39c-62-42-188-144-242-197l-42-39 404-202 404-203 1-47c0-26 2-67 4-92s6-107 10-184l7-139-134 7c-73 4-176 9-228 12-52 2-98 8-101 12-4 4-96 184-204 400-108 215-200 392-204 392s-21-17-38-37c-18-21-46-54-64-73-72-80-228-300-246-347-3-7 43-110 102-228 59-119 106-217 104-218-2-2-105-36-229-76s-226-75-228-76c-6-5-51-235-62-312-14-106-23-273-14-273 4 0 217 70 473 155s477 155 491 156c21 1 138-4 355-16 28-1 117-6 200-10 82-4 159-8 172-10 13-1 81-61 174-154l152-152-155-153c-84-84-160-153-168-153-33 0-338-15-380-18-25-2-118-6-206-10l-161-7-470 156c-259 86-473 156-477 156-7 0 0-177 9-232 2-13 6-43 9-68s8-54 10-65 12-60 21-110c10-49 22-95 27-102 5-6 107-44 226-83 119-40 220-75 225-79 4-4-40-101-98-215s-105-213-105-220c0-41 322-466 353-466 3 0 94 177 202 392 108 216 200 396 203 400 7 6 73 11 340 24l123 6-6-138c-4-77-9-164-10-194-2-30-4-72-4-92l-1-37-405-203-404-203 47-43c113-104 358-286 415-308 8-3 110 43 227 101 117 59 216 103 220 98 4-4 40-107 80-228s73-221 74-222c3-4 182-42 226-48 25-3 52-8 60-10 20-5 137-16 228-20 71-4 73-4 66 18-3 12-74 226-156 476-83 249-150 468-151 485 0 30 11 250 18 371 2 33 7 125 10 205 4 80 11 152 15 160 5 8 74 80 154 159l145 144v-989c0-544 0-1000 1-1013v-23l132 6c72 4 134 9 137 10 3 2 33 7 66 10 33 4 67 9 75 11s30 7 47 10c111 19 296 73 430 126 476 188 892 540 1159 979 117 193 226 445 270 625 21 89 43 190 50 230 4 28 9 57 11 65 22 106 22 619-1 658-2 4-6 30-10 57-13 105-60 291-106 420-248 693-818 1249-1513 1475-88 28-218 63-282 74-151 28-247 39-368 40l-99 1 1-1009v-1010l-153 153-153 152-2 57c-2 31-4 84-6 117s-6 123-10 200c-3 77-8 169-10 205-12 191-19 157 149 663 86 257 156 469 156 471 0 4-130 3-133 0zm940-699c41-19 77-35 80-35s17-8 31-19c15-10 50-31 77-46 133-73 352-262 466-401 319-390 468-863 426-1359-7-84-8-92-33-220-39-195-143-449-254-620-242-370-616-657-1012-775l-27-8v1782c0 981 2 1786 5 1788 7 8 150-44 241-87z" transform="matrix(.1 0 0 -.1 0 480)"/></svg>';

let designTitles = [
  'title-1',
  'title-2',
  'title-3',
  'title-4',
  'title-5'
]

const designNoEl = document.getElementById("current-design-no");
designNoEl.innerHTML = currentDesign
const designCountEl = document.getElementById("design-count");
designCountEl.innerHTML = designCount
const designTitleEl = document.getElementById("design-title");
designTitleEl.innerHTML = designTitles[currentDesign-1]

function selectDesign(d) {
  currentDesign = currentDesign + d
  if (currentDesign === 0) currentDesign = designCount
  else if (currentDesign > designCount) currentDesign = 1

  if (design) canvas.remove(design);

  designNoEl.innerHTML = currentDesign
  designTitleEl.innerHTML = designTitles[currentDesign-1]

  if (currentDesign === 1) {
    fabric.loadSVGFromString(svg, (objects, options) => {
      design = fabric.util.groupSVGElements(objects, options);
      design.globalCompositeOperation = 'multiply';
      design.scaleToWidth(100)
        .scaleToHeight(100)
        .set({
          left: 72,
          top: 72
        });
      canvas.add(design);
    });
  }
  else if (currentDesign === 2) {
    fabric.loadSVGFromString(svg, (objects, options) => {
      design = fabric.util.groupSVGElements(objects, options);
      design.globalCompositeOperation = 'overlay';
      design.scaleToWidth(100)
        .scaleToHeight(100)
        .set({
          left: 300,
          top: 300
        });
      canvas.add(design);
    });
  }
  else if (currentDesign === 3) {
    fabric.loadSVGFromString(svg, (objects, options) => {
      design = fabric.util.groupSVGElements(objects, options);
      design.globalCompositeOperation = 'screen';
      design.scaleToWidth(300)
        .scaleToHeight(300)
        .set({
          top: 0,
          left: 0
        });
      canvas.add(design);
    });
  }
  else if (currentDesign === 4) {
    fabric.loadSVGFromString(svg, (objects, options) => {
      design = fabric.util.groupSVGElements(objects, options);
      design.globalCompositeOperation = 'exclusion';
      design.scaleToWidth(300)
        .scaleToHeight(300)
        .set({
          top: 0,
          left: 0
        });
      canvas.add(design);
    });
  }
}