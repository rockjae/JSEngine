

// PNG 이미지 생성 및 저장 함수
function createPNGImage(target,url) {
  const pngImage = new Image();
  pngImage.src = url;
  target.pngImage = pngImage;
}

function renderPlayer2() {
  const player = game.player;
  if (player.pngImages && player.pngImages.length > 0) {
    const currentImage = player.pngImages[player.currentImageIndex];
    const imageRatio = currentImage.width / currentImage.height;
    const resizedWidth = player.width;
    const resizedHeight = resizedWidth / imageRatio;
	
    ctx.drawImage(
      currentImage,
      0, 0, currentImage.width, currentImage.height, // 원본 이미지의 좌표와 크기
      player.x - game.scrollOffset, player.y, resizedWidth, resizedHeight // 렌더링할 영역의 좌표와 크기
    );
  }
}