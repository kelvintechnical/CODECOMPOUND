import React, { useState, useEffect } from "react"; //import React and hooks

const WelcomeModal = () => {
  //Define the WelcomeModel component

  const [showModal, setShowModal] = useState(true); // State to control modal visability (Boolean)
  const [displayedText, setDisplayText] = useState(""); //state for the text being displayed
  const [countdown, setCountdown] = useState(3); // State to control countdown value of countdown timer
  // (3) initializes the countdown with a value of 3, starting the countdown from 3 seconds
  const fullText =
    "Hello, Welcome to Code Compound. Created by Kelvin R. Tobias. Are you ready to learn?";

  useEffect(() => {
    //useEffect hook to handle countdown logic
    //handling the typewriter effect first
    if (displayedText.length < fullText.length) {
      const timer = setInterval(() => {
        setDisplayText((prevText) => prevText + fullText[prevText.length]);
      }, 30); //Delay of 70ms per character
      return () => clearInterval(timer); //clean up interval on component unmount
    } else {
      //once text is fully displayed, start countdown
      const countdownTimer = setInterval(() => {
        if (countdown > 0) {
          setCountdown((prevCountdown) => prevCountdown - 1);
        } else {
          setShowModal(false); // Hide modal once countdown reaches 0
        }
      }, 1000); //Update countdown every second
      return () => clearInterval(countdownTimer);
      //clean up the timer when the component unmounts
    }
  }, [displayedText, countdown]);

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            {" "}
            {/**Modal container *  */}
            <h2 className="text-2x1 font-bold text-center">
              Welcome to CodeCompound!
            </h2>
            <p className="mt-4 text-center">{displayedText}</p>
            <div className="text-center mt-4 text-xl font-semibold">
              Now, lets get started in {countdown}
            </div>{" "}
            {/**Displays countdown */}
          </div>
        </div>
      )}
    </>
  );
};

export default WelcomeModal;
