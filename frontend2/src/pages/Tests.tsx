import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Tests = () => {
  const subjects = ["Operating System", "DSA", "Frontend", "Backend", "Machine Learning", "Data Analytics"];
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchQuestions();
  }, [currentSubjectIndex]);

  const fetchQuestions = async () => {
    try {
      const subject = subjects[currentSubjectIndex];
      const res = await fetch(`http://127.0.0.1:5000/get_questions?subject=${subject}`);
      if (!res.ok) throw new Error("Failed to fetch questions");
      const data = await res.json();
      setQuestions(data.questions);
      setAnswers({});
    } catch (error) {
      console.error("Error fetching questions:", error);
    }
  };

  const handleAnswerChange = (qIndex, answer) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: answer }));
  };

  const handleSubmit = async () => {
    const subject = subjects[currentSubjectIndex];
    const orderedAnswers = questions.map((_, index) => answers[index] || null);

    const res = await fetch("http://127.0.0.1:5000/submit_answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, answers: orderedAnswers }),
    });

    const data = await res.json();
    const updatedScores = { ...scores, [subject]: data.score };
    setScores(updatedScores);

    if (currentSubjectIndex < subjects.length - 1) {
      setCurrentSubjectIndex(currentSubjectIndex + 1);
    } else {
      navigate("/predict", { state: { scores: updatedScores } });
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto m-10 bg-[#272935] shadow-md rounded-lg">
      <h2 className="text-4xl uppercase underline font-semibold mb-6 text-center text-white">
        {subjects[currentSubjectIndex]} Test
      </h2>

      {questions.map((q, index) => (
        <div key={index} className="mb-6 p-4 border rounded-lg bg-[#272935] hover:bg-[#393c4e] shadow-sm">
          <p className="font-medium text-white mb-3">{index + 1}. {q.question}</p>
          <div className="space-y-2">
            {q.options.map((opt, optIndex) => (
              <label key={optIndex} className="flex items-center gap-2 text-white">
                <input
                  type="radio"
                  name={`q${index}`}
                  value={opt}
                  checked={answers[index] === opt}
                  onChange={() => handleAnswerChange(index, opt)}
                  className="accent-blue-500"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="flex justify-between mt-8">
        {currentSubjectIndex > 0 && (
          <button
            onClick={() => setCurrentSubjectIndex(currentSubjectIndex - 1)}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded"
          >
            Previous
          </button>
        )}
        <button
          onClick={handleSubmit}
          className="bg-white text-black font-semibold py-2 px-6 rounded ml-auto border border-transparent hover:bg-transparent hover:border-white hover:text-white transition-all duration-100"
        >
          {currentSubjectIndex < subjects.length - 1 ? "Next" : "Finish Test"}
        </button>
      </div>
    </div>
  );
};

export default Tests;
