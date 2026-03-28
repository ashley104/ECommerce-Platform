"use client";

import Form from "next/form";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import ThemeSwitch from "../Themes/ThemeSwitcher";

const SEARCH_DELAY_MS = 300;

export function TopMenu({ query }: { query?: string }) {
  const router = useRouter();
  // Store the active debounce timer so we can replace it on each keystroke.
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear any pending navigation when the component unmounts.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  function handleSearchChange(
    input: HTMLInputElement,
    form: HTMLFormElement | null,
  ) {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Wait briefly before searching so we do not navigate on every keystroke.
    timeoutRef.current = setTimeout(() => {
      const trimmedSearch = input.value.trim();

      // Empty search returns to the home page instead of opening /search?q=.
      if (!trimmedSearch) {
        router.push("/");
        return;
      }

      form?.requestSubmit();
    }, SEARCH_DELAY_MS);
  }

  return (
    <div className="sticky top-0 self-start border-b border-gray-200 bg-white">
      <div className="py-3 px-9 flex items-center gap-x-3">
        <Form action="/search" className="flex-1 min-w-0">
          <input
            type="text"
            name="q"
            placeholder="Search"
            className="w-full py-2 pl-5 pr-5 text-sm placeholder-gray-500 bg-white border border-gray-200 rounded-full"
            defaultValue={query ?? ""}
            onChange={(event) => {
              handleSearchChange(event.currentTarget, event.currentTarget.form);
            }}
          />
        </Form>
        <div className="flex shrink-0 items-center gap-x-6">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
}
