import tinyGradient from "tinygradient";
import sortBy from "lodash/sortBy";

import luminance from "./javascripts/luminance";
import ImageFile from "./javascripts/image-file";
import ImageColorPicker from "./javascripts/image-color-picker";

document.addEventListener("DOMContentLoaded", () => {
  const input = document.querySelector("input");
  const stage = document.querySelector("#stage");
  const colorsList = document.querySelector(".colors");
  const bg = document.querySelector("#bg");
  const COLOR_COUNT = 5;
  let imageFile, imageColorPicker;

  input.addEventListener("change", (e) => {
    const file = e.target.files[0];
    imageFile = new ImageFile(file);
    if (imageColorPicker) {
      imageColorPicker.imageFile = imageFile;
    } else {
      imageColorPicker = new ImageColorPicker(imageFile);
    }

    [].slice.call(stage.children).map((c) => c.remove());
    [].slice.call(colorsList.children).map((c) => c.remove());

    imageFile.readAsDataURL().then((dataURL) => {
      let img = document.createElement("img");
      img.width = 300;
      img.src = dataURL;
      stage.appendChild(img)  ;
    });

    imageColorPicker.getColors().then((colors) => {
      colors.forEach((color) => {
        let li = document.createElement("li");
        li.style.width = "80px";
        li.style.height = "15px";
        li.style.backgroundColor = bgColor(color);
        colorsList.appendChild(li);
      })

      const sortedColors = sortBy(colors.slice(0, COLOR_COUNT), luminance).reverse();
      const rgbObjects = sortedColors.map(rgbObject);
      const gradient = tinyGradient(rgbObjects)
        .css("radial", "farthest-corner ellipse at top left");

      bg.style.background = gradient;
    });
  });
});

function tap(obj, block) {
  block(obj);
}

function bgColor(rgb) {
  return `rgba(${rgb.join(",")}, 255)`;
}

function rgbObject(rgbArray) {
  return {
    r: rgbArray[0],
    g: rgbArray[1],
    b: rgbArray[2]
  };
}
