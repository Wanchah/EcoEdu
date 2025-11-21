import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, BookOpen, Award, Flag, Camera } from "lucide-react";
import { Link } from "react-router-dom"; // for routing to reporting page

const LESSONS = [
  {
    id: 1,
    title: "Waste Sorting Basics",
    content: "Learn why separating plastics, organics, and recyclables reduces pollution.",
    task: "Sort your household waste for 7 days.",
    quiz: { q: "Which bin should organic waste go into?", options: ["Green", "Blue", "Yellow"], answer: "Green" }
  },
  {
    id: 2,
    title: "Water Hygiene & Safety",
    content: "Discover how clean water storage prevents disease and mosquito breeding.",
    task: "Cover all water containers at home.",
    quiz: { q: "Why should water containers be covered?", options: ["Prevent evaporation", "Prevent mosquito breeding", "Keep water cool"], answer: "Prevent mosquito breeding" }
  },
  {
    id: 3,
    title: "Urban Greening",
    content: "Planting trees improves air quality, reduces flooding, and provides shade.",
    task: "Plant one tree or start a recycled container garden.",
    quiz: { q: "Which of these is NOT a benefit of trees?", options: ["Shade", "Air quality", "Plastic recycling"], answer: "Plastic recycling" }
  },
  {
    id: 4,
    title: "Safe Waste Disposal",
    content: "Burning plastics releases toxic fumes. Learn safe disposal methods.",
    task: "Identify one safe disposal site in your community.",
    quiz: { q: "What toxic gas is released when burning plastics?", options: ["CO2", "Dioxins", "Methane"], answer: "Dioxins" }
  },
  {
    id: 5,
    title: "Community Clean-Ups",
    content: "Organizing clean-ups builds pride and keeps neighborhoods healthy.",
    task: "Join or organize a clean-up this week.",
    quiz: { q: "What is the main benefit of community clean-ups?", options: ["Fun", "Health & sanitation", "Competition"], answer: "Health & sanitation" }
  },
  {
    id: 6,
    title: "Recycling & Reuse",
    content: "Repurpose plastics, bottles, and cans to reduce waste.",
    task: "Create one reusable item (e.g., planter from a bottle).",
    quiz: { q: "Which material is easiest to recycle?", options: ["Plastic", "Glass", "Organic waste"], answer: "Glass" }
  },
  {
    id: 7,
    title: "Energy Conservation",
    content: "Saving energy reduces costs and pollution.",
    task: "Switch off unused lights and appliances for a week.",
    quiz: { q: "Which bulb type saves the most energy?", options: ["Incandescent", "LED", "Halogen"], answer: "LED" }
  },
  {
    id: 8,
    title: "Water Conservation",
    content: "Learn how to save water in daily routines.",
    task: "Track how many liters you save by turning off taps.",
    quiz: { q: "How many seconds should you wash your hands?", options: ["5", "20", "60"], answer: "20" }
  },
  {
    id: 9,
    title: "Community Reporting",
    content: "Use the app’s map to report sanitation issues.",
    task: "Submit one report through the app.",
    quiz: { q: "What’s the most important detail in a sanitation report?", options: ["Location", "Color", "Weather"], answer: "Location" }
  },
  {
    id: 10,
    title: "Climate Awareness",
    content: "Understand how local actions contribute to global climate change.",
    task: "Share one eco-tip with your community.",
    quiz: { q: "Which gas is the main driver of climate change?", options: ["Oxygen", "Carbon dioxide", "Nitrogen"], answer: "Carbon dioxide" }
  }
];

const TIPS = [
  "♻️ Recycling one plastic bottle saves energy for 3 hours of light.",
  "🚰 Covering water containers prevents mosquito breeding.",
  "🌱 Planting trees reduces flooding risks and improves air quality.",
  "🗑️ Report illegal dumping to keep your community safe.",
  "💡 Switching to LED bulbs saves up to 80% energy.",
  "🌍 Always carry a reusable bag to reduce plastic waste.",
  "🌿 Composting food scraps reduces landfill waste and produces natural fertilizer.",
  "🚴 Walking or biking instead of driving reduces air pollution.",
  "💧 Fixing leaking taps can save thousands of liters of water a year.",
  "🔥 Avoid burning trash — it releases toxic fumes harmful to your lungs.",
  "📦 Reuse cardboard boxes for storage instead of throwing them away.",
  "🍃 Composting food scraps creates natural fertilizer and reduces landfill waste.",
  "🚿 Short showers save water — aim for under 5 minutes.",
  "🔌 Unplug chargers when not in use to avoid phantom energy drain.",
  "🥤 Carry a reusable water bottle to cut down on single‑use plastics.",
  "🛍️ Use cloth bags instead of plastic when shopping.",
  "🌞 Dry clothes in the sun instead of using electric dryers.",
  "🐝 Plant flowers to support bees and pollinators in your community.",
  "📢 Share one eco‑tip with friends each week to spread awareness."
];

