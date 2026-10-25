import fs from 'fs';
import path from 'path';

const outDir = path.resolve('public/images');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

// 1. Solar Inverter (Hybrid / Pure Sine Wave)
const inverterSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="invBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#111827"/>
      <stop offset="50%" stop-color="#1F2937"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="caseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#F8FAFC"/>
      <stop offset="50%" stop-color="#E2E8F0"/>
      <stop offset="100%" stop-color="#CBD5E1"/>
    </linearGradient>
    <linearGradient id="lcdGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#invBg)"/>
  
  <!-- Heat Sink Fins on sides -->
  <g fill="#475569" opacity="0.6">
    <rect x="130" y="110" width="15" height="380" rx="2"/>
    <rect x="455" y="110" width="15" height="380" rx="2"/>
  </g>
  
  <!-- Main Inverter Chassis -->
  <rect x="145" y="90" width="310" height="420" rx="20" fill="url(#caseGrad)" stroke="#6D28D9" stroke-width="4" filter="drop-shadow(0 20px 25px rgba(0,0,0,0.5))"/>
  
  <!-- Purple Brand Trim -->
  <path d="M 145 130 Q 300 160 455 130 L 455 90 L 145 90 Z" fill="#6D28D9" rx="20"/>
  <text x="300" y="118" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle" letter-spacing="2">GROWATT / DEYE HYBRID</text>

  <!-- Interactive LCD Color Display -->
  <rect x="190" y="180" width="220" height="150" rx="12" fill="url(#lcdGrad)" stroke="#38BDF8" stroke-width="2"/>
  
  <!-- LCD Display Graphics -->
  <text x="300" y="210" fill="#38BDF8" font-family="monospace" font-size="12" text-anchor="middle" font-weight="bold">SYSTEM STATUS: NORMAL</text>
  <text x="300" y="240" fill="#FACC15" font-family="system-ui, sans-serif" font-size="28" text-anchor="middle" font-weight="900">6.00 kW</text>
  <text x="300" y="260" fill="#94A3B8" font-family="monospace" font-size="11" text-anchor="middle">PV: 380V | BATT: 51.2V (98%)</text>
  
  <!-- Sine Wave Graphic on LCD -->
  <path d="M 210 295 Q 235 275 260 295 T 310 295 T 360 295 T 390 295" fill="none" stroke="#4ADE80" stroke-width="3"/>
  
  <!-- Navigation Buttons below LCD -->
  <circle cx="240" cy="360" r="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="280" cy="360" r="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="320" cy="360" r="12" fill="#E2E8F0" stroke="#94A3B8" stroke-width="2"/>
  <circle cx="360" cy="360" r="12" fill="#6D28D9" stroke="#5B21B6" stroke-width="2"/>
  <text x="360" y="364" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">ENT</text>

  <!-- Status LEDs -->
  <g transform="translate(200, 400)">
    <circle cx="20" cy="0" r="5" fill="#22C55E"/>
    <text x="20" y="16" fill="#475569" font-family="system-ui, sans-serif" font-size="9" text-anchor="middle">NORMAL</text>
    
    <circle cx="100" cy="0" r="5" fill="#EAB308"/>
    <text x="100" y="16" fill="#475569" font-family="system-ui, sans-serif" font-size="9" text-anchor="middle">WARNING</text>
    
    <circle cx="180" cy="0" r="5" fill="#EF4444"/>
    <text x="180" y="16" fill="#475569" font-family="system-ui, sans-serif" font-size="9" text-anchor="middle">FAULT</text>
  </g>

  <!-- Bottom Terminal Cover & Wi-Fi Module -->
  <rect x="170" y="440" width="260" height="50" rx="8" fill="#334155"/>
  <rect x="380" y="450" width="30" height="30" rx="4" fill="#6D28D9"/>
  <path d="M 390 465 A 6 6 0 0 1 400 465 M 387 462 A 10 10 0 0 1 403 462" fill="none" stroke="#FDE047" stroke-width="2"/>
  <text x="300" y="470" fill="#94A3B8" font-family="monospace" font-size="10" text-anchor="middle">DUAL MPPT 150-500VDC</text>
