'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import MascotAnimation from '@/components/MascotAnimation';

export default function DogAnimation() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentState, setCurrentState] = useState('sitting');
  const dogRef = useRef<HTMLDivElement>(null);
  const [playMascotSignal, setPlayMascotSignal] = useState(0);
  const mascotDoneRef = useRef<(() => void) | null>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const playAnimation = async () => {
    setIsAnimating(true);
    const dog = dogRef.current;
    if (!dog) return;

    // Entrance
    dog.style.opacity = '1';
    dog.style.transform = 'scale(1) translateY(0)';
    dog.classList.add('breathing');
    setCurrentState('sitting');
    await wait(800);

    // Phase 1: Tongue out while sitting (use MascotAnimation)
    dog.classList.add('tongue-transition');
    setCurrentState('sitting-tongue');

    // signal the MascotAnimation to play and wait for its onComplete
    const mascotPromise = new Promise<void>((resolve) => {
      mascotDoneRef.current = resolve;
    });
    setPlayMascotSignal((s) => s + 1);
    await mascotPromise;

    // Phase 2: Stand up with tongue - SMOOTH RISE
    dog.classList.add('standing-transition-rise');
    setCurrentState('standing-tongue');
    await wait(1200);

    // Phase 3: Happy wag
    dog.classList.add('wag');
    await wait(800);
    dog.classList.add('wag-fast');
    await wait(1200);

    // Phase 4: Calm wag
    dog.classList.remove('wag-fast');
    await wait(600);
    dog.classList.remove('wag');
    await wait(400);

    // Phase 5: Retract tongue - SMOOTH MOUTH TRANSITION
    dog.classList.add('tongue-retract');
    await wait(400);
    setCurrentState('standing');
    dog.classList.remove('tongue-transition', 'tongue-retract');
    await wait(600);

    // Phase 6: Sit back down - SMOOTH DESCENT
    dog.classList.add('sitting-transition-down');
    dog.classList.remove('standing-transition-rise');
    await wait(600);
    setCurrentState('sitting');
    await wait(400);
    dog.classList.remove('sitting-transition-down');

    dog.classList.remove('breathing');
    setShowSuccess(true);
    await wait(3000);
    setShowSuccess(false);
    setIsAnimating(false);
  };

  const handleSubmit = async () => {
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setEmail('');
      await playAnimation();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSvgPath = () => {
    const paths: Record<string, string> = {
      sitting: '/assets/dog-animations/Sitting.svg',
      'sitting-tongue': '/assets/dog-animations/Sitting_with_tongue_out.svg',
      'standing-tongue': '/assets/dog-animations/Standing_with_tongue_out.svg',
      standing: '/assets/dog-animations/Standing.svg'
    };
    return paths[currentState] || paths.sitting;
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 overflow-hidden relative">
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">🐾</div>
      <div className="absolute top-40 right-20 text-5xl opacity-10 animate-pulse" style={{animationDelay: '0.5s'}}>🐾</div>
      <div className="absolute bottom-20 left-32 text-7xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}>🐾</div>
      <div className="absolute bottom-40 right-10 text-6xl opacity-10 animate-pulse" style={{animationDelay: '1.5s'}}>🐾</div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-4 space-y-2">
          <div
            ref={dogRef}
            className="dog-container mx-auto mb-4 relative"
            style={{
              width: '220px',
              height: '280px',
              opacity: 0,
              transform: 'scale(0.7) translateY(20px)',
              transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            {currentState === 'sitting-tongue' ? (
              <div className="w-full h-full flex items-center justify-center">
                <MascotAnimation
                  playSignal={playMascotSignal}
                  onComplete={() => {
                    mascotDoneRef.current?.();
                    mascotDoneRef.current = null;
                  }}
                />
              </div>
            ) : (
              <img
                src={getSvgPath()}
                alt="Dog animation"
                className="w-full h-full object-contain"
                style={{
                  transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
                }}
              />
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
           Give me a Treat! 🦴
          </h1>
          <p className="text-base text-gray-600">
            Enter your email to Feed the Dog 
          </p>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isAnimating}
              className="h-14 text-lg px-6 bg-white border-2 border-amber-200 focus:border-amber-400 focus:ring-amber-400 transition-all rounded-xl shadow-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
            {error && (
              <p className="text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isAnimating}
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] rounded-xl"
          >
            {isSubmitting
              ? '🍖 Preparing treat...'
              : isAnimating
              ? '🐕 Nom nom nom...'
              : '🎁 Give Treat'}
          </Button>

          {showSuccess && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center shadow-md">
              <p className="text-green-800 font-medium text-lg">🎉 Yay! My pup loved it! 🐕💚</p>
              <p className="text-green-700 text-sm mt-1">Thanks for signing up!</p>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-gray-500 mt-3">
          Animation state: <span className="font-semibold">{currentState}</span>
        </p>
      </div>

      <style jsx>{`
        .dog-container.breathing {
          animation: breathing 3s ease-in-out infinite;
        }

        @keyframes breathing {
          0%, 100% { transform: scale(1) translateY(0); }
          50% { transform: scale(1.02) translateY(-1px); }
        }

        .dog-container.tongue-transition img {
          animation: tongueAppear 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        @keyframes tongueAppear {
          0% { opacity: 1; }
          40% { opacity: 0.3; }
          100% { opacity: 1; }
        }

        .dog-container.tongue-retract img {
          animation: tongueRetract 0.4s cubic-bezier(0.4, 0, 0.6, 1);
        }

        @keyframes tongueRetract {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }

        .dog-container.standing-transition-rise {
          animation: standUpSmooth 1.2s cubic-bezier(0.34, 1.56, 0.64, 1);
          animation-fill-mode: forwards;
        }

        @keyframes standUpSmooth {
          0% { 
            transform: scale(1) translateY(0) scaleY(1);
          }
          20% {
            transform: scale(0.98) translateY(2px) scaleY(0.96);
          }
          50% { 
            transform: scale(1.02) translateY(-5px) scaleY(1.05);
          }
          70% {
            transform: scale(1) translateY(-12px) scaleY(1.02);
          }
          100% { 
            transform: scale(1) translateY(-15px) scaleY(1);
          }
        }

        .dog-container.sitting-transition-down {
          animation: sitDownSmooth 0.8s cubic-bezier(0.4, 0, 0.2, 1);
          animation-fill-mode: forwards;
        }

        @keyframes sitDownSmooth {
          0% { 
            transform: scale(1) translateY(-15px) scaleY(1);
          }
          30% {
            transform: scale(1.01) translateY(-10px) scaleY(1.03);
          }
          60% { 
            transform: scale(0.98) translateY(-3px) scaleY(0.97);
          }
          80% {
            transform: scale(1.01) translateY(1px) scaleY(1.02);
          }
          100% { 
            transform: scale(1) translateY(0) scaleY(1);
          }
        }

        .dog-container.wag {
          animation: wag 0.18s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          transform-origin: center 85%;
        }

        .dog-container.wag-fast {
          animation: wag-fast 0.12s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          transform-origin: center 85%;
        }

        @keyframes wag {
          0%, 100% { transform: rotate(-1.5deg) translateY(-15px); }
          25% { transform: rotate(-0.5deg) translateY(-15px); }
          50% { transform: rotate(1.5deg) translateY(-15px); }
          75% { transform: rotate(0.5deg) translateY(-15px); }
        }

        @keyframes wag-fast {
          0%, 100% { transform: rotate(-2.5deg) translateY(-15px); }
          25% { transform: rotate(-1deg) translateY(-15px); }
          50% { transform: rotate(2.5deg) translateY(-15px); }
          75% { transform: rotate(1deg) translateY(-15px); }
        }
      `}</style>
    </main>
  );
}