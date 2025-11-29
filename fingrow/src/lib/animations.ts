import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Fade in animation
export const fadeIn = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: 'power3.out',
    ...options,
  });
};

// Fade in with stagger
export const fadeInStagger = (elements: string | Element[], options = {}) => {
  return gsap.from(elements, {
    opacity: 0,
    y: 30,
    duration: 0.8,
    stagger: 0.1,
    ease: 'power3.out',
    ...options,
  });
};

// Scale in animation
export const scaleIn = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    scale: 0.8,
    opacity: 0,
    duration: 0.6,
    ease: 'back.out(1.7)',
    ...options,
  });
};

// Slide in from left
export const slideInLeft = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    x: -100,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    ...options,
  });
};

// Slide in from right
export const slideInRight = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    x: 100,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out',
    ...options,
  });
};

// Floating animation
export const float = (element: string | Element) => {
  return gsap.to(element, {
    y: -20,
    duration: 2,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true,
  });
};

// Rotate animation
export const rotate = (element: string | Element, options = {}) => {
  return gsap.to(element, {
    rotation: 360,
    duration: 20,
    ease: 'none',
    repeat: -1,
    ...options,
  });
};

// Pulse animation
export const pulse = (element: string | Element) => {
  return gsap.to(element, {
    scale: 1.05,
    duration: 1,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true,
  });
};

// Scroll-triggered animation
export const scrollTriggerAnimation = (
  element: string | Element,
  animationProps = {},
  triggerOptions = {}
) => {
  return gsap.from(element, {
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
      ...triggerOptions,
    },
    opacity: 0,
    y: 50,
    duration: 0.8,
    ease: 'power3.out',
    ...animationProps,
  });
};

// Counter animation
export const animateCounter = (
  element: Element,
  endValue: number,
  duration = 2
) => {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power1.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toString();
    },
  });
};

// Page transition animations
export const pageTransition = {
  enter: (element: string | Element) => {
    return gsap.from(element, {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power3.out',
    });
  },
  exit: (element: string | Element) => {
    return gsap.to(element, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power3.in',
    });
  },
};

// Magnetic button effect
export const magneticButton = (button: Element) => {
  const handleMouseMove = (e: Event) => {
    const mouseEvent = e as MouseEvent;
    const rect = button.getBoundingClientRect();
    const x = mouseEvent.clientX - rect.left - rect.width / 2;
    const y = mouseEvent.clientY - rect.top - rect.height / 2;

    gsap.to(button, {
      x: x * 0.3,
      y: y * 0.3,
      duration: 0.3,
      ease: 'power2.out',
    });
  };

  const handleMouseLeave = () => {
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.3)',
    });
  };

  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseleave', handleMouseLeave);

  return () => {
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
};
