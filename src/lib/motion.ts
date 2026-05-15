import { useReducedMotion } from "motion/react";

// --- Easing Curves ---

/**
 * Primary Premium Curve: Instant response, soft landing.
 * Use for cards, buttons, modals, panels, menus, navigation.
 */
export const PREMIUM_EASE = [0.22, 1, 0.36, 1];

/**
 * Material-style Curve: Calmer transitions.
 * Use for enterprise interfaces.
 */
export const MATERIAL_EASE = [0.4, 0, 0.2, 1];

// --- Spring Physics ---

/**
 * Default preferred spring. Fast, not rubbery.
 */
export const SPRING_DEFAULT = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.8,
};

/**
 * Soft spring for subtler movements.
 */
export const SPRING_SOFT = {
  type: "spring",
  stiffness: 220,
  damping: 24,
};

// --- Standard Interaction Variants ---

export const hoverVariant = {
  y: -2,
  scale: 1.02,
  transition: {
    duration: 0.16,
    ease: PREMIUM_EASE,
  },
};

export const tapVariant = {
  scale: 0.97,
  transition: {
    duration: 0.1,
    ease: PREMIUM_EASE,
  },
};

export const modalEntranceVariant = {
  initial: {
    opacity: 0,
    scale: 0.96,
    y: 8,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: PREMIUM_EASE,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    y: 4,
    transition: {
      duration: 0.15,
      ease: PREMIUM_EASE,
    },
  },
};

export const defaultEntranceVariant = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.22,
      ease: PREMIUM_EASE,
    },
  },
  exit: {
    opacity: 0,
    y: 4,
    transition: {
      duration: 0.15,
      ease: PREMIUM_EASE,
    },
  },
};

export { useReducedMotion };
