"use client";

import React, { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { startAdminSession, validateAdminCredentials } from "../../../lib/admin";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setErrorMessage("");
  }, [username, password]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!validateAdminCredentials(username.trim(), password)) {
      setErrorMessage("Invalid prototype admin credentials.");
      return;
    }

    startAdminSession();
    router.push("/admin");
  };

  return (
    <main className="min-h-[calc(100vh-116px)] bg-white px-6 py-20 text-neutral-950 sm:px-8 lg:px-10">
      <section className="mx-auto max-w-xl">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.32em] text-neutral-500">
          Prototype Admin
        </p>

        <h1 className="mt-6 text-center font-serif text-4xl leading-tight tracking-[-0.04em] sm:text-5xl">
          POS Login
        </h1>

        <p className="mx-auto mt-7 max-w-lg text-center text-sm leading-7 text-neutral-500">
          Temporary access for local testing only. Do not use this login system for public launch.
        </p>

        <div className="mx-auto mt-10 h-px w-20 bg-neutral-950" />

        <form onSubmit={handleSubmit} className="mt-12 border border-neutral-950/10 p-6 sm:p-8">
          <div>
            <label
              htmlFor="username"
              className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-500"
            >
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              className="mt-3 w-full border border-neutral-950/10 px-4 py-4 text-sm outline-none transition duration-300 focus:border-neutral-950"
              placeholder="admin"
            />
          </div>

          <div className="mt-6">
            <label
              htmlFor="password"
              className="text-[10px] font-medium uppercase tracking-[0.26em] text-neutral-500"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-3 w-full border border-neutral-950/10 px-4 py-4 text-sm outline-none transition duration-300 focus:border-neutral-950"
              placeholder="admin"
            />
          </div>

          {errorMessage ? (
            <div className="mt-6 border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-600">{errorMessage}</div>
          ) : null}

          <button
            type="submit"
            className="mt-8 w-full bg-neutral-950 px-8 py-5 text-[11px] font-medium uppercase tracking-[0.28em] text-white transition duration-300 hover:bg-neutral-800"
          >
            Enter POS
          </button>

          <p className="mt-6 text-xs leading-6 text-neutral-400">
            Prototype credentials: username <strong>admin</strong>, password <strong>admin</strong>.
          </p>
        </form>
      </section>
    </main>
  );
}