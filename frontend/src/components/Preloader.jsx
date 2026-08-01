import React, { useState, useEffect } from 'react';

const Preloader = () => {
  const [step, setStep] = useState(0);
  const [currentTestCase, setCurrentTestCase] = useState(1);

  useEffect(() => {
    if (step < 3) {
      const timer = setTimeout(() => {
        setStep((prev) => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (currentTestCase < 6) {
      const testCaseTimer = setTimeout(() => {
        setCurrentTestCase((prev) => prev + 1);
      }, 1000);
      return () => clearTimeout(testCaseTimer);
    }
  }, [step, currentTestCase]);

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50">
      <div className="w-11/12 max-w-xl bg-[#0d1117] p-6 rounded-xl font-mono text-sm shadow-2xl border border-gray-700">

        {/* Step 0 */}
        {step >= 0 && currentTestCase < 6 && (
          <p className="text-gray-300 mt-1 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-gray-300">
            Compiling source code...
          </p>
        )}

        {/* Step 1 */}
        {step >= 1 && currentTestCase < 6 && (
          <p className="text-gray-300 mt-2 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-gray-300">
            Compiled successfully
          </p>
        )}

        {/* Step 2 */}
        {step >= 2 && currentTestCase < 6 && (
          <p className="text-gray-300 mt-2 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-gray-300">
            Running hidden test cases...
          </p>
        )}

        {/* Step 3+ */}
        {step >= 3 && currentTestCase < 6 && (
          <p className="text-gray-300 mt-2 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-gray-300">
            Running on test case {currentTestCase}
          </p>
        )}

        {/* Final Step */}
        {step === 3 && currentTestCase === 6 && (
          <p className="text-green-400 mt-2 animate-typing overflow-hidden whitespace-nowrap border-r-4 border-green-400">
            Accepted...
          </p>
        )}
      </div>
    </div>
  );
};

export default Preloader;
