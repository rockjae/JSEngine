// game.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const keysPressed = {};

// 게임 객체
const game = {
    player: {
        x: 50,
        y: 50,
        width: 64,
        height: 45,
        velocity: 0,
        jumpForce: 15,
        isJumping: false,
		pngImages: [], // PNG 이미지를 저장할 속성 추가    
		currentImageIndex: 0, // 현재 이미지 인덱스 추가
		animationInterval: null // 애니메이션 인터벌 ID
    },
    platforms: [
        { x: 0, y: 300, width: 200, height: 20 },
        { x: 400, y: 200, width: 150, height: 20 }
    ],
    scrollOffset: 0
};

function gameInit(){
	pushPlayerImage();
}

function pushPlayerImage(){
	const playerImage1 = new Image();
		playerImage1.src = 'cat1.png';
		playerImage1.onload = () => {
		game.player.pngImages.push(playerImage1);
	};
	
	const playerImage2 = new Image();
		playerImage2.src = 'cat2.png';
		playerImage2.onload = () => {
		  game.player.pngImages.push(playerImage2);

		  // 애니메이션 인터벌 시작
		  updateAnimation();
	};
}


// 게임 루프
function gameLoop() {
    // 화면 지우기
    ctx.clearRect(0, 0, canvas.width, canvas.height);
	
    // 플레이어 이동
	playerMove();
	
    // 플레이어 점프
    PlayerJump();

    // 플랫폼 렌더링
    renderPlatforms();

    // 플레이어 렌더링
    renderPlayer();

    // 다음 프레임을 위해 requestAnimationFrame 호출
    requestAnimationFrame(gameLoop);
}

function playerMove(){
	const player = game.player;
	const moveSpeed = 5; // 이동 속도

	// 이동 처리
	if (keysPressed['ArrowLeft']) {
		player.x -= moveSpeed;
	}
	if (keysPressed['ArrowRight']) {
		player.x += moveSpeed;
	}
}

// 플레이어 이동 처리
function PlayerJump() {
    const player = game.player;
    const gravity = 0.5;
	const jumpDuration = 0.5; // 점프 지속 시간 (초)

    // 중력 적용
    player.velocity += gravity;

    // 최대 낙하 속도 제한
    if (player.velocity > 20) {
        player.velocity = 20;
    }
	
	if (!player.isJumping && keysPressed['ArrowUp']) {
        player.isJumping = true;	
		player.jumpTimer = 0; // 점프 타이머 초기화
		player.velocity = -player.jumpForce; // 점프력 적용
    }
	
    // 새로운 y 위치 계산
    player.y += player.velocity;
	
	// 바닥에 닿으면 점프 중지
	let isOnPlatform = false;
	for (const platform of game.platforms) {
	  if (isColliding(player, platform)) {
		player.y = platform.y - player.height;
		player.isJumping = false;
		player.jumpTimer = 0; // 점프 타이머 초기화
		player.velocity = 0;
		isOnPlatform = true;
		break;
	  }
	}

	// 마지막 플랫폼을 지나친 경우 점프 가능하도록 설정
	if (!isOnPlatform) {
	  player.isJumping = true;
	}
}

// 플레이어와 플랫폼 충돌 감지 함수
function isColliding(player, platform) {
  return (
    player.y + player.height >= platform.y &&
    player.y + player.height <= platform.y + platform.height &&
    player.x + player.width >= platform.x &&
    player.x <= platform.x + platform.width
  );
}

// 플랫폼 렌더링
function renderPlatforms() {
    game.platforms.forEach(platform => {
        ctx.fillRect(platform.x - game.scrollOffset, platform.y, platform.width, platform.height);
    });
}

function renderPlayer() {
  const player = game.player;

  if (player.pngImages && player.pngImages.length > 0) {
    const currentImage = player.pngImages[player.currentImageIndex];
    const imageRatio = currentImage.width / currentImage.height;
    const resizedWidth = player.width;
    const resizedHeight = resizedWidth / imageRatio;

    // 플레이어 방향에 따라 회전 각도 설정
    let rotationAngle = 1;
    if (keysPressed['ArrowLeft']) {
      rotationAngle = 1;
    } else if (keysPressed['ArrowRight']) {
      rotationAngle = -1;
    }

    // 회전을 위한 변환 설정
    ctx.save();
    ctx.translate(player.x - game.scrollOffset + resizedWidth / 2, player.y + resizedHeight / 2);
    ctx.scale(-rotationAngle, 1); // 가로로 반전시키기
    ctx.drawImage(
      currentImage,
      0, 0, currentImage.width, currentImage.height, // 원본 이미지의 좌표와 크기
      -resizedWidth / 2, -resizedHeight / 2, resizedWidth, resizedHeight // 렌더링할 영역의 좌표와 크기
    );
    ctx.restore();
  }
}

function updateAnimation() {
	  const player = game.player;
	  player.currentImageIndex = (player.currentImageIndex + 1) % player.pngImages.length;
	  
	  setTimeout(updateAnimation, 100); // 최초 호출
}

document.addEventListener('keydown', event => {
  keysPressed[event.code] = true;
});

document.addEventListener('keyup', event => {
  delete keysPressed[event.code];
});

gameInit();
// 게임 시작
gameLoop();