</svg>`;

// 2. Solar Lithium Battery (LiFePO4 Rack Module / Wall-mount)
const batterySvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="batBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#1E1B4B"/>
      <stop offset="100%" stop-color="#090514"/>
    </linearGradient>
    <linearGradient id="chassis" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
    <linearGradient id="ledGreen" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#4ADE80"/>
      <stop offset="100%" stop-color="#22C55E"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#batBg)"/>

  <!-- Battery Unit 1 (Rack Mount) -->
  <g transform="translate(100, 100)">
    <!-- Main Shell -->
    <rect width="400" height="170" rx="12" fill="url(#chassis)" stroke="#475569" stroke-width="2" filter="drop-shadow(0 15px 20px rgba(0,0,0,0.6))"/>
    <!-- Rack Ears -->
    <rect x="-15" y="30" width="15" height="110" rx="3" fill="#64748B"/>
    <circle cx="-7" cy="50" r="4" fill="#0F172A"/>
    <circle cx="-7" cy="120" r="4" fill="#0F172A"/>
    <rect x="400" y="30" width="15" height="110" rx="3" fill="#64748B"/>
    <circle cx="407" cy="50" r="4" fill="#0F172A"/>
    <circle cx="407" cy="120" r="4" fill="#0F172A"/>

    <!-- Handles -->
    <rect x="15" y="45" width="12" height="80" rx="4" fill="#94A3B8"/>
    <rect x="373" y="45" width="12" height="80" rx="4" fill="#94A3B8"/>

    <!-- Brand & Specs -->
    <text x="50" y="45" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16" font-weight="900" letter-spacing="1">PYLONTECH US5000</text>
    <text x="50" y="65" fill="#A78BFA" font-family="monospace" font-size="11">LiFePO4 48V 100Ah (4.8kWh)</text>

    <!-- State of Charge (SoC) LED Bar -->
    <text x="50" y="105" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="10">STATE OF CHARGE</text>
    <g transform="translate(50, 115)">
      <rect x="0" y="0" width="22" height="10" rx="2" fill="url(#ledGreen)"/>
      <rect x="28" y="0" width="22" height="10" rx="2" fill="url(#ledGreen)"/>
      <rect x="56" y="0" width="22" height="10" rx="2" fill="url(#ledGreen)"/>
      <rect x="84" y="0" width="22" height="10" rx="2" fill="url(#ledGreen)"/>
      <rect x="112" y="0" width="22" height="10" rx="2" fill="url(#ledGreen)"/>
      <rect x="140" y="0" width="22" height="10" rx="2" fill="url(#ledGreen)"/>
    </g>

    <!-- Terminals (+ and -) -->
    <circle cx="280" cy="100" r="18" fill="#DC2626" stroke="#991B1B" stroke-width="2"/>
    <text x="280" y="106" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">+</text>
    <circle cx="330" cy="100" r="18" fill="#1E293B" stroke="#000000" stroke-width="2"/>
    <text x="330" y="106" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">-</text>

    <!-- CAN/RS485 Communication Ports -->
    <rect x="230" y="45" width="30" height="20" rx="3" fill="#020617" stroke="#64748B"/>
    <rect x="270" y="45" width="30" height="20" rx="3" fill="#020617" stroke="#64748B"/>
    <text x="265" y="78" fill="#64748B" font-family="monospace" font-size="8" text-anchor="middle">CAN / RS485</text>
  </g>

  <!-- Battery Unit 2 (Parallel Stack) -->
  <g transform="translate(100, 310)">
    <rect width="400" height="170" rx="12" fill="url(#chassis)" stroke="#475569" stroke-width="2" filter="drop-shadow(0 15px 20px rgba(0,0,0,0.6))"/>
    <rect x="-15" y="30" width="15" height="110" rx="3" fill="#64748B"/>
    <circle cx="-7" cy="50" r="4" fill="#0F172A"/><circle cx="-7" cy="120" r="4" fill="#0F172A"/>
    <rect x="400" y="30" width="15" height="110" rx="3" fill="#64748B"/>
    <circle cx="407" cy="50" r="4" fill="#0F172A"/><circle cx="407" cy="120" r="4" fill="#0F172A"/>

    <rect x="15" y="45" width="12" height="80" rx="4" fill="#94A3B8"/>
    <rect x="373" y="45" width="12" height="80" rx="4" fill="#94A3B8"/>

    <text x="50" y="45" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="16" font-weight="900" letter-spacing="1">FELICITY 10kWh BANK</text>
    <text x="50" y="65" fill="#4ADE80" font-family="monospace" font-size="11">6000 CYCLES @ 90% DoD</text>

    <text x="50" y="105" fill="#94A3B8" font-family="system-ui, sans-serif" font-size="10">STATE OF CHARGE</text>
    <g transform="translate(50, 115)">
      <rect x="0" y="0" width="22" height="10" rx="2" fill="url(#ledGreen)"/>
      <rect x="28" y="0" width="22" height="10" rx="2" fill="url(#ledGreen)"/>
      <rect x="56" y="0" width="22" height="10" rx="2" fill="url(#ledGreen)"/>
      <rect x="84" y="0" width="22" height="10" rx="2" fill="url(#ledGreen)"/>
      <rect x="112" y="0" width="22" height="10" rx="2" fill="url(#ledGreen)"/>
      <rect x="140" y="0" width="22" height="10" rx="2" fill="#334155"/>
    </g>

    <circle cx="280" cy="100" r="18" fill="#DC2626" stroke="#991B1B" stroke-width="2"/>
    <text x="280" y="106" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">+</text>
    <circle cx="330" cy="100" r="18" fill="#1E293B" stroke="#000000" stroke-width="2"/>
    <text x="330" y="106" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="18" font-weight="bold" text-anchor="middle">-</text>

    <rect x="230" y="45" width="30" height="20" rx="3" fill="#020617" stroke="#64748B"/>
    <rect x="270" y="45" width="30" height="20" rx="3" fill="#020617" stroke="#64748B"/>
  </g>
</svg>`;

