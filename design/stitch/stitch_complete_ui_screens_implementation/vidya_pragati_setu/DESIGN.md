---
name: Vidya Pragati Setu
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#747686'
  outline-variant: '#c4c5d7'
  surface-tint: '#2151da'
  primary: '#0037b0'
  on-primary: '#ffffff'
  primary-container: '#1d4ed8'
  on-primary-container: '#cad3ff'
  inverse-primary: '#b7c4ff'
  secondary: '#9d4300'
  on-secondary: '#ffffff'
  secondary-container: '#fd761a'
  on-secondary-container: '#5c2400'
  tertiary: '#233f8f'
  on-tertiary: '#ffffff'
  tertiary-container: '#3e57a8'
  on-tertiary-container: '#c9d3ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dce1ff'
  primary-fixed-dim: '#b7c4ff'
  on-primary-fixed: '#001551'
  on-primary-fixed-variant: '#0039b5'
  secondary-fixed: '#ffdbca'
  secondary-fixed-dim: '#ffb690'
  on-secondary-fixed: '#341100'
  on-secondary-fixed-variant: '#783200'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b6c4ff'
  on-tertiary-fixed: '#00164e'
  on-tertiary-fixed-variant: '#264191'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-mobile:
    fontFamily: Inter
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes a high-trust, citizen-first civic digital experience tailored for the state education ecosystem of Gujarat. Balancing institutional authority with accessible warmth, it bridges state machinery and diverse beneficiaries—from rural first-generation college aspirants to urban administrative officers.

The aesthetic fuses **Corporate / Modern** civic precision with approachable, humancentric clarity:
- **Personality:** Trustworthy, uplifting, crystal-clear, transparent, and encouraging.
- **Emotional Response:** Inspires confidence, removes bureaucratic anxiety, and instills a sense of progression and dignity in every scholarship applicant.
- **Design Metaphor:** "The Clear Bridge" (*Setu*)—unobstructed workflows, zero visual clutter, explicit feedback states, and strict structural legibility that prioritizes accessibility across devices and network conditions.

## Colors

The palette delivers strict WCAG AA contrast standards while honoring institutional familiarity and state identity.

- **Primary (Trust Blue - `#1D4ED8`):** Anchors navigation, primary brand moments, interactive links, and focused active components. 
  - *Deep Navy (`#1E3A8A`):* Elevated headers, text emphasis, and high-priority chrome.
  - *Light Blue tint (`#DBEAFE`):* Interactive focus halos, informative surfaces, and selection indicators.
- **Secondary / Action Accent (Saffron Orange - `#F97316`):** Reserved for high-value forward actions, critical applicant CTAs ("Apply Now", "Submit Verification"), and promotional milestones.
- **Functional Semantics:**
  - *Success (`#16A34A`):* Application Approved, Document Verified, Payment Disbursed (paired with `#DCFCE7` surface).
  - *Warning (`#EAB308`):* Pending Verification, Action Required, Incomplete Form (paired with `#FEF9C3` surface).
  - *Danger (`#DC2626`):* Rejected, Scheme Ineligible, Immediate Correction Required (paired with `#FEE2E2` surface).
  - *Info (`#0EA5E9`):* Under Scrutiny, In Progress, System Notices (paired with `#E0F2FE` surface).
- **Surfaces & Borders:** Grounded in a cool canvas `#F8FAFC`, pristine white card surfaces `#FFFFFF`, and structural borders `#E2E8F0`. Neutral text flows from slate `#0F172A` down to subtle metadata `#64748B`.

## Typography

The type system prioritizes uncompromised legibility across screen sizes and multiple languages.

- **Primary Font Stack:** `Inter, 'Noto Sans Gujarati', system-ui, -apple-system, sans-serif`.
- **Bilingual Harmony:** When switching to Gujarati locale (`gu-IN`), typography metrics map 1:1 using `Noto Sans Gujarati` at matched weights. Gujarati script requires strict enforcement of the provided line-height scale to avoid clipping diacritics and conjuncts (*matras* and *jodakshar*).
- **Scale Usage:**
  - `display` & `headline-lg`: Platform landing banners and portal welcoming sections.
  - `headline-md` & `headline-sm`: Application stage headers, dashboard summaries, and eligibility criteria headers.
  - `title-lg` & `title-md`: Card headings, document verification rows, and modal dialog titles.
  - `body-md` & `body-sm`: Instructions, form help notes, input labels, and terms.
  - `label-*` & `caption`: Status badges, metadata tags, and timestamp indicators.

## Layout & Spacing

A structured 12-column responsive layout manages the density of civic multi-step workflows.

- **Grid Architecture:**
  - **Desktop (≥1024px):** 12 columns, `1.5rem` (24px) gutters, `2rem` (32px) screen margins. Maximum container width capped at `1280px` for optimal reading comprehension.
  - **Tablet (768px – 1023px):** 8 columns, `1.5rem` gutters, `1.5rem` outer margin.
  - **Mobile (<768px):** 4 columns, `1rem` (16px) gutters, `1rem` (16px) outer canvas margin.
- **Rhythm & Vertical Flow:**
  - Strict 4px base modular unit (`0.25rem`).
  - Section blocks separate with `space-xl` (32px).
  - Form field groupings and related input pairs stack with `space-md` (16px).
  - Micro-spacing within interactive elements (icon to label) uses `space-xs` (4px) or `space-sm` (8px).

