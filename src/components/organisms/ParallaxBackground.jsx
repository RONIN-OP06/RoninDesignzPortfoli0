import { useEffect, useRef } from "react"
import * as THREE from "three"

export function ParallaxBackground() {
  const canvasRef = useRef(null)
  const scrollYRef = useRef(0)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    canvas.id = "parallax-canvas"

    let scene, camera, renderer, bgMaterial, particleSystem, bgGeometry, particles, particleMaterial
    let animationId = null
    let mouseX = 0
    let mouseY = 0

    try {
      // setup scene
      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 5

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
        powerPreference: "high-performance"
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)

      // parallax bg shader
      bgGeometry = new THREE.PlaneGeometry(2, 2)
      bgMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        scrollY: { value: 0 },
        mouseX: { value: 0 },
        mouseY: { value: 0 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float scrollY;
        uniform float mouseX;
        uniform float mouseY;
        varying vec2 vUv;
        
        void main() {
          vec2 uv = vUv;
          
          // parallax from scroll/mouse
          vec2 parallax = vec2(mouseX * 0.1, mouseY * 0.1 + scrollY * 0.3);
          uv += parallax;
          
          // gradient colors
          vec3 color1 = vec3(0.1, 0.05, 0.2);
          vec3 color2 = vec3(0.2, 0.1, 0.3);
          vec3 color3 = vec3(0.15, 0.05, 0.25);
          vec3 color4 = vec3(0.05, 0.1, 0.2);
          
          // radial gradient
          float dist = distance(uv, vec2(0.5, 0.5));
          vec3 bgColor = mix(color1, color2, dist * 2.0);
          
          // waves
          float wave1 = sin(uv.x * 5.0 + time * 0.5) * 0.02;
          float wave2 = sin(uv.y * 5.0 + time * 0.7) * 0.02;
          float wave3 = sin((uv.x + uv.y) * 3.0 + time * 0.3) * 0.03;
          
          bgColor += wave1 + wave2 + wave3;
          
          // color shift on scroll
          bgColor = mix(bgColor, color3, scrollY * 0.2);
          bgColor = mix(bgColor, color4, sin(time + scrollY) * 0.1);
          
          // noise texture
          float noise = sin(uv.x * 20.0 + time) * sin(uv.y * 20.0 + time * 0.7) * 0.01;
          bgColor += noise;
          
          gl_FragColor = vec4(bgColor, 1.0);
        }
      `
    })
    
      const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial)
      bgPlane.position.z = -10
      scene.add(bgPlane)

      // particles
      const particleCount = 500
      particles = new THREE.BufferGeometry()
    const positions = new Float32Array(particleCount * 3)
    const colors = new Float32Array(particleCount * 3)
    
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 30
      positions[i + 1] = (Math.random() - 0.5) * 30
      positions[i + 2] = (Math.random() - 0.5) * 20
      
      const colorChoice = Math.random()
      if (colorChoice < 0.33) {
        colors[i] = 1.0; colors[i + 1] = 0.2; colors[i + 2] = 0.2
      } else if (colorChoice < 0.66) {
        colors[i] = 0.5; colors[i + 1] = 0.0; colors[i + 2] = 1.0
      } else {
        colors[i] = 0.0; colors[i + 1] = 0.5; colors[i + 2] = 1.0
      }
    }
    
      particles.setAttribute('position', new THREE.BufferAttribute(positions, 3))
      particles.setAttribute('color', new THREE.BufferAttribute(colors, 3))
      
      particleMaterial = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      })
      
      particleSystem = new THREE.Points(particles, particleMaterial)
      scene.add(particleSystem)

      // Mouse tracking
      const handleMouseMove = (e) => {
        mouseX = (e.clientX / window.innerWidth) * 2 - 1
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1
      }
      
      window.addEventListener('mousemove', handleMouseMove)

      // Scroll tracking
      const handleScroll = () => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        scrollYRef.current = docHeight > 0 ? window.scrollY / docHeight : 0
      }
      
      window.addEventListener('scroll', handleScroll)
      handleScroll() // init scroll

      // resize handler
      const handleResize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
      
      window.addEventListener('resize', handleResize)

      // animation loop
      let time = 0
      let isMounted = true
      
      const animate = () => {
        if (!canvasRef.current || !isMounted) {
          if (animationId !== null) {
            cancelAnimationFrame(animationId)
            animationId = null
          }
          return
        }
        
        animationId = requestAnimationFrame(animate)
        time += 0.01
        
        // update shader uniforms (only if material exists)
        if (bgMaterial?.uniforms) {
          bgMaterial.uniforms.time.value = time
          bgMaterial.uniforms.scrollY.value = scrollYRef.current
          bgMaterial.uniforms.mouseX.value = mouseX
          bgMaterial.uniforms.mouseY.value = mouseY
        }
        
        // animate particles (only if system exists)
        if (particleSystem?.geometry?.attributes?.position) {
          particleSystem.rotation.y += 0.001
          const positions = particleSystem.geometry.attributes.position.array
          const length = positions.length
          for (let i = 1; i < length; i += 3) {
            positions[i] += Math.sin(time + i) * 0.002
          }
          particleSystem.geometry.attributes.position.needsUpdate = true
        }
        
        // render only if all components exist
        if (renderer && scene && camera) {
          renderer.render(scene, camera)
        }
      }
      
      animate()

      // cleanup
      return () => {
        isMounted = false
        if (animationId !== null) {
          cancelAnimationFrame(animationId)
          animationId = null
        }
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
        
        if (bgGeometry) bgGeometry.dispose()
        if (bgMaterial) bgMaterial.dispose()
        if (particles) particles.dispose()
        if (particleMaterial) particleMaterial.dispose()
        if (renderer) renderer.dispose()
      }
    } catch (error) {
      console.error('Error initializing ParallaxBackground:', error)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      aria-label="Parallax background"
    />
  )
}


