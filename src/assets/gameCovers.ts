// High-Definition Stylized SVG Box Art & Cartridges (Clean & Professional Gaming Aesthetics)

export const GAME_COVERS = {
  retroArch: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_retro" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4C0519" />
      <stop offset="50%" stop-color="#881337" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="cart_grad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#334155" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <radialGradient id="pokeglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F43F5E" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#F43F5E" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg_retro)" />
  <circle cx="200" cy="180" r="140" fill="url(#pokeglow)" />
  
  <!-- Virtual Cartridge Shell -->
  <g transform="translate(60, 50)">
    <path d="M 15 0 L 265 0 C 275 0 280 8 280 18 L 280 260 C 280 270 272 278 260 278 L 20 278 C 8 278 0 270 0 260 L 0 18 C 0 8 5 0 15 0 Z" fill="url(#cart_grad)" stroke="#E11D48" stroke-width="3" />
    <path d="M 30 15 L 250 15 C 255 15 260 20 260 25 L 260 35 L 20 35 L 20 25 C 20 20 25 15 30 15 Z" fill="#1E293B" />
    <text x="140" y="28" font-family="'Inter', sans-serif" font-weight="900" font-size="10" fill="#94A3B8" text-anchor="middle" letter-spacing="4">VIRTUAL SYSTEM CORE</text>
    
    <!-- Shiny Art Sticker -->
    <rect x="25" y="45" width="230" height="190" rx="10" fill="#BE123C" stroke="#FDA4AF" stroke-width="2" />
    
    <!-- Generic Pixel Arcade Chip Logo -->
    <g transform="translate(140, 115) scale(1.4)">
      <path d="M -30 -15 L -20 -35 L -10 -20 L 10 -20 L 20 -35 L 30 -15 L 35 10 L 20 25 L 15 20 L -15 20 L -20 25 L -35 10 Z" fill="#FFFFFF" opacity="0.95" />
      <circle cx="-12" cy="-2" r="4" fill="#BE123C" />
      <circle cx="12" cy="-2" r="4" fill="#BE123C" />
      <rect x="-16" y="8" width="32" height="4" rx="2" fill="#BE123C" />
    </g>
    
    <!-- Sticker Banner (100% Legal & Discreet) -->
    <rect x="35" y="180" width="210" height="42" rx="6" fill="#1E1B4B" />
    <text x="140" y="198" font-family="'Inter', sans-serif" font-weight="900" font-size="12" fill="#FBBF24" text-anchor="middle" letter-spacing="1">LIBRETRO WASM CORE</text>
    <text x="140" y="213" font-family="'Inter', sans-serif" font-weight="700" font-size="9" fill="#E2E8F0" text-anchor="middle" letter-spacing="2">16-BIT / 32-BIT ENGINE</text>
  </g>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#F43F5E" />
  <rect x="392" y="360" width="8" height="40" fill="#F59E0B" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#FDA4AF" text-anchor="middle" letter-spacing="3">INTÉRPRETE VIRTUAL</text>
</svg>`)}`,

  cyberEncounter: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_cyber" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#083344" />
      <stop offset="50%" stop-color="#164E63" />
      <stop offset="100%" stop-color="#042F2E" />
    </linearGradient>
    <radialGradient id="cyberglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#06B6D4" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#06B6D4" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg_cyber)" />
  <circle cx="200" cy="180" r="150" fill="url(#cyberglow)" />
  
  <!-- Monolith Boss Hexagon -->
  <g transform="translate(100, 70)">
    <polygon points="100,10 180,50 180,150 100,190 20,150 20,50" fill="#0E7490" stroke="#22D3EE" stroke-width="4" />
    <polygon points="100,30 160,65 160,135 100,170 40,135 40,65" fill="#155E75" stroke="#67E8F9" stroke-width="2" />
    
    <!-- Glowing Boss Core Eye -->
    <circle cx="100" cy="100" r="28" fill="#042F2E" stroke="#A5F3FC" stroke-width="3" />
    <circle cx="100" cy="100" r="12" fill="#22D3EE" />
    <circle cx="100" cy="100" r="4" fill="#FFFFFF" />
    
    <line x1="20" y1="210" x2="60" y2="160" stroke="#38BDF8" stroke-width="4" stroke-linecap="round" />
    <line x1="180" y1="210" x2="140" y2="160" stroke="#F43F5E" stroke-width="4" stroke-linecap="round" />
  </g>
  
  <!-- JRPG Title Banner -->
  <rect x="40" y="270" width="320" height="70" rx="14" fill="#082F49" stroke="#38BDF8" stroke-width="2" />
  <text x="200" y="298" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">CYBER-ENCOUNTER</text>
  <text x="200" y="322" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#38BDF8" text-anchor="middle" letter-spacing="3">TACTICAL ARCH BOSS</text>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#06B6D4" />
  <rect x="392" y="360" width="8" height="40" fill="#3B82F6" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#67E8F9" text-anchor="middle" letter-spacing="3">CLEAN ARCH BATTLE</text>
</svg>`)}`,

  snake8bit: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_snake" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022C22" />
      <stop offset="50%" stop-color="#064E3B" />
      <stop offset="100%" stop-color="#022C22" />
    </linearGradient>
    <radialGradient id="snakeglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#10B981" stop-opacity="0.5" />
      <stop offset="100%" stop-color="#10B981" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg_snake)" />
  <circle cx="200" cy="180" r="140" fill="url(#snakeglow)" />
  
  <!-- Pixel Snake Body (Glowing Neon Emerald) -->
  <g>
    <rect x="100" y="220" width="36" height="36" rx="6" fill="#059669" />
    <rect x="140" y="220" width="36" height="36" rx="6" fill="#10B981" />
    <rect x="140" y="180" width="36" height="36" rx="6" fill="#10B981" />
    <rect x="140" y="140" width="36" height="36" rx="6" fill="#34D399" />
    <rect x="180" y="140" width="36" height="36" rx="6" fill="#34D399" />
    <rect x="220" y="140" width="36" height="36" rx="6" fill="#6EE7B7" />
    <rect x="220" y="100" width="36" height="36" rx="6" fill="#6EE7B7" />
    <rect x="260" y="100" width="36" height="36" rx="8" fill="#A7F3D0" stroke="#FFFFFF" stroke-width="2" />
    <circle cx="282" cy="110" r="4" fill="#064E3B" />
    <circle cx="282" cy="126" r="4" fill="#064E3B" />
    <circle cx="280" cy="200" r="14" fill="#EF4444" stroke="#FECACA" stroke-width="2" />
    <line x1="280" y1="186" x2="284" y2="180" stroke="#22C55E" stroke-width="3" stroke-linecap="round" />
  </g>
  
  <!-- Title Badge -->
  <rect x="40" y="275" width="320" height="65" rx="14" fill="#064E3B" stroke="#34D399" stroke-width="2" />
  <text x="200" y="302" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">RETRO SNAKE NEON</text>
  <text x="200" y="324" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#6EE7B7" text-anchor="middle" letter-spacing="3">ARCADE DELUXE EDITION</text>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#10B981" />
  <rect x="392" y="360" width="8" height="40" fill="#34D399" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#A7F3D0" text-anchor="middle" letter-spacing="3">NEON MATRIX ENGINE</text>
