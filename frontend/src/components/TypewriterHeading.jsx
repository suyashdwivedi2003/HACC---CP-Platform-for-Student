import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const quotes = [
  "Code is like poetry.",
  "Eat. Sleep. Code. Repeat.",
  "Think twice, code once.",
  "In code we trust.",
  "Less talk, more code.",
  "Keep calm and code.",
];

const TypewriterHeading = () => {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const quote = quotes[quoteIndex];
    if (charIndex < quote.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + quote[charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 80);
      return () => clearTimeout(timeout);
    } else {
      const pause = setTimeout(() => {
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setDisplayedText("");
        setCharIndex(0);
      }, 2500);
      return () => clearTimeout(pause);
    }
  }, [charIndex, quoteIndex]);

  return (
    <motion.h1
      className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 text-center mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {displayedText}
      <span className="border-r-2 border-blue-400 animate-pulse ml-1" />
    </motion.h1>
  );
};

export default TypewriterHeading;
