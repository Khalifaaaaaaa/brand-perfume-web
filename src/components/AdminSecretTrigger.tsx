"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const ADMIN_SECRET_CODE = "admin1234";

export default function AdminSecretTrigger() {
  const router = useRouter();
  const typedSequenceRef = useRef("");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tagName = target?.tagName.toLowerCase();

      if (tagName === "input" || tagName === "textarea" || target?.isContentEditable) {
        return;
      }

      if (event.key.length !== 1) {
        return;
      }

      typedSequenceRef.current = `${typedSequenceRef.current}${event.key.toLowerCase()}`.slice(
        -ADMIN_SECRET_CODE.length,
      );

      if (typedSequenceRef.current === ADMIN_SECRET_CODE) {
        typedSequenceRef.current = "";
        router.push("/admin/login");
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [router]);

  return null;
}