"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Firebase error codes -> Turkish messages for customers.
function authErrorMessage(err: any) {
  switch (err?.code) {
    case "auth/invalid-email":
      return "Please enter a valid email address.";
    case "auth/missing-password":
      return "Please enter your password.";
    case "auth/weak-password":
      return "Your password must be at least 6 characters.";
    case "auth/email-already-in-use":
      return "An account with this email already exists. Try signing in.";
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/too-many-requests":
      return "Too many attempts. Please try again in a moment.";
    case "auth/popup-closed-by-user":
    case "auth/cancelled-popup-request":
      return "";
    case "auth/network-request-failed":
      return "Connection error. Please check your internet connection.";
    default:
      return "Something went wrong. Please try again.";
  }
}

export default function AuthClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailAuth = async (e?: FormEvent) => {
    e?.preventDefault();

    try {
      setLoading(true);
      setError("");

      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);

        if (name) {
          await updateProfile(cred.user, { displayName: name });
        }
      }

      router.push(redirect);
    } catch (err: any) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setLoading(true);
      setError("");
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push(redirect);
    } catch (err: any) {
      setError(authErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "h-12 w-full rounded-sm border border-line bg-paper px-4 text-sm text-ink outline-none transition focus:border-custom-accent";

  return (
    <>
      <Header />

      <main className="bg-custom-bg">
        <div className="mx-auto grid max-w-7xl gap-0 px-6 py-10 lg:grid-cols-2 lg:px-10 lg:py-16">
          {/* Image side (desktop) */}
          <div className="relative hidden overflow-hidden rounded-sm lg:block">
            <img
              src="/img/BannerOne.jpg"
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-10 text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
                Keramet Rugs
              </p>
              <p className="mt-3 font-display text-4xl font-semibold leading-tight">
                A master’s labour in every knot, a story in every pattern.
              </p>
            </div>
          </div>

          {/* Form */}
          <div className="flex items-center justify-center lg:pl-16">
            <div className="w-full max-w-md py-4 lg:py-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-custom-accent">
                {isLogin ? "Welcome back" : "Join us"}
              </p>
              <h1 className="mt-3 font-display text-5xl font-semibold leading-none text-ink">
                {isLogin ? "Sign In" : "Create Account"}
              </h1>
              <p className="mt-3 text-sm text-muted">
                {isLogin
                  ? "Sign in to your account to complete your orders."
                  : "Create your account in seconds and continue shopping."}
              </p>

              <button
                type="button"
                onClick={handleGoogle}
                disabled={loading}
                className="mt-8 flex h-12 w-full items-center justify-center gap-3 rounded-full border border-line bg-paper text-sm font-semibold text-ink transition hover:border-custom-accent disabled:opacity-60"
              >
                <FaGoogle className="text-custom-accent" />
                Continue with Google
              </button>

              <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-muted">
                <span className="h-px flex-1 bg-line" />
                or
                <span className="h-px flex-1 bg-line" />
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4" noValidate>
                {!isLogin ? (
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold text-ink/80">
                      Full Name
                    </span>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      className={inputClass}
                    />
                  </label>
                ) : null}

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-ink/80">
                    Email
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    className={inputClass}
                  />
                </label>

                <label className="block">
                  <span className="mb-1.5 block text-xs font-semibold text-ink/80">
                    Password
                  </span>
                  <span className="relative block">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      className={`${inputClass} pr-12`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted hover:text-custom-accent"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </span>
                </label>

                {error ? (
                  <p role="alert" className="rounded-sm bg-custom-accent/10 px-4 py-3 text-sm text-custom-accent">
                    {error}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={loading}
                  className="h-12 w-full rounded-full bg-custom-accent text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-custom-accent-light disabled:opacity-70"
                >
                  {loading ? "Please wait…" : isLogin ? "Sign In" : "Sign Up"}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-muted">
                {isLogin ? "Don’t have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setError("");
                  }}
                  className="font-semibold text-custom-accent hover:text-custom-accent-light"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>

              <p className="mt-8 text-center text-xs leading-6 text-muted">
                By continuing, you agree to our{" "}
                <Link href="/terms" className="underline hover:text-custom-accent">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link href="/privacy-policy" className="underline hover:text-custom-accent">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