</svg>`)}`,

  matrix2048: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_2048" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#451A03" />
      <stop offset="50%" stop-color="#78350F" />
      <stop offset="100%" stop-color="#1C1917" />
    </linearGradient>
    <radialGradient id="goldenglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg_2048)" />
  <circle cx="200" cy="170" r="140" fill="url(#goldenglow)" />
  
  <!-- Isometric 2048 Matrix Grid -->
  <g transform="translate(70, 50)">
    <rect x="0" y="0" width="260" height="210" rx="16" fill="#292524" stroke="#F59E0B" stroke-width="3" />
    
    <g transform="translate(15, 15)">
      <rect x="0" y="0" width="50" height="40" rx="8" fill="#78716C" />
      <text x="25" y="25" font-family="'Inter', sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle">2</text>
      
      <rect x="60" y="0" width="50" height="40" rx="8" fill="#F97316" />
      <text x="85" y="25" font-family="'Inter', sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle">8</text>
      
      <rect x="120" y="0" width="50" height="40" rx="8" fill="#EA580C" />
      <text x="145" y="25" font-family="'Inter', sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle">64</text>
      
      <rect x="180" y="0" width="50" height="40" rx="8" fill="#CA8A04" />
      <text x="205" y="25" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#FFFFFF" text-anchor="middle">256</text>
      
      <rect x="30" y="55" width="170" height="110" rx="14" fill="#F59E0B" stroke="#FEF3C7" stroke-width="4" />
      <text x="115" y="125" font-family="'Inter', sans-serif" font-weight="900" font-size="44" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">2048</text>
    </g>
  </g>
  
  <rect x="40" y="275" width="320" height="65" rx="14" fill="#78350F" stroke="#F59E0B" stroke-width="2" />
  <text x="200" y="302" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">2048 LOGIC MATRIX</text>
  <text x="200" y="324" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#FDE68A" text-anchor="middle" letter-spacing="3">BINARY ARRAY PUZZLE</text>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#F59E0B" />
  <rect x="392" y="360" width="8" height="40" fill="#EA580C" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#FDE68A" text-anchor="middle" letter-spacing="3">PUZZLE LOGIC ENGINE</text>