## Elevation & Depth

This system avoids aggressive skeuomorphic drops and harsh shadows in favor of calm, institutional elevation. Depth communicates interactivity and context stacking:

- **Level 0 (Flat Canvas):** `#F8FAFC` base surface for global page layout.
- **Level 1 (Card / Container Rest):** `#FFFFFF` surface with crisp 1px solid border (`#E2E8F0`) and subtle diffuse ambient shadow: `box-shadow: 0 4px 16px rgba(15, 23, 42, 0.06)`. This frames all form modules, scheme cards, and metrics widgets.
- **Level 2 (Hover / Interactive Elevation):** Transitions on interactive scheme cards and clickable items: `box-shadow: 0 8px 24px rgba(15, 23, 42, 0.09)`, maintaining the `#E2E8F0` border.
- **Level 3 (Overlays & Dialogs):** Modals, OTP verification sheets, and slide-over document previewers: `box-shadow: 0 16px 36px rgba(15, 23, 42, 0.12)`, supported by a `rgba(15, 23, 42, 0.45)` backdrop wash.
- **Focus Rings:** Non-shadow high-contrast 3px focus ring with 2px offset: `outline: 3px solid #1D4ED8; outline-offset: 2px;` to fulfill rigorous accessibility compliance.

## Shapes

The geometric personality features soft, reassuring curvature (`roundedness: 2`), balancing human warmth with structured clarity.

- **Primary Cards & Containers:** Standardized at `16px` (`rounded-xl` equivalent in this scale) to keep dense data panels friendly and approachable.
- **Form Controls & Inputs:** Sized at `8px` (`rounded`) corner radius for sharp optical alignment with text margins.
- **Buttons:** Sized at `8px` (`rounded`) for dependable tactile grounding.
- **Status Chips & Pills:** Full pill radius (`9999px`) for unmistakable recognition as status tokens distinct from actionable buttons.

## Components

All icons throughout components utilize **Lucide Icons** rendered with a consistent `2px` stroke width and `20px` bounding box for optimal optical balance.

### 1. Buttons
- **Primary Action (Saffron CTA):** Background `#F97316`, white text `#FFFFFF`, bold weight. Used for key forward user paths ("Submit Application", "Verify Aadhaar"). Focus ring `#F97316`. Hover `#EA580C`.
- **Institutional Primary (Trust Blue):** Background `#1D4ED8`, white text `#FFFFFF`. Used for portal-wide standard actions ("Search Schemes", "Save Draft"). Hover `#1E40AF`.
- **Secondary / Outline:** Background `#FFFFFF`, 1.5px border `#E2E8F0`, text `#1E3A8A`. Hover background `#F8FAFC`.
- **Destructive:** Background `#DC2626`, text `#FFFFFF`. Hover `#B91C1C`.
- **Dimensions:** Height 44px (touch-compliant min-target on mobile), horizontal padding `1.25rem`.

### 2. Status Chips
Pill-shaped containers (`border-radius: 9999px`), padding `4px 12px`, typography `label-md`. Each chip pairs an icon with an explicit text label:
- **Approved:** Background `#DCFCE7`, text `#15803D`, border `1px solid #BBF7D0`, icon `CheckCircle2`.
- **Pending / Action Required:** Background `#FEF9C3`, text `#A16207`, border `1px solid #FEF08A`, icon `Clock`.
- **Rejected / Ineligible:** Background `#FEE2E2`, text `#B91C1C`, border `1px solid #FECACA`, icon `XCircle`.
- **In Progress / Under Scrutiny:** Background `#E0F2FE`, text `#0369A1`, border `1px solid #BAE6FD`, icon `RefreshCw`.

### 3. Cards & Scheme Modules
- Built on `#FFFFFF` surface with `16px` border-radius and `0 4px 16px rgba(15,23,42,0.06)` shadow.
- Border: `1px solid #E2E8F0`.
- Includes scheme category pill, eligible quota indicator, award amount highlighted in `title-lg` (`#1D4ED8`), and deadline countdown tag.

### 4. Input Fields & Selects
- Height 44px, border `1px solid #CBD5E1`, background `#FFFFFF`, radius `8px`.
- Active/Focus: Border `#1D4ED8`, box-shadow `0 0 0 3px #DBEAFE`.
- Error state: Border `#DC2626`, support message text `#DC2626` with `AlertCircle` icon.
- Labels sit above inputs in `label-lg` (`#0F172A`) with mandatory asterisk `*` in `#DC2626`.

### 5. Checkboxes & Radio Buttons
- 20px x 20px dimension, radius `4px` (checkbox) and `50%` (radio).
- Border `1.5px solid #94A3B8`. Checked state: Background `#1D4ED8`, border `#1D4ED8`, white check indicator.

### 6. Stepper & Application Progress Bar
- Horizontal numbered step chain showing completion flow (e.g., *1. Student Details → 2. Academic Record → 3. Income & Caste Certificate → 4. Bank Details → 5. Preview*).
- Active step: `#1D4ED8` circle with white numeral; completed step: `#16A34A` circle with white check icon; upcoming step: `#E2E8F0` circle with `#64748B` numeral.

### 7. Document Upload & Verification Tile
- Drag-and-drop zone with `#F8FAFC` background and `1.5px dashed #CBD5E1` border.
- Uploaded file state reveals document name, size, verification badge ("DigiLocker Verified" in `#16A34A`), and removal action.