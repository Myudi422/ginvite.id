---
name: design-system-platform-undangan-digital-premium-untuk-semua-ac
description: Creates implementation-ready design-system guidance with tokens, component behavior, and accessibility standards. Use when creating or updating UI rules, component specifications, or design-system documentation.
---

<!-- TYPEUI_SH_MANAGED_START -->

# Platform Undangan Digital Premium untuk Semua Acara

## Mission
Deliver implementation-ready design-system guidance for Platform Undangan Digital Premium untuk Semua Acara that can be applied consistently across content site interfaces.

## Brand
- Product/brand: Platform Undangan Digital Premium untuk Semua Acara
- URL: https://qondangan.com/
- Audience: readers and knowledge seekers
- Product surface: content site

## Style Foundations
- Visual style: structured, accessible, implementation-first
- Main font style: `font.family.primary=sans-serif`, `font.family.stack=sans-serif, ui-sans-serif, system-ui, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji`, `font.size.base=16px`, `font.weight.base=400`, `font.lineHeight.base=24px`
- Typography scale: `font.size.xs=10px`, `font.size.sm=12px`, `font.size.md=14px`, `font.size.lg=16px`, `font.size.xl=18px`, `font.size.2xl=20px`, `font.size.3xl=24px`, `font.size.4xl=30px`
- Color palette: `color.text.primary=#ffffff`, `color.text.secondary=oklch(0.647 0.156 241.257)`, `color.text.tertiary=oklch(0.869 0.022 252.894)`, `color.text.inverse=oklch(0.705 0.015 286.067)`, `color.surface.base=#000000`, `color.surface.muted=oklch(0.588 0.158 241.966)`, `color.surface.raised=oklch(0.129 0.042 264.695)`, `color.surface.strong=oklch(0.13 0.028 261.692)`, `color.border.default=oklch(0.269 0 0)`, `color.border.muted=oklch(0.274 0.006 286.033)`
- Spacing scale: `space.1=2px`, `space.2=2.5px`, `space.3=3px`, `space.4=3.5px`, `space.5=4px`, `space.6=8px`, `space.7=12px`, `space.8=13.26px`
- Radius/shadow/motion tokens: `radius.xs=10px`, `radius.sm=18px`, `radius.md=21.6px`, `radius.lg=24px`, `radius.xl=28px`, `radius.2xl=32px`, `radius.step7=9999px` | `shadow.1=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.1) 0px 4px 6px -4px`, `shadow.2=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(8, 47, 73, 0.25) 0px 24px 80px 0px`, `shadow.3=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px`, `shadow.4=rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(15, 23, 42, 0.1) 0px 24px 70px 0px` | `motion.duration.instant=150ms`, `motion.duration.fast=200ms`, `motion.duration.normal=300ms`, `motion.duration.slow=400ms`, `motion.duration.slower=500ms`, `motion.duration.step6=700ms`

## Accessibility
- Target: WCAG 2.2 AA
- Keyboard-first interactions required.
- Focus-visible rules required.
- Contrast constraints required.

## Writing Tone
concise, confident, implementation-focused

## Rules: Do
- Use semantic tokens, not raw hex values in component guidance.
- Every component must define required states: default, hover, focus-visible, active, disabled, loading, error.
- Responsive behavior and edge-case handling should be specified for every component family.
- Accessibility acceptance criteria must be testable in implementation.

## Rules: Don't
- Do not allow low-contrast text or hidden focus indicators.
- Do not introduce one-off spacing or typography exceptions.
- Do not use ambiguous labels or non-descriptive actions.

## Guideline Authoring Workflow
1. Restate design intent in one sentence.
2. Define foundations and tokens.
3. Define component anatomy, variants, and interactions.
4. Add accessibility acceptance criteria.
5. Add anti-patterns and migration notes.
6. End with QA checklist.

## Required Output Structure
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- Include keyboard, pointer, and touch behavior.
- Include spacing and typography token requirements.
- Include long-content, overflow, and empty-state handling.

## Quality Gates
- Every non-negotiable rule must use "must".
- Every recommendation should use "should".
- Every accessibility rule must be testable in implementation.
- Prefer system consistency over local visual exceptions.

<!-- TYPEUI_SH_MANAGED_END -->
