import { useEffect, useRef, memo } from "react"
import * as THREE from "three"

export const ParallaxBackground = memo(function ParallaxBackground() {
  const canvasRef = useRef(null)
  const scrollYRef = useRef(0)

  useEffect(() => {
    if (!canvasRef.current) return

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
    const isLowPerformance = navigator.hardwareConcurrency < 4 || (navigator.deviceMemory && navigator.deviceMemory < 4)
    
    // Always render canvas, but use simpler effects on mobile/low performance
    const useSimpleMode = isMobile || isLowPerformance

    const canvas = canvasRef.current
    canvas.id = "parallax-canvas"

    let scene, camera, renderer, bgMaterial, particleSystem, bgGeometry, particles, particleMaterial
    let animationId = null
    let mouseX = 0
    let mouseY = 0

    try {
      if (!THREE) {
        console.error('Three.js is not loaded')
        return
      }

      scene = new THREE.Scene()
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 5

      renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: !useSimpleMode,
        alpha: true,
        powerPreference: useSimpleMode ? "default" : "high-performance"
      })
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(useSimpleMode ? 1 : Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x000000, 0)
      
      // Ensure canvas is visible
      canvas.style.display = 'block'
      canvas.style.visibility = 'visible'
      
      console.log('ParallaxBackground initialized', { useSimpleMode, width: window.innerWidth, height: window.innerHeight })
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
          
          vec2 parallax = vec2(mouseX * 0.1, mouseY * 0.1 + scrollY * 0.3);
          uv += parallax;
          
          // Much brighter, more visible colors with purple/blue gradient
          vec3 color1 = vec3(0.2, 0.1, 0.35);
          vec3 color2 = vec3(0.3, 0.2, 0.45);
          vec3 color3 = vec3(0.25, 0.15, 0.40);
          vec3 color4 = vec3(0.15, 0.2, 0.35);
          
          float dist = distance(uv, vec2(0.5, 0.5));
          vec3 bgColor = mix(color1, color2, dist * 2.0);
          
          float wave1 = sin(uv.x * 5.0 + time * 0.5) * 0.05;
          float wave2 = sin(uv.y * 5.0 + time * 0.7) * 0.05;
          float wave3 = sin((uv.x + uv.y) * 3.0 + time * 0.3) * 0.06;
          
          bgColor += wave1 + wave2 + wave3;
          bgColor = mix(bgColor, color3, scrollY * 0.3);
          bgColor = mix(bgColor, color4, sin(time + scrollY) * 0.2);
          
          float noise = sin(uv.x * 20.0 + time) * sin(uv.y * 20.0 + time * 0.7) * 0.02;
          bgColor += noise;
          
          // Add gradient overlay for depth - brighter
          float gradient = mix(0.9, 1.3, uv.y);
          bgColor *= gradient;
          
          // Ensure minimum brightness
          bgColor = max(bgColor, vec3(0.15, 0.1, 0.25));
          
          gl_FragColor = vec4(bgColor, 1.0);
        }
      `
    })
    
      const bgPlane = new THREE.Mesh(bgGeometry, bgMaterial)
      bgPlane.position.z = -10
      scene.add(bgPlane)

      const particleCount = useSimpleMode ? 50 : 200
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
        size: useSimpleMode ? 0.15 : 0.1,
        vertexColors: true,
        transparent: true,
        opacity: useSimpleMode ? 0.4 : 0.6,
        blending: THREE.AdditiveBlending
      })
      
      particleSystem = new THREE.Points(particles, particleMaterial)
      scene.add(particleSystem)

      let mouseTimeout = null
      const handleMouseMove = useSimpleMode ? null : (e) => {
        if (mouseTimeout) return
        mouseTimeout = requestAnimationFrame(() => {
          mouseX = (e.clientX / window.innerWidth) * 2 - 1
          mouseY = -(e.clientY / window.innerHeight) * 2 + 1
          mouseTimeout = null
        })
      }
      
      if (!useSimpleMode && handleMouseMove) {
        window.addEventListener('mousemove', handleMouseMove, { passive: true })
      }

      let scrollTimeout = null
      const handleScroll = () => {
        if (scrollTimeout) return
        scrollTimeout = setTimeout(() => {
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        scrollYRef.current = docHeight > 0 ? window.scrollY / docHeight : 0
          scrollTimeout = null
        }, 16) // ~60fps
      }
      
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()

      const handleResize = () => {
        const width = window.innerWidth
        const height = window.innerHeight
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
      
      window.addEventListener('resize', handleResize, { passive: true })

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
        
        if (bgMaterial?.uniforms) {
          bgMaterial.uniforms.time.value = time
          bgMaterial.uniforms.scrollY.value = scrollYRef.current
          bgMaterial.uniforms.mouseX.value = mouseX
          bgMaterial.uniforms.mouseY.value = mouseY
        }
        
        if (particleSystem?.geometry?.attributes?.position && !useSimpleMode) {
          particleSystem.rotation.y += 0.001
          const positions = particleSystem.geometry.attributes.position.array
          const length = positions.length
          for (let i = 1; i < length; i += 3) {
            positions[i] += Math.sin(time + i) * 0.002
          }
          particleSystem.geometry.attributes.position.needsUpdate = true
        }
        
        if (renderer && scene && camera) {
          renderer.render(scene, camera)
        }
      }
      
      animate()
      
      console.log('ParallaxBackground animation started')

      return () => {
        isMounted = false
        if (animationId !== null) {
          cancelAnimationFrame(animationId)
          animationId = null
        }
        if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('scroll', handleScroll)
        window.removeEventListener('resize', handleResize)
        if (scrollTimeout) clearTimeout(scrollTimeout)
        if (mouseTimeout) cancelAnimationFrame(mouseTimeout)
        
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
      className="fixed inset-0 w-full h-full z-[1] pointer-events-none"
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
      aria-label="Parallax background"
    />
  )
})


