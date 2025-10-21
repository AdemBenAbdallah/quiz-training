"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import CompletionModal from "@/components/CompletionModal";

/**
 * Example usage of the CompletionModal component
 * This shows how to implement the modal when a user completes a quiz level
 */
export default function CompletionModalExample() {
  const [showModal, setShowModal] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);

  const simulateQuizCompletion = (level: number) => {
    setCurrentLevel(level);
    setShowModal(true);
  };

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-2xl font-bold mb-4">CompletionModal Examples</h2>

      <div className="space-y-2">
        <p className="text-sm text-gray-600 mb-4">
          Click the buttons below to simulate completing different quiz levels:
        </p>

        {[1, 2, 3, 4, 5].map((level) => (
          <Button
            key={level}
            onClick={() => simulateQuizCompletion(level)}
            variant="outline"
            className="mr-2 mb-2"
          >
            Complete Level {level}
          </Button>
        ))}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold mb-2">Usage in your component:</h3>
        <pre className="text-sm bg-white p-3 rounded border overflow-x-auto">
{`import CompletionModal from "@/components/CompletionModal";
import { useState } from "react";

function YourComponent() {
  const [showModal, setShowModal] = useState(false);
  const [level, setLevel] = useState(1);

  const handleQuizComplete = async (levelNumber) => {
    // Your quiz completion logic here
    // ...

    // Show the completion modal
    setLevel(levelNumber);
    setShowModal(true);
  };

  return (
    <div>
      {/* Your quiz content */}

      <CompletionModal
        isOpen={showModal}
        onCloseAction={() => setShowModal(false)}
        level={level}
      />
    </div>
  );
}`}
        </pre>
      </div>

      <CompletionModal
        isOpen={showModal}
        onCloseAction={() => setShowModal(false)}
        level={currentLevel}
      />
    </div>
  );
}
