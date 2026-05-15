````md
# Premium Motion System

Version: 1.0

This project follows a premium motion language inspired by:

- Apple
- Linear
- Raycast
- Figma
- modern operating systems
- high-end SaaS products

The goal of motion is NOT decoration.

Motion exists to:

- improve clarity
- reinforce spatial relationships
- provide tactile feedback
- communicate progress
- create emotional smoothness
- increase perceived performance

Animations must always feel:

- fast
- calm
- intentional
- physical
- responsive
- lightweight
- trustworthy

Never create motion that feels:

- childish
- chaotic
- theatrical
- distracting
- game-like
- slow
- exaggerated

---

# Core Motion Philosophy

Humans naturally prefer motion that mimics:

- inertia
- friction
- momentum
- elasticity
- acceleration
- deceleration

Therefore:

- never use linear motion for UI interactions
- always prefer spring or asymmetric ease-out curves

Motion should feel:

- physically plausible
- emotionally smooth
- instantly responsive

---

# Approved Libraries

Preferred:

- motion/react
- Framer Motion
- Motion One

Allowed:

- CSS transitions for simple hover states

Avoid:

- GSAP unless complex sequencing is required
- anime.js
- excessive keyframe animations

---

# Global Animation Principles

## 1. Instant Responsiveness

The UI must react immediately to user intent.

Never delay:

- hover
- tap
- press
- drag
- focus

Users should feel:

- control
- responsiveness
- tactile confirmation

---

# 2. Minimal Travel Distance

Elements should move small distances.

Preferred:

- 4px → 24px movement

Avoid:

- large slide-ins
- dramatic travel
- excessive transforms

Premium interfaces use restrained motion.

---

# 3. Fast Start, Smooth End

Animations should:

- accelerate quickly
- decelerate naturally

Preferred easing:

```css id="5mfxh9"
cubic-bezier(0.22, 1, 0.36, 1)
```
````

This creates:

- instant response
- soft landing
- natural momentum

---

# 4. Motion Should Preserve Context

Users should always understand:

- where elements came from
- where they are going
- what changed

Use:

- shared element transitions
- opacity fades
- subtle transforms

Avoid:

- hard cuts
- disorienting movement
- full-screen wipes

---

# 5. Motion Should Never Compete With Content

Animation supports the interface.

It should never become:

- the main attraction
- visually exhausting
- attention stealing

Subtle motion feels more premium.

---

# Standard Timing System

| Interaction      | Duration         |
| ---------------- | ---------------- |
| Hover            | 120–180ms        |
| Press/Tap        | 80–140ms         |
| Tooltip          | 120–180ms        |
| Dropdown         | 180–240ms        |
| Card Expansion   | 220–320ms        |
| Modal            | 220–320ms        |
| Page Transition  | 300–450ms        |
| Loading Skeleton | 1200–1800ms loop |

Rules:

- never exceed 500ms for normal UI
- avoid sluggish transitions
- prioritize responsiveness

---

# Approved Easing Curves

## Primary Premium Curve

```css id="9g2mkj"
cubic-bezier(0.22, 1, 0.36, 1)
```

Use for:

- cards
- buttons
- modals
- panels
- menus
- navigation

---

# Material-style Curve

```css id="qaw1g2"
cubic-bezier(0.4, 0, 0.2, 1)
```

Use for:

- enterprise interfaces
- calmer transitions

---

# Forbidden Curves

Avoid:

```css id="4n2pyh"
linear
ease-in
```

Reason:

- robotic
- delayed
- unnatural
- low-quality feel

---

# Spring Motion Standards

Preferred spring:

```ts id="s3s6cg"
const SPRING = {
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.8,
};
```

Soft spring:

```ts id="6y2vwt"
const SOFT_SPRING = {
  type: "spring",
  stiffness: 220,
  damping: 24,
};
```

Rules:

- avoid excessive bounce
- avoid rubbery motion
- damping should usually remain above 20

---

# GPU Performance Rules

Always animate:

- transform
- opacity
- filter (minimal)

Preferred transforms:

- translateX
- translateY
- scale
- rotate (very subtle)

Avoid animating:

- width
- height
- top
- left
- margin
- padding

unless absolutely necessary.

---

# Hover Interactions

Hover states should feel:

- magnetic
- lightweight
- immediate

Preferred effects:

- translateY(-2px)
- scale(1.01 → 1.02)
- subtle shadow enhancement
- slight opacity increase

Preferred example:

```tsx id="n8e0fe"
whileHover={{
  y: -2,
  scale: 1.02
}}
transition={{
  duration: 0.16,
  ease: [0.22, 1, 0.36, 1]
}}
```

Avoid:

- aggressive scaling
- glowing effects
- large hover movement

---

# Tap / Press Feedback

Buttons must compress slightly on press.

Preferred:

```tsx id="qzcf1k"
whileTap={{
  scale: 0.97
}}
```

Purpose:

- tactile feedback
- physical realism
- interaction confirmation

---

# Card Animations

Cards should feel:

- lightweight
- layered
- responsive

Preferred:

- subtle lift
- tiny scale increase
- shadow interpolation

Avoid:

- flipping cards
- rotating cards
- exaggerated perspective

---

# Modal Motion

Modals should:

- appear quickly
- feel lightweight
- preserve context

Preferred animation:

```tsx id="m4ukc0"
initial={{
  opacity: 0,
  scale: 0.96,
  y: 8
}}

animate={{
  opacity: 1,
  scale: 1,
  y: 0
}}
```

Backdrop:

- fade immediately
- use subtle blur

Avoid:

- bouncing modals
- spinning modals
- cinematic transitions

