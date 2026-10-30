/**
 * Groverlaw — Realistic 3D Earth Globe & Cyber-Physical Legal Corridor Engine
 * 
 * Features:
 * - Natural Earth Terrain: Green continents (India, Europe, Americas), natural deserts, Arctic ice sheet, deep blue oceans.
 * - Photorealistic Atmospheric Cloud Layer (soft feathered RGBA).
 * - Modern Corporate Office Firm Architecture (interlocking cuboid towers, glass facades, zero antennas).
 * - Next-Gen Trans-Continental Legal Bridge:
 *   - Luminous multi-beam quantum laser conduit (Heritage Brand Orange core + outer ethereal glow sheath)
 *   - Twin counter-helical energy strands twisting along the arc
 *   - 3 Holographic Gateway Transit Portals at jurisdictional waypoints
 *   - 4 High-Speed Bilateral Photon Packets with animated comet tails (continuous two-way legal data flow)
 *   - Rooftop laser uplinks anchoring New Delhi Chambers & London Office
 * - Generous camera headroom & adaptive aspect-ratio frustum (ZERO top, bottom, or side clipping).
 * - Interactive pointer drag with smooth inertia & 60fps auto-rotation.
 */

(function () {
  'use strict';

  function initGlobe() {
    const container = document.getElementById('globeContainer');
    if (!container || typeof THREE === 'undefined') return;

    let width = container.clientWidth || 580;
    let height = container.clientHeight || 580;

    // 1. Scene & Perspective Camera (Engineered for generous framing)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, width / height, 1, 2000);

    // 2. High-Performance WebGL Renderer (Transparent Canvas, ACES Filmic Tonemapping)
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // Adaptive camera frustum: guarantees ZERO top or side clipping on any screen width
    function updateFrustum() {
      if (!container) return;
      width = container.clientWidth || 580;
      height = container.clientHeight || 580;
      const aspect = width / height;
      camera.aspect = aspect;

      // Base viewing distance with generous headroom above the highest arc apex
      const baseZ = 330;
      if (aspect < 1.05) {
        camera.position.z = Math.min(460, baseZ / Math.min(1.0, aspect * 0.92));
      } else {
        camera.position.z = baseZ;
      }
      camera.position.y = 6;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    updateFrustum();
    window.addEventListener('resize', updateFrustum, { passive: true });

    // 3. Balanced Natural Illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xfffaed, 2.0);
    sunLight.position.set(200, 140, 220);
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.55);
    fillLight.position.set(-180, -60, -120);
    scene.add(fillLight);

    const brandRim = new THREE.PointLight(0xeb6a1d, 1.6, 380);
    brandRim.position.set(-140, 100, -100);
    scene.add(brandRim);

    // 4. Globe Master Group (Positioned vertically to provide generous top headroom)
    const globeGroup = new THREE.Group();
    globeGroup.position.set(0, -3, 0);
    scene.add(globeGroup);

    // 5. Realistic Earth Globe Sphere
    const GLOBE_RADIUS = 84;
    const earthGeometry = new THREE.SphereGeometry(GLOBE_RADIUS, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const realisticTexture = textureLoader.load('assets/images/earth_realistic.jpg?v=4');
    realisticTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

    const earthMaterial = new THREE.MeshStandardMaterial({
      map: realisticTexture,
      roughness: 0.65,
      metalness: 0.08,
    });
    const earthMesh = new THREE.Mesh(earthGeometry, earthMaterial);
    globeGroup.add(earthMesh);

    // 6. Atmospheric Cloud Layer (Drifts over realistic terrain)
    const cloudsTexture = textureLoader.load('assets/images/earth_clouds.png?v=3');
    const cloudsGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.012, 64, 64);
    const cloudsMaterial = new THREE.MeshStandardMaterial({
      map: cloudsTexture,
      transparent: true,
      opacity: 0.55,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });
    const cloudsMesh = new THREE.Mesh(cloudsGeometry, cloudsMaterial);
    globeGroup.add(cloudsMesh);

    // Atmospheric Outer Sky Glow
    const haloGeometry = new THREE.SphereGeometry(GLOBE_RADIUS * 1.026, 64, 64);
    const haloMaterial = new THREE.MeshBasicMaterial({
      color: 0x93c5fd,
      transparent: true,
      opacity: 0.09,
      side: THREE.BackSide,
    });
    const haloMesh = new THREE.Mesh(haloGeometry, haloMaterial);
    globeGroup.add(haloMesh);

    // 7. Spherical Coordinate Converter (Lat/Lon -> 3D Vector)
    function latLonToVector3(lat, lon, radius, alt = 0) {
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lon + 180) * (Math.PI / 180);
      const r = radius + alt;
      const x = -(r * Math.sin(phi) * Math.cos(theta));
      const z = (r * Math.sin(phi) * Math.sin(theta));
      const y = (r * Math.cos(phi));
      return new THREE.Vector3(x, y, z);
    }

    // 8. Architectural Office Facade Generator
    function createModernOfficeFacadeTexture(isIndia) {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 0, 256, 512);

      const floors = 14;
      const cols = 8;
      const floorHeight = 512 / floors;
      const colWidth = 256 / cols;

      for (let f = 0; f < floors; f++) {
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(0, f * floorHeight, 256, 4);

        for (let c = 0; c < cols; c++) {
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(c * colWidth, f * floorHeight, 3, floorHeight);

          const isLit = (f + c) % 2 === 0 || (f * 3 + c) % 5 === 0;
          if (isLit) {
            ctx.fillStyle = isIndia
              ? (Math.random() > 0.4 ? '#fb923c' : '#fed7aa')
              : (Math.random() > 0.4 ? '#60a5fa' : '#e2e8f0');
          } else {
            ctx.fillStyle = '#1e293b';
          }
          ctx.fillRect(c * colWidth + 4, f * floorHeight + 5, colWidth - 7, floorHeight - 8);
        }
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      return tex;
    }

    const indiaFacadeTex = createModernOfficeFacadeTexture(true);
    const londonFacadeTex = createModernOfficeFacadeTexture(false);

    // 9. Modern Corporate Law Firm Building Complex
    function createModernCorporateFirm(isIndia, primaryAccentHex) {
      const group = new THREE.Group();
      const facadeTex = isIndia ? indiaFacadeTex : londonFacadeTex;

      const glassMat = new THREE.MeshStandardMaterial({
        map: facadeTex,
        roughness: 0.25,
        metalness: 0.6,
      });

      const slateMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b,
        roughness: 0.4,
        metalness: 0.7,
      });

      const parapetMat = new THREE.MeshStandardMaterial({
        color: primaryAccentHex,
        roughness: 0.3,
        metalness: 0.8,
      });

      const edgeLineMat = new THREE.LineBasicMaterial({
        color: isIndia ? 0xffa559 : 0x93c5fd,
        transparent: true,
        opacity: 0.75,
      });

      function addEdges(mesh) {
        const edges = new THREE.EdgesGeometry(mesh.geometry);
        const line = new THREE.LineSegments(edges, edgeLineMat);
        mesh.add(line);
      }

      // (A) Ground Plaza Forecourt
      const plazaGeo = new THREE.BoxGeometry(12, 1.2, 11);
      const plaza = new THREE.Mesh(plazaGeo, slateMat);
      plaza.position.y = 0.6;
      addEdges(plaza);
      group.add(plaza);

      // (B) Double-Height Reception Lobby
      const lobbyGeo = new THREE.BoxGeometry(10, 3.2, 9.5);
      const lobby = new THREE.Mesh(lobbyGeo, glassMat);
      lobby.position.y = 1.2 + 1.6;
      addEdges(lobby);
      group.add(lobby);

      // (C) Main Corporate High-Rise Tower
      const mainTowerHeight = isIndia ? 13 : 15;
      const mainTowerGeo = new THREE.BoxGeometry(7, mainTowerHeight, 6.5);
      const mainTower = new THREE.Mesh(mainTowerGeo, glassMat);
      mainTower.position.set(0, 4.4 + mainTowerHeight / 2, 0);
      addEdges(mainTower);
      group.add(mainTower);

      // (D) Interlocking Low-Rise Corporate Wing
      const wingHeight = mainTowerHeight * 0.65;
      const wingGeo = new THREE.BoxGeometry(4.5, wingHeight, 5.5);
      const wing = new THREE.Mesh(wingGeo, glassMat);
      wing.position.set(isIndia ? 4.2 : -4.2, 4.4 + wingHeight / 2, 0.4);
      addEdges(wing);
      group.add(wing);

      // (E) Flat Rooftop Executive Penthouse
      const roofBaseY = 4.4 + mainTowerHeight;
      const penthouseGeo = new THREE.BoxGeometry(5.4, 1.8, 5.0);
      const penthouse = new THREE.Mesh(penthouseGeo, slateMat);
      penthouse.position.y = roofBaseY + 0.9;
      addEdges(penthouse);
      group.add(penthouse);

      // (F) Modern Rooftop Corporate Crown / Helipad Frame
      const crownGeo = new THREE.BoxGeometry(5.8, 0.5, 5.4);
      const crown = new THREE.Mesh(crownGeo, parapetMat);
      crown.position.y = roofBaseY + 2.0;
      addEdges(crown);
      group.add(crown);

      // (G) Luminous Rooftop Uplink Anchor Terminal
      const terminalGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.35, 16);
      const terminalMat = new THREE.MeshBasicMaterial({ color: primaryAccentHex });
      const terminal = new THREE.Mesh(terminalGeo, terminalMat);
      terminal.position.y = roofBaseY + 2.45;
      group.add(terminal);

      // (H) Vertical Laser Uplink Pillar (Sky beam linking terrace to the bridge arc)
      const uplinkGeo = new THREE.CylinderGeometry(0.35, 0.35, 2.5, 12);
      const uplinkMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      });
      const uplink = new THREE.Mesh(uplinkGeo, uplinkMat);
      uplink.position.y = roofBaseY + 3.7;
      group.add(uplink);

      const totalTipHeight = roofBaseY + 4.95;
      return { mesh: group, tipHeight: totalTipHeight };
    }

    // Modern radar pulse ring at building ground base
    function createGroundPulse(colorHex) {
      const ringGeo = new THREE.RingGeometry(3, 4.5, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: colorHex,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = Math.PI / 2;
      return ring;
    }

    // 10. Accurate Geo-Coordinates: New Delhi (India) & London (UK)
    const indiaCoords = { lat: 28.6139, lon: 77.2090 };
    const londonCoords = { lat: 51.5074, lon: -0.1278 };

    const pIndiaSurface = latLonToVector3(indiaCoords.lat, indiaCoords.lon, GLOBE_RADIUS);
    const pLondonSurface = latLonToVector3(londonCoords.lat, londonCoords.lon, GLOBE_RADIUS);

    // Place Modern New Delhi Corporate Office Headquarters
    const indiaFirm = createModernCorporateFirm(true, 0xeb6a1d);
    indiaFirm.mesh.position.copy(pIndiaSurface);
    indiaFirm.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pIndiaSurface.clone().normalize());
    globeGroup.add(indiaFirm.mesh);

    const pulseIndia = createGroundPulse(0xeb6a1d);
    indiaFirm.mesh.add(pulseIndia);

    // Place Modern London Corporate Chambers
    const londonFirm = createModernCorporateFirm(false, 0x3b82f6);
    londonFirm.mesh.position.copy(pLondonSurface);
    londonFirm.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pLondonSurface.clone().normalize());
    globeGroup.add(londonFirm.mesh);

    const pulseLondon = createGroundPulse(0x3b82f6);
    londonFirm.mesh.add(pulseLondon);

    // 11. BREATHTAKING STYLISH LEGAL CORRIDOR (MULTI-LAYERED ENERGY BRIDGE)
    const pIndiaTip = latLonToVector3(indiaCoords.lat, indiaCoords.lon, GLOBE_RADIUS, indiaFirm.tipHeight);
    const pLondonTip = latLonToVector3(londonCoords.lat, londonCoords.lon, GLOBE_RADIUS, londonFirm.tipHeight);

    // Aerodynamic bridge curve hovering gracefully above the buildings (avoids top clipping)
    const midPoint = pIndiaTip.clone().add(pLondonTip).multiplyScalar(0.5);
    const arcApex = midPoint.clone().normalize().multiplyScalar(GLOBE_RADIUS * 1.20);
    const arcCurve = new THREE.QuadraticBezierCurve3(pIndiaTip, arcApex, pLondonTip);

    // (Layer 1) Central Luminous Quantum Laser Core Beam
    const coreTubeGeo = new THREE.TubeGeometry(arcCurve, 90, 0.42, 8, false);
    const coreTubeMat = new THREE.MeshBasicMaterial({
      color: 0xff6a14,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending,
    });
    const coreArcMesh = new THREE.Mesh(coreTubeGeo, coreTubeMat);
    globeGroup.add(coreArcMesh);

    // (Layer 2) Outer Ethereal Atmosphere Glow Sheath
    const glowTubeGeo = new THREE.TubeGeometry(arcCurve, 90, 1.05, 8, false);
    const glowTubeMat = new THREE.MeshBasicMaterial({
      color: 0xeb6a1d,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
    });
    const glowArcMesh = new THREE.Mesh(glowTubeGeo, glowTubeMat);
    globeGroup.add(glowArcMesh);

    // (Layer 3) Twin Counter-Helical Quantum Energy Strands (Double-Helix Data Trail)
    const helixPointsA = [];
    const helixPointsB = [];
    const helixSteps = 120;

    for (let i = 0; i <= helixSteps; i++) {
      const u = i / helixSteps;
      const p = arcCurve.getPoint(u);
      const t = arcCurve.getTangent(u);

      const up = p.clone().normalize();
      const binormal = new THREE.Vector3().crossVectors(t, up).normalize();
      const normal = new THREE.Vector3().crossVectors(binormal, t).normalize();

      const phase = u * Math.PI * 10;
      // Taper radius to 0 at building endpoints
      const radius = Math.sin(u * Math.PI) * 2.2;

      const offsetA = normal.clone().multiplyScalar(Math.cos(phase) * radius)
        .add(binormal.clone().multiplyScalar(Math.sin(phase) * radius));
      const offsetB = normal.clone().multiplyScalar(Math.cos(phase + Math.PI) * radius)
        .add(binormal.clone().multiplyScalar(Math.sin(phase + Math.PI) * radius));

      helixPointsA.push(p.clone().add(offsetA));
      helixPointsB.push(p.clone().add(offsetB));
    }

    const helixMat = new THREE.LineBasicMaterial({
      color: 0xffedd5,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
    });

    const helixLineA = new THREE.Line(new THREE.BufferGeometry().setFromPoints(helixPointsA), helixMat);
    const helixLineB = new THREE.Line(new THREE.BufferGeometry().setFromPoints(helixPointsB), helixMat);
    globeGroup.add(helixLineA);
    globeGroup.add(helixLineB);

    // (Layer 4) Holographic Gateway Transit Portals (International Jurisdiction Checkpoints)
    const gatewayWaypoints = [0.25, 0.50, 0.75];
    const gatewayMeshes = [];

    gatewayWaypoints.forEach((wp) => {
      const p = arcCurve.getPoint(wp);
      const t = arcCurve.getTangent(wp);

      const ringGeo = new THREE.RingGeometry(1.6, 2.3, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xffa559,
        transparent: true,
        opacity: 0.8,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(p);
      ring.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), t);
      globeGroup.add(ring);
      gatewayMeshes.push(ring);
    });

    // (Layer 5) High-Speed Bilateral Photon Packets with Trailing Comet Particles
    // 2 Packets Outbound (New Delhi -> London), 2 Packets Inbound (London -> New Delhi)
    const packets = [];
    const NUM_PACKETS = 4;

    for (let i = 0; i < NUM_PACKETS; i++) {
      const isOutbound = i % 2 === 0;
      const packetGroup = new THREE.Group();

      // Glowing core diamond
      const coreMesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.3, 12, 12),
        new THREE.MeshBasicMaterial({ color: 0xffffff, blending: THREE.AdditiveBlending })
      );
      packetGroup.add(coreMesh);

      // Ethereal outer aura
      const auraMesh = new THREE.Mesh(
        new THREE.SphereGeometry(2.4, 12, 12),
        new THREE.MeshBasicMaterial({
          color: isOutbound ? 0xeb6a1d : 0x60a5fa,
          transparent: true,
          opacity: 0.75,
          blending: THREE.AdditiveBlending
        })
      );
      packetGroup.add(auraMesh);

      // Comet tail (3 trailing glow beads)
      const tailBeads = [];
      for (let tb = 1; tb <= 3; tb++) {
        const bead = new THREE.Mesh(
          new THREE.SphereGeometry(1.1 - tb * 0.25, 8, 8),
          new THREE.MeshBasicMaterial({
            color: isOutbound ? 0xfba058 : 0x93c5fd,
            transparent: true,
            opacity: 0.7 - tb * 0.18,
            blending: THREE.AdditiveBlending
          })
        );
        globeGroup.add(bead);
        tailBeads.push(bead);
      }

      globeGroup.add(packetGroup);
      packets.push({
        group: packetGroup,
        tail: tailBeads,
        isOutbound: isOutbound,
        baseOffset: i * 0.25,
      });
    }

    // 12. Initial Earth Angle (Showcases India, Middle East corridor, and Europe/UK)
    globeGroup.rotation.y = -1.18;
    globeGroup.rotation.x = 0.18;

    // 13. Smooth Interactive Pointer Drag & Inertia
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let velocityX = 0;
    let velocityY = 0;
    let targetRotationY = null;
    let targetRotationX = null;

    function setFocusTarget(targetY, targetX) {
      targetRotationY = targetY;
      targetRotationX = targetX;
      velocityX = 0;
      velocityY = 0;
    }

    container.addEventListener('pointerdown', (e) => {
      isDragging = true;
      targetRotationY = null;
      targetRotationX = null;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      container.style.cursor = 'grabbing';
    });

    window.addEventListener('pointermove', (e) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      velocityX = deltaX * 0.005;
      velocityY = deltaY * 0.005;

      globeGroup.rotation.y += velocityX;
      globeGroup.rotation.x += velocityY;
      globeGroup.rotation.x = Math.max(-0.75, Math.min(0.75, globeGroup.rotation.x));
    });

    window.addEventListener('pointerup', () => {
      isDragging = false;
      container.style.cursor = 'grab';
    });

    container.style.cursor = 'grab';

    // 14. 2D Projected Badges tracking 3D Buildings
    const badgeIndia = document.getElementById('globeBadgeIndia');
    const badgeLondon = document.getElementById('globeBadgeLondon');

    function updateBadgePositions() {
      if (!badgeIndia || !badgeLondon) return;

      function projectToScreen(worldPos) {
        const v = worldPos.clone();
        v.applyMatrix4(globeGroup.matrixWorld);
        v.project(camera);

        const x = (v.x * 0.5 + 0.5) * width;
        const y = (-v.y * 0.5 + 0.5) * height;
        const isBehind = v.z > 0.98;
        return { x, y, isBehind };
      }

      const pInd = projectToScreen(pIndiaTip);
      const pLon = projectToScreen(pLondonTip);

      if (pInd.isBehind) {
        badgeIndia.style.opacity = '0';
      } else {
        badgeIndia.style.opacity = '1';
        badgeIndia.style.transform = `translate3d(${pInd.x - 75}px, ${pInd.y - 42}px, 0)`;
      }

      if (pLon.isBehind) {
        badgeLondon.style.opacity = '0';
      } else {
        badgeLondon.style.opacity = '1';
        badgeLondon.style.transform = `translate3d(${pLon.x - 70}px, ${pLon.y - 42}px, 0)`;
      }
    }

    // Interactive Hub Focus Buttons & Badge Clicks
    const btnDelhi = document.getElementById('btnFocusDelhi');
    const btnLondon = document.getElementById('btnFocusLondon');

    if (btnDelhi) {
      btnDelhi.addEventListener('click', (e) => {
        e.preventDefault();
        setFocusTarget(-2.92, -0.22);
      });
    }

    if (btnLondon) {
      btnLondon.addEventListener('click', (e) => {
        e.preventDefault();
        setFocusTarget(-1.57, -0.38);
      });
    }

    if (badgeIndia) {
      badgeIndia.style.pointerEvents = 'auto';
      badgeIndia.style.cursor = 'pointer';
      badgeIndia.addEventListener('click', () => setFocusTarget(-2.92, -0.22));
    }

    if (badgeLondon) {
      badgeLondon.style.pointerEvents = 'auto';
      badgeLondon.style.cursor = 'pointer';
      badgeLondon.addEventListener('click', () => setFocusTarget(-1.57, -0.38));
    }

    // 15. Animation Loop
    let time = 0;
    let pulseScale = 1;

    function animate() {
      requestAnimationFrame(animate);

      time += 0.006;

      // Smooth magnetic glide to target hub if focus requested
      if (targetRotationY !== null && targetRotationX !== null) {
        globeGroup.rotation.y += (targetRotationY - globeGroup.rotation.y) * 0.065;
        globeGroup.rotation.x += (targetRotationX - globeGroup.rotation.x) * 0.065;
        if (Math.abs(targetRotationY - globeGroup.rotation.y) < 0.004 && Math.abs(targetRotationX - globeGroup.rotation.x) < 0.004) {
          targetRotationY = null;
          targetRotationX = null;
        }
      } else if (!isDragging) {
        // Slow realistic earth auto-rotation
        globeGroup.rotation.y += 0.0016;
        velocityX *= 0.94;
        velocityY *= 0.94;
        globeGroup.rotation.y += velocityX;
        globeGroup.rotation.x += velocityY;
      }

      // Clouds rotate slightly faster for realistic atmospheric drift
      cloudsMesh.rotation.y += 0.0003;

      // Rotate Holographic Gateway Rings
      gatewayMeshes.forEach((gw, idx) => {
        gw.rotation.z += 0.015 * (idx % 2 === 0 ? 1 : -1);
      });

      // Animate Bilateral Energy Packets with Trailing Comet Beads
      packets.forEach((pkt) => {
        // Compute normalized progression along arc [0, 1]
        let prog = (time * 0.35 + pkt.baseOffset) % 1.0;
        let tVal = pkt.isOutbound ? prog : (1.0 - prog);

        const mainPos = arcCurve.getPointAt(tVal);
        pkt.group.position.copy(mainPos);

        // Position trailing comet beads slightly behind the head
        pkt.tail.forEach((bead, bIdx) => {
          const lag = (bIdx + 1) * 0.022;
          let tailT = pkt.isOutbound ? Math.max(0, tVal - lag) : Math.min(1, tVal + lag);
          const tailPos = arcCurve.getPointAt(tailT);
          bead.position.copy(tailPos);
        });
      });

      // Radar pulse wave at office foundations
      pulseScale = 1 + (time * 1.5) % 2.2;
      pulseIndia.scale.set(pulseScale, pulseScale, 1);
      pulseIndia.material.opacity = Math.max(0, 1 - (pulseScale - 1) / 2.2);

      pulseLondon.scale.set(pulseScale, pulseScale, 1);
      pulseLondon.material.opacity = Math.max(0, 1 - (pulseScale - 1) / 2.2);

      // Render 3D Scene
      renderer.render(scene, camera);

      // Update projected 2D location tags
      updateBadgePositions();
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGlobe);
  } else {
    initGlobe();
  }
})();
