"use client";

import { Card, CardDescription, CardHeader, CardTitle } from "@mobayilo/ui";
import { SignInForm, type SignInState } from "@mobayilo/auth-magic-link/sign-in-form";
import { ShowcasePanel } from "../../showcase-panel";

// Demo-only stand-ins: the real app wires `action` to a Better Auth magic-link
// server action (see @mobayilo/auth-magic-link) and `onGoogle` to the auth
// client's `signIn.social({ provider: "google" })`.
async function demoSendMagicLink(_prev: SignInState, formData: FormData): Promise<SignInState> {
  await new Promise((resolve) => setTimeout(resolve, 600));
  const email = String(formData.get("email") ?? "");
  return { ok: true, message: `Magic link sent to ${email} (demo — no email was sent).` };
}

function demoGoogleSignIn() {
  return new Promise<void>((resolve) => setTimeout(resolve, 600));
}

export function SignIn() {
  return (
    <ShowcasePanel label="Sign-in — magic link + Google">
      <Card style={{ maxWidth: 380 }}>
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Passwordless everywhere — Better Auth magic link, ZeptoMail delivery.</CardDescription>
        </CardHeader>
        <SignInForm action={demoSendMagicLink} onGoogle={demoGoogleSignIn} />
      </Card>
    </ShowcasePanel>
  );
}