// 3. Wires & Cables (BRB Solar DC 6mm² / Drum Coil)
const cableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="cableBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181B"/>
      <stop offset="100%" stop-color="#09090B"/>
    </linearGradient>
    <radialGradient id="coilRed" cx="50%" cy="50%" r="50%">
      <stop offset="40%" stop-color="#DC2626"/>
      <stop offset="90%" stop-color="#991B1B"/>
      <stop offset="100%" stop-color="#450A0A"/>
    </radialGradient>
    <radialGradient id="coilBlack" cx="50%" cy="50%" r="50%">
      <stop offset="40%" stop-color="#3F3F46"/>
      <stop offset="90%" stop-color="#18181B"/>
      <stop offset="100%" stop-color="#09090B"/>
    </radialGradient>
    <linearGradient id="copperGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F59E0B"/>
      <stop offset="50%" stop-color="#D97706"/>
      <stop offset="100%" stop-color="#B45309"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#cableBg)"/>

  <!-- Left Cable Coil (Red Solar DC Cable) -->
  <g transform="translate(160, 260)">
    <ellipse cx="0" cy="0" rx="120" ry="80" fill="url(#coilRed)" filter="drop-shadow(0 20px 20px rgba(0,0,0,0.7))"/>
    <ellipse cx="0" cy="0" rx="60" ry="40" fill="#18181B"/>
    <ellipse cx="0" cy="-10" rx="110" ry="70" fill="none" stroke="#EF4444" stroke-width="5" opacity="0.7"/>
    <ellipse cx="0" cy="-20" rx="100" ry="60" fill="none" stroke="#F87171" stroke-width="4" opacity="0.6"/>
  </g>

  <!-- Right Cable Coil (Black Solar DC Cable) -->
  <g transform="translate(360, 310)">
    <ellipse cx="0" cy="0" rx="130" ry="90" fill="url(#coilBlack)" stroke="#52525B" stroke-width="2" filter="drop-shadow(0 20px 20px rgba(0,0,0,0.7))"/>
    <ellipse cx="0" cy="0" rx="65" ry="45" fill="#09090B"/>
    <ellipse cx="0" cy="-10" rx="120" ry="80" fill="none" stroke="#71717A" stroke-width="5" opacity="0.6"/>
    <ellipse cx="0" cy="-20" rx="110" ry="70" fill="none" stroke="#A1A1AA" stroke-width="4" opacity="0.5"/>
  </g>

  <!-- Stripped Cable End showing Pure Tinned Copper Strands -->
  <g transform="translate(260, 100)">
    <!-- Red Outer Jacket -->
    <path d="M 0 100 L 80 40 L 110 55 L 30 115 Z" fill="#DC2626"/>
    <!-- White Inner XLPO Insulation -->
    <path d="M 80 40 L 110 18 L 125 26 L 95 48 Z" fill="#F8FAFC"/>
    <!-- Exposed Pure Electrolytic Copper Strands -->
    <path d="M 110 18 L 140 -5 L 152 4 L 122 27 Z" fill="url(#copperGrad)"/>
    <line x1="113" y1="16" x2="143" y2="-7" stroke="#FEF08A" stroke-width="1.5"/>
    <line x1="117" y1="20" x2="147" y2="-3" stroke="#FEF08A" stroke-width="1.5"/>
  </g>

  <!-- Brand Label Ribbon -->
  <g transform="translate(150, 470)">
    <rect width="300" height="50" rx="12" fill="#6D28D9" stroke="#A78BFA" stroke-width="2"/>
    <text x="150" y="24" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="13" font-weight="900" text-anchor="middle">BRB SOLAR DC PV CABLE</text>
    <text x="150" y="40" fill="#FDE047" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">6.0mm² 1500V DC | 100% PURE COPPER</text>
  </g>
