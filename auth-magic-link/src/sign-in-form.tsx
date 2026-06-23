"use client";

import { useActionState, useState } from "react";

export type SignInState = { ok: boolean; message: string };

const initialState: SignInState = { ok: false, message: "" };

export type SignInFormProps = {
  /** Server action that sends the magic link: (prev, formData) => state. */
  action: (prev: SignInState, formData: FormData) => Promise<SignInState>;
  /** Client handler for Google sign-in. Omit to hide the Google button. */
  onGoogle?: () => Promise<void> | void;
  emailPlaceholder?: string;
  submitLabel?: string;
  sendingLabel?: string;
  googleLabel?: string;
};

function GoogleMark() {
  return (
    <svg viewBox="0 0 24 24" className="ml-auth-google-icon" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.46 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

// Passwordless sign-in: optional Google button + email magic-link form. Styling
// is self-contained (auth.css) and references theme CSS variables, so it matches
// whichever @mobayilo/themes theme is active without any Tailwind config.
export function SignInForm({
  action,
  onGoogle,
  emailPlaceholder = "you@example.com",
  submitLabel = "Send magic link",
  sendingLabel = "Sending…",
  googleLabel = "Continue with Google",
}: SignInFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [googlePending, setGooglePending] = useState(false);

  async function handleGoogle() {
    if (!onGoogle) return;
    setGooglePending(true);
    try {
      await onGoogle();
    } finally {
      setGooglePending(false);
    }
  }

  return (
    <div className="ml-auth">
      {onGoogle && (
        <>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={googlePending}
            className="ml-auth-google"
          >
            <GoogleMark />
            {googlePending ? "Redirecting…" : googleLabel}
          </button>
          <div className="ml-auth-divider">
            <span />or<span />
          </div>
        </>
      )}

      <form action={formAction} className="ml-auth-form">
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder={emailPlaceholder}
          className="ml-auth-input"
        />
        <button type="submit" disabled={pending} className="ml-auth-submit">
          {pending ? sendingLabel : submitLabel}
        </button>
        {state.message && (
          <p className={state.ok ? "ml-auth-msg-ok" : "ml-auth-msg-err"}>{state.message}</p>
        )}
      </form>
    </div>
  );
}
