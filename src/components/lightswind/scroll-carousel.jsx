"use client";

import { forwardRef, useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/components/lib/utils";
import { refreshScrollTriggers } from "@/components/lib/refreshScrollTriggers";
import { LinkedText } from "@/app/cmsComponents/shared/backlinks";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const FALLBACK_IMAGE =
  "https://images.pexels.com/photos/9934462/pexels-photo-9934462.jpeg";

const PIN_BACKGROUND = {
  backgroundColor: "#050505",
  backgroundImage:
    "radial-gradient(circle, rgba(255,255,255,0.14) 1px, transparent 1.2px)",
  backgroundSize: "22px 22px",
};

function useFeatureAnimations(
  containerRef,
  scrollContainerRef,
  scrollContainerRef2,
  progressBarRef,
  cardRefs,
  cardRefs2,
  isDesktop,
  maxScrollHeight
) {
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const ctx = gsap.context(() => {
      if (isDesktop) {
        const measure = () => {
          const scrollWidth1 = scrollContainerRef.current?.scrollWidth || 0;
          const scrollWidth2 = scrollContainerRef2.current?.scrollWidth || 0;
          const containerWidth = container.offsetWidth || 0;
          const cardWidth = cardRefs.current[0]?.offsetWidth || 0;
          const viewportOffset = (containerWidth - cardWidth) / 2;
          const finalOffset1 = scrollWidth1 - containerWidth + viewportOffset;
          const finalOffset2 = scrollWidth2 - containerWidth + viewportOffset;
          const scrollDistance = maxScrollHeight || Math.max(finalOffset1, 1);
          return { viewportOffset, finalOffset1, finalOffset2, scrollDistance };
        };

        const applyRow2Start = () => {
          if (!scrollContainerRef2.current) return;
          const { finalOffset2, viewportOffset } = measure();
          gsap.set(scrollContainerRef2.current, {
            x: -finalOffset2 + viewportOffset * 2,
          });
        };

        applyRow2Start();

        const scrollTriggerBase = {
          trigger: container,
          start: "top top",
          end: () => `+=${measure().scrollDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
        };

        gsap
          .timeline({
            scrollTrigger: {
              ...scrollTriggerBase,
              pin: true,
              pinSpacing: true,
              anticipatePin: 1,
              onRefresh: applyRow2Start,
            },
          })
          .fromTo(
            scrollContainerRef.current,
            { x: () => measure().viewportOffset },
            {
              x: () => {
                const { finalOffset1, viewportOffset } = measure();
                return -finalOffset1 + viewportOffset;
              },
              ease: "none",
            }
          );

        if (scrollContainerRef2.current) {
          gsap
            .timeline({
              scrollTrigger: {
                ...scrollTriggerBase,
                onRefresh: applyRow2Start,
              },
            })
            .fromTo(
              scrollContainerRef2.current,
              {
                x: () => {
                  const { finalOffset2, viewportOffset } = measure();
                  return -finalOffset2 + viewportOffset * 2;
                },
              },
              { x: () => measure().viewportOffset, ease: "none" }
            );
        }

        if (progressBarRef.current) {
          gsap.fromTo(
            progressBarRef.current,
            { width: "0%" },
            {
              width: "100%",
              ease: "none",
              scrollTrigger: scrollTriggerBase,
            }
          );
        }
      } else {
        const allCards = [...cardRefs.current, ...cardRefs2.current];
        allCards.forEach((card, index) => {
          if (!card) return;
          gsap.fromTo(
            card,
            { opacity: 0, x: index % 2 === 0 ? -200 : 200 },
            {
              opacity: 1,
              x: 0,
              duration: 1,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
                once: true,
              },
            }
          );
        });
      }
    }, container);

    refreshScrollTriggers();
    const delayedRefresh = [120, 450, 1200].map((ms) =>
      window.setTimeout(() => refreshScrollTriggers(), ms)
    );
    window.addEventListener("load", refreshScrollTriggers);

    let debounceId;
    const root = container.closest("main") || document.body;
    const observer = new ResizeObserver(() => {
      window.clearTimeout(debounceId);
      debounceId = window.setTimeout(() => refreshScrollTriggers(), 200);
    });
    observer.observe(root);

    return () => {
      delayedRefresh.forEach(window.clearTimeout);
      window.removeEventListener("load", refreshScrollTriggers);
      window.clearTimeout(debounceId);
      observer.disconnect();
      ctx.revert();
    };
  }, [
    cardRefs,
    cardRefs2,
    containerRef,
    isDesktop,
    maxScrollHeight,
    progressBarRef,
    scrollContainerRef,
    scrollContainerRef2,
  ]);
}

function FeatureCard({
  feature,
  cardRef,
  showTitle = true,
  showDescription = true,
  showCardImage = true,
  showOverlay = true,
  showLinks = true,
  linkStyle,
  cardRadiusClass = "rounded-[28px]",
  titleCss,
  descriptionCss,
}) {
  return (
    <div
      ref={cardRef}
      className="feature-card relative w-[85vw] shrink-0 sm:w-[340px] lg:w-[380px]"
    >
      <div
        className={cn(
          "relative aspect-[4/3] overflow-hidden",
          cardRadiusClass
        )}
      >
        {showCardImage ? (
          <img
            src={feature.image || FALLBACK_IMAGE}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        {showOverlay ? (
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
        ) : null}
        <div className="absolute right-6 bottom-6 left-6 text-white">
          {showTitle && feature.title ? (
            <h3
              className="text-[22px] leading-tight font-semibold tracking-tight lg:text-2xl"
              style={titleCss ? { color: titleCss } : undefined}
            >
              <LinkedText
                text={feature.title}
                parts={feature.titleParts}
                links={feature.links}
                style={linkStyle}
                enabled={showLinks}
              />
            </h3>
          ) : null}
          {showDescription && feature.description ? (
            <p
              className="mt-1.5 text-sm leading-snug text-white/80"
              style={descriptionCss ? { color: descriptionCss } : undefined}
            >
              <LinkedText
                text={feature.description}
                parts={feature.bodyParts}
                links={feature.links}
                style={linkStyle}
                enabled={showLinks}
              />
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/**
 * Lightswind ScrollCarousel — pinned dual-row horizontal scroll.
 * @see https://lightswind.com/components/scroll-carousel
 */
export const ScrollCarousel = forwardRef(function ScrollCarousel(
  {
    features = [],
    className,
    maxScrollHeight,
    showTitle = true,
    showDescription = true,
    showCardImage = true,
    showOverlay = true,
    showProgress = true,
    showDots = true,
    showLinks = true,
    linkStyle,
    cardRadiusClass = "rounded-[28px]",
    stageBgCss,
    dotsColorCss,
    titleCss,
    descriptionCss,
  },
  ref
) {
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const scrollContainerRef2 = useRef(null);
  const progressBarRef = useRef(null);
  const cardRefs = useRef([]);
  const cardRefs2 = useRef([]);
  const [isDesktop, setIsDesktop] = useState(false);
  const [features2] = useState(() =>
    [...features].sort(() => Math.random() - 0.5)
  );

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.matchMedia("(min-width: 768px)").matches);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  useFeatureAnimations(
    containerRef,
    scrollContainerRef,
    scrollContainerRef2,
    progressBarRef,
    cardRefs,
    cardRefs2,
    isDesktop,
    maxScrollHeight
  );

  const setPinnedRef = (node) => {
    containerRef.current = node;
    if (typeof ref === "function") {
      ref(node);
    } else if (ref) {
      ref.current = node;
    }
  };

  const renderFeatureCards = (featureSet, refs) =>
    featureSet.map((feature, index) => (
      <FeatureCard
        key={`${feature.title}-${index}`}
        feature={feature}
        showTitle={showTitle}
        showDescription={showDescription}
        showCardImage={showCardImage}
        showOverlay={showOverlay}
        showLinks={showLinks}
        linkStyle={linkStyle}
        cardRadiusClass={cardRadiusClass}
        titleCss={titleCss}
        descriptionCss={descriptionCss}
        cardRef={(el) => {
          if (el) refs.current[index] = el;
        }}
      />
    ));

  const dotsCss = dotsColorCss || "rgba(255,255,255,0.14)";

  return (
    <section
      ref={setPinnedRef}
      className={cn("relative isolate w-full", className)}
      style={{
        backgroundColor: stageBgCss || PIN_BACKGROUND.backgroundColor,
        backgroundImage: showDots
          ? `radial-gradient(circle, ${
              dotsColorCss
                ? `color-mix(in srgb, ${dotsColorCss} 14%, transparent)`
                : dotsCss
            } 1px, transparent 1.2px)`
          : "none",
        backgroundSize: showDots ? PIN_BACKGROUND.backgroundSize : undefined,
      }}
    >
      <div className="relative flex w-full flex-col justify-center gap-4 overflow-hidden py-16 md:h-screen md:gap-5 md:py-0 lg:[mask-image:linear-gradient(to_right,transparent_0%,black_8%,black_92%,transparent_100%)]">
        <div
          ref={scrollContainerRef}
          className="flex flex-col flex-nowrap items-center gap-4 px-6 md:flex-row md:px-0"
        >
          {renderFeatureCards(features, cardRefs)}
        </div>

        <div
          ref={scrollContainerRef2}
          className="hidden flex-nowrap items-center gap-4 px-6 md:flex md:flex-row md:px-0"
        >
          {renderFeatureCards(features2, cardRefs2)}
        </div>

        {isDesktop && showProgress ? (
          <div className="absolute bottom-8 left-1/2 h-1 w-40 -translate-x-1/2 overflow-hidden rounded-full bg-white/15">
            <div
              ref={progressBarRef}
              className="animated-water h-full rounded-full"
              style={{ width: "0%" }}
            />
          </div>
        ) : null}
      </div>

      <style>{`
        .animated-water {
          background: repeating-linear-gradient(
            -45deg,
            rgba(255, 255, 255, 0.9) 0%,
            rgba(255, 255, 255, 0.55) 25%,
            rgba(255, 255, 255, 0.9) 50%
          );
          background-size: 40px 40px;
          animation: scroll-carousel-wave 2s linear infinite;
        }
        @keyframes scroll-carousel-wave {
          from { background-position: 0 0; }
          to { background-position: 40px 40px; }
        }
      `}</style>
    </section>
  );
});

ScrollCarousel.displayName = "ScrollCarousel";

export default ScrollCarousel;