</svg>`)}`,

  psxCover: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_psx" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A" />
      <stop offset="50%" stop-color="#1E3A8A" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
    <radialGradient id="psxglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#0284C7" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg_psx)" />
  <circle cx="200" cy="170" r="140" fill="url(#psxglow)" />
  
  <!-- Geometric 3D CD Case Silhouette -->
  <g transform="translate(70, 45)">
    <rect x="0" y="0" width="260" height="220" rx="14" fill="#0B0F19" stroke="#38BDF8" stroke-width="3" />
    <circle cx="130" cy="110" r="75" fill="#1E293B" stroke="#0284C7" stroke-width="2" />
    <circle cx="130" cy="110" r="28" fill="#0B0F19" stroke="#38BDF8" stroke-width="2" />
    
    <!-- 4 Geometric Symbols -->
    <polygon points="130,55 115,80 145,80" fill="#10B981" />
    <circle cx="185" cy="110" r="12" fill="none" stroke="#EF4444" stroke-width="4" />
    <g transform="translate(130, 165)">
      <line x1="-10" y1="-10" x2="10" y2="10" stroke="#3B82F6" stroke-width="4" stroke-linecap="round" />
      <line x1="10" y1="-10" x2="-10" y2="10" stroke="#3B82F6" stroke-width="4" stroke-linecap="round" />
    </g>
    <rect x="63" y="98" width="24" height="24" fill="none" stroke="#EC4899" stroke-width="4" rx="2" />
  </g>
  
  <rect x="40" y="280" width="320" height="65" rx="14" fill="#1E293B" stroke="#38BDF8" stroke-width="2" />
  <text x="200" y="307" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">32-BIT 3D POLYGON ENGINE</text>
  <text x="200" y="329" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#7DD3FC" text-anchor="middle" letter-spacing="3">ISO / CHD / CUE RUNNER</text>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#38BDF8" />
  <rect x="392" y="360" width="8" height="40" fill="#3B82F6" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#BAE6FD" text-anchor="middle" letter-spacing="3">32-BIT CD-ROM RUNTIME</text>
</svg>`)}`,

  n64Cover: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_n64" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#022C22" />
      <stop offset="50%" stop-color="#14532D" />
      <stop offset="100%" stop-color="#713F12" />
    </linearGradient>
    <radialGradient id="n64glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#EAB308" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#EAB308" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg_n64)" />
  <circle cx="200" cy="165" r="140" fill="url(#n64glow)" />
  
  <!-- 3D 64-Bit Prism Geometric Structure -->
  <g transform="translate(130, 60)">
    <polygon points="70,0 140,40 140,120 70,160 0,120 0,40" fill="#15803D" stroke="#EAB308" stroke-width="4" />
    <polygon points="70,0 140,40 70,80 0,40" fill="#22C55E" />
    <polygon points="70,80 140,40 140,120 70,160" fill="#166534" />
    <text x="70" y="105" font-family="'Inter', sans-serif" font-weight="900" font-size="42" fill="#FACC15" text-anchor="middle">64</text>
  </g>
  
  <rect x="40" y="280" width="320" height="65" rx="14" fill="#1C1917" stroke="#EAB308" stroke-width="2" />
  <text x="200" y="307" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">64-BIT ULTRA MIPMAP ENGINE</text>
  <text x="200" y="329" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#FEF08A" text-anchor="middle" letter-spacing="3">Z64 / N64 3D WEBGL CORE</text>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#22C55E" />
  <rect x="392" y="360" width="8" height="40" fill="#EAB308" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#FEF08A" text-anchor="middle" letter-spacing="3">HIGH-LEVEL 64-BIT RUNTIME</text>
