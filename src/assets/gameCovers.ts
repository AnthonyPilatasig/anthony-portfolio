// High-Definition Stylized SVG Box Art & Cartridges (Nintendo Switch & Steam Deck aesthetics)

export const GAME_COVERS = {
  zipLoader: `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="100%" height="100%">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E1B4B" />
      <stop offset="50%" stop-color="#312E81" />
      <stop offset="100%" stop-color="#0F172A" />
    </linearGradient>
    <linearGradient id="holo" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#6366F1" />
      <stop offset="50%" stop-color="#EC4899" />
      <stop offset="100%" stop-color="#06B6D4" />
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#818CF8" stop-opacity="0.4" />
      <stop offset="100%" stop-color="#818CF8" stop-opacity="0" />
    </radialGradient>
  </defs>
  <rect width="400" height="400" fill="url(#bg)" />
  <circle cx="200" cy="180" r="140" fill="url(#glow)" />
  
  <!-- Cyber Cartridge Shell -->
  <g transform="translate(80, 60)">
    <rect x="0" y="0" width="240" height="260" rx="20" fill="#0B0F19" stroke="url(#holo)" stroke-width="4" />
    <rect x="20" y="20" width="200" height="150" rx="12" fill="#181E2E" stroke="#334155" stroke-width="2" />
    
    <!-- Holographic Chip Lines -->
    <path d="M 40 40 L 90 40 L 110 60 L 180 60" stroke="#6366F1" stroke-width="3" fill="none" opacity="0.8" />
    <circle cx="180" cy="60" r="4" fill="#EC4899" />
    <path d="M 40 140 L 100 140 L 120 120 L 180 120" stroke="#06B6D4" stroke-width="3" fill="none" opacity="0.8" />
    <circle cx="40" cy="140" r="4" fill="#6366F1" />
    
    <!-- Upload Zip Icon Center -->
    <circle cx="120" cy="95" r="36" fill="#1E1B4B" stroke="url(#holo)" stroke-width="3" />
    <path d="M 120 75 L 120 110 M 105 90 L 120 75 L 135 90" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" />
    <rect x="106" y="112" width="28" height="5" rx="2.5" fill="#38BDF8" />
    
    <!-- Gold Contact Pins at Bottom -->
    <g transform="translate(45, 230)">
      <rect x="0" y="0" width="12" height="24" rx="2" fill="#F59E0B" />
      <rect x="22" y="0" width="12" height="24" rx="2" fill="#F59E0B" />
      <rect x="44" y="0" width="12" height="24" rx="2" fill="#F59E0B" />
      <rect x="66" y="0" width="12" height="24" rx="2" fill="#F59E0B" />
      <rect x="88" y="0" width="12" height="24" rx="2" fill="#F59E0B" />
      <rect x="110" y="0" width="12" height="24" rx="2" fill="#F59E0B" />
      <rect x="132" y="0" width="12" height="24" rx="2" fill="#F59E0B" />
    </g>
    
    <!-- Cartridge Label -->
    <rect x="25" y="185" width="190" height="32" rx="8" fill="#1E293B" />
    <text x="120" y="206" font-family="'Inter', sans-serif" font-weight="900" font-size="13" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">ZIP GAME SLOT</text>
  </g>
  
  <!-- Switch-style Red/Blue Corner Badges -->
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#EF4444" />
  <rect x="392" y="360" width="8" height="40" fill="#06B6D4" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#94A3B8" text-anchor="middle" letter-spacing="3">CARGAR DESDE ZIP</text>
</svg>`)}`,

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
  
  <!-- GBA Game Cartridge -->
  <g transform="translate(60, 50)">
    <!-- Cartridge Outer Plastic Shell -->
    <path d="M 15 0 L 265 0 C 275 0 280 8 280 18 L 280 260 C 280 270 272 278 260 278 L 20 278 C 8 278 0 270 0 260 L 0 18 C 0 8 5 0 15 0 Z" fill="url(#cart_grad)" stroke="#E11D48" stroke-width="3" />
    <path d="M 30 15 L 250 15 C 255 15 260 20 260 25 L 260 35 L 20 35 L 20 25 C 20 20 25 15 30 15 Z" fill="#1E293B" />
    <text x="140" y="28" font-family="'Inter', sans-serif" font-weight="900" font-size="10" fill="#94A3B8" text-anchor="middle" letter-spacing="4">GAME BOY ADVANCE</text>
    
    <!-- Cartridge Shiny Art Sticker -->
    <rect x="25" y="45" width="230" height="190" rx="10" fill="#BE123C" stroke="#FDA4AF" stroke-width="2" />
    
    <!-- RetroArch Alien Logo in Sticker -->
    <g transform="translate(140, 115) scale(1.4)">
      <!-- Alien Invader / RetroArch Logo -->
      <path d="M -30 -15 L -20 -35 L -10 -20 L 10 -20 L 20 -35 L 30 -15 L 35 10 L 20 25 L 15 20 L -15 20 L -20 25 L -35 10 Z" fill="#FFFFFF" opacity="0.95" />
      <circle cx="-12" cy="-2" r="4" fill="#BE123C" />
      <circle cx="12" cy="-2" r="4" fill="#BE123C" />
      <rect x="-16" y="8" width="32" height="4" rx="2" fill="#BE123C" />
    </g>
    
    <!-- Sticker Banner -->
    <rect x="35" y="180" width="210" height="42" rx="6" fill="#1E1B4B" />
    <text x="140" y="198" font-family="'Inter', sans-serif" font-weight="900" font-size="12" fill="#FBBF24" text-anchor="middle" letter-spacing="1">POKÉMON / RETRO GBA</text>
    <text x="140" y="213" font-family="'Inter', sans-serif" font-weight="700" font-size="9" fill="#E2E8F0" text-anchor="middle" letter-spacing="2">LIBRETRO WASM CORE</text>
  </g>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#F43F5E" />
  <rect x="392" y="360" width="8" height="40" fill="#F59E0B" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#FDA4AF" text-anchor="middle" letter-spacing="3">RANURA RETROARCH</text>
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
  
  <!-- Monolith Boss & Grid -->
  <g transform="translate(100, 70)">
    <!-- Monolith Boss Hexagon -->
    <polygon points="100,10 180,50 180,150 100,190 20,150 20,50" fill="#0E7490" stroke="#22D3EE" stroke-width="4" />
    <polygon points="100,30 160,65 160,135 100,170 40,135 40,65" fill="#155E75" stroke="#67E8F9" stroke-width="2" />
    
    <!-- Glowing Boss Core Eye -->
    <circle cx="100" cy="100" r="28" fill="#042F2E" stroke="#A5F3FC" stroke-width="3" />
    <circle cx="100" cy="100" r="12" fill="#22D3EE" />
    <circle cx="100" cy="100" r="4" fill="#FFFFFF" />
    
    <!-- Hero Swords / Particles -->
    <line x1="20" y1="210" x2="60" y2="160" stroke="#38BDF8" stroke-width="4" stroke-linecap="round" />
    <line x1="180" y1="210" x2="140" y2="160" stroke="#F43F5E" stroke-width="4" stroke-linecap="round" />
  </g>
  
  <!-- JRPG Title Banner -->
  <rect x="40" y="270" width="320" height="70" rx="14" fill="#082F49" stroke="#38BDF8" stroke-width="2" />
  <text x="200" y="298" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">CYBER-ENCOUNTER</text>
  <text x="200" y="322" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#38BDF8" text-anchor="middle" letter-spacing="3">TACTICAL J-RPG BOSS</text>
  
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
  
  <!-- 8-Bit Grid Lines -->
  <g stroke="#047857" stroke-width="1" opacity="0.4">
    <line x1="60" y1="60" x2="340" y2="60" />
    <line x1="60" y1="100" x2="340" y2="100" />
    <line x1="60" y1="140" x2="340" y2="140" />
    <line x1="60" y1="180" x2="340" y2="180" />
    <line x1="60" y1="220" x2="340" y2="220" />
    <line x1="60" y1="60" x2="60" y2="260" />
    <line x1="100" y1="60" x2="100" y2="260" />
    <line x1="140" y1="60" x2="140" y2="260" />
    <line x1="180" y1="60" x2="180" y2="260" />
    <line x1="220" y1="60" x2="220" y2="260" />
    <line x1="260" y1="60" x2="260" y2="260" />
    <line x1="300" y1="60" x2="300" y2="260" />
  </g>
  
  <!-- Pixel Snake Body (Glowing Neon Emerald) -->
  <g>
    <!-- Tail -->
    <rect x="100" y="220" width="36" height="36" rx="6" fill="#059669" />
    <rect x="140" y="220" width="36" height="36" rx="6" fill="#10B981" />
    <rect x="140" y="180" width="36" height="36" rx="6" fill="#10B981" />
    <rect x="140" y="140" width="36" height="36" rx="6" fill="#34D399" />
    <rect x="180" y="140" width="36" height="36" rx="6" fill="#34D399" />
    <rect x="220" y="140" width="36" height="36" rx="6" fill="#6EE7B7" />
    <rect x="220" y="100" width="36" height="36" rx="6" fill="#6EE7B7" />
    <rect x="260" y="100" width="36" height="36" rx="8" fill="#A7F3D0" stroke="#FFFFFF" stroke-width="2" />
    <!-- Snake Eyes -->
    <circle cx="282" cy="110" r="4" fill="#064E3B" />
    <circle cx="282" cy="126" r="4" fill="#064E3B" />
    <!-- Food Apple -->
    <circle cx="280" cy="200" r="14" fill="#EF4444" stroke="#FECACA" stroke-width="2" />
    <line x1="280" y1="186" x2="284" y2="180" stroke="#22C55E" stroke-width="3" stroke-linecap="round" />
  </g>
  
  <!-- Title Badge -->
  <rect x="40" y="275" width="320" height="65" rx="14" fill="#064E3B" stroke="#34D399" stroke-width="2" />
  <text x="200" y="302" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">RETRO SNAKE 8-BIT</text>
  <text x="200" y="324" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#6EE7B7" text-anchor="middle" letter-spacing="3">ARCADE DELUXE EDITION</text>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#10B981" />
  <rect x="392" y="360" width="8" height="40" fill="#34D399" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#A7F3D0" text-anchor="middle" letter-spacing="3">8-BIT MATRIX ENGINE</text>
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
    
    <!-- 4 Tiles Matrix -->
    <g transform="translate(15, 15)">
      <rect x="0" y="0" width="50" height="40" rx="8" fill="#78716C" />
      <text x="25" y="25" font-family="'Inter', sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle">2</text>
      
      <rect x="60" y="0" width="50" height="40" rx="8" fill="#F97316" />
      <text x="85" y="25" font-family="'Inter', sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle">8</text>
      
      <rect x="120" y="0" width="50" height="40" rx="8" fill="#EA580C" />
      <text x="145" y="25" font-family="'Inter', sans-serif" font-weight="800" font-size="14" fill="#FFFFFF" text-anchor="middle">64</text>
      
      <rect x="180" y="0" width="50" height="40" rx="8" fill="#CA8A04" />
      <text x="205" y="25" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#FFFFFF" text-anchor="middle">256</text>
      
      <!-- Big Center 2048 Glowing Tile -->
      <rect x="30" y="55" width="170" height="110" rx="14" fill="#F59E0B" stroke="#FEF3C7" stroke-width="4" />
      <text x="115" y="125" font-family="'Inter', sans-serif" font-weight="900" font-size="44" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">2048</text>
    </g>
  </g>
  
  <!-- Title Badge -->
  <rect x="40" y="275" width="320" height="65" rx="14" fill="#78350F" stroke="#F59E0B" stroke-width="2" />
  <text x="200" y="302" font-family="'Inter', sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">2048 LOGIC MATRIX</text>
  <text x="200" y="324" font-family="'Inter', sans-serif" font-weight="700" font-size="11" fill="#FDE68A" text-anchor="middle" letter-spacing="3">BINARY ARRAY PUZZLE</text>
  
  <rect x="0" y="360" width="400" height="40" fill="#0B0F19" />
  <rect x="0" y="360" width="8" height="40" fill="#F59E0B" />
  <rect x="392" y="360" width="8" height="40" fill="#EA580C" />
  <text x="200" y="385" font-family="'Inter', sans-serif" font-weight="800" font-size="12" fill="#FDE68A" text-anchor="middle" letter-spacing="3">PUZZLE LOGIC ENGINE</text>
</svg>`)}`,
};
