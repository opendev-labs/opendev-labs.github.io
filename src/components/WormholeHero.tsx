import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface WormholeHeroProps {
    className?: string;
}

export const WormholeHero: React.FC<WormholeHeroProps> = ({ className = "absolute inset-0" }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);

        // Camera setup
        const camera = new THREE.PerspectiveCamera(
            60,
            containerRef.current.clientWidth / containerRef.current.clientHeight,
            0.1,
            1000
        );
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);

        // Renderer setup
        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
            alpha: true
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        containerRef.current.appendChild(renderer.domElement);

        // Controls
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 2;
        controls.maxDistance = 15;
        controls.enablePan = false;
        controls.autoRotate = true;
        controls.autoRotateSpeed = 0.5;

        // Lighting
        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 5, 5);
        scene.add(directionalLight);

        // Load Cube Texture for Reflection
        const textureLoader = new THREE.CubeTextureLoader();
        const envTexture = textureLoader.load([
            "https://threejs.org/examples/textures/cube/MilkyWay/dark-s_px.jpg",
            "https://threejs.org/examples/textures/cube/MilkyWay/dark-s_nx.jpg",
            "https://threejs.org/examples/textures/cube/MilkyWay/dark-s_py.jpg",
            "https://threejs.org/examples/textures/cube/MilkyWay/dark-s_ny.jpg",
            "https://threejs.org/examples/textures/cube/MilkyWay/dark-s_pz.jpg",
            "https://threejs.org/examples/textures/cube/MilkyWay/dark-s_nz.jpg",
        ]);
        scene.background = envTexture;

        // Ball (The "Wormhole" Nucleus)
        const sphereGeometry = new THREE.SphereGeometry(1.2, 64, 64);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            envMap: envTexture,
            metalness: 1,
            roughness: 0,
            color: 0xffffff
        });

        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.castShadow = true;
        sphere.receiveShadow = true;
        scene.add(sphere);

        // Stars
        const starsGeometry = new THREE.BufferGeometry();
        const starsMaterial = new THREE.PointsMaterial({
            color: 0xffffff,
            size: 0.05,
            transparent: true,
            opacity: 0.8
        });

        const stars = [];
        for (let i = 0; i < 2000; i++) {
            const x = (Math.random() - 0.5) * 100;
            const y = (Math.random() - 0.5) * 100;
            const z = (Math.random() - 0.5) * 100;
            stars.push(x, y, z);
        }

        starsGeometry.setAttribute(
            "position",
            new THREE.Float32BufferAttribute(stars, 3)
        );

        const starField = new THREE.Points(starsGeometry, starsMaterial);
        scene.add(starField);

        // Animation Loop
        let animationFrameId: number;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            sphere.rotation.x += 0.002;
            sphere.rotation.y += 0.003;
            
            // Pulsing effect
            const time = Date.now() * 0.001;
            sphere.scale.setScalar(1 + Math.sin(time) * 0.05);

            controls.update();
            renderer.render(scene, camera);
        };
        animate();

        // Resize handler
        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener("resize", handleResize);

        // Cleanup
        return () => {
            window.removeEventListener("resize", handleResize);
            cancelAnimationFrame(animationFrameId);
            if (containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            sphereGeometry.dispose();
            sphereMaterial.dispose();
            starsGeometry.dispose();
            starsMaterial.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <div 
            ref={containerRef} 
            className={`${className} z-0 pointer-events-auto cursor-grab active:cursor-grabbing`}
            style={{ touchAction: 'none' }}
        />
    );
};
