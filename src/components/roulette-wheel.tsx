"use client";

import { useEffect, useMemo, useState } from "react";
import confetti from "canvas-confetti";
import { Wheel } from "react-custom-roulette";

import { Button } from "@/components/ui/button";

type WheelOption = {
  id: string;
  label: string;
  weight?: number | null;
};

type RouletteWheelProps = {
  options: WheelOption[];
  onResult?: (option: WheelOption) => void;
  canSpin?: boolean;
};

export function RouletteWheel({ options, onResult, canSpin = true }: RouletteWheelProps) {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeIndex, setPrizeIndex] = useState(0);

  const data = useMemo(
    () =>
      options.map((option) => ({
        option: option.label,
        style: {
          backgroundColor: "transparent",
        },
      })),
    [options]
  );

  const segmentColors = [
    "#FFD6A5",
    "#FDFFB6",
    "#CAFFBF",
    "#9BF6FF",
    "#A0C4FF",
    "#BDB2FF",
    "#FFC6FF",
    "#FFADAD",
  ];

  const spin = () => {
    if (!options.length || !canSpin) return;
    const weighted: number[] = [];
    options.forEach((option, index) => {
      const count = option.weight ?? 1;
      for (let i = 0; i < count; i += 1) {
        weighted.push(index);
      }
    });
    const nextIndex = weighted[Math.floor(Math.random() * weighted.length)] ?? 0;
    setPrizeIndex(nextIndex);
    setMustSpin(true);
  };

  useEffect(() => {
    if (!mustSpin) return;
    const handler = window.setTimeout(() => {
      confetti({
        particleCount: 160,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 900);

    return () => window.clearTimeout(handler);
  }, [mustSpin]);

  const current = options[prizeIndex];

  return (
    <div className="grid gap-6 place-items-center">
      <div className="relative grid gap-3 place-items-center">
        <div className="rounded-[40px] bg-white/70 p-4 shadow-soft dark:bg-white/5">
          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeIndex}
            data={data}
            backgroundColors={segmentColors}
            textColors={["#1f2937"]}
            outerBorderColor="#ffffff"
            innerBorderColor="#ffffff"
            innerBorderWidth={12}
            radiusLineColor="rgba(0,0,0,0.05)"
            radiusLineWidth={2}
            fontSize={15}
            onStopSpinning={() => {
              setMustSpin(false);
              if (current && onResult) onResult(current);
            }}
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {current ? `Останній випад: ${current.label}` : "Натисни «Крутити»"}
        </div>
      </div>
      <Button onClick={spin} disabled={mustSpin || options.length < 2 || !canSpin} size="lg">
        {mustSpin ? "Крутиться..." : canSpin ? "Крутити" : "Увійдіть, щоб крутити"}
      </Button>
    </div>
  );
}
