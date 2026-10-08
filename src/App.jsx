import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { ContactShadows } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function CoffeeScene({ progress, reducedMotion }) {
  const groupRef = useRef(null)

  useFrame(({ clock }) => {
    if (!groupRef.current) return

    const floatOffset = reducedMotion ? 0 : Math.sin(clock.elapsedTime * 1.3) * 0.14
    const targetY = 0.35 + floatOffset + progress * 0.7
    const targetRotationY = progress * Math.PI * 2 + (reducedMotion ? 0 : clock.elapsedTime * 0.3)

    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.08)
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.08)
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      reducedMotion ? 0 : Math.sin(clock.elapsedTime * 0.8) * 0.08,
      0.08,
    )
  })

  return (
    <group ref={groupRef} position={[0, 0.35, 0]}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.82, 0.67, 1.24, 48]} />
        <meshStandardMaterial color="#f4ead7" roughness={0.38} metalness={0.05} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <cylinderGeometry args={[0.74, 0.64, 0.58, 48]} />
        <meshStandardMaterial color="#2f2118" roughness={0.9} />
      </mesh>
      <mesh position={[0.86, 0.16, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <torusGeometry args={[0.3, 0.08, 22, 80, Math.PI * 1.5]} />
        <meshStandardMaterial color="#efe2ca" roughness={0.38} metalness={0.05} />
      </mesh>

      {[
        [-1.45, -0.35, 0.5],
        [-1.1, -0.55, -0.15],
        [1.45, -0.45, -0.25],
        [1.1, -0.3, 0.45],
      ].map((bean, index) => (
        <mesh key={index} position={bean} rotation={[0.4, 0.2 + index * 0.3, 0.6]} castShadow>
          <sphereGeometry args={[0.16, 18, 18]} />
          <meshStandardMaterial color="#4b2c1f" roughness={0.55} />
        </mesh>
      ))}
    </group>
  )
}

const menuItems = [
  {
    title: 'Classic Filter Kaapi',
    description: 'Brass davara-tumbler service with deep, balanced decoction and creamy froth.',
  },
  {
    title: 'Jaggery Cold Brew',
    description: 'Slow-steeped Arabica, palm jaggery syrup, orange peel, and a cool coastal breeze vibe.',
  },
  {
    title: 'Benne Bun',
    description: 'Mangaluru-style buttered bun with house-spiced spread and a crisp toasted edge.',
  },
  {
    title: 'Cardamom Chai',
    description: 'Fragrant elaichi chai with ginger warmth for rainy Bangalore evenings.',
  },
]

function App() {
  const [progress, setProgress] = useState(0)
  const [reducedMotion, setReducedMotion] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false,
  )

  useEffect(() => {
    const motionMedia = window.matchMedia('(prefers-reduced-motion: reduce)')
    const applyMotionPreference = (event) => setReducedMotion(event.matches)

    motionMedia.addEventListener('change', applyMotionPreference)

    const ctx = gsap.context(() => {
      if (motionMedia.matches) {
        gsap.set('.reveal', { opacity: 1, y: 0 })
        return
      }

      gsap.utils.toArray('.reveal').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 56 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 84%',
            },
          },
        )
      })

      ScrollTrigger.create({
        trigger: '.app-shell',
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => setProgress(self.progress),
      })
    })

    return () => {
      motionMedia.removeEventListener('change', applyMotionPreference)
      ctx.revert()
    }
  }, [])

  return (
    <>
      <div className="scene-layer" aria-hidden="true">
        <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.7, 4.9], fov: 45 }}>
          <color attach="background" args={['#160f0b']} />
          <ambientLight intensity={0.85} />
          <directionalLight position={[4, 6, 4]} intensity={1.6} castShadow />
          <pointLight position={[-3, 2.3, 2]} intensity={0.55} color="#95b17d" />
          <CoffeeScene progress={progress} reducedMotion={reducedMotion} />
          <ContactShadows opacity={0.36} scale={10} blur={2.4} far={4.2} resolution={512} />
        </Canvas>
      </div>

      <div className="overlay-gradient" aria-hidden="true" />

      <main className="app-shell">
        <section className="hero reveal" id="top">
          <p className="eyebrow">Filter &amp; Fiber · Indiranagar</p>
          <h1>South Indian Heritage meets Silicon Valley Hustle</h1>
          <p>
            Hand-brewed filter coffee, neighborhood warmth, and a workspace pulse for builders,
            dreamers, and early risers.
          </p>
          <a href="#menu" className="cta-btn">
            Explore our menu
          </a>
        </section>

        <section className="content-section reveal" id="about">
          <h2>Rooted in Bengaluru mornings</h2>
          <p>
            We slow-brew authentic South Indian filter coffee in small batches and pair it with the
            leafy, laid-back energy of Indiranagar. Come for a quick kaapi, stay for the aroma,
            conversations, and community.
          </p>
        </section>

        <section className="content-section reveal" id="menu">
          <h2>Menu highlights</h2>
          <div className="menu-grid">
            {menuItems.map((item) => (
              <article key={item.title} className="menu-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="site-footer reveal">
          <p>Filter &amp; Fiber · 12th Main Road, Indiranagar, Bangalore</p>
          <a href="#top" className="footer-link">
            Plan your coffee run
          </a>
        </footer>
      </main>
    </>
  )
}

export default App
