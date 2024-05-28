

// PNG 이미지 생성 및 저장 함수
function createPNGImage(target,url) {
  const pngImage = new Image();
  pngImage.src = url;
  target.pngImage = pngImage;
}