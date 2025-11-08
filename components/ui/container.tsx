"use client";

import { useRef, useState, useEffect, createContext } from "react";

export const FullscreenContainerContext =
  createContext<React.RefObject<HTMLDivElement | null> | null>(null);

const Container = ({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    const elem = containerRef.current;
    if (!elem) return;

    if (!document.fullscreenElement) {
      elem.requestFullscreen().catch((err) => {
        alert(
          `Error attempting to enable full-screen mode: ${err.message} (${err.name})`,
        );
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullScreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullScreenChange);
    };
  }, []);

  return (
    <FullscreenContainerContext.Provider value={containerRef}>
      <div
        ref={containerRef}
        className="rounded-[1.3rem] border border-base-content/5 bg-neutral/5 p-1.5 dark:bg-neutral/50 w-full max-w-6xl 2xl:max-w-7xl mx-auto"
      >
        <div className="relative hidden md:block">
          <div className="absolute -top-4 right-4 flex -translate-y-full animate-pulse items-center gap-2">
            <svg
              className="fill-white mt-2 w-8 -rotate-[24deg] opacity-60"
              viewBox="0 0 219 41"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_3_248)">
                <path d="M21.489 29.4305C36.9333 31.3498 51.3198 33.0559 65.7063 34.9753C66.7641 35.1885 67.6104 36.4681 69.9376 38.3875C63.1675 39.2406 57.8783 40.3069 52.5892 40.5201C38.6259 40.9467 24.8741 40.9467 10.9107 40.9467C9.21821 40.9467 7.5257 41.1599 5.83317 40.7334C0.332466 39.6671 -1.57164 36.0416 1.39028 31.1365C2.87124 28.7906 4.56377 26.658 6.46786 24.7386C13.6611 17.4876 21.0659 10.4499 28.4707 3.41224C29.7401 2.13265 31.6442 1.49285 34.183 0C34.6061 10.8765 23.8162 13.8622 21.489 22.3927C23.3931 21.9662 25.0856 21.7529 26.5666 21.3264C83.6894 5.54486 140.601 7.25099 197.3 22.606C203.224 24.0988 208.936 26.4447 214.649 28.5773C217.61 29.6437 220.149 31.9896 218.457 35.6151C216.976 39.2406 214.014 39.2406 210.629 37.7477C172.759 20.6866 132.561 18.7672 91.9404 19.407C70.7838 19.6203 50.0504 21.9662 29.5285 26.8713C26.9897 27.5111 24.4509 28.3641 21.489 29.4305Z"></path>
              </g>
              <defs>
                <clipPath id="clip0_3_248">
                  <rect width="219" height="41"></rect>
                </clipPath>
              </defs>
            </svg>
            <span className="text-base-secondary text-sm __className_76434e">
              Interactive demo
            </span>
          </div>

          <div
            className="custom-card group relative mx-auto flex aspect-[5/3.6] flex-col overflow-hidden"
            id="demo-container"
          >
            <div className="relative z-10 flex w-full items-center border-b-[0.5px] border-base-content/5 bg-base-100 px-4 py-2 shadow-[0_1px_1px_rgba(0,0,0,0.08)]">
              <div className="absolute left-4 top-1/2 flex -translate-y-1/2 items-center justify-start space-x-1.5">
                <span className="size-2.5 rounded-full bg-red-400"></span>
                <span className="size-2.5 rounded-full bg-yellow-400"></span>
                <span className="size-2.5 rounded-full bg-green-400"></span>
              </div>
              <div className="w-full text-center text-sm">
                <span className="text-base-secondary opacity-50">
                  https://awsquizgame.adembenabdallah.com/
                </span>
                <span className="text-base-content">levels</span>
              </div>
              <div className="absolute right-2 top-1/2 hidden -translate-y-1/2 items-center justify-center md:flex">
                <button
                  onClick={toggleFullScreen}
                  className="btn btn-square btn-ghost btn-sm"
                  title={isFullScreen ? "Exit fullscreen" : "Enter fullscreen"}
                >
                  {isFullScreen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-[18px]"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.75 3.25a.75.75 0 0 0-1.5 0v2.69L6.03 2.72a.75.75 0 0 0-1.06 1.06L8.19 7H5.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 .75-.75v-4.5ZM2.72 13.97a.75.75 0 0 0 1.06-1.06L.56 16.19v-2.69a.75.75 0 0 0-1.5 0v4.5a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 0-1.5H2.81l3.22-3.22Z"
                        clipRule="evenodd"
                      />
                      <path
                        fillRule="evenodd"
                        d="M13.97 2.72a.75.75 0 0 1 1.06 1.06L11.81 7h2.69a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 1 1.5 0v2.69l3.22-3.22ZM17.28 13.97a.75.75 0 1 1-1.06-1.06l3.22-3.22h-2.69a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-2.69l-3.22 3.22Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-[18px]"
                    >
                      <path d="m13.28 7.78 3.22-3.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 0 0 1.06 1.06ZM2 17.25v-4.5a.75.75 0 0 1 1.5 0v2.69l3.22-3.22a.75.75 0 0 1 1.06 1.06L4.56 16.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.747.747 0 0 1-.75-.75ZM12.22 13.28l3.22 3.22h-2.69a.75.75 0 0 0 0 1.5h4.5a.747.747 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69l-3.22-3.22a.75.75 0 1 0-1.06 1.06ZM3.5 4.56l3.22 3.22a.75.75 0 0 0 1.06-1.06L4.56 3.5h2.69a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0V4.56Z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </div>
            <div className="overflow-y-auto">{children}</div>
          </div>
        </div>
      </div>
    </FullscreenContainerContext.Provider>
  );
};

export default Container;
