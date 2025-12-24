import barba from '@barba/core';
import { gsap } from 'gsap';

// Define transition animations
const fadeTransition = {
  name: 'fade-transition',
  leave(data: any) {
    return gsap.to(data.current.container, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  },
  enter(data: any) {
    return gsap.from(data.next.container, {
      opacity: 0,
      duration: 0.5,
      ease: 'power2.inOut'
    });
  }
};

const slideTransition = {
  name: 'slide-transition',
  leave(data: any) {
    return gsap.to(data.current.container, {
      x: '-100%',
      duration: 0.6,
      ease: 'power2.inOut'
    });
  },
  enter(data: any) {
    gsap.set(data.next.container, { x: '100%' });
    return gsap.to(data.next.container, {
      x: '0%',
      duration: 0.6,
      ease: 'power2.inOut'
    });
  }
};

const scaleTransition = {
  name: 'scale-transition',
  leave(data: any) {
    return gsap.to(data.current.container, {
      scale: 0.8,
      opacity: 0,
      duration: 0.4,
      ease: 'power2.inOut'
    });
  },
  enter(data: any) {
    gsap.set(data.next.container, { scale: 1.2, opacity: 0 });
    return gsap.to(data.next.container, {
      scale: 1,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.inOut'
    });
  }
};

// Initialize Barba.js
export function initBarba() {
  // Only run on client side
  if (typeof window === 'undefined') return;

  barba.init({
    transitions: [
      // Default fade transition
      fadeTransition,
      
      // Slide transition for dashboard pages
      {
        ...slideTransition,
        custom: ({ current, next }) => {
          return current.namespace === 'dashboard' || next.namespace === 'dashboard';
        }
      },
      
      // Scale transition for auth pages
      {
        ...scaleTransition,
        custom: ({ current, next }) => {
          return (current.namespace === 'auth' || next.namespace === 'auth') &&
                 (current.namespace !== next.namespace);
        }
      }
    ],
    
    views: [
      {
        namespace: 'home',
        beforeEnter() {
          // Initialize home page animations
          console.log('Entering home page');
        }
      },
      {
        namespace: 'dashboard',
        beforeEnter() {
          // Initialize dashboard animations
          console.log('Entering dashboard');
        }
      },
      {
        namespace: 'auth',
        beforeEnter() {
          // Initialize auth page animations
          console.log('Entering auth page');
        }
      }
    ]
  });

  // Add loading indicator
  barba.hooks.before(() => {
    document.body.classList.add('is-loading');
  });

  barba.hooks.after(() => {
    document.body.classList.remove('is-loading');
  });

  // Handle scroll position
  barba.hooks.enter(() => {
    window.scrollTo(0, 0);
  });
}

// Cleanup function
export function destroyBarba() {
  if (typeof window !== 'undefined' && barba) {
    barba.destroy();
  }
}