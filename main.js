const fileLabel = document.getElementById('file-label');
const fileInput = document.getElementById('file');
const img = document.querySelector('.thumbnail img');
const canvas = document.getElementById('cs');
const result = document.querySelector('.result');
const preview = document.querySelector('.preview');

let x, y;

fileLabel.addEventListener('click', function () {
    fileInput.click();
});

fileInput.onchange = async () => {
    const selectedFile = fileInput.files[0];
    const base64 = await toBase64(selectedFile);

    img.src = base64;
}

img.addEventListener('click', async function (e) {
    if (e.offsetX) {
        x = e.offsetX;
        y = e.offsetY;
    } else if (e.layerX) {
        x = e.layerX;
        y = e.layerY;
    }

    await useCanvas(canvas, img);

    const p = canvas.getContext('2d').getImageData(x, y, 1, 1).data;

    result.innerHTML = `<span>HEX: ${rgbToHex(p[0], p[1], p[2])}</span>
                        <span>RGB: rgb(${p[0]},${p[1]},${p[2]})</span>`;

    document.body.style.background = rgbToHex(p[0], p[1], p[2]);
}, false);

img.addEventListener('mousemove', async function (e) {
    if (e.offsetX) {
        x = e.offsetX;
        y = e.offsetY;
    } else if (e.layerX) {
        x = e.layerX;
        y = e.layerY;
    }

    await useCanvas(canvas, img);

    const p = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
    
    preview.style.background = rgbToHex(p[0], p[1], p[2]);
}, false);

function toBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

function useCanvas(el, image) {
    return new Promise((resolve, reject) => {
        el.width = image.width;
        el.height = image.height;
        el.getContext('2d').drawImage(image, 0, 0, image.width, image.height);

        resolve();
    });
}

function componentToHex(c) {
    const hex = c.toString(16);

    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function findPos(obj) {
    let curleft = 0, curtop = 0;

    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);

        return { x: curleft, y: curtop };
    }

    return undefined;
}
