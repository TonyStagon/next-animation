'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase';

export default function Home() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const dogRef = useRef<HTMLDivElement>(null);

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const playAnimation = async () => {
    setIsAnimating(true);
    const dog = dogRef.current;
    if (!dog) return;

    // Enhanced smooth entrance with bounce
    dog.style.opacity = '1';
    dog.style.transform = 'scale(1) translateY(0)';
    dog.classList.add('breathing');

    await new Promise((resolve) => setTimeout(resolve, 800));

    // Tongue out - gradual transition with anticipation
    dog.classList.add('tongue-out');
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Sitting - smooth transition with weight shift
    dog.classList.add('sitting');
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Happy wag with progressive intensity
    dog.classList.add('wag');
    await new Promise((resolve) => setTimeout(resolve, 800));
    dog.classList.add('wag-fast');
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Remove wag gradually
    dog.classList.remove('wag-fast');
    await new Promise((resolve) => setTimeout(resolve, 600));
    dog.classList.remove('wag');
    await new Promise((resolve) => setTimeout(resolve, 400));

    // Return to standing - natural transition
    dog.classList.remove('sitting');
    await new Promise((resolve) => setTimeout(resolve, 800));
    
    dog.classList.remove('tongue-out');
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Final breathing before exit
    await new Promise((resolve) => setTimeout(resolve, 800));
    dog.classList.remove('breathing');

    setShowSuccess(true);
    await new Promise((resolve) => setTimeout(resolve, 3000));
    setShowSuccess(false);
    setIsAnimating(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error: dbError } = await supabase
        .from('emails')
        .insert([{ email }]);

      if (dbError) {
        if (dbError.code === '23505') {
          setError('This email has already been submitted');
        } else {
          setError('Something went wrong. Please try again.');
        }
        setIsSubmitting(false);
        return;
      }

      setEmail('');
      await playAnimation();
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 overflow-hidden relative">
      {/* Decorative paw prints */}
      <div className="absolute top-10 left-10 text-6xl opacity-10 animate-pulse">🐾</div>
      <div className="absolute top-40 right-20 text-5xl opacity-10 animate-pulse" style={{animationDelay: '0.5s'}}>🐾</div>
      <div className="absolute bottom-20 left-32 text-7xl opacity-10 animate-pulse" style={{animationDelay: '1s'}}>🐾</div>
      <div className="absolute bottom-40 right-10 text-6xl opacity-10 animate-pulse" style={{animationDelay: '1.5s'}}>🐾</div>
      
      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8 space-y-4">
          <div
            ref={dogRef}
            className="dog-container mx-auto mb-8 relative"
            style={{
              width: '200px',
              height: '260px',
              opacity: 0,
              transform: 'scale(0.7) translateY(20px)',
              transition: 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
          >
            <div className="dog-standing absolute inset-0 flex items-center justify-center">
              <img
                src="/assets/dog-animations/Standing.svg"
                alt="Dog standing"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="dog-standing-tongue absolute inset-0 flex items-center justify-center opacity-0">
              <img
                src="/assets/dog-animations/Standing_with_tongue_out.svg"
                alt="Dog standing with tongue out"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="dog-sitting absolute inset-0 flex items-center justify-center opacity-0">
              <img
                src="/assets/dog-animations/Sitting.svg"
                alt="Dog sitting"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="dog-sitting-tongue absolute inset-0 flex items-center justify-center opacity-0">
              <img
                src="/assets/dog-animations/Sitting_with_tongue_out.svg"
                alt="Dog sitting with tongue out"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            🦴 Give My Pup a Treat! 🦴
          </h1>
          <p className="text-lg text-gray-600">
            Enter your email and watch the magic happen ✨
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isAnimating}
              className="h-14 text-lg px-6 bg-white border-2 border-amber-200 focus:border-amber-400 focus:ring-amber-400 transition-all rounded-xl shadow-sm"
              required
            />
            {error && (
              <p className="text-sm text-red-600 animate-in fade-in slide-in-from-top-1">
                {error}
              </p>
            )}
          </div>

          <Button
            type="submit"
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
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
       
        </p>
      </div>

      <style jsx>{`
        /* Enhanced smooth transitions with realistic timing */
        .dog-standing,
        .dog-standing-tongue,
        .dog-sitting,
        .dog-sitting-tongue {
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        /* Standing to tongue out - gradual fade with anticipation */
        .dog-container.tongue-out .dog-standing {
          opacity: 0;
          transition-delay: 0s;
        }
        .dog-container.tongue-out .dog-standing-tongue {
          opacity: 1;
          transition-delay: 0.1s;
        }

        /* Sitting transition - smooth blend with weight shift */
        .dog-container.sitting .dog-standing,
        .dog-container.sitting .dog-standing-tongue {
          opacity: 0;
          transition-delay: 0s;
        }
        .dog-container.sitting .dog-sitting {
          opacity: 1;
          transition-delay: 0.2s;
        }

        /* Sitting with tongue - seamless cross-fade */
        .dog-container.sitting.tongue-out .dog-sitting {
          opacity: 0;
          transition-delay: 0s;
        }
        .dog-container.sitting.tongue-out .dog-sitting-tongue {
          opacity: 1;
          transition-delay: 0.1s;
        }

        /* Natural breathing effect */
        .dog-container.breathing {
          animation: breathing 3s ease-in-out infinite;
        }

        @keyframes breathing {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.02) translateY(-1px);
          }
        }

        /* Enhanced tail wag - more realistic physics */
        .dog-container.wag {
          animation: wag 0.18s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          transform-origin: center 85%;
        }

        .dog-container.wag-fast {
          animation: wag-fast 0.12s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;
          transform-origin: center 85%;
        }

        @keyframes wag {
          0%, 100% {
            transform: rotate(-1.5deg);
          }
          25% {
            transform: rotate(-0.5deg);
          }
          50% {
            transform: rotate(1.5deg);
          }
          75% {
            transform: rotate(0.5deg);
          }
        }

        @keyframes wag-fast {
          0%, 100% {
            transform: rotate(-2.5deg);
          }
          25% {
            transform: rotate(-1deg);
          }
          50% {
            transform: rotate(2.5deg);
          }
          75% {
            transform: rotate(1deg);
          }
        }

        /* Enhanced bounce effect on entrance */
        @keyframes bounce-in {
          0% {
            transform: scale(0.7) translateY(20px);
            opacity: 0;
          }
          40% {
            transform: scale(1.08) translateY(-8px);
            opacity: 1;
          }
          60% {
            transform: scale(0.98) translateY(2px);
          }
          80% {
            transform: scale(1.03) translateY(-2px);
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        /* Subtle head tilt during wag */
        .dog-container.wag .dog-standing,
        .dog-container.wag .dog-standing-tongue,
        .dog-container.wag .dog-sitting,
        .dog-container.wag .dog-sitting-tongue {
          animation: head-tilt 0.36s ease-in-out infinite;
        }

        .dog-container.wag-fast .dog-standing,
        .dog-container.wag-fast .dog-standing-tongue,
        .dog-container.wag-fast .dog-sitting,
        .dog-container.wag-fast .dog-sitting-tongue {
          animation: head-tilt-fast 0.24s ease-in-out infinite;
        }

        @keyframes head-tilt {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(0.5deg);
          }
        }

        @keyframes head-tilt-fast {
          0%, 100% {
            transform: rotate(0deg);
          }
          50% {
            transform: rotate(0.8deg);
          }
        }
      `}</style>
    </main>
  );
}