export default function luminance(RGB) {
  const R = 0.298912;
  const G = 0.586611;
  const B = 0.114478;
  return Math.floor(R * RGB[0] + G * RGB[1] + B * RGB[2]);
}
