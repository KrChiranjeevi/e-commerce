import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const AnimatedBackground = () => {
  const containerRef = useRef(null);

  useGSAP(() => {
    const shapes = gsap.utils.toArray('.bg-shape');

    shapes.forEach((shape) => {
      gsap.to(shape, {
        x: 'random(-100, 100, 10)',
        y: 'random(-100, 100, 10)',
        rotation: 'random(-180, 180)',
        scale: 'random(0.8, 1.2)',
        duration: 'random(10, 20)',
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
      });
    });
  }, { scope: containerRef });

  return (
    <div 
      ref={containerRef} 
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -1,
        backgroundColor: '#f8fafc'
      }}
    >
      <div className="bg-shape" style={{ position: 'absolute', top: '-10%', left: '-10%', width: '24rem', height: '24rem', backgroundColor: '#a5b4fc', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(64px)', opacity: 0.5 }}></div>
      <div className="bg-shape" style={{ position: 'absolute', top: '20%', right: '-10%', width: '24rem', height: '24rem', backgroundColor: '#f9a8d4', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(64px)', opacity: 0.5 }}></div>
      <div className="bg-shape" style={{ position: 'absolute', bottom: '-20%', left: '20%', width: '30rem', height: '30rem', backgroundColor: '#d8b4fe', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(64px)', opacity: 0.5 }}></div>
      <div className="bg-shape" style={{ position: 'absolute', top: '40%', left: '40%', width: '20rem', height: '20rem', backgroundColor: '#93c5fd', borderRadius: '50%', mixBlendMode: 'multiply', filter: 'blur(64px)', opacity: 0.4 }}></div>
    </div>
  );
};

export default AnimatedBackground;