</svg>`;

// 4. Circuit Breaker (Schneider Acti9 MCB / MCCB / SPD)
const breakerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="brkBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0F172A"/>
      <stop offset="50%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#020617"/>
    </linearGradient>
    <linearGradient id="dinCase" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FFFFFF"/>
      <stop offset="50%" stop-color="#F1F5F9"/>
      <stop offset="100%" stop-color="#E2E8F0"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#brkBg)"/>

  <!-- DIN Rail in Background -->
  <rect x="80" y="270" width="440" height="60" fill="#94A3B8" stroke="#64748B" stroke-width="2"/>
  <rect x="80" y="285" width="440" height="30" fill="#CBD5E1"/>

  <!-- MCB Module 1 (Left Pole) -->
  <g transform="translate(190, 110)">
    <rect width="110" height="380" rx="8" fill="url(#dinCase)" stroke="#CBD5E1" stroke-width="2" filter="drop-shadow(0 20px 25px rgba(0,0,0,0.5))"/>
    <!-- Terminal Screws -->
    <circle cx="55" cy="35" r="14" fill="#64748B"/><line x1="45" y1="35" x2="65" y2="35" stroke="#E2E8F0" stroke-width="3"/>
    <circle cx="55" cy="345" r="14" fill="#64748B"/><line x1="45" y1="345" x2="65" y2="345" stroke="#E2E8F0" stroke-width="3"/>
    
    <!-- VisiTrip Window -->
    <rect x="40" y="90" width="30" height="16" rx="3" fill="#22C55E"/>
    
    <!-- Brand & Specs -->
    <text x="55" y="135" fill="#0F172A" font-family="system-ui, sans-serif" font-size="11" font-weight="900" text-anchor="middle">SCHNEIDER</text>
    <text x="55" y="150" fill="#6D28D9" font-family="system-ui, sans-serif" font-size="13" font-weight="900" text-anchor="middle">C32</text>
    <text x="55" y="165" fill="#64748B" font-family="monospace" font-size="9" text-anchor="middle">6000A 415V</text>

    <!-- Toggle Lever -->
    <rect x="35" y="190" width="40" height="60" rx="6" fill="#DC2626" stroke="#991B1B" stroke-width="2"/>
    <rect x="42" y="200" width="26" height="20" rx="3" fill="#EF4444"/>
    <text x="55" y="240" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">ON</text>
  </g>

  <!-- MCB Module 2 (Right Pole) -->
  <g transform="translate(300, 110)">
    <rect width="110" height="380" rx="8" fill="url(#dinCase)" stroke="#CBD5E1" stroke-width="2" filter="drop-shadow(0 20px 25px rgba(0,0,0,0.5))"/>
    <circle cx="55" cy="35" r="14" fill="#64748B"/><line x1="45" y1="35" x2="65" y2="35" stroke="#E2E8F0" stroke-width="3"/>
    <circle cx="55" cy="345" r="14" fill="#64748B"/><line x1="45" y1="345" x2="65" y2="345" stroke="#E2E8F0" stroke-width="3"/>

    <rect x="40" y="90" width="30" height="16" rx="3" fill="#22C55E"/>
    <text x="55" y="135" fill="#0F172A" font-family="system-ui, sans-serif" font-size="11" font-weight="900" text-anchor="middle">Acti9 iC60N</text>
    <text x="55" y="150" fill="#6D28D9" font-family="system-ui, sans-serif" font-size="13" font-weight="900" text-anchor="middle">2-POLE</text>
    <text x="55" y="165" fill="#64748B" font-family="monospace" font-size="9" text-anchor="middle">IEC 60898-1</text>

    <rect x="35" y="190" width="40" height="60" rx="6" fill="#DC2626" stroke="#991B1B" stroke-width="2"/>
    <rect x="42" y="200" width="26" height="20" rx="3" fill="#EF4444"/>
    <text x="55" y="240" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">ON</text>
  </g>

  <!-- Mechanical Bridge connecting both levers -->
  <rect x="245" y="210" width="110" height="16" rx="4" fill="#B91C1C"/>
</svg>`;

