import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function DNA3DViewer({ rotationSpeed = 1.5, zoom = 100 }) {
  const containerRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isDraggingRef = useRef(false);
  const prevMouseRef = useRef({ x: 0, y: 0 });
  const rotationSpeedRef = useRef(rotationSpeed);
  const cameraRef = useRef(null);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    if (cameraRef.current) {
      const zoomValue = Math.max(60, Math.min(150, zoom));
      cameraRef.current.position.set(0, 0, 45 * (100 / zoomValue));
    }
  }, [zoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 300;

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    const initialZoom = Math.max(60, Math.min(150, zoom));
    camera.position.set(0, 0, 45 * (100 / initialZoom));
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    container.innerHTML = "";
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x06b6d4, 1.5);
    dirLight1.position.set(10, 20, 15);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x8b5cf6, 1.5);
    dirLight2.position.set(-10, -20, -15);
    scene.add(dirLight2);

    // 5. DNA Helix Group
    const dnaGroup = new THREE.Group();

    const numPairs = 30;
    const radius = 6;
    const pitch = 0.7;
    const turnRate = 0.35;

    const sphereGeo = new THREE.SphereGeometry(0.5, 16, 16);
    const cylinderGeo = new THREE.CylinderGeometry(0.12, 0.12, 1, 8);

    const colors = [0x10b981, 0xf59e0b, 0x06b6d4, 0x8b5cf6];

    for (let i = 0; i < numPairs; i++) {
      const y = (i - numPairs / 2) * pitch;
      const angle = i * turnRate;

      const x1 = Math.cos(angle) * radius;
      const z1 = Math.sin(angle) * radius;

      const x2 = Math.cos(angle + Math.PI) * radius;
      const z2 = Math.sin(angle + Math.PI) * radius;

      const strandMaterial1 = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        emissive: 0x0284c7,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8
      });
      const node1 = new THREE.Mesh(sphereGeo, strandMaterial1);
      node1.position.set(x1, y, z1);
      dnaGroup.add(node1);

      const strandMaterial2 = new THREE.MeshStandardMaterial({
        color: 0x8b5cf6,
        emissive: 0x7c3aed,
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8
      });
      const node2 = new THREE.Mesh(sphereGeo, strandMaterial2);
      node2.position.set(x2, y, z2);
      dnaGroup.add(node2);

      const baseColor = colors[i % colors.length];
      const rungMaterial = new THREE.MeshStandardMaterial({
        color: baseColor,
        emissive: baseColor,
        emissiveIntensity: 0.5,
        roughness: 0.3
      });

      const rung = new THREE.Mesh(cylinderGeo, rungMaterial);
      rung.position.set((x1 + x2) / 2, y, (z1 + z2) / 2);
      rung.scale.set(1, radius * 2, 1);
      rung.rotation.z = Math.PI / 2;
      rung.rotation.y = -angle;
      dnaGroup.add(rung);
    }

    const particleCount = 200;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 80;
      positions[i + 1] = (Math.random() - 0.5) * 80;
      positions[i + 2] = (Math.random() - 0.5) * 80;
    }

    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.4,
      transparent: true,
      opacity: 0.6
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    dnaGroup.add(particles);

    scene.add(dnaGroup);

    const handleMouseDown = (e) => {
      isDraggingRef.current = true;
      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e) => {
      if (!isDraggingRef.current) return;
      const deltaX = e.clientX - prevMouseRef.current.x;
      const deltaY = e.clientY - prevMouseRef.current.y;

      dnaGroup.rotation.y += deltaX * 0.01;
      dnaGroup.rotation.x += deltaY * 0.01;

      prevMouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    container.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w && h) {
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    };

    window.addEventListener("resize", handleResize);

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);

      if (!isDraggingRef.current) {
        dnaGroup.rotation.y += 0.008 * rotationSpeedRef.current;
        dnaGroup.rotation.x += 0.002 * rotationSpeedRef.current;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      container.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("resize", handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="w-full h-[280px] sm:h-[340px] rounded-2xl glass-panel relative overflow-hidden border border-cyan-500/20 shadow-2xl shadow-purple-500/10">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing"></div>
      <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur border border-slate-800 rounded-lg px-3 py-1 text-[11px] font-mono text-slate-400">
        Interactive 3D Double Helix • Click & Drag to rotate
      </div>
    </div>
  );
}
