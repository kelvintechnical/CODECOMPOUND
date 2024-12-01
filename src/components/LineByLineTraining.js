import React, { useState, useEffect } from "react";
import WelcomeModal from "./WelcomeModal"; // Import your modal component

const LineByLineTraining = () => {
  const MILESTONES = [25, 50, 75, 100]; // Milestone percentages
  const [codeExplanation, setCodeExplanation] = useState("");
  const [projectCode, setProjectCode] = useState([]);
  const [userCode, setUserCode] = useState("");
  const [feedback, setFeedback] = useState("");
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showInstruction, setShowInstruction] = useState(true);
  const [showExplanation, setShowExplanation] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [progress, setProgress] = useState(0);

  // List of code snippets and explanations
  const codeLines = [
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

  // Initialize progress and milestones
  useEffect(() => {
    setCurrentLineIndex(0);
  }, []);

  // Update progress based on currentLineIndex
  useEffect(() => {
    const currentProgress = (currentLineIndex / codeLines.length) * 100;
    setProgress(currentProgress);

    // Update reached milestones
    const reachedMilesstones = MILESTONES.filter(
      (milestone) => currentProgress >= milestone
    );
    setMilestones(reachedMilesstones);
  }, [currentLineIndex, codeLines.length]);

  // Current line and explanation
  const currentCode = codeLines[currentLineIndex]?.code;
  const currentExplanation = codeLines[currentLineIndex]?.explanation;

  // Check user input against the current line
  const checkCode = () => {
    const normalizedUserCode = userCode
      .trim()
      .replace(/\s+/g, " ")
      .replace(/"/g, "'");
    const normalizedExpectedCode = currentCode
      .trim()
      .replace(/\s+/g, " ")
      .replace(/"/g, "'");

    if (normalizedUserCode === normalizedExpectedCode) {
      setFeedback("✅ Correct! Great job!");
      setCodeExplanation(currentExplanation);
      setProjectCode((prev) => [...prev, normalizedUserCode]);
      setUserCode("");

      setShowInstruction(false);
      setTimeout(() => setShowExplanation(true), 2000);
      setTimeout(() => {
        setCurrentLineIndex((prevIndex) => prevIndex + 1);
        setShowExplanation(false);
        setShowInstruction(true);
      }, 6000);
    } else {
      setFeedback("❌ Incorrect. Try again!");
      setCodeExplanation("");
      setShowExplanation(false);
    }
  };

  // Copy code to clipboard
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
        {/* Render the WelcomeModal */}
        <WelcomeModal />
      </div>

      {/* **************Progress Bar**************8 */}
      <div className="w-full max-w-lg h-4 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <p className="text-center text-sm text-gray-700 mt-1">
        Progress: {Math.round(progress)}%
      </p>

      {/* **************Progress Bar**************8 */}

      {/** ******************Milestone div ****************8 */}
      <div className="mt-4">
        <h2 className="text-lg font-bold">Milestones Reached</h2>
        {progress > 0 ? ( //should display milestones if progress > 0
          <ul className="list-none ml-6">
            {milestones.map((milestone, index) => (
              <li key={index} className="text-green-600">
                {milestone}% Complete
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">
            Start progressing to unlock milestones!
          </p>
        )}
      </div>
      {/** ******************Milestone div ****************8 */}

      <h1 className="text-3xl font-bold text-center mb-6">CodeCompound</h1>

      {/* Instruction and code to type */}
      {showInstruction && (
        <code className="bg-gray-100 p-4 rounded block mt-2">
          {currentCode}
        </code>
      )}

      {/* Code editor */}
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

      {/* Feedback */}
      <p className="mt-4 text-lg font-medium">
        {feedback.includes("✅") ? (
          <span className="text-green-600">{feedback}</span>
        ) : (
          <span className="text-red-600">{feedback}</span>
        )}
      </p>

      {/* Explanation */}
      {showExplanation && (
        <div className="bg-gray-100 p-4 rounded-lg shadow-lg mt-4">
          <h3 className="text-lg font-bold">Explanation</h3>
          <p>{codeExplanation}</p>
        </div>
      )}

      {/* Project code */}
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
