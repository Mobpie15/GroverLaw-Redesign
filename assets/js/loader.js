/**
 * Groverlaw — Signature Snake Logo Disappearance Loader
 * Sequences the 9 emblem blocks: 9 -> 8 -> 7 -> 4 -> 1 -> 2 -> 3 -> 6 -> 5 (Center Orange)
 * Smooth cubic-bezier dissipation, followed by cinematic entrance of Navbar & Hero.
 */

(function () {
  'use strict';

  function initLoader() {
    const loader = document.getElementById('loadingScreen');
    if (!loader) {
      document.body.classList.add('hero-active');
      window.dispatchEvent(new CustomEvent('hero-ready'));
      return;
    }

    // Disappearance snake sequence
    const sequence = [9, 8, 7, 4, 1, 2, 3, 6, 5];
    const initialDelay = 450; // Initial display time for the complete logo
    const stepInterval = 140; // Timing between each block disappearing

    sequence.forEach((num, index) => {
      setTimeout(() => {
        const block = document.getElementById(`logoBlock${num}`);
        if (!block) return;

        if (num === 5) {
          // Special climax dissipation for the Center Orange Block
          block.style.transform = 'scale(1.25)';
          block.style.boxShadow = '0 0 30px rgba(235, 106, 29, 0.8)';
          block.style.filter = 'brightness(1.3)';
          
          setTimeout(() => {
            block.style.transform = 'scale(0) rotate(15deg)';
            block.style.opacity = '0';
            block.style.filter = 'blur(8px)';
          }, 180);
        } else {
          // Snake dissipation for perimeter blocks
          block.style.transform = 'scale(0.3) translateY(8px)';
          block.style.opacity = '0';
          block.style.filter = 'blur(4px)';
        }
      }, initialDelay + index * stepInterval);
    });

    // Total sequence duration before curtain dissolves
    const totalTime = initialDelay + sequence.length * stepInterval + 380;

    setTimeout(() => {
      // Dissolve the loading screen curtain
      loader.style.opacity = '0';
      loader.style.transform = 'scale(1.03)';
      loader.style.pointerEvents = 'none';

      // Trigger 1-by-1 Staggered Entrance for Left-Side Hero Text & Stats
      document.body.classList.add('hero-active');
      window.dispatchEvent(new CustomEvent('hero-ready'));

      // Trigger navbar entrance
      const navbar = document.getElementById('mainNavbar');
      const globeContainer = document.getElementById('globeContainer');

      if (navbar) {
        navbar.classList.remove('opacity-0', '-translate-y-4');
        navbar.classList.add('opacity-100', 'translate-y-0');
      }

      if (globeContainer) {
        globeContainer.classList.remove('opacity-0', 'scale-95');
        globeContainer.classList.add('opacity-100', 'scale-100');
      }

      // Remove loader from DOM after transition finishes
      setTimeout(() => {
        loader.style.display = 'none';
      }, 700);
    }, totalTime);
  }

  // Safety fallback: Ensure hero content reveals even if loader was already hidden
  setTimeout(() => {
    document.body.classList.add('hero-active');
    window.dispatchEvent(new CustomEvent('hero-ready'));
  }, 2200);

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initLoader);
  } else {
    initLoader();
  }
})();
