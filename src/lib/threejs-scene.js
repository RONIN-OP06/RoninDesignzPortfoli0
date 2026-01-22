// three.js scene setup
import * as THREE from 'three';
import { CONFIG } from './config';

export class ThreeJSScene {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cube = null;
    this.backgroundCubes = [];
    this.scrollRatio = 0;
    this.animationId = null;
    this.time = 0;
    
    if (!this.canvas) {
      throw new Error(`Canvas with id "${canvasId}" not found`);
    }
    
    this._initializeScene();
    this._setupEventListeners();
  }

  _initializeScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000); // Deep space black

    this.camera = new THREE.PerspectiveCamera(
      CONFIG.THREEJS.CAMERA.FOV,
      window.innerWidth / window.innerHeight,
      CONFIG.THREEJS.CAMERA.NEAR,
      CONFIG.THREEJS.CAMERA.FAR
    );
    this.camera.position.z = CONFIG.THREEJS.CAMERA.INITIAL_Z;

    // Optimize renderer for performance
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
    const isLowPerformance = navigator.hardwareConcurrency < 4 || (navigator.deviceMemory && navigator.deviceMemory < 4);
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !isMobile && !isLowPerformance, // Disable antialiasing on mobile/low-end devices
      alpha: true,
      powerPreference: isMobile || isLowPerformance ? "default" : "high-performance"
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(isMobile || isLowPerformance ? 1 : Math.min(window.devicePixelRatio, 2));
    
    // Enable frustum culling for better performance
    this.renderer.sortObjects = false;

    this._createBackgroundCubes();
    this._createMainCube();
  }

  _createMainCube() {
    const geometry = new THREE.BoxGeometry(
      CONFIG.THREEJS.CUBE.SIZE,
      CONFIG.THREEJS.CUBE.SIZE,
      CONFIG.THREEJS.CUBE.SIZE
    );
    
    // wireframe material
    const material = new THREE.MeshBasicMaterial({
      color: 0x00ff88, // cyan green
      wireframe: true,
      transparent: true,
      opacity: 0.95
    });
    
    this.cube = new THREE.Mesh(geometry, material);
    this.cube.position.set(
      CONFIG.THREEJS.CUBE.INITIAL_POSITION.x,
      CONFIG.THREEJS.CUBE.INITIAL_POSITION.y,
      CONFIG.THREEJS.CUBE.INITIAL_POSITION.z
    );
    
    this.scene.add(this.cube);
  }

  _createBackgroundCubes() {
    // background cubes for depth - reduced count for better performance
    const cubeCount = 100; // Reduced from 150 to 100 for lighter load
    const spread = 100;
    const depth = 200;
    const minSize = 0.05;
    const maxSize = 0.25;

    for (let i = 0; i < cubeCount; i++) {
      const size = Math.random() * (maxSize - minSize) + minSize;
      const geometry = new THREE.BoxGeometry(size, size, size);
      
      // random colors for variety
      const colorVariation = Math.random();
      let color;
      if (colorVariation < 0.6) {
        color = new THREE.Color(0xffffff);
      } else if (colorVariation < 0.85) {
        color = new THREE.Color(0x88ddff);
      } else if (colorVariation < 0.95) {
        color = new THREE.Color(0x4a9eff);
      } else {
        // occasional colored ones
        const hue = Math.random();
        if (hue < 0.33) {
          color = new THREE.Color(0xff88ff);
        } else if (hue < 0.66) {
          color = new THREE.Color(0xaa88ff);
        } else {
          color = new THREE.Color(0xffff88);
        }
      }
      
      const material = new THREE.MeshBasicMaterial({
        color: color,
        wireframe: true,
        transparent: true,
        opacity: Math.random() * 0.4 + 0.2
      });
      
      const cube = new THREE.Mesh(geometry, material);
      
      // random positions
      cube.position.set(
        (Math.random() - 0.5) * spread,
        (Math.random() - 0.5) * spread,
        -Math.random() * depth - 20
      );
      
      // store rotation data
      cube.userData = {
        rotationSpeed: {
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.005
        },
        initialZ: cube.position.z,
        floatSpeed: Math.random() * 0.001 + 0.0005
      };
      
      this.scene.add(cube);
      this.backgroundCubes.push(cube);
    }
  }

  _setupEventListeners() {
    // Throttle scroll and resize events for better performance
    let scrollTimeout;
    let resizeTimeout;
    
    window.addEventListener('scroll', () => {
      if (scrollTimeout) return;
      scrollTimeout = requestAnimationFrame(() => {
        this._handleScroll();
        scrollTimeout = null;
      });
    });
    
    window.addEventListener('resize', () => {
      if (resizeTimeout) return;
      resizeTimeout = setTimeout(() => {
        this._handleResize();
        resizeTimeout = null;
      }, 100);
    });
  }

  _handleScroll() {
    const scrollPosition = window.scrollY;
    const docHeight = document.body.scrollHeight - window.innerHeight;
    this.scrollRatio = Math.max(0, Math.min(1, scrollPosition / docHeight));
  }

  _handleResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  _updateScene() {
    this.time += 0.01;
    
    // Update main cube
    if (this.cube) {
      // Rotation
      this.cube.rotation.x += CONFIG.THREEJS.CUBE.ROTATION_SPEED;
      this.cube.rotation.y += CONFIG.THREEJS.CUBE.ROTATION_SPEED;
      
      // Position based on scroll
      this.cube.position.y = CONFIG.THREEJS.CUBE.INITIAL_POSITION.y + 
        (this.scrollRatio * CONFIG.THREEJS.CUBE.POSITION_MULTIPLIER);
      
      // Scale based on scroll
      const scale = Math.max(
        CONFIG.THREEJS.CUBE.MIN_SCALE,
        1 + (this.scrollRatio * CONFIG.THREEJS.CUBE.SCALE_MULTIPLIER)
      );
      this.cube.scale.setScalar(scale);
    }
    
    // Animate background cubes - slow rotation and subtle floating
    // Update only every other frame for better performance
    const shouldUpdateBackground = Math.floor(this.time * 10) % 2 === 0;
    
    if (shouldUpdateBackground) {
      this.backgroundCubes.forEach((cube, index) => {
        // Slow rotation
        cube.rotation.x += cube.userData.rotationSpeed.x;
        cube.rotation.y += cube.userData.rotationSpeed.y;
        cube.rotation.z += cube.userData.rotationSpeed.z;
        
        // Subtle floating motion - different phase for each cube
        const phase = index * 0.1;
        cube.position.y += Math.sin(this.time + phase) * cube.userData.floatSpeed;
        
        // Subtle parallax effect - cubes further back move slower
        const depthFactor = Math.abs(cube.userData.initialZ) / 200;
        cube.position.x += Math.cos(this.time * 0.5 + phase) * cube.userData.floatSpeed * depthFactor;
      });
    }
  }

  _animate() {
    this.animationId = requestAnimationFrame(() => this._animate());
    this._updateScene();
    this.renderer.render(this.scene, this.camera);
  }

  start() {
    this._animate();
  }

  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  dispose() {
    this.stop();
    
    if (this.cube) {
      this.cube.geometry.dispose();
      this.cube.material.dispose();
    }
    
    // cleanup
    this.backgroundCubes.forEach(cube => {
      cube.geometry.dispose();
      cube.material.dispose();
    });
    this.backgroundCubes = [];
    
    if (this.renderer) {
      this.renderer.dispose();
    }
  }
}
