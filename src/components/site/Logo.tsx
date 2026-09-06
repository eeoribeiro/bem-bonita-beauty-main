import { usePublicSiteData } from "@/lib/site-data";

export function Logo({ tone: _tone = "dark" }: { tone?: "dark" | "light" }) {
  const { data } = usePublicSiteData();
  const salonName = data?.settings?.salon_name ?? "Bem Bonita";

  return (
    <span className="inline-flex min-w-0 items-center text-foreground select-none">
      <svg
        viewBox="0 0 900 360"
        role="img"
        aria-label={salonName}
        className="h-10 w-auto max-w-[145px] sm:h-11 sm:max-w-[170px] lg:h-12 lg:max-w-[190px]"
      >
        <g
          transform="translate(40,40)"
          fill="none"
          stroke="#e0489a"
          strokeWidth="6"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          <path d="M40 210 C 20 190, 15 150, 30 120 C 45 90, 40 70, 55 55 C 70 40, 95 35, 115 45 C 135 55, 140 75, 135 95 C 165 100, 190 120, 195 150 C 200 175, 190 200, 170 215 C 150 228, 60 228, 40 210 Z" />
          <path d="M60 55 L45 15 L85 45 Z" />
          <path d="M110 45 L120 5 L150 40 Z" />
          <path d="M195 150 C 230 140, 250 110, 240 75 C 232 48, 205 35, 185 45" />
          <path d="M95 85 C 100 78, 112 78, 116 85" strokeWidth="5" />
          <path d="M100 100 C 103 97, 109 97, 112 100 C 109 105, 103 105, 100 100 Z" fill="#e0489a" stroke="none" />
          <path d="M70 100 L30 92" strokeWidth="3" />
          <path d="M70 108 L28 108" strokeWidth="3" />
          <path d="M70 116 L30 124" strokeWidth="3" />
          <path d="M140 100 L180 92" strokeWidth="3" />
          <path d="M140 108 L182 108" strokeWidth="3" />
          <path d="M140 116 L180 124" strokeWidth="3" />
          <path d="M60 215 L58 250" />
          <path d="M100 220 L100 255" />
          <path d="M150 218 L155 252" />
        </g>

        <g transform="translate(300,0)">
          <text x="0" y="120" fontFamily="Georgia, 'Times New Roman', serif" fontSize="96" fontWeight="700" fill="currentColor">
            Bem
          </text>
          <text x="0" y="215" fontFamily="Georgia, 'Times New Roman', serif" fontSize="96" fontWeight="700" fill="currentColor">
            Bonita
          </text>
          <text x="4" y="255" fontFamily="Arial, Helvetica, sans-serif" fontSize="26" fontWeight="600" letterSpacing="4" fill="#e0489a">
            BELEZA &amp; COSMÉTICOS
          </text>
        </g>
      </svg>
    </span>
  );
}
