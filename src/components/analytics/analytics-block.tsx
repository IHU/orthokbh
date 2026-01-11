"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useAnalyticsEvents } from "@/components/analytics/use-analytics-events";

interface AnalyticsBlockContextValue {
  blockId: string;
  blockType?: string;
  position?: number;
}

const AnalyticsBlockContext = createContext<
  AnalyticsBlockContextValue | undefined
>(undefined);

export function useAnalyticsBlock(): AnalyticsBlockContextValue | undefined {
  return useContext(AnalyticsBlockContext);
}

interface AnalyticsBlockProps extends AnalyticsBlockContextValue {
  children: ReactNode;
  once?: boolean;
}

export function AnalyticsBlock({
  blockId,
  blockType,
  position,
  once = true,
  children,
}: AnalyticsBlockProps): JSX.Element {
  const ref = useRef<HTMLDivElement | null>(null);
  const { trackBlockImpression } = useAnalyticsEvents();
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    if (!ref.current || (once && seen)) {
      return;
    }

    const element = ref.current;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackBlockImpression({
              blockId,
              blockType,
              position,
            });

            if (once) {
              setSeen(true);
              observer.unobserve(entry.target);
            }
          }
        });
      },
      {
        threshold: 0.4,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
      observer.disconnect();
    };
  }, [blockId, blockType, once, position, seen, trackBlockImpression]);

  const value: AnalyticsBlockContextValue = { blockId, blockType, position };

  return (
    <AnalyticsBlockContext.Provider value={value}>
      <div ref={ref} data-analytics-block-id={blockId}>
        {children}
      </div>
    </AnalyticsBlockContext.Provider>
  );
}
