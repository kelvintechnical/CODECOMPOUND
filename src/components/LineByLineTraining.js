import React, { useState, useEffect, useMemo } from "react";
import WelcomeModal from "./WelcomeModal";

const LineByLineTraining = () => {
  const MILESTONES = useMemo(() => [25, 50, 75, 100], []);

  const initialCodeLines = [
    {
      code: "console.log('Hello, World!');",
      explanation:
        "This logs 'Hello, World!' to the console, a common first program.",
    },
    {
      code: "const x = 10;",
      explanation:
        "This creates a constant variable 'x' and assigns it the value 10.",
    },
    {
      code: "let y = 20;",
      explanation:
        "This creates a variable 'y' and assigns it the value 20. The value can be reassigned.",
    },
    {
      code: "function greet() { console.log('Hello!'); }",
      explanation:
        "This defines a function 'greet' that logs 'Hello!' to the console.",
    },
    {
      code: "const sum = (a, b) => a + b;",
      explanation:
        "This defines an arrow function 'sum' that adds two numbers 'a' and 'b'.",
    },
  ];

  const javascriptCodeLines = [
    {
      code: "let numbers = [1, 2, 3, 4, 5];",
      explanation: "Creates an array of numbers in JavaScript",
    },
    {
      code: "const doubled = numbers.map(num => num * 2);",
      explanation: "Uses map to create a new array with each number doubled",
    },
    {
      code: "const sum = numbers.reduce((acc, curr) => acc + curr, 0);",
      explanation: "Uses reduce to sum all numbers in the array",
    },
    {
      code: "const evens = numbers.filter(num => num % 2 === 0);",
      explanation: "Filters the array to keep only even numbers",
    },
    {
      code: "console.log('The sum is ' + sum);",
      explanation: "Uses template literals to print the sum",
    },
  ];

  const pythonCodeLines = [
    {
      code: "numbers = [1, 2, 3, 4, 5]",
      explanation: "Creates a list of numbers in Python",
    },
    {
      code: "doubled = [num * 2 for num in numbers]",
      explanation:
        "Uses list comprehension to create a new list with each number doubled",
    },
    {
      code: "total = sum(numbers)",
      explanation: "Uses the sum() function to add all numbers in the list",
    },
    {
      code: "evens = [num for num in numbers if num % 2 == 0]",
      explanation: "List comprehension to filter even numbers",
    },
    {
      code: "print(f'The sum is {total}')",
      explanation: "Uses f-string to print the sum",
    },
  ];

  const [codeLines, setCodeLines] = useState(initialCodeLines);
  const [codeExplanation, setCodeExplanation] = useState("");
  const [projectCode, setProjectCode] = useState([]);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [progress, setProgress] = useState(0);
  const [isFirstSetComplete, setIsFirstSetComplete] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [completedLanguages, setCompletedLanguages] = useState([]);

  useEffect(() => {
    setCurrentLineIndex(0);
  }, []);

  useEffect(() => {
    const currentProgress = (currentLineIndex / codeLines.length) * 100;
    setProgress(currentProgress);

    const reachedMilestones = MILESTONES.filter(
      (milestone) => currentProgress >= milestone
    );
    setMilestones(reachedMilestones);
  }, [currentLineIndex, codeLines.length, MILESTONES]);

  useEffect(() => {
    if (selectedLanguage) {
      setCurrentLineIndex(0);
      setProjectCode([]);
      setProgress(0);
      if (selectedLanguage === "javascript") {
        setCodeLines(javascriptCodeLines);
      } else {
        setCodeLines(pythonCodeLines);
      }
    }
  }, [selectedLanguage, javascriptCodeLines, pythonCodeLines]);

  const handleLanguageCompletion = () => {
    setCompletedLanguages((prev) => [...prev, selectedLanguage]);

    if (
      selectedLanguage === "javascript" &&
      !completedLanguages.includes("python")
    ) {
      setSelectedLanguage("python");
    } else if (
      selectedLanguage === "python" &&
      !completedLanguages.includes("javascript")
    ) {
      setSelectedLanguage("javascript");
    } else {
      setSelectedLanguage(null);
    }

    setCurrentLineIndex(0);
    setProgress(0);
    setProjectCode([]);
  };

  const currentCode = codeLines[currentLineIndex]?.code;
  const currentExplanation = codeLines[currentLineIndex]?.explanation;

  const checkCode = () => {
    // More precise normalization for arrow functions
    const normalizeCode = (code) => {
      return (
        code
          .trim()
          // Normalize spaces around arrow
          .replace(/\s*=>\s*/g, " => ")
          // Normalize spaces around parentheses
          .replace(/\(\s*/g, "(")
          .replace(/\s*\)/g, ")")
          // Normalize spaces around operators
          .replace(/\s*\+\s*/g, " + ")
          // Normalize multiple spaces and ensure semicolon
          .replace(/\s+/g, " ")
          .replace(/;?\s*$/, ";")
          // Normalize quotes
          .replace(/"/g, "'")
      );
    };

    const normalizedUserCode = normalizeCode(userCode);
    const normalizedExpectedCode = normalizeCode(currentCode);

    console.log("User code:", normalizedUserCode);
    console.log("Expected code:", normalizedExpectedCode);
    console.log("Current line index:", currentLineIndex);
    console.log("Total lines:", codeLines.length);

    if (normalizedUserCode === normalizedExpectedCode) {
      setFeedback("✅ Correct! Great job!");
      setCodeExplanation(currentExplanation);
      setProjectCode((prev) => [...prev, normalizedUserCode]);
      setUserCode("");

      setShowInstruction(false);
      setTimeout(() => setShowExplanation(true), 2000);
      setTimeout(() => {
        // Calculate if this was the last line of the first set
        const isLastLine = currentLineIndex === codeLines.length - 1;
        const completingFirstSet = !selectedLanguage && isLastLine;

        if (completingFirstSet) {
          setIsFirstSetComplete(true);
          setProgress(100); // Ensure progress is set to 100%
        } else if (isLastLine && selectedLanguage) {
          handleLanguageCompletion();
        } else {
          setCurrentLineIndex((prevIndex) => prevIndex + 1);
        }
        setShowExplanation(false);
        setShowInstruction(true);
      }, 6000);
    } else {
      setFeedback(
        "❌ Incorrect. Try again! Make sure you've typed it exactly as shown, including spaces and semicolons."
      );
      setCodeExplanation("");
      setShowExplanation(false);
    }
  };

  const copyToClipboard = () => {
    const codeText = projectCode.join("\n");
    navigator.clipboard
      .writeText(codeText)
      .then(() => setFeedback("✅ Code copied to clipboard!"))
      .catch(() => setFeedback("❌ Failed to copy. Try again."));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 mt-2">
      <div>
        <WelcomeModal />
      </div>

      <div className="w-full max-w-lg h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center text-sm text-gray-700 mt-1">
        Progress: {Math.round(progress)}%
      </p>

      {progress >= 25 && (
        <div className="mt-4">
          <h2 className="text-lg font-bold">Current Milestone</h2>
          <div className="text-green-600">
            {milestones.length > 0 &&
              `${milestones[milestones.length - 1]}% Complete`}
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-6">CodeCompound</h1>

      {isFirstSetComplete && !selectedLanguage && progress >= 100 && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg mb-6">
          <h2 className="text-xl font-bold mb-4 text-center">
            Choose Your Path
          </h2>
          <p className="text-gray-600 mb-4 text-center">
            Congratulations on completing the basics! Select a programming
            language to continue your journey:
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setSelectedLanguage("javascript")}
              className="px-6 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition duration-200"
            >
              JavaScript
            </button>
            <button
              onClick={() => setSelectedLanguage("python")}
              className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-200"
            >
              Python
            </button>
          </div>
        </div>
      )}

      {showInstruction && (
        <code className="bg-gray-100 p-4 rounded block mt-2">
          {currentCode}
        </code>
      )}

      <p className="mt-4 text-lg font-medium">
        {feedback.includes("✅") ? (
          <span className="text-green-600">{feedback}</span>
        ) : (
          <span className="text-red-600">{feedback}</span>
        )}
      </p>

      {(!isFirstSetComplete || selectedLanguage) && (
        <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg">
          <textarea
            className="w-full h-40 p-4 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                checkCode();
              }
            }}
            placeholder="Type your code here"
          ></textarea>
          <button
            className="bg-blue-500 text-white font-semibold px-6 py-2 rounded-lg shadow hover:bg-blue-700 mt-4"
            onClick={checkCode}
          >
            Check Code
          </button>
        </div>
      )}

      {showExplanation && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg mt-4">
          <h3 className="text-lg font-bold">Explanation</h3>
          <p>{codeExplanation}</p>
        </div>
      )}

      <div className="w-96 max-w-2x1 bg-gray-800 text-white p-6 rounded-lg shadow-lg mt-6">
        <h3 className="text-lg font-bold">project.js</h3>
        <pre>{projectCode.join("\n")}</pre>
        <button
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-lg"
          onClick={copyToClipboard}
        >
          Copy to Clipboard
        </button>
      </div>
    </div>
  );
};

export default LineByLineTraining;
