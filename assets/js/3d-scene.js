/**
 * Groverlaw — High-Performance 3D Interactive Engine
 * Architectural 3D Legal Armillary, Parallax Canvas & 3D Tilt Cards
 * Zero external libraries needed — 60fps native matrix projection & hardware acceleration.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. HERO 3D ARCHITECTURAL ARMILLARY & CELESTIAL LEGAL SPHERE
  // =========================================================================
  function init3DHeroScene() {
    const canvas = document.getElementById('hero3dCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight || 540);

    // Dynamic responsive sizing
    function handleResize() {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight || 540;
    }
    window.addEventListener('resize', handleResize, { passive: true });

    // 3D Geometry definitions (Wireframe Rings, Icosahedron Vertices & Connecting Struts)
    const NUM_PARTICLES = 45;
    const particles = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 600,
        radius: Math.random() * 1.8 + 0.8,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        alphaOffset: Math.random() * Math.PI * 2,
      });
    }

    // Geodesic Nodes (Golden Ratio Vertices)
    const phi = (1 + Math.sqrt(5)) / 2;
    const baseScale = 140;
    const icosahedronVertices = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]
    ].map(v => {
      const len = Math.hypot(v[0], v[1], v[2]);
      return {
        x: (v[0] / len) * baseScale,
        y: (v[1] / len) * baseScale,
        z: (v[2] / len) * baseScale
      };
    });

    // Edges connecting vertices
    const edges = [];
    for (let i = 0; i < icosahedronVertices.length; i++) {
      for (let j = i + 1; j < icosahedronVertices.length; j++) {
        const dx = icosahedronVertices[i].x - icosahedronVertices[j].x;
        const dy = icosahedronVertices[i].y - icosahedronVertices[j].y;
        const dz = icosahedronVertices[i].z - icosahedronVertices[j].z;
        const dist = Math.hypot(dx, dy, dz);
        // Connect nearby vertices (threshold ~ 160)
        if (dist < baseScale * 1.2) {
          edges.push([i, j]);
        }
      }
    }

    // Rings (Armillary Latitude & Longitude)
    const ringPoints1 = [];
    const ringPoints2 = [];
    const ringPoints3 = [];
    const ringRadius = baseScale * 1.35;
    const segments = 64;

    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      // Equatorial Ring
      ringPoints1.push({ x: Math.cos(theta) * ringRadius, y: 0, z: Math.sin(theta) * ringRadius });
      // Meridian Ring
      ringPoints2.push({ x: 0, y: Math.cos(theta) * ringRadius, z: Math.sin(theta) * ringRadius });
      // Oblique Ring (45 deg)
      ringPoints3.push({
        x: Math.cos(theta) * ringRadius * 0.7071,
        y: Math.sin(theta) * ringRadius,
        z: Math.cos(theta) * ringRadius * 0.7071
      });
    }

    // State for interactive rotation & damping
    let rotX = 0.3;
    let rotY = 0.4;
    let targetRotX = 0.3;
    let targetRotY = 0.4;
    let mouseActive = false;

    // Track mouse over hero container
    const heroSection = canvas.closest('section') || document.body;
    heroSection.addEventListener('mousemove', (e) => {
      const rect = heroSection.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      targetRotY = nx * 1.2;
      targetRotX = -ny * 1.0;
      mouseActive = true;
    }, { passive: true });

    heroSection.addEventListener('mouseleave', () => {
      mouseActive = false;
    });

    // 3D Rotation Matrix projection
    function rotatePoint(p, rx, ry, rz) {
      // Y-axis rotation
      let cosY = Math.cos(ry), sinY = Math.sin(ry);
      let x1 = p.x * cosY + p.z * sinY;
      let y1 = p.y;
      let z1 = -p.x * sinY + p.z * cosY;

      // X-axis rotation
      let cosX = Math.cos(rx), sinX = Math.sin(rx);
      let x2 = x1;
      let y2 = y1 * cosX - z1 * sinX;
      let z2 = y1 * sinX + z1 * cosX;

      // Z-axis rotation
      let cosZ = Math.cos(rz), sinZ = Math.sin(rz);
      let x3 = x2 * cosZ - y2 * sinZ;
      let y3 = x2 * sinZ + y2 * cosZ;
      let z3 = z2;

      return { x: x3, y: y3, z: z3 };
    }

    // Perspective Projection helper
    const fov = 480;
    function project(p3d, cx, cy) {
      const scale = fov / (fov + p3d.z);
      return {
        x: cx + p3d.x * scale,
        y: cy + p3d.y * scale,
        scale: scale,
        z: p3d.z
      };
    }

    let isVisible = true;
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    });
    observer.observe(canvas);

    let lastTime = performance.now();
    let autoAngle = 0;

    function render(now) {
      requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      autoAngle += dt * 0.25;

      // Smooth damping interpolation
      const targetX = mouseActive ? targetRotX : Math.sin(autoAngle * 0.7) * 0.25;
      const targetY = mouseActive ? targetRotY : autoAngle;

      rotX += (targetX - rotX) * 0.05;
      rotY += (targetY - rotY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      // On desktop, position the 3D focal sphere to frame the right showcase card
      const cx = width > 1024 ? width * 0.72 : width * 0.5;
      const cy = height * 0.5;

      // 1. Draw subtle ambient depth particles
      for (let i = 0; i < particles.length; i++) {
        const pt = particles[i];
        const rotPt = rotatePoint(pt, rotX * 0.5, rotY * 0.5, autoAngle * 0.1);
        const proj = project(rotPt, cx, cy);

        const pulse = Math.sin(now * pt.pulseSpeed + pt.alphaOffset) * 0.3 + 0.7;
        const alpha = Math.max(0, Math.min(1, (1 - rotPt.z / 600) * 0.35 * pulse));

        ctx.fillStyle = `rgba(197, 168, 128, ${alpha})`;
        ctx.beginPath();
        ctx.arc(proj.x, proj.y, pt.radius * proj.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Draw Geodesic Struts / Edges
      ctx.lineWidth = 1.2;
      for (let i = 0; i < edges.length; i++) {
        const [idx1, idx2] = edges[i];
        const v1 = rotatePoint(icosahedronVertices[idx1], rotX, rotY, 0);
        const v2 = rotatePoint(icosahedronVertices[idx2], rotX, rotY, 0);

        const p1 = project(v1, cx, cy);
        const p2 = project(v2, cx, cy);

        const avgZ = (v1.z + v2.z) * 0.5;
        const depthAlpha = Math.max(0.08, Math.min(0.45, (1 - avgZ / (baseScale * 2)) * 0.35));

        ctx.strokeStyle = `rgba(197, 168, 128, ${depthAlpha})`;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      }

      // 3. Draw Golden Vertex Nodes with Glow
      for (let i = 0; i < icosahedronVertices.length; i++) {
        const v = rotatePoint(icosahedronVertices[i], rotX, rotY, 0);
        const p = project(v, cx, cy);

        const depthAlpha = Math.max(0.15, Math.min(0.9, (1 - v.z / (baseScale * 2)) * 0.75));

        // Outer glow
        const glowRad = Math.max(2, 6 * p.scale);
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowRad);
        grad.addColorStop(0, `rgba(223, 197, 160, ${depthAlpha * 0.8})`);
        grad.addColorStop(1, 'rgba(197, 168, 128, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Core bright point
        ctx.fillStyle = `rgba(255, 246, 233, ${depthAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2.5 * p.scale, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Draw Armillary Rings
      function drawRing(points, alphaBase, dash) {
        ctx.lineWidth = 1.0;
        ctx.strokeStyle = `rgba(197, 168, 128, ${alphaBase})`;
        if (dash) {
          ctx.setLineDash([4, 6]);
        } else {
          ctx.setLineDash([]);
        }

        ctx.beginPath();
        for (let i = 0; i < points.length; i++) {
          const pt = rotatePoint(points[i], rotX, rotY, 0);
          const p = project(pt, cx, cy);
          if (i === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
      }

      drawRing(ringPoints1, 0.28, false);
      drawRing(ringPoints2, 0.20, true);
      drawRing(ringPoints3, 0.22, false);

      // Subtle Central Core Golden Glow
      const centerGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 90);
      centerGrad.addColorStop(0, 'rgba(197, 168, 128, 0.12)');
      centerGrad.addColorStop(1, 'rgba(197, 168, 128, 0)');
      ctx.fillStyle = centerGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, 90, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(render);
  }

  // =========================================================================
  // 2. INTERACTIVE 3D PERSPECTIVE TILT CARDS WITH DYNAMIC SPECULAR GLARE
  // =========================================================================
  function init3DTiltCards() {
    const cards = document.querySelectorAll('.tilt-card-3d');
    if (!cards.length) return;

    cards.forEach((card) => {
      // Ensure glare overlay element exists
      if (!card.querySelector('.tilt-glare')) {
        const glare = document.createElement('div');
        glare.className = 'tilt-glare';
        card.appendChild(glare);
      }

      let bounds = null;

      function onMouseEnter() {
        bounds = card.getBoundingClientRect();
      }

      function onMouseMove(e) {
        if (!bounds) bounds = card.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        // Relative coordinates from -1 to 1
        const xPct = (mouseX / bounds.width - 0.5) * 2;
        const yPct = (mouseY / bounds.height - 0.5) * 2;

        const maxTilt = 7; // Max tilt in degrees (refined, non-gimmicky)
        const rotX = -yPct * maxTilt;
        const rotY = xPct * maxTilt;

        card.style.transform = `perspective(1000px) rotateX(${rotX.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg) translateZ(6px)`;
        card.style.setProperty('--mouse-x', `${mouseX}px`);
        card.style.setProperty('--mouse-y', `${mouseY}px`);
      }

      function onMouseLeave() {
        bounds = null;
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
      }

      card.addEventListener('mouseenter', onMouseEnter);
      card.addEventListener('mousemove', onMouseMove, { passive: true });
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }

  // Self initialize on DOM load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      init3DHeroScene();
      init3DTiltCards();
    });
  } else {
    init3DHeroScene();
    init3DTiltCards();
  }
})();
