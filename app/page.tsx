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

    dog.style.opacity = '1';
    dog.style.transform = 'scale(1)';

    await new Promise((resolve) => setTimeout(resolve, 350));

    dog.classList.add('tongue-out');
    await new Promise((resolve) => setTimeout(resolve, 900));

    dog.classList.add('sitting');
    await new Promise((resolve) => setTimeout(resolve, 500));

    dog.classList.add('wag');
    await new Promise((resolve) => setTimeout(resolve, 1600));

    dog.classList.remove('wag');
    await new Promise((resolve) => setTimeout(resolve, 300));

    dog.classList.remove('sitting');
    dog.classList.remove('tongue-out');

    await new Promise((resolve) => setTimeout(resolve, 600));

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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 p-4 overflow-hidden">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 space-y-4">
          <div
            ref={dogRef}
            className="dog-container mx-auto mb-8 relative"
            style={{
              width: '200px',
              height: '260px',
              opacity: 0,
              transform: 'scale(0.8)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
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
            Enter your email to
            <br />
            give my dog a treat
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting || isAnimating}
              className="h-14 text-lg px-6 bg-white border-2 border-gray-200 focus:border-amber-400 focus:ring-amber-400 transition-all"
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
            className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            {isSubmitting
              ? 'Sending treat...'
              : isAnimating
              ? 'Nom nom nom...'
              : 'Give treat'}
          </Button>

          {showSuccess && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-800 font-medium">Email saved! Thanks for treating my dog!</p>
            </div>
          )}
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Your email is safe with us. We'll only use it to send updates.
        </p>
      </div>

      <style jsx>{`
        .dog-container.tongue-out .dog-standing {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .dog-container.tongue-out .dog-standing-tongue {
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .dog-container.sitting .dog-standing,
        .dog-container.sitting .dog-standing-tongue {
          opacity: 0;
          transition: opacity 0.4s ease;
        }
        .dog-container.sitting .dog-sitting {
          opacity: 1;
          transition: opacity 0.4s ease;
        }

        .dog-container.sitting.tongue-out .dog-sitting {
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .dog-container.sitting.tongue-out .dog-sitting-tongue {
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .dog-container.wag {
          animation: wag 0.12s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          transform-origin: center bottom;
        }

        @keyframes wag {
          0%,
          100% {
            transform: rotate(-3deg);
          }
          50% {
            transform: rotate(3deg);
          }
        }

        .dog-standing,
        .dog-standing-tongue,
        .dog-sitting,
        .dog-sitting-tongue {
          transition: opacity 0.4s ease;
        }
      `}</style>
    </main>
  );
}