</svg>`)}`,

  ndsCover: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_nds" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#500724" />
      <stop offset="50%" stop-color="#831843" />
      <stop offset="100%" stop-color="#1E1B4B" />
    </linearGradient>
    <radialGradient id="ndsglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#EC4899" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#EC4899" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg_nds)" />
  <circle cx="200" cy="165" r="140" fill="url(#ndsglow)" />
  
  <!-- Dual Screen Foldable Handheld -->
  <g transform="translate(90, 40)">
    <rect x="0" y="0" width="220" height="100" rx="10" fill="#0F172A" stroke="#EC4899" stroke-width="3" />
    <rect x="25" y="15" width="170" height="70" rx="6" fill="#1E293B" stroke="#F472B6" stroke-width="2" />
    
    <line x1="0" y1="110" x2="220" y2="110" stroke="#9D174D" stroke-width="4" stroke-dasharray="10 6" />
    
    <rect x="0" y="120" width="220" height="100" rx="10" fill="#0F172A" stroke="#EC4899" stroke-width="3" />
    <rect x="25" y="135" width="170" height="70" rx="6" fill="#1E293B" stroke="#06B6D4" stroke-width="2" />
    <text x="110" y="178" font-family="'Inter', sans-serif" font-weight="900" font-size="14" fill="#38BDF8" text-anchor="middle" letter-spacing="2">TOUCH SCREEN</text>
  </g>
  
  <rect x="40" y="280" width="320" height="65" rx="14" fill="#1E1B4B" stroke="#EC4899" stroke-width="2" />
  <text x="200" y="307" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">DUAL-SCREEN TOUCH ENGINE</text>
  <text x="200" y="329" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#FBCFE8" text-anchor="middle" letter-spacing="3">NDS DUAL DISPLAY RUNNER</text>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#EC4899" />
  <rect x="392" y="360" width="8" height="40" fill="#06B6D4" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#FBCFE8" text-anchor="middle" letter-spacing="3">DUAL WASM RUNTIME</text>
</svg>`)}`,

  snesCover: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_snes" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2E1065" />
      <stop offset="50%" stop-color="#581C87" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <radialGradient id="snesglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#A855F7" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#A855F7" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg_snes)" />
  <circle cx="200" cy="165" r="140" fill="url(#snesglow)" />
  
  <!-- 16-Bit Super FX Cartridge -->
  <g transform="translate(60, 50)">
    <rect x="0" y="0" width="280" height="210" rx="20" fill="#334155" stroke="#A855F7" stroke-width="4" />
    <rect x="25" y="30" width="230" height="130" rx="10" fill="#1E1B4B" stroke="#C084FC" stroke-width="2" />
    <text x="140" y="85" font-family="'Inter', sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">SUPER 16-BIT</text>
    <text x="140" y="115" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#E9D5FF" text-anchor="middle" letter-spacing="4">MODE-7 & DSP CORES</text>
  </g>
  
  <rect x="40" y="280" width="320" height="65" rx="14" fill="#3B0764" stroke="#A855F7" stroke-width="2" />
  <text x="200" y="307" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">SUPER 16-BIT MODE-7 ENGINE</text>
  <text x="200" y="329" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#E9D5FF" text-anchor="middle" letter-spacing="3">SFC / SMC VIRTUAL ENGINE</text>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#A855F7" />
  <rect x="392" y="360" width="8" height="40" fill="#C084FC" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#E9D5FF" text-anchor="middle" letter-spacing="3">16-BIT DSP RUNTIME</text>
</svg>`)}`,

  segaCover: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_sega" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#082F49" />
      <stop offset="50%" stop-color="#0369A1" />
      <stop offset="100%" stop-color="#0284C7" />
    </linearGradient>
    <radialGradient id="segaglow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.6" />
      <stop offset="100%" stop-color="#38BDF8" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg_sega)" />
  <circle cx="200" cy="165" r="140" fill="url(#segaglow)" />
  
  <!-- Sega 16-Bit Arcade Grid -->
  <g transform="translate(60, 50)">
    <rect x="0" y="0" width="280" height="210" rx="14" fill="#0B0F19" stroke="#38BDF8" stroke-width="4" />
    <rect x="25" y="30" width="230" height="130" rx="8" fill="#0C4A6E" stroke="#7DD3FC" stroke-width="2" />
    <text x="140" y="85" font-family="'Inter', sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">BLAST PROCESSING</text>
    <text x="140" y="115" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#BAE6FD" text-anchor="middle" letter-spacing="4">16-BIT HIGH-SPEED FM SYNTH</text>
  </g>
  
  <rect x="40" y="280" width="320" height="65" rx="14" fill="#075985" stroke="#38BDF8" stroke-width="2" />
  <text x="200" y="307" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">16-BIT HIGH-SPEED ARCADE</text>
  <text x="200" y="329" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#BAE6FD" text-anchor="middle" letter-spacing="3">MD / GEN BLAST RUNNER</text>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#38BDF8" />
  <rect x="392" y="360" width="8" height="40" fill="#0284C7" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#BAE6FD" text-anchor="middle" letter-spacing="3">16-BIT ARCADE RUNTIME</text>
</svg>`)}`,
};