---

# Navigation Motion

Navigation should:

- preserve orientation
- maintain continuity
- avoid disorientation

Preferred:

- fade
- shared element transitions
- subtle vertical movement

Avoid:

- horizontal app-wide slides
- dramatic wipes
- excessive motion blur

---

# Shared Element Transitions

Use shared transitions whenever:

- opening details
- expanding cards
- navigating between related views

This creates:

- spatial continuity
- premium feel
- perceived intelligence

Shared transitions are strongly encouraged.

---

# List & Grid Motion

Lists should animate:

- progressively
- subtly
- quickly

Preferred stagger:

```ts id="4ah4b0"
0.03 → 0.05
```

Never exceed:

```ts id="qgvkic"
0.08;
```

Avoid:

- dramatic cascades
- slow stagger chains

---

# Entrance Animations

Entrance motion should:

- fade in
- move minimally
- remain subtle

Preferred:

```tsx id="kkazcx"
initial={{
  opacity: 0,
  y: 12
}}

animate={{
  opacity: 1,
  y: 0
}}
```

Avoid:

- zoom explosions
- spinning entrances
- elastic bouncing

---

# Exit Animations

Exit animations should:

- be faster than entrances
- avoid dramatic movement

Preferred:

- fade
- slight downward translation
- scale reduction

Duration:

- 120–180ms

---

# Scroll Motion

Scroll animations should:

- support reading flow
- avoid hijacking scrolling
- feel smooth

Allowed:

- fade-in reveals
- subtle translate
- low-intensity parallax

Avoid:

- scroll jacking
- aggressive parallax
- spinning on scroll
- large-scale transformations

---

# Loading Motion

Prefer:

- skeleton loaders
- shimmer placeholders
- progressive reveal

Avoid:

- endless spinners
- aggressive pulsing
- flashing loaders

Skeleton shimmer should:

- be subtle
- low contrast
- slow moving

---

# Success Animations

Success states should create:

- completion satisfaction
- confidence
- reward

Examples:

- checkmark morph
- smooth progress completion
- soft pulse
- subtle glow

Avoid:

- excessive confetti
- loud celebration motion

Professional apps require restrained feedback.

---

# Error Motion

Errors should:

- attract attention gently
- avoid panic-inducing movement

Preferred:

- small shake
- subtle color transition
- micro vibration effect

Avoid:

- aggressive shaking
- flashing red elements

---

# Shipping / Logistics Motion Rules

Shipping and logistics interfaces benefit from:

- directional motion
- progress visualization
- route continuity
- state transitions

Preferred:

- left-to-right progression
- timeline fills
- route tracing
- moving indicators

Motion should communicate:

- certainty
- progress
- reliability

Avoid playful motion.

---

# AI Interface Motion Rules

AI interfaces should feel:

- intelligent
- calm
- fluid
- adaptive

Preferred:

- streaming fades
- progressive reveal
- cursor-like motion
- soft typing indicators

Avoid:

- chaotic loading
- excessive streaming effects
- distracting AI animations

---

# Blur & Glassmorphism

Use blur subtly.

Preferred:

```css id="q2b7q3"
backdrop-blur-xl
```

Avoid:

- unreadable transparency
- layered blur overload
- excessive frosted glass

---

# Shadow Motion

Shadows should:

- interpolate smoothly
- increase subtly on hover
- reinforce depth

Avoid:

- hard shadow jumps
- unrealistic shadow changes

---

# Motion Density Rules

Not every element should animate.

Prioritize animation for:

1. user-triggered interactions
2. navigation changes
3. important state changes
4. feedback confirmation

Avoid animation saturation.

Premium interfaces feel restrained.

---

# Reduced Motion Accessibility

Always support reduced motion.

Use:

```tsx id="4j8h5t"
useReducedMotion();
```

When enabled:

- disable transforms
- reduce duration
- remove parallax
- simplify transitions

Accessibility is mandatory.

---

# Emotional Design Goals

Motion should emotionally communicate:

- trust
- speed
- intelligence
- precision
- calmness
- modernity

Users should subconsciously feel:

- “this app is fast”
- “this app is polished”
- “this app is reliable”

---

# Forbidden Animation Patterns

Never use:

- random motion
- autoplaying decorative motion
- infinite bouncing
- large rotations
- spinning UI panels
- cartoon elasticity
- excessive blur transitions
- dramatic 3D perspective
- exaggerated scaling
- slow cinematic delays

Avoid motion that feels:

- gimmicky
- noisy
- juvenile

---

# Preferred Motion Stack

Recommended stack:

```txt id="wk5g8j"
React
Motion / Framer Motion
Tailwind
transform + opacity animations
spring physics
GPU acceleration
```

---

# Default React Transition

```tsx id="xy9w3v"
transition={{
  type: "spring",
  stiffness: 320,
  damping: 30,
  mass: 0.8
}}
```

---

# Default CSS Transition

```css id="j9y3yv"
transition:
  transform 220ms cubic-bezier(0.22, 1, 0.36, 1),
  opacity 220ms cubic-bezier(0.22, 1, 0.36, 1),
  box-shadow 220ms cubic-bezier(0.22, 1, 0.36, 1);
```

---

# Motion Quality Checklist

Before shipping any animation verify:

- Is it responsive immediately?
- Is it under 400ms?
- Does it preserve context?
- Is easing non-linear?
- Is motion subtle?
- Is it GPU accelerated?
- Does it improve usability?
- Does it avoid distraction?
- Does it feel physically believable?
- Does it support reduced motion?
- Does it feel premium?
- Would Apple/Linear ship this?

If not:
simplify the motion.

```

```
