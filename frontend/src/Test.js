import React, { useState, useEffect } from "react"; 

const TestInterface = () => {
  const subjects = ["Operating System", "DSA", "Frontend", "Backend", "Machine Learning", "Data Analytics"];
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [scores, setScores] = useState({});  

  useEffect(() => {
    fetchQuestions();
  }, [currentSubjectIndex]);

  const fetchQuestions = async () => {
    const subject = subjects[currentSubjectIndex];
    const res = await fetch(`http://127.0.0.1:5000/get_questions?subject=${subject}`);
    const data = await res.json();
    setQuestions(data.questions);
    setAnswers({}); // ✅ Clear selected answers when switching subjects
  };

  const handleAnswerChange = (qIndex, answer) => {3
    setAnswers((prev) => ({ ...prev, [qIndex]: answer }));
  };

  const handleSubmit = async () => {
    const subject = subjects[currentSubjectIndex];
    const res = await fetch("https://smartinterest-ai.onrender.com/submit_answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, answers: Object.values(answers) }),
    });
    const data = await res.json();

    setScores((prev) => ({
      ...prev,
      [subject]: data.score,
    }));

    // ✅ Move to the next subject and reset answers
    if (currentSubjectIndex < subjects.length - 1) {
      setCurrentSubjectIndex(currentSubjectIndex + 1);
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
                checked={answers[index] === opt} // ✅ Make sure answers clear when subject changes
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
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-bold">Scores:</h3>
        {subjects.map((subject) => (
          <p key={subject}>
            {subject}: {scores[subject] !== undefined ? scores[subject] : "Not attempted"}
          </p>
        ))}
      </div>
    </div>
  );
};

export default TestInterface;
