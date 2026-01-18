import { useEffect, useRef } from "react"
import { ThreeJSScene as ThreeJSSceneClass } from "@/lib/threejs-scene"

export function ThreeJSScene() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    canvasRef.current.id = "three-canvas"

    try {
      const scene = new ThreeJSSceneClass("three-canvas")
      sceneRef.current = scene
      scene.start()

      return () => {
        if (sceneRef.current) {
          sceneRef.current.dispose()
          sceneRef.current = null
        }
      }
    } catch (error) {
      console.error("Failed to initialize Three.js scene:", error)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0 pointer-events-none"
      aria-label="3D animated background"
    />
  )
}


