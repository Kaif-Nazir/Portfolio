import * as THREE from 'three';

// Inject responsive canvas styling
const style = document.createElement('style');
style.innerHTML = `
  #background-animation {
    position: fixed;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    z-index: -1;
  }
`;
document.head.appendChild(style);

// Container setup
const canvasContainer = document.createElement('div');
canvasContainer.id = 'background-animation';
document.body.appendChild(canvasContainer);

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 3000);
camera.position.z = 800;

// Renderer setup
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor('0x000000');
canvasContainer.appendChild(renderer.domElement);

// Starfield setup
const starCount = window.innerWidth > 1000 ? 3000 : 1000;
const starGeometry = new THREE.BufferGeometry();
const starPositions = new Float32Array(starCount * 3);

for (let i = 0; i < starCount * 3.5; i++) {
  const i3 = i*2;
  starPositions[i3 + 0] = (Math.random() - 0.5) * 1000; // X
  starPositions[i3 + 1] = (Math.random() - 0.5) * 1500; // Y
  starPositions[i3 + 2] = -Math.random() * 3000 - 800; // Z (always behind)
}

starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

// Points material with circle particles
const starMaterial = new THREE.PointsMaterial({
  color: 'cyan',
  size: 1, // smaller size for high performance
  transparent: true,
  opacity: 0.8,
  depthWrite: false,  // Disable depth writing for performance
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Adding a mesh (a large sphere as background effect)
const backgroundGeometry = new THREE.SphereGeometry(1000, 64, 64); // Large sphere to act as background
const backgroundMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000, // Black sphere to make stars more prominent
  side: THREE.BackSide, // Only the inside of the sphere is visible
});
const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
scene.add(backgroundMesh);

// Meteor head (loaded asynchronously)
let meteorHead;
const textureLoader = new THREE.TextureLoader();
textureLoader.load('imgs/blue_star_update_b.png', (spriteTexture) => {
  const spriteMaterial = new THREE.SpriteMaterial({
    map: spriteTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  meteorHead = new THREE.Sprite(spriteMaterial);
  meteorHead.scale.set(17, 17, 1);
  scene.add(meteorHead);
});
function getVisibleBounds(camera) {
  const distance = camera.position.z;
  const height = 2 * Math.tan((camera.fov * Math.PI) / 360) * distance;
  const width = height * camera.aspect;
  return {
    left: -width / 2,
    right: width / 2,
    top: height / 2,
    bottom: -height / 2
  };
}

// Tail using fading spheres
const tailLength = 18;
const tailSpheres = [];
for (let i = 0; i < tailLength; i++) {
  const radius = 5 - i * 0.19;
  const opacity = 0.9 - i * 0.025;
  const tailGeom = new THREE.SphereGeometry(radius, 12, 12);
  const tailMat = new THREE.MeshBasicMaterial({
    color: 0x00aaff,
    transparent: true,
    opacity,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const tail = new THREE.Mesh(tailGeom, tailMat);
  scene.add(tail);
  tailSpheres.push(tail);
}

// Meteor state

const position = new THREE.Vector3(-1500, 600, 0);
const scaleFactor = Math.min(window.innerWidth / 1440, 1);
const direction = new THREE.Vector3(10, -2.5, 0).normalize();  // Pure direction

// Scale based on screen size and speed
const speed = 7 * scaleFactor;
const velocity = direction.clone().multiplyScalar(speed);
const trailPositions = Array(tailLength).fill(position.clone());

let lastMeteorTime = 0;
let meteorCooldown = 10000;
let isMeteorActive = true;

// Animation loop
function animate(time) {
  requestAnimationFrame(animate);

  if (!isMeteorActive && time - lastMeteorTime > meteorCooldown) {
    isMeteorActive = true;
    lastMeteorTime = time;
    position.set(-1000, 600, 0);
  }

  if (isMeteorActive) {
    position.add(velocity);
    if (meteorHead) meteorHead.position.copy(position);

    trailPositions.pop();
    trailPositions.unshift(position.clone());
    tailSpheres.forEach((tail, idx) => {
      tail.position.copy(trailPositions[idx]);
    });

    if (position.x > 1500 || position.y < -1000) {
      isMeteorActive = false;
    }
  } else {
    if (meteorHead) meteorHead.position.set(9999, 9999, 9999);
    tailSpheres.forEach((tail) => tail.position.set(9999, 9999, 9999));
  }

  stars.rotation.y += 0.0003; // Slow rotation to give a dynamic look
  renderer.render(scene, camera);
}
animate();

// Responsive resizing (debounced)
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  }, 100);
});