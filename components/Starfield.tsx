"use client";

import { useEffect, useMemo, useState } from "react";

type Star = {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    twinkleDuration: number;
    twinkleDelay: number;
    driftX: number;
    driftY: number;
};

type ShootingStar = {
    id: number;
    x: number;
    y: number;
    length: number;
    duration: number;
    delay: number;
    angle: number;
    opacity: number;
};

type StarfieldProps = {
    starCount?: number;
    shootingStarCount?: number;
    className?: string;
};

function random(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export default function StarfieldBackground({
    starCount = 250,
    shootingStarCount = 10,
    className = "",
}: StarfieldProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const stars = useMemo<Star[]>(() => {
        return Array.from({ length: starCount }, (_, i) => ({
            id: i,
            x: random(0, 100),
            y: random(0, 100),
            size: random(1, 3.2),
            opacity: random(0.2, 0.96),
            twinkleDuration: random(2.5, 7.5),
            twinkleDelay: random(0, 6),
            driftX: random(-8, 8),
            driftY: random(-8, 8),
        }));
    }, [starCount]);
    const shootingStars = useMemo<ShootingStar[]>(() => {
        return Array.from({ length: shootingStarCount }, (_, i) => ({
            id: i,
            x: random(-15, 95),
            y: random(-10, 65),
            length: random(120, 240),
            duration: random(1.2, 2.4),
            delay: random(0, 18),
            angle: random(-32, -18),
            opacity: random(0.45, 0.95),
        }));
    }, [shootingStarCount]);

    if (!mounted) return null;

    return (
        <>
            <div
                className={`pointer-events-none fixed inset-0 -z-10 overflow-hidden  ${className}`}
                aria-hidden="true"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(88,199,255,0.08),transparent_28%),radial-gradient(circle_at_20%_30%,rgba(122,108,255,0.08),transparent_22%),radial-gradient(circle_at_80%_20%,rgba(67,230,195,0.06),transparent_20%),linear-gradient(to_bottom,#081120,#060d1a_55%,#040914)]" />

                <div className="absolute left-[8%] top-[10%] h-64 w-64 rounded-full bg-cyan-400/5 blur-3xl" />
                <div className="absolute right-[12%] top-[18%] h-72 w-72 rounded-full bg-violet-500/5 blur-3xl" />
                <div className="absolute bottom-[12%] left-[25%] h-80 w-80 rounded-full bg-sky-400/5 blur-3xl" />

                {stars.map((star) => (
                    <span
                        key={star.id}
                        className="absolute rounded-full bg-white"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.size}px`,
                            height: `${star.size}px`,
                            opacity: star.opacity,
                            boxShadow:
                                star.size > 2
                                    ? "0 0 10px rgba(255,255,255,0.35), 0 0 18px rgba(93,235,208,0.15)"
                                    : "0 0 6px rgba(255,255,255,0.2)",
                            animation: `twinkle ${star.twinkleDuration}s ease-in-out ${star.twinkleDelay}s infinite, drift ${random(18, 40)}s ease-in-out ${star.twinkleDelay}s infinite`,
                            ["--drift-x" as string]: `${star.driftX}px`,
                            ["--drift-y" as string]: `${star.driftY}px`,
                        }}
                    />
                ))}

                {shootingStars.map((star) => (
                    <span
                        key={star.id}
                        className="absolute block"
                        style={{
                            left: `${star.x}%`,
                            top: `${star.y}%`,
                            width: `${star.length}px`,
                            height: "2px",
                            opacity: star.opacity,
                            background:
                                "linear-gradient(90deg, rgba(255,255,255,0), rgba(147,197,253,0.18), rgba(255,255,255,0.98))",
                            filter: "drop-shadow(0 0 10px rgba(255,255,255,0.45))",
                            transform: `rotate(${star.angle}deg)`,
                            transformOrigin: "left center",
                            animation: `shoot ${star.duration}s linear ${star.delay}s infinite`,
                            ["--shoot-angle" as string]: `${star.angle}deg`,
                        }}
                    />
                ))}

                <div
                    className="absolute inset-0 mix-blend-screen opacity-[0.035]"
                    style={{
                        backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='160' height='160' filter='url(%23n)' opacity='1'/></svg>")`,
                    }}
                />      </div>

            <style jsx>{`
        @keyframes twinkle {
          0%,
          100% {
            opacity: 0.25;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.25);
          }
        }

        @keyframes drift {
          0%,
          100% {
            transform: translate3d(0, 0, 0);
          }
          50% {
            transform: translate3d(var(--drift-x), var(--drift-y), 0);
          }
        }

       @keyframes shoot {
  0% {
    opacity: 0;
    transform: translate3d(-120px, -60px, 0) rotate(var(--shoot-angle));
  }
  8% {
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translate3d(520px, 260px, 0) rotate(var(--shoot-angle));
  }
}
      `}</style>
        </>
    );
}