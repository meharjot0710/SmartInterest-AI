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
  
    // Ensure the answers are in correct order
    const orderedAnswers = questions.map((_, index) => answers[index] || null); 
  
    const res = await fetch("http://127.0.0.1:5000/submit_answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, answers: orderedAnswers }), // Ensures correct order
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
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-bold">{subjects[currentSubjectIndex]} Test</h2>
      {questions.map((q, index) => (
        <div key={index} className="p-4 my-2">
          <p>{q.question}</p>
          {q.options.map((opt, optIndex) => (
            <label key={optIndex} className="block">
              <input
                type="radio"
                name={`q${index}`}
                value={opt}
                checked={answers[index] === opt}
                onChange={() => handleAnswerChange(index, opt)}
              />
              {opt}
            </label>
          ))}
        </div>
      ))}

      <div className="flex justify-between mt-4">
        {currentSubjectIndex > 0 && (
          <button onClick={() => setCurrentSubjectIndex(currentSubjectIndex - 1)}>Previous</button>
        )}
        {currentSubjectIndex < subjects.length - 1 ? (
          <button onClick={handleSubmit}>Next</button>
        ) : (
          <button onClick={handleSubmit}>Finish Test</button>
        )}
      </div>
    </div>
  );
};

export default Tests;