// 5. Turnkey Solar Package Hero / System Package
const packageSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="pkgBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2E1065"/>
      <stop offset="50%" stop-color="#4C1D95"/>
      <stop offset="100%" stop-color="#1E1B4B"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#pkgBg)"/>

  <!-- Glowing Aura -->
  <circle cx="300" cy="280" r="180" fill="#A855F7" opacity="0.15" filter="blur(40px)"/>

  <!-- Left: Solar Panel array (tilted) -->
  <g transform="translate(80, 160) skewY(-8)">
    <rect width="180" height="260" rx="6" fill="#1E3A8A" stroke="#E2E8F0" stroke-width="3"/>
    <line x1="0" y1="65" x2="180" y2="65" stroke="#93C5FD" stroke-width="1.5"/>
    <line x1="0" y1="130" x2="180" y2="130" stroke="#FFFFFF" stroke-width="2"/>
    <line x1="0" y1="195" x2="180" y2="195" stroke="#93C5FD" stroke-width="1.5"/>
    <line x1="60" y1="0" x2="60" y2="260" stroke="#93C5FD" stroke-width="1.5"/>
    <line x1="120" y1="0" x2="120" y2="260" stroke="#93C5FD" stroke-width="1.5"/>
  </g>

  <!-- Center: Hybrid Inverter -->
  <g transform="translate(240, 180)">
    <rect width="140" height="200" rx="12" fill="#F8FAFC" stroke="#6D28D9" stroke-width="3" filter="drop-shadow(0 15px 20px rgba(0,0,0,0.5))"/>
    <rect x="0" y="0" width="140" height="35" rx="12" fill="#6D28D9"/>
    <rect x="20" y="55" width="100" height="60" rx="6" fill="#0F172A"/>
    <text x="70" y="88" fill="#FACC15" font-family="system-ui, sans-serif" font-size="14" font-weight="900" text-anchor="middle">5.0 kW</text>
    <text x="70" y="102" fill="#38BDF8" font-family="monospace" font-size="8" text-anchor="middle">HYBRID ON/OFF</text>
  </g>

  <!-- Right: Lithium Battery Storage Unit -->
  <g transform="translate(370, 240)">
    <rect width="150" height="150" rx="10" fill="#0F172A" stroke="#475569" stroke-width="2" filter="drop-shadow(0 15px 20px rgba(0,0,0,0.6))"/>
    <text x="75" y="40" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="11" font-weight="bold" text-anchor="middle">4.8kWh LiFePO4</text>
    <g transform="translate(25, 60)">
      <rect x="0" y="0" width="18" height="8" rx="2" fill="#22C55E"/>
      <rect x="22" y="0" width="18" height="8" rx="2" fill="#22C55E"/>
      <rect x="44" y="0" width="18" height="8" rx="2" fill="#22C55E"/>
      <rect x="66" y="0" width="18" height="8" rx="2" fill="#22C55E"/>
      <rect x="88" y="0" width="18" height="8" rx="2" fill="#22C55E"/>
    </g>
    <circle cx="50" cy="110" r="12" fill="#DC2626"/><text x="50" y="115" fill="#FFFFFF" font-size="14" font-weight="bold" text-anchor="middle">+</text>
    <circle cx="95" cy="110" r="12" fill="#334155"/><text x="95" y="115" fill="#FFFFFF" font-size="14" font-weight="bold" text-anchor="middle">-</text>
  </g>

  <!-- Bottom Banner Badge -->
  <g transform="translate(140, 480)">
    <rect width="320" height="50" rx="12" fill="#FACC15" stroke="#EAB308" stroke-width="2"/>
    <text x="160" y="24" fill="#0F172A" font-family="system-ui, sans-serif" font-size="13" font-weight="900" text-anchor="middle">COMPLETE RESIDENTIAL PACKAGE</text>
    <text x="160" y="40" fill="#581C87" font-family="monospace" font-size="11" font-weight="bold" text-anchor="middle">3.5kWp Array + 5kW Inverter + 4.8kWh LiFePO4</text>
  </g>
