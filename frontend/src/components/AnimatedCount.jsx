import React, { useEffect, useRef, useState } from "react";

const AnimatedCount = ({ totalUsers }) => {
  const [currentCount, setCurrentCount] = useState(0);
  const spanRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animateCount(0, totalUsers, 2000); // 2 seconds
        }
      },
      { threshold: 0.5 } // Half visible
    );

    if (spanRef.current) {
      observer.observe(spanRef.current);
    }

    return () => {
      if (spanRef.current) observer.unobserve(spanRef.current);
    };
  }, [totalUsers]);

  // Easing function: easeInOutQuad
  const easeInOutQuad = (t) => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  };

  const animateCount = (start, end, duration) => {
    let startTime = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = easeInOutQuad(progress);
      const value = Math.floor(easedProgress * (end - start) + start);

      setCurrentCount(value);
      if (progress < 1) requestAnimationFrame(step);
    };

    requestAnimationFrame(step);
  };

  return (
    <span
      ref={spanRef}
      className="ml-2 text-9xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
    >
      {currentCount}
    </span>
  );
};

export default AnimatedCount;