export default function LearningHub({ userId }) {
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [progress, setProgress] = useState({});
  const [tipIndex, setTipIndex] = useState(0);

  // 🔹 Fetch progress from backend when component mounts
useEffect(() => {
  const fetchProgress = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch("http://localhost:5000/api/progress", {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      if (!res.ok) throw new Error("Failed to fetch progress");
      const data = await res.json();
      if (data?.progress) {
        setProgress(data.progress);
      }
    } catch (err) {
      console.error("Error fetching progress:", err);
    }
  };
  fetchProgress();
}, []);

  // 🔹 Save progress to backend when a lesson is completed
const markLessonComplete = async (id) => {
  const newProgress = { ...progress, [id]: true };
  setProgress(newProgress);

  try {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    const res = await fetch("http://localhost:5000/api/progress", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ progress: newProgress })
    });
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to save progress");
    }
    const data = await res.json();
    console.log("✅ Saved progress:", data);
  } catch (err) {
    console.error("❌ Error saving progress:", err);
  }
};

  const openLesson = (lesson) => {
    setSelectedLesson(lesson);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6">
      <header className="flex justify-between items-center mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-green-800 flex items-center gap-2"
        >
          <BookOpen className="w-7 h-7" />
          Community Learning Hub
        </motion.h1>
      </header>

      {/* Progress Bar */}
      <div className="mb-6">
        <h3 className="text-green-700 font-semibold mb-2">
          Overall Progress: {Object.keys(progress).length}/{LESSONS.length} lessons
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              (Object.keys(progress).length / LESSONS.length) * 100 < 30
                ? "bg-red-500"
                : (Object.keys(progress).length / LESSONS.length) * 100 < 70
                ? "bg-yellow-400"
                : "bg-green-600"
            }`}
            style={{ width: `${(Object.keys(progress).length / LESSONS.length) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Awareness Banner */}
      <div className="mb-6 p-4 rounded-2xl bg-green-100 border">
        <strong>Eco Tip:</strong>
        <p>{TIPS[tipIndex]}</p>
        <button
          onClick={() => setTipIndex((tipIndex + 1) % TIPS.length)}
          className="mt-2 px-3 py-1 bg-green-600 text-white rounded-lg"
        >
          Next Tip
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Sidebar Lessons */}
        <aside className="md:col-span-1 space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-green-100"
          >
            <h2 className="font-bold text-green-700 text-lg mb-2">Lessons</h2>
            <div className="space-y-3">
              {LESSONS.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => openLesson(lesson)}
                  className="w-full text-left p-3 rounded-xl bg-white hover:bg-green-50 transition shadow-sm flex justify-between items-center border"
                >
                  <span className="font-medium text-gray-700">{lesson.title}</span>
                  {progress[lesson.id] ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <CheckCircle className="w-5 h-5 text-gray-300" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Achievements */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white/70 backdrop-blur-md p-5 rounded-2xl shadow-lg border border-green-100"
          >
            <h3 className="font-bold text-green-700 text-lg mb-3 flex items-center gap-2">
              <Award className="w-5 h-5" /> Achievements
            </h3>
            <div className="text-gray-600 text-sm">
              {Object.keys(progress).length === 0 && "No badges earned yet."}
              {Object.keys(progress).length >= 1 && <p>🏅 Starter Badge</p>}
              {Object.keys(progress).length >= 5 && <p>🌟 Eco Learner Badge</p>}
              {Object.keys(progress).length === LESSONS.length && <p>🌱 Eco Champion Badge</p>}
            </div>
          </motion.div>
        </aside>

        {/* Lesson Content */}
        <main className="md:col-span-2">
          {!selectedLesson && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-green-200"
            >
              <h2 className="text-2xl font-bold text-green-700 mb-3">Welcome!</h2>
              <p className="text-gray-600">
                Choose a lesson to begin learning about protecting your environment and improving your community.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {LESSONS.map((lesson) => (
                  <motion.div
                    key={lesson.id}
                    whileHover={{ scale: 1.03 }}
                    className="p-4 rounded-2xl shadow-sm bg-white border hover:shadow-md cursor-pointer"
                    onClick={() => openLesson(lesson)}
                  >
                    <div className="font-semibold text-green-700">{lesson.title}</div>
                    <p className="text-xs text-gray-500 mt-1">{lesson.content}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {selectedLesson && (
            <LessonCard lesson={selectedLesson} markLessonComplete={markLessonComplete} />
          )}
        </main>
      </div>
    </div>
  );
}
function LessonCard({ lesson, markLessonComplete }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [taskDone, setTaskDone] = useState(false);
  const [quizPassed, setQuizPassed] = useState(false);
  const [lessonComplete, setLessonComplete] = useState(false);

  // Reset states when a new lesson is opened
  useEffect(() => {
    setSelectedAnswer(null);
    setTaskDone(false);
    setQuizPassed(false);
    setLessonComplete(false);
  }, [lesson.id]);

  // Mark lesson complete only once when both task and quiz are done
  useEffect(() => {
    if (taskDone && quizPassed && !lessonComplete) {
      setLessonComplete(true);
      markLessonComplete(lesson.id);
    }
  }, [taskDone, quizPassed, lessonComplete, lesson.id, markLessonComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl p-8 rounded-3xl shadow-xl border border-green-200"
    >
      {/* Lesson Title */}
      <h2 className="text-2xl font-bold text-green-700 flex items-center gap-2">
        <Flag className="w-6 h-6" />
        {lesson.title}
      </h2>

      <p className="mt-2 text-gray-700 leading-relaxed">{lesson.content}</p>

      {/* Task Section */}
      <div className="mt-6 p-5 rounded-2xl bg-green-50 border">
        <h3 className="font-semibold text-green-700 mb-2">Your Task</h3>
        <p className="text-gray-700 text-sm">{lesson.task}</p>
        {!taskDone ? (
          <button
            onClick={() => setTaskDone(true)}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-xl shadow hover:bg-green-700"
          >
            Mark Task Done
          </button>
        ) : (
          <p className="text-green-700 mt-2 text-sm font-semibold">
            ✔ Task completed successfully!
          </p>
        )}
      </div>

      {/* Quiz Section */}
      <div className="mt-6 p-5 rounded-2xl bg-blue-50 border">
        <h3 className="font-semibold text-blue-700 mb-2">Quick Quiz</h3>
        <p className="text-sm text-gray-700 mb-3">{lesson.quiz.q}</p>

        {lesson.quiz.options.map((opt) => (
          <label
            key={opt}
            className={`flex items-center p-2 mb-2 rounded-xl border cursor-pointer ${
              selectedAnswer === opt ? "bg-blue-100" : "bg-white"
            }`}
          >
            <input
              type="radio"
              name={`quiz-${lesson.id}`}
              className="mr-2"
              onChange={() => setSelectedAnswer(opt)}
            />
            {opt}
          </label>
        ))}

        {!quizPassed ? (
          <button
            onClick={() => setQuizPassed(selectedAnswer === lesson.quiz.answer)}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700"
          >
            Submit Answer
          </button>
        ) : (
          <p className="text-blue-700 mt-2 text-sm font-semibold">
            🎉 Congratulations! You passed the quiz!
          </p>
        )}
      </div>

      {/* Report Section */}
      <div className="mt-6 p-5 rounded-2xl border bg-white/70">
        <h3 className="font-semibold text-gray-800 mb-2">Report an Issue</h3>
        <p className="text-sm text-gray-600 mb-3">
          Spotted pollution while completing your task? Report it instantly.
        </p>

        <Link
          to="/report"
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl shadow hover:bg-red-700"
        >
          <Camera className="w-5 h-5" /> Go to Reporting Page
        </Link>
      </div>

      {/* Completion Badge */}
      {lessonComplete && (
        <div className="mt-6 p-4 bg-green-100 border rounded-xl text-green-700 font-semibold">
          🌟 Lesson Completed!
        </div>
      )}
    </motion.div>
  );
}