</svg>`;

// 6. Tools (Fluke True-RMS Clamp Meter)
const toolsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="toolBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#18181B"/>
      <stop offset="100%" stop-color="#09090B"/>
    </linearGradient>
    <linearGradient id="flukeYellow" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#FACC15"/>
      <stop offset="100%" stop-color="#EAB308"/>
    </linearGradient>
  </defs>
  <rect width="600" height="600" fill="url(#toolBg)"/>

  <!-- Fluke Clamp Meter Body -->
  <g transform="translate(210, 80)">
    <!-- Clamp Jaw at Top -->
    <path d="M 50 120 C 20 40, 160 40, 130 120 Z" fill="none" stroke="#DC2626" stroke-width="22" stroke-linecap="round"/>
    
    <!-- Main Yellow Meter Body -->
    <rect x="25" y="110" width="130" height="360" rx="24" fill="url(#flukeYellow)" stroke="#CA8A04" stroke-width="2" filter="drop-shadow(0 20px 25px rgba(0,0,0,0.6))"/>
    
    <!-- Grip Rubber Sides -->
    <rect x="20" y="200" width="10" height="150" rx="4" fill="#27272A"/>
    <rect x="150" y="200" width="10" height="150" rx="4" fill="#27272A"/>

    <!-- Brand -->
    <text x="90" y="150" fill="#000000" font-family="system-ui, sans-serif" font-size="18" font-weight="900" text-anchor="middle">FLUKE 376 FC</text>
    <text x="90" y="165" fill="#451A03" font-family="system-ui, sans-serif" font-size="10" font-weight="bold" text-anchor="middle">TRUE RMS CLAMP METER</text>

    <!-- Digital Backlit LCD Display -->
    <rect x="45" y="180" width="90" height="65" rx="6" fill="#020617" stroke="#3F3F46" stroke-width="2"/>
    <text x="90" y="222" fill="#38BDF8" font-family="monospace" font-size="24" font-weight="bold" text-anchor="middle">415.6</text>
    <text x="125" y="200" fill="#FACC15" font-family="monospace" font-size="10" font-weight="bold">V AC</text>

    <!-- Rotary Switch Knob -->
    <circle cx="90" cy="300" r="34" fill="#27272A" stroke="#52525B" stroke-width="3"/>
    <rect x="86" y="270" width="8" height="25" rx="2" fill="#DC2626"/>

    <!-- Test Probe Jack Terminals at Bottom -->
    <circle cx="65" cy="420" r="10" fill="#000000" stroke="#DC2626" stroke-width="3"/>
    <circle cx="115" cy="420" r="10" fill="#000000" stroke="#3F3F46" stroke-width="3"/>
  </g>
</svg>`;

