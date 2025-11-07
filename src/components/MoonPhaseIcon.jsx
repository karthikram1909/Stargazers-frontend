import React from "react";

export default function MoonPhaseIcon({ phase }) {
  const getMoonSVG = () => {
    switch(phase) {
      case "new":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="newMoonGrad" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#newMoonGrad)" stroke="#3a3a4e" strokeWidth="1"/>
          </svg>
        );
      case "waxing-crescent":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="moonLight1" cx="70%" cy="30%">
                <stop offset="0%" stopColor="#FFF8DC" />
                <stop offset="50%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <radialGradient id="moonDark1" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#moonDark1)" />
            <path d="M 50 10 A 40 40 0 0 1 50 90 A 25 40 0 0 0 50 10" fill="url(#moonLight1)"/>
            <ellipse cx="60" cy="35" rx="3" ry="2" fill="#C0C0C0" opacity="0.3"/>
            <ellipse cx="58" cy="55" rx="4" ry="3" fill="#B0B0B0" opacity="0.25"/>
          </svg>
        );
      case "first-quarter":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="moonLight2" cx="70%" cy="30%">
                <stop offset="0%" stopColor="#FFFACD" />
                <stop offset="40%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <radialGradient id="moonDark2" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#moonLight2)"/>
            <ellipse cx="55" cy="30" rx="5" ry="4" fill="#C0C0C0" opacity="0.4"/>
            <ellipse cx="60" cy="48" rx="6" ry="5" fill="#B0B0B0" opacity="0.35"/>
            <ellipse cx="58" cy="65" rx="4" ry="3" fill="#B8B8B8" opacity="0.33"/>
            <path d="M 50 10 A 40 40 0 0 0 50 90 A 15 40 0 0 1 50 10" fill="url(#moonDark2)"/>
          </svg>
        );
      case "waxing-gibbous":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="waxingGibbousLight" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#FFFAF0" />
                <stop offset="30%" stopColor="#FFF8DC" />
                <stop offset="70%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <radialGradient id="waxingGibbousDark" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#waxingGibbousLight)"/>
            <ellipse cx="45" cy="30" rx="6" ry="5" fill="#D3D3D3" opacity="0.4"/>
            <ellipse cx="55" cy="35" rx="4" ry="3" fill="#C0C0C0" opacity="0.35"/>
            <ellipse cx="38" cy="48" rx="7" ry="6" fill="#DCDCDC" opacity="0.45"/>
            <ellipse cx="60" cy="52" rx="5" ry="4" fill="#D0D0D0" opacity="0.4"/>
            <path d="M 50 10 A 40 40 0 0 0 50 90 A 30 40 0 0 1 50 10" fill="url(#waxingGibbousDark)"/>
          </svg>
        );
      case "full":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="fullMoonGrad" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#FFFAF0" />
                <stop offset="30%" stopColor="#FFF8DC" />
                <stop offset="70%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <filter id="moonGlow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle cx="50" cy="50" r="42" fill="#F5DEB3" opacity="0.3" filter="url(#moonGlow)"/>
            <circle cx="50" cy="50" r="40" fill="url(#fullMoonGrad)"/>
            <ellipse cx="45" cy="30" rx="6" ry="5" fill="#D3D3D3" opacity="0.4"/>
            <ellipse cx="55" cy="35" rx="4" ry="3" fill="#C0C0C0" opacity="0.35"/>
            <ellipse cx="38" cy="48" rx="7" ry="6" fill="#DCDCDC" opacity="0.45"/>
            <ellipse cx="60" cy="52" rx="5" ry="4" fill="#D0D0D0" opacity="0.4"/>
            <ellipse cx="48" cy="65" rx="6" ry="5" fill="#C8C8C8" opacity="0.38"/>
            <ellipse cx="35" cy="62" rx="3" ry="2" fill="#BEBEBE" opacity="0.3"/>
          </svg>
        );
      case "waning-gibbous":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="moonLight3" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#FFFACD" />
                <stop offset="40%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <radialGradient id="moonDark3" cx="70%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#moonLight3)"/>
            <ellipse cx="62" cy="35" rx="4" ry="3" fill="#C0C0C0" opacity="0.4"/>
            <ellipse cx="70" cy="48" rx="5" ry="4" fill="#B0B0B0" opacity="0.35"/>
            <ellipse cx="58" cy="60" rx="4" ry="3" fill="#B8B8B8" opacity="0.33"/>
            <path d="M 50 10 A 40 40 0 0 1 50 90 A 30 40 0 0 0 50 10" fill="url(#moonDark3)"/>
          </svg>
        );
      case "last-quarter":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="moonLight4" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#FFFACD" />
                <stop offset="40%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <radialGradient id="moonDark4" cx="70%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#moonDark4)" />
            <path d="M 50 10 A 40 40 0 0 0 50 90 Q 45 50 50 10" fill="url(#moonLight4)"/>
            <ellipse cx="35" cy="30" rx="4" ry="3" fill="#A9A9A9" opacity="0.4"/>
            <ellipse cx="38" cy="50" rx="5" ry="4" fill="#999999" opacity="0.35"/>
            <ellipse cx="32" cy="65" rx="3" ry="2" fill="#B0B0B0" opacity="0.3"/>
          </svg>
        );
      case "waning-crescent":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="moonLight5" cx="30%" cy="30%">
                <stop offset="0%" stopColor="#FFF8DC" />
                <stop offset="50%" stopColor="#F5DEB3" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
              <radialGradient id="moonDark5" cx="70%" cy="30%">
                <stop offset="0%" stopColor="#2a2a3e" />
                <stop offset="100%" stopColor="#1a1a2e" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#moonDark5)" />
            <path d="M 50 10 A 40 40 0 0 0 50 90 A 25 40 0 0 1 50 10" fill="url(#moonLight5)"/>
            <ellipse cx="40" cy="35" rx="3" ry="2" fill="#C0C0C0" opacity="0.3"/>
            <ellipse cx="42" cy="55" rx="4" ry="3" fill="#B0B0B0" opacity="0.25"/>
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <radialGradient id="defaultMoon" cx="40%" cy="35%">
                <stop offset="0%" stopColor="#FFFAF0" />
                <stop offset="100%" stopColor="#D2B48C" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="40" fill="url(#defaultMoon)"/>
          </svg>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {getMoonSVG()}
    </div>
  );
}