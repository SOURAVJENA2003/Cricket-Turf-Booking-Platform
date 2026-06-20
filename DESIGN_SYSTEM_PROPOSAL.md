# Design System Proposal — Cricket Turf Booking Platform
**Three Color Palette + Typography Options**

---

## **PALETTE OPTION 1: "Modern Turf"** ✅ *Recommended*
*Energetic outdoor sports + premium trust*

### Colors
```
Primary (CTA, selection):        #1B8A3C  (Vibrant Turf Green)
Primary Light:                   #E8F5E9  (Very light green bg)
Primary Dark:                    #0D5A24  (Dark green for hover/depth)
Secondary (Accent highlights):   #FF6B35  (Warm Sports Orange)
Accent (Warnings, info):         #FFA500  (Amber for pending/caution)
Success:                         #10B981  (Bright green)
Error:                           #EF4444  (Red)
Background:                      #F8FAFC  (Very light blue-gray)
Card BG:                         #FFFFFF  (White)
Text Main:                       #0F172A  (Near-black)
Text Muted:                      #64748B  (Gray)
Border:                          #E2E8F0  (Light gray)
Shadow:                          0 4px 6px -1px rgba(0, 0, 0, 0.1)
```

### Typography
- **Headings:** `Inter` (sans-serif, 800 weight) - modern, confident, sporty
- **Body:** `Inter` (sans-serif, 400–500 weight) - clean, highly readable
- **Monospace:** `JetBrains Mono` - booking IDs, transaction refs

### Feeling
🏏 Energetic & sporty (turf green primary)  
✅ Trustworthy (professional secondary)  
🎯 Action-oriented (orange accent pops)  
📱 Fresh & modern (clean neutrals)

---

## **PALETTE OPTION 2: "Premium Blue + Green"**
*Professional, trustworthy, premium sports brand*

### Colors
```
Primary (CTA, selection):        #0D47A1  (Deep Sports Blue)
Primary Light:                   #E3F2FD  (Very light blue bg)
Primary Dark:                    #051C3F  (Navy for depth)
Secondary (Accent highlights):   #00D084  (Vibrant Teal/Green)
Accent (Warnings, info):         #FFA500  (Amber)
Success:                         #10B981  (Bright green)
Error:                           #DC2626  (Deep red)
Background:                      #F0F4F8  (Cooler light gray)
Card BG:                         #FFFFFF  (White)
Text Main:                       #111827  (Near-black)
Text Muted:                      #6B7280  (Gray)
Border:                          #E5E7EB  (Light gray)
Shadow:                          0 4px 6px -1px rgba(0, 0, 0, 0.12)
```

### Typography
- **Headings:** `Poppins` (bold, geometric, premium feel)
- **Body:** `Segoe UI` / `Open Sans` (highly readable, corporate)
- **Monospace:** `IBM Plex Mono` - booking IDs

### Feeling
🏢 Premium & professional  
🎖️ Trustworthy & corporate  
⚡ Modern & authoritative  
🌊 Cool, premium sports brand vibe

---

## **PALETTE OPTION 3: "Energetic Orange + Teal"**
*Playo/BookMyShow vibes — bold, youthful, action-driven*

### Colors
```
Primary (CTA, selection):        #FF6F3C  (Bold Sports Orange)
Primary Light:                   #FFE4CC  (Light orange bg)
Primary Dark:                    #D84315  (Deep orange for depth)
Secondary (Accent highlights):   #00BFA5  (Vibrant Teal)
Accent (Warnings, info):         #FFC107  (Bright Amber)
Success:                         #1DD1A1  (Bright Teal-Green)
Error:                           #E63946  (Red)
Background:                      #FAFAFA  (Off-white)
Card BG:                         #FFFFFF  (White)
Text Main:                       #1A1A1A  (Black)
Text Muted:                      #757575  (Gray)
Border:                          #E0E0E0  (Light gray)
Shadow:                          0 4px 8px rgba(0, 0, 0, 0.15)
```

### Typography
- **Headings:** `Montserrat` (bold, geometric, youth-forward)
- **Body:** `Roboto` (modern, highly readable, Google-approved)
- **Monospace:** `Space Mono` - booking IDs, technical info

### Feeling
🚀 Youthful & energetic  
🎯 Action-oriented & bold  
💥 High-confidence, premium sports brand  
📲 Modern, youth-friendly (like Playo/BookMyShow)

---

## **TYPOGRAPHY SCALES (All Options)**

### Heading Scale (Inter/Poppins/Montserrat)
```
h1: 2.25rem (36px), weight 800, line-height 1.2
h2: 1.875rem (30px), weight 700, line-height 1.3
h3: 1.5rem (24px), weight 700, line-height 1.4
h4: 1.25rem (20px), weight 600, line-height 1.4
```

### Body Scale
```
Body Large: 1.125rem (18px), weight 500, line-height 1.6
Body: 1rem (16px), weight 400, line-height 1.6
Body Small: 0.875rem (14px), weight 400, line-height 1.5
Label: 0.75rem (12px), weight 600, line-height 1.4, uppercase
```

---

## **RECOMMENDED CHOICE**

### **Option 1: Modern Turf** ✅

**Why:**
- **Turf-focused:** Green primary instantly communicates "outdoor cricket/sports"
- **Energetic:** Orange secondary adds action & youthfulness
- **Trustworthy:** Green + orange is calming + confidence-inducing (like established sports brands)
- **Accessible:** High contrast ratios, widely recognized color psychology
- **Versatile:** Works beautifully from 375px phones to 1440px desktops
- **Minimal change:** Builds on existing green (#2e7d32) with refinements

---

## **NEXT STEPS**

Once you confirm **Option 1, 2, or 3**, I'll immediately proceed to:

### **Step 3: Design System Implementation**
1. Create `app/styles/design-system.css` with all CSS variables
2. Redesign shared components:
   - `Button` component (new file: `.module.css` + best practices)
   - `Input/Form` component (new file)
   - `Card` component (new file)
   - Update `DatePicker`, `SlotGrid`, `BookingModal`, `SuccessModal`
3. Convert `layout.js` Tailwind classes to CSS Modules
4. Fix all hardcoded colors/spacing → use variables

### **Step 4: Preview Summary**
Show you before/after of all components before page redesign

### **Step 5: Full Page Redesign** (in order)
- Home page (slot booking UX)
- Admin dashboard
- Cancel booking page
- Admin login page

---

## **CONFIRMATION**

**Which palette? 1, 2, or 3?** (Or provide feedback to refine)

Once confirmed, I'll implement the complete design system in ~30 minutes.
