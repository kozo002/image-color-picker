import Promise from "promise";

export default class ImageFile {
  constructor(file) {
    this.file = file;
  }

  readAsDataURL() {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(this.file);
    });
  }

  getDimensions(dataURL) {
    return new Promise((resolve, reject) => {
      this.imageElement = new Image();
      this.imageElement.onload = function(e) {
        const { width, height } = this;
        resolve({ width, height });
      };
      this.imageElement.src = dataURL;
    });
  }
}
