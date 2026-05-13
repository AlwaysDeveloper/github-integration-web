'use client'

import { useState } from 'react';
import { handelLogin } from './_page';

function GitHubIcon({ size = 24 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.341-3.369-1.341-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836a9.59 9.59 0 012.504.337c1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
    </svg>
  );
}

function SpinnerIcon({ size = 18 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      className="animate-spin-smooth"
      aria-label="Loading"
    >
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="40"
        strokeDashoffset="10"
        opacity="0.3"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  return (
    <main className="relative min-h-screen bg-[#080C10] text-[#E6EDF3] font-mono overflow-hidden">
      {/* Background grid */}
      <div
        aria-hidden="true"
        className="fixed inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#1E2730 1px, transparent 1px), linear-gradient(90deg, #1E2730 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          maskImage:
            'radial-gradient(ellipse 80% 80% at 50% 50%, black 20%, transparent 100%)',
        }}
      />

      {/* Glow blobs */}
      <div
        aria-hidden="true"
        className="fixed -top-40 -left-20 w-[600px] h-[600px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(63,185,80,0.06) 0%, transparent 70%)',
        }}
      />
      <div
        aria-hidden="true"
        className="fixed -bottom-40 -right-20 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(88,166,255,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Two-column layout */}
      <div className="relative z-10 min-h-screen grid grid-cols-1 md:grid-cols-[1fr_1px_1fr]">
        {/* ── Left panel ── */}
        <section className="hidden md:flex flex-col justify-center px-16 py-20">
          <span className="flex items-center gap-2 text-[11px] tracking-[0.15em] text-[#3FB950] uppercase mb-7 before:block before:w-5 before:h-px before:bg-[#3FB950]">
            GitHub Integration
          </span>

          <h1 className="text-[clamp(36px,4vw,54px)] leading-[1.1] text-white mb-5">
            Connect your
            <br />
            <em className="not-italic text-[#7D8590]">repositories,</em>
            <br />
            your way.
          </h1>

          <p className="text-[13px] leading-[1.8] text-[#7D8590] max-w-[360px] mb-12">
            Monitor pull requests, manage subscriptions, and get notified
            instantly — all from a single unified dashboard.
          </p>

          <div className="flex gap-8 mb-10">
            {[
              { num: '100M+', label: 'Developers' },
              { num: '420M+', label: 'Repositories' },
              { num: '∞', label: 'Pull Requests' },
            ].map((s) => (
              <div key={s.label} className="flex flex-col gap-1">
                <span className="text-[22px] font-semibold text-white tracking-tight">
                  {s.num}
                </span>
                <span className="text-[11px] text-[#7D8590] tracking-[0.08em] uppercase">
                  {s.label}
                </span>
              </div>
            ))}
          </div>

          <div className="bg-[#0A0E13] border border-[#1E2730] rounded-lg p-5 text-[12px] leading-[1.9] max-w-[400px] whitespace-pre">
            <span className="text-[#3D444D]">
              {'// OAuth scopes requested'}
            </span>
            {'\n'}
            <span className="text-[#58A6FF]">scope</span>
            {': [\n'}
            {'  '}
            <span className="text-[#E3B341]">"repo"</span>
            {'            '}
            <span className="text-[#3D444D]">{'// private repos'}</span>
            {'\n'}
            {'  '}
            <span className="text-[#E3B341]">"user:email"</span>
            {'      '}
            <span className="text-[#3D444D]">{'// notifications'}</span>
            {'\n'}
            {'  '}
            <span className="text-[#E3B341]">"write:repo_hook"</span>
            {'  '}
            <span className="text-[#3D444D]">{'// webhooks'}</span>
            {'\n'}
            {']'}
          </div>
        </section>

        {/* Vertical divider */}
        <div className="hidden md:block bg-[#1E2730]" aria-hidden="true" />

        {/* ── Right panel ── */}
        <section className="flex flex-col justify-center items-center px-6 md:px-16 py-20">
          <div className="w-full max-w-[380px] border border-[#1E2730] rounded-xl bg-[#0D1117] overflow-hidden shadow-[0_0_0_1px_rgba(255,255,255,0.03)_inset,0_32px_64px_rgba(0,0,0,0.5)]">
            {/* macOS title bar */}
            <div
              className="flex items-center gap-2.5 px-5 py-3.5 border-b border-[#1E2730]"
              aria-hidden="true"
            >
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              </div>
              <span className="flex-1 text-center text-[12px] text-[#3D444D] tracking-[0.05em]">
                auth / login
              </span>
            </div>

            <div className="px-7 pt-8 pb-6">
              {/* Logo */}
              <div className="flex justify-center mb-7">
                <div className="w-14 h-14 border border-[#2A3540] rounded-xl bg-gradient-to-br from-[#161B22] to-[#0D1117] flex items-center justify-center shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
                  <GitHubIcon size={28} />
                </div>
              </div>

              <h2 className="text-center text-[20px] font-medium text-white mb-1.5 tracking-tight">
                Welcome back
              </h2>
              <p className="text-center text-[12px] text-[#7D8590] mb-7 leading-relaxed">
                Sign in with your GitHub account to access
                <br />
                your repositories and notifications.
              </p>

              {/* Error message */}
              {error && (
                <div className="mb-4 px-3.5 py-2.5 bg-[#2D1515] border border-[#5C2020] rounded-lg text-[12px] text-[#FF7B72] text-center">
                  {error}
                </div>
              )}

              {/* GitHub button */}
              <button
                onClick={() => handelLogin(setLoading, setError)}
                disabled={isLoading}
                className="group relative w-full flex items-center justify-center gap-2.5 px-5 py-3 bg-[#161B22] border border-[#2A3540] rounded-lg text-white text-[14px] font-medium cursor-pointer overflow-hidden transition-all duration-200 hover:border-[#3FB950] hover:shadow-[0_0_0_1px_#1A3626,0_0_20px_rgba(63,185,80,0.1)] hover:-translate-y-px active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:border-[#2A3540] disabled:hover:shadow-none"
              >
                <span className="absolute inset-0 bg-gradient-to-br from-[rgba(63,185,80,0.08)] to-transparent opacity-0 group-hover:opacity-100 group-disabled:opacity-0 transition-opacity duration-300" />

                {isLoading ? (
                  <>
                    <SpinnerIcon size={18} />
                    Redirecting to GitHub...
                  </>
                ) : (
                  <>
                    <GitHubIcon size={18} />
                    Continue with GitHub
                  </>
                )}
              </button>

              {/* OR divider */}
              <div className="flex items-center gap-3 my-5 text-[11px] text-[#3D444D] tracking-[0.1em]">
                <div className="flex-1 h-px bg-[#1E2730]" />
                <span>or</span>
                <div className="flex-1 h-px bg-[#1E2730]" />
              </div>

              {/* Terminal hint */}
              <div className="flex items-center gap-2 bg-[#0A0E13] border border-[#1E2730] rounded-md px-3.5 py-3 text-[12px] text-[#7D8590]">
                <span className="text-[#3FB950]">$</span>
                <span className="text-[#58A6FF]">gh auth login --web</span>
                <span
                  className="inline-block w-[7px] h-[13px] bg-[#58A6FF] ml-0.5 align-text-bottom animate-[blink_1.1s_step-end_infinite]"
                  aria-hidden="true"
                />
              </div>

              {/* Scope badges */}
              <div className="flex flex-wrap gap-1.5 justify-center mt-4">
                {['repo', 'user:email', 'write:repo_hook'].map((s) => (
                  <span
                    key={s}
                    className="text-[10px] px-2 py-0.5 border border-[#1A3626] rounded text-[#3FB950] tracking-[0.05em]"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>

            <div className="px-7 py-4 border-t border-[#1E2730] text-center text-[11px] text-[#3D444D] leading-relaxed">
              By continuing, you agree to our{' '}
              <a
                href="/terms"
                className="text-[#7D8590] border-b border-[#2A3540] no-underline hover:text-[#58A6FF] transition-colors"
              >
                Terms
              </a>{' '}
              and{' '}
              <a
                href="/privacy"
                className="text-[#7D8590] border-b border-[#2A3540] no-underline hover:text-[#58A6FF] transition-colors"
              >
                Privacy Policy
              </a>
              .
              <br />
              Your token is encrypted and never shared.
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .animate-spin-smooth { animation: spin 0.8s linear infinite; }
      `}</style>
    </main>
  );
}