// 7. Switches & LED Lighting (Philips Outdoor Floodlight / Modular Switch)
const lightSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 600" width="100%" height="100%">
  <defs>
    <linearGradient id="lightBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#090514"/>
      <stop offset="100%" stop-color="#1E1035"/>
    </linearGradient>
    <radialGradient id="lightBeam" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.8"/>
      <stop offset="40%" stop-color="#FACC15" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#EAB308" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="600" height="600" fill="url(#lightBg)"/>

  <!-- Radiant Light Beam Glow -->
  <circle cx="300" cy="270" r="230" fill="url(#lightBeam)"/>

  <!-- LED Floodlight Housing -->
  <g transform="translate(150, 130)">
    <!-- Mounting Bracket -->
    <path d="M 30 180 L -10 180 L -10 70 L 30 70" fill="none" stroke="#64748B" stroke-width="12" stroke-linecap="round"/>
    <path d="M 270 180 L 310 180 L 310 70 L 270 70" fill="none" stroke="#64748B" stroke-width="12" stroke-linecap="round"/>

    <!-- Die-cast Aluminium Casing -->
    <rect width="300" height="240" rx="16" fill="#1E293B" stroke="#475569" stroke-width="4" filter="drop-shadow(0 20px 25px rgba(0,0,0,0.6))"/>
    
    <!-- Reflector & Tempered Glass -->
    <rect x="25" y="25" width="250" height="190" rx="10" fill="#0F172A" stroke="#94A3B8" stroke-width="2"/>
    
    <!-- High-Lumen SMD LED Array Grid (6 x 4) -->
    <g fill="#FEF08A" stroke="#EAB308" stroke-width="1">
      <rect x="45" y="45" width="22" height="22" rx="3"/><rect x="85" y="45" width="22" height="22" rx="3"/><rect x="125" y="45" width="22" height="22" rx="3"/><rect x="165" y="45" width="22" height="22" rx="3"/><rect x="205" y="45" width="22" height="22" rx="3"/><rect x="235" y="45" width="22" height="22" rx="3"/>
      <rect x="45" y="85" width="22" height="22" rx="3"/><rect x="85" y="85" width="22" height="22" rx="3"/><rect x="125" y="85" width="22" height="22" rx="3"/><rect x="165" y="85" width="22" height="22" rx="3"/><rect x="205" y="85" width="22" height="22" rx="3"/><rect x="235" y="85" width="22" height="22" rx="3"/>
      <rect x="45" y="125" width="22" height="22" rx="3"/><rect x="85" y="125" width="22" height="22" rx="3"/><rect x="125" y="125" width="22" height="22" rx="3"/><rect x="165" y="125" width="22" height="22" rx="3"/><rect x="205" y="125" width="22" height="22" rx="3"/><rect x="235" y="125" width="22" height="22" rx="3"/>
      <rect x="45" y="165" width="22" height="22" rx="3"/><rect x="85" y="165" width="22" height="22" rx="3"/><rect x="125" y="165" width="22" height="22" rx="3"/><rect x="165" y="165" width="22" height="22" rx="3"/><rect x="205" y="165" width="22" height="22" rx="3"/><rect x="235" y="165" width="22" height="22" rx="3"/>
    </g>
  </g>

  <!-- Spec Label -->
  <g transform="translate(180, 440)">
    <rect width="240" height="45" rx="10" fill="#6D28D9" stroke="#A78BFA" stroke-width="2"/>
    <text x="120" y="22" fill="#FFFFFF" font-family="system-ui, sans-serif" font-size="12" font-weight="900" text-anchor="middle">PHILIPS LED 100W FLOODLIGHT</text>
    <text x="120" y="36" fill="#FDE047" font-family="monospace" font-size="10" font-weight="bold" text-anchor="middle">10,000 LM | IP66 WATERPROOF</text>
  </g>
</svg>`;

// Write all SVGs
fs.writeFileSync(path.join(outDir, 'solar-inverter.svg'), inverterSvg);
fs.writeFileSync(path.join(outDir, 'solar-battery.svg'), batterySvg);
fs.writeFileSync(path.join(outDir, 'solar-cable.svg'), cableSvg);
fs.writeFileSync(path.join(outDir, 'circuit-breaker.svg'), breakerSvg);
fs.writeFileSync(path.join(outDir, 'solar-package.svg'), packageSvg);
fs.writeFileSync(path.join(outDir, 'electrical-tools.svg'), toolsSvg);
fs.writeFileSync(path.join(outDir, 'led-lighting.svg'), lightSvg);

console.log('Successfully generated all high-resolution local product SVGs in public/images/');
