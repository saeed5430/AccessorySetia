import { useEffect, useRef } from "react"
import {
  AmbientLight,
  BufferGeometry,
  Clock,
  DirectionalLight,
  EdgesGeometry,
  Float32BufferAttribute,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  WebGLRenderer,
} from "three"

const createGemGeometry = () => {
  const sides = 8
  const tableRadius = 0.5
  const tableY = 0.36
  const culetY = -1.3
  const positions: number[] = []
  const indices: number[] = []

  for (let i = 0; i < sides; i++) {
    const angle = (i / sides) * Math.PI * 2
    positions.push(
      Math.cos(angle) * tableRadius,
      tableY,
      Math.sin(angle) * tableRadius,
    )
  }

  for (let i = 0; i < sides; i++) {
    const angle = ((i + 0.5) / sides) * Math.PI * 2
    positions.push(Math.cos(angle), 0, Math.sin(angle))
  }

  positions.push(0, culetY, 0)

  for (let i = 1; i < sides - 1; i++) {
    indices.push(0, i + 1, i)
  }

  const culet = sides * 2
  for (let i = 0; i < sides; i++) {
    const next = (i + 1) % sides
    const t0 = i
    const t1 = next
    const g0 = sides + i
    const g1 = sides + next
    indices.push(t0, t1, g0, t1, g1, g0, g0, g1, culet)
  }

  const geometry = new BufferGeometry()
  geometry.setAttribute("position", new Float32BufferAttribute(positions, 3))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}

function GemSpinner() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    const scene = new Scene()
    const camera = new PerspectiveCamera(45, 1, 0.1, 100)
    camera.position.set(0, 0.3, 2.6)
    camera.lookAt(0, -0.47, 0)

    const renderer = new WebGLRenderer({ antialias: true, alpha: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))
    const size = container.clientWidth || 32
    renderer.setSize(size, size)
    renderer.setClearColor(0x000000, 0)
    container.appendChild(renderer.domElement)

    const geometry = createGemGeometry()
    const material = new MeshPhongMaterial({
      color: 0xc0c0c0,
      specular: 0xffffff,
      shininess: 110,
      flatShading: true,
      polygonOffset: true,
      polygonOffsetFactor: 1,
      polygonOffsetUnits: 1,
    })
    const gem = new Mesh(geometry, material)
    gem.rotation.set(0.16, 0, 0.38)

    const edges = new EdgesGeometry(geometry)
    const edgeMaterial = new LineBasicMaterial({ color: 0x000000 })
    gem.add(new LineSegments(edges, edgeMaterial))
    scene.add(gem)

    const ambient = new AmbientLight(0xffffff, 0.5)
    const key = new DirectionalLight(0xffffff, 1.8)
    key.position.set(2, 4, 3)
    const rim = new DirectionalLight(0xe4e4e7, 0.9)
    rim.position.set(-3, 0.5, -2)
    const spark = new PointLight(0xffffff, 1.6, 0, 0)
    spark.position.set(-1.5, 2.5, 3)
    scene.add(ambient, key, rim, spark)

    let rafId = 0
    const clock = new Clock()

    const tick = () => {
      gem.rotation.y += clock.getDelta() * 0.7
      renderer.render(scene, camera)
      rafId = requestAnimationFrame(tick)
    }

    if (reduceMotion) {
      renderer.render(scene, camera)
    } else {
      rafId = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(rafId)
      geometry.dispose()
      material.dispose()
      edges.dispose()
      edgeMaterial.dispose()
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div ref={containerRef} aria-hidden="true" className="size-10" />
  )
}

export { GemSpinner }
