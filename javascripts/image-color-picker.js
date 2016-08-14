import quantize from "quantize";

export default class ImageColorPicker {
  constructor(imageFile) {
    this.imageFile = imageFile;
    this.debug = true;
  }

  getColors() {
    return new Promise((resolve, reject) => {
      this.imageFile.readAsDataURL().then((dataURL) => {
        this.imageFile.getDimensions(dataURL).then((dimensions) => {
          const resizedDimensions = this.calcDimensions(dimensions, 800);
          this.dimensions = resizedDimensions;
          this.makeCanvas();
          resolve(this.sampleColors());
          this.removeCanvas();
        });
      });
    });
  }

  calcDimensions(dimensions, maxLength) {
    let result = { with: 0, height: 0 };
    const { width, height } = dimensions;
    if (width >= height && width > maxLength) {
      const rate = maxLength / width;
      const newHeight = height * rate;
      return {
        width: maxLength,
        height: newHeight
      };
    } else if (height > width && height > maxLength) {
      const rate = maxLength / height;
      const newWidth = width * rate;
      return {
        height: maxLength,
        width: newWidth
      };
    } else {
      return dimensions;
    }
  }

  makeCanvas() {
    this.removeCanvas();
    this.canvas = document.createElement("canvas");
    this.context = this.canvas.getContext("2d");
    const { width, height } = this.dimensions;
    this.canvas.width = width;
    this.canvas.height = height;
    this.canvas.style.position = "absolute";
    if (this.debug) {
      this.canvas.style.top = 50 + "px";
      this.canvas.style.left = 300 + "px";
    } else {
      this.canvas.style.top = `-${height + 2}px`;
      this.canvas.style.left = `-${width + 2}px`;
    }
    document.body.appendChild(this.canvas);
  }

  removeCanvas() {
    if (this.canvas != null) { this.canvas.remove(); }
  }

  sampleColors() {
    const { width, height } = this.dimensions;
    this.context.drawImage(this.imageFile.imageElement, 0, 0, width, height);
    const imageData = this.context.getImageData(0, 0, width, height);
    const colorsArray = convertToColorsArrayFrom(imageData.data);
    const opaqueColorsArray = colorsArray.filter((c) => c[3] > 128);
    const removedAlphaChannelColorsArray = opaqueColorsArray.map((c) => { c.splice(3); return c })
    const colorMap = quantize(removedAlphaChannelColorsArray, 10);
    const colorPalette = colorMap.palette();
    return colorPalette;
  }
}

function convertToColorsArrayFrom(rawImageData) {
  let result = [];
  for (let index = 0; index < rawImageData.length; index += 4) {
    result.push([
      rawImageData[index],
      rawImageData[index + 1],
      rawImageData[index + 2],
      rawImageData[index + 3],
    ]);
  }
  return result;
}
