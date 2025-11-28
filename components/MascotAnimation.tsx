import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import MascotSVG from "./MascotSVG";

type AnimationPhase = "idle" | "blink" | "eyes-widen" | "head-tilt" | "mouth-open" | "bounce" | "tongue-out" | "tail-wiggle" | "settle";

// Duolingo-style animation timings (smoother and slower)
const DURATION = {
  blink: 0.2,
  eyesWiden: 0.8,
  headTilt: 1.0,
  mouthOpen: 0.8,
  bounce: 0.6,
  tongueOut: 0.6,
  tailWiggle: 0.4,
  settle: 1.2,
};

export const MascotAnimation = ({ autoPlay = false, onComplete, playSignal = 0 }: { autoPlay?: boolean; onComplete?: () => void; playSignal?: number }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [phase, setPhase] = useState<AnimationPhase>("idle");
  const [isPlaying, setIsPlaying] = useState(false);
  const mainTimeline = useRef<gsap.core.Timeline | null>(null);
  const idleTimeline = useRef<gsap.core.Timeline | null>(null);

  // Initialize idle animations (like Duolingo's subtle movements)
  useEffect(() => {
    if (!svgRef.current) return;

    idleTimeline.current = gsap.timeline({ repeat: -1, yoyo: true });

    idleTimeline.current
      .to("#body", {
        scaleY: 1.015,
        transformOrigin: "50% 100%",
        duration: 3,
        ease: "sine.inOut",
      }, 0)
      .to("#head", {
        y: -1.5,
        duration: 3,
        ease: "sine.inOut",
      }, 0)
      .to("#tail", {
        rotate: 2,
        transformOrigin: "0% 50%",
        duration: 2.5,
        ease: "sine.inOut",
      }, 0);

    // Occasional soft blink
    const blinkInterval = setInterval(() => {
      if (!isPlaying && svgRef.current) {
        gsap.timeline()
          .to("#eyelids", { opacity: 1, duration: 0.12, ease: "sine.in" })
          .to("#eyelids", { opacity: 0, duration: 0.15, delay: 0.12, ease: "sine.out" });
      }
    }, 5000);

    return () => {
      idleTimeline.current?.kill();
      clearInterval(blinkInterval);
    };
  }, [isPlaying]);

  const runAnimation = useCallback(async () => {
    if (isPlaying || !svgRef.current) return;

    setIsPlaying(true);
    idleTimeline.current?.pause();

    mainTimeline.current?.kill();

    const tl = gsap.timeline({
      onComplete: () => {
        setIsPlaying(false);
        setPhase("idle");
        idleTimeline.current?.play();
        if (onComplete) onComplete();
      },
    });

    mainTimeline.current = tl;

    // PHASE 1: Soft blink (smooth)
    setPhase("blink");
    tl.to("#eyelids", {
      opacity: 1,
      duration: DURATION.blink,
      ease: "sine.in",
    })
    .to("#eyelids", {
      opacity: 0,
      duration: DURATION.blink * 1.5,
      ease: "sine.out",
    })
    .add(() => setPhase("eyes-widen"), "+=0.3");

    // PHASE 2: Eyes widen with excitement (smooth)
    tl.to("#pupils", {
      scale: 1.15,
      transformOrigin: "50% 50%",
      duration: DURATION.eyesWiden,
      ease: "power2.out",
    })
    .to("#eyeWhites", {
      scale: 1.08,
      transformOrigin: "50% 50%",
      duration: DURATION.eyesWiden,
      ease: "power2.out",
    }, "<")
    .add(() => setPhase("head-tilt"), "+=0.2");

    // PHASE 3: Head tilts forward with anticipation (smooth)
    tl.to("#head", {
      rotate: 4,
      y: -4,
      transformOrigin: "50% 100%",
      duration: DURATION.headTilt,
      ease: "power1.inOut",
    })
    .to("#ears", {
      rotate: -2,
      transformOrigin: "50% 100%",
      duration: DURATION.headTilt,
      ease: "power1.inOut",
    }, "<0.15")
    .add(() => setPhase("mouth-open"), "+=0.3");

    // PHASE 4: Mouth opens - transition to happy eyes (smooth)
    tl.to("#eyes", {
      opacity: 0,
      duration: DURATION.mouthOpen * 0.6,
      ease: "power1.inOut",
    })
    .to("#happyEyes", {
      opacity: 1,
      duration: DURATION.mouthOpen * 0.6,
      ease: "power1.inOut",
    }, "<")
    .to("#mouthClosed", {
      opacity: 0,
      duration: DURATION.mouthOpen * 0.4,
      ease: "power1.inOut",
    }, "<")
    .to("#mouthOpen", {
      opacity: 1,
      duration: DURATION.mouthOpen,
      ease: "power2.out",
    }, "<0.15")
    .add(() => setPhase("bounce"), "+=0.4");

    // PHASE 5: Excited bounce - smooth squash and stretch
    tl.to("#mascot", {
      scaleY: 0.94,
      scaleX: 1.04,
      transformOrigin: "50% 100%",
      duration: DURATION.bounce * 0.5,
      ease: "power1.in",
    })
    .to("#floor", {
      scaleX: 1.2,
      transformOrigin: "50% 50%",
      duration: DURATION.bounce * 0.5,
      ease: "power1.in",
    }, "<")
    .to("#mascot", {
      scaleY: 1.06,
      scaleX: 0.97,
      y: -15,
      duration: DURATION.bounce,
      ease: "power2.out",
    })
    .to("#floor", {
      scaleX: 0.8,
      opacity: 0.25,
      duration: DURATION.bounce,
      ease: "power2.out",
    }, "<")
    .add(() => setPhase("tongue-out"), "+=0.2");

    // PHASE 6: Tongue comes out with gentle sway
    tl.to("#tongue", {
      scaleY: 1.08,
      transformOrigin: "50% 0%",
      duration: DURATION.tongueOut,
      ease: "power2.out",
    })
    .to("#tongue", {
      rotate: 3,
      duration: DURATION.tongueOut,
      ease: "sine.inOut",
      yoyo: true,
      repeat: 3,
    })
    .add(() => setPhase("tail-wiggle"), "+=0.3");

    // PHASE 7: Tail wiggle (soft, gentle like Duolingo)
    const tailWiggle = gsap.timeline();
    for (let i = 0; i < 3; i++) {
      tailWiggle
        .to("#tail", {
          rotate: 12,
          transformOrigin: "0% 80%",
          duration: DURATION.tailWiggle,
          ease: "sine.inOut",
        })
        .to("#tail", {
          rotate: -8,
          transformOrigin: "0% 80%",
          duration: DURATION.tailWiggle,
          ease: "sine.inOut",
        });
    }
    tl.add(tailWiggle);

    // Landing and settle - smooth and gentle
    tl.add(() => setPhase("settle"), "+=0.3")
    .to("#mascot", {
      scaleY: 0.97,
      scaleX: 1.02,
      y: 0,
      duration: DURATION.settle * 0.4,
      ease: "power1.in",
    })
    .to("#floor", {
      scaleX: 1.08,
      opacity: 0.4,
      duration: DURATION.settle * 0.4,
      ease: "power1.in",
    }, "<")
    .to("#mascot", {
      scaleY: 1,
      scaleX: 1,
      duration: DURATION.settle,
      ease: "power2.out",
    })
    .to("#floor", {
      scaleX: 1,
      opacity: 0.15,
      duration: DURATION.settle,
      ease: "power2.out",
    }, "<")
    .to("#head", {
      rotate: 0,
      y: 0,
      duration: DURATION.settle,
      ease: "power2.out",
    }, "<")
    .to("#ears", {
      rotate: 0,
      duration: DURATION.settle,
      ease: "power2.out",
    }, "<")
    .to("#tail", {
      rotate: 0,
      duration: DURATION.settle * 1.2,
      ease: "power2.out",
    }, "<");

    // Keep the excited expression for a moment before returning
    tl.to({}, { duration: 2.5 });

    // Return to normal expression - smooth and gradual
    tl.to("#happyEyes", { opacity: 0, duration: 0.6, ease: "power1.inOut" })
    .to("#eyes", { opacity: 1, duration: 0.6, ease: "power1.inOut" }, "<")
    .to("#mouthOpen", { opacity: 0, duration: 0.6, ease: "power1.inOut" }, "<")
    .to("#mouthClosed", { opacity: 1, duration: 0.6, ease: "power1.inOut" }, "<")
    .to("#pupils", {
      scale: 1,
      duration: 0.8,
      ease: "power1.out",
    }, "<")
    .to("#eyeWhites", {
      scale: 1,
      duration: 0.8,
      ease: "power1.out",
    }, "<");

  }, [isPlaying, onComplete]);

  const resetAnimation = useCallback(() => {
    mainTimeline.current?.kill();
    idleTimeline.current?.pause();

    gsap.set("#mascot", { scaleX: 1, scaleY: 1, y: 0 });
    gsap.set("#head", { rotate: 0, y: 0 });
    gsap.set("#ears", { rotate: 0 });
    gsap.set("#tail", { rotate: 0 });
    gsap.set("#pupils", { scale: 1 });
    gsap.set("#eyeWhites", { scale: 1 });
    gsap.set("#eyelids", { opacity: 0 });
    gsap.set("#happyEyes", { opacity: 0 });
    gsap.set("#eyes", { opacity: 1 });
    gsap.set("#mouthClosed", { opacity: 1 });
    gsap.set("#mouthOpen", { opacity: 0 });
    gsap.set("#tongue", { scaleY: 1, rotate: 0 });
    gsap.set("#floor", { scaleX: 1, opacity: 0.15 });

    setPhase("idle");
    setIsPlaying(false);
    idleTimeline.current?.restart();
  }, []);

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(runAnimation, 1500);
      return () => clearTimeout(timer);
    }
  }, [autoPlay, runAnimation]);

  // Triggered by external signal changes (increment `playSignal` to run)
  useEffect(() => {
    if (playSignal > 0) {
      runAnimation();
    }
  }, [playSignal, runAnimation]);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <MascotSVG ref={svgRef} className="w-40 h-auto" />
    </div>
  );
};

export default MascotAnimation;
