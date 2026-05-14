import { useEffect, useState, useRef } from "react";
import { Sun, Moon } from "lucide-react";
import Switch from "@/components/ui/inputs/Switch/Switch";
import { useAppState, initAppState } from "@/hooks/useAppState";

const ThemeSwitcher = () => {
  const [, setAppState] = useAppState();

  const [isDark, setIsDark] = useState(() => {
    // 1. Check local storage first via persistent appState
    const savedTheme = initAppState().theme;
    if (savedTheme) {
      return savedTheme === "dark";
    }
    // 2. Fall back to system preference
    if (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    ) {
      return true;
    }
    // 3. Fallback to current HTML class if initialized elsewhere, else light
    return document.documentElement.classList.contains("dark");
  });

  const clickPosRef = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });

  const toggleTheme = (checked: boolean) => {
    const { x, y } = clickPosRef.current;

    if (!document.startViewTransition) {
      setIsDark(checked);
      return;
    }

    const transition = document.startViewTransition(() => {
      // Force DOM update synchronously inside the callback for the snapshot
      const root = document.documentElement;
      if (checked) {
        root.classList.add("dark");
        setAppState({ theme: "dark" });
      } else {
        root.classList.remove("dark");
        setAppState({ theme: "light" });
      }
      setIsDark(checked);
    });

    transition.ready.then(() => {
      const endRadius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      );

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${endRadius}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div
      onClickCapture={(e) => {
        clickPosRef.current = { x: e.clientX, y: e.clientY };
      }}
      className="flex cursor-pointer items-center justify-center"
    >
      <Switch
        checked={isDark}
        onCheckedChange={toggleTheme}
        activeThumbIcon={<Moon size={12} />}
        inactiveThumbIcon={<Sun size={12} />}
      />
    </div>
  );
};

export default ThemeSwitcher;
