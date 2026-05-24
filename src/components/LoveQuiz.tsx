import { useState } from "react";
import { Sparkles, Trophy, ArrowRight, RotateCcw, Heart, AlertCircle, CheckCircle2 } from "lucide-react";
import { QuizQuestion } from "../types";
import { motion, AnimatePresence } from "motion/react";

export default function LoveQuiz() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  // Cute customizable love trivia trivia set
  const initialQuestions: QuizQuestion[] = [
    {
      id: "q1",
      question: "What is my absolute favorite nickname to call you when you're being super adorable?",
      options: ["Princess / Queen", "My Little Strawberry", "Sweet Pea", "Bubblebutt 🌸"],
      correctIndex: 1,
      explanation: "Yes! There's nothing sweeter than calling you 'My Little Strawberry' and watching you smile!"
    },
    {
      id: "q2",
      question: "Where did we share our very first official warm hug together?",
      options: ["Under the rain at the bus stop", "By the cozy corner table in the library", "Under the big pine tree at the park", "Right in front of my front porch"],
      correctIndex: 2,
      explanation: "Absolutely! The wind was so breezy, but holding you tight under that pine tree made the whole world completely warm."
    },
    {
      id: "q3",
      question: "What is your biggest cute habit that always melts my heart in a millisecond?",
      options: ["The way your nose crinkles when you laugh", "How you steal my hoodies and roll the sleeves up", "Your cute little high-pitched gasp when you get excited", "All of the above combined! 🥰"],
      correctIndex: 3,
      explanation: "Tricked you—it's absolutely ALL of them! Every single tiny habit of yours makes me fall in love over and over."
    },
    {
      id: "q4",
      question: "If we could take a magic flying carpet anywhere in the world tonight, where would we go?",
      options: ["A flower garden next to the Eiffel Tower", "A small cabin in Iceland to see the green Aurora lights", "A cute cat cafe in Tokyo, Japan", "A cozy white beach with glowing bio-ocean waves"],
      correctIndex: 1,
      explanation: "Exactly! Bundling up under a shared blanket in Iceland and watching the night skies light up in lavender green has always been our dream."
    }
  ];

  const handleAnswerClick = (index: number) => {
    if (selectedAnswer !== null) return; // Answer locked
    setSelectedAnswer(index);
    
    const isCorrect = index === initialQuestions[currentIdx].correctIndex;
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    
    setUserAnswers(prev => [...prev, index]);
  };

  const handleNextStep = () => {
    setSelectedAnswer(null);
    if (currentIdx + 1 < initialQuestions.length) {
      setCurrentIdx(prev => prev + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setQuizScore(0);
    setShowResult(false);
    setUserAnswers([]);
  };

  const questionObj = initialQuestions[currentIdx];
  const isCorrectChoice = selectedAnswer === questionObj.correctIndex;

  return (
    <div className="w-full max-w-2xl mx-auto px-4" id="love-quiz-section">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={currentIdx}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white/95 border border-pink-100 rounded-3xl p-6 md:p-8 shadow-xl relative"
            id={`quiz-question-card-${currentIdx}`}
          >
            {/* Header / progress */}
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs font-bold font-mono tracking-widest text-pink-500 uppercase">
                🌸 Sweet Chemistry Quiz
              </span>
              <span className="text-xs font-mono font-extrabold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-lg">
                Question {currentIdx + 1}/{initialQuestions.length}
              </span>
            </div>

            {/* Question title */}
            <h4 className="text-lg md:text-xl font-sans font-extrabold text-gray-800 leading-snug mb-6 text-left">
              {questionObj.question}
            </h4>

            {/* Answers Column */}
            <div className="flex flex-col gap-3.5" id="quiz-answers-stack">
              {questionObj.options.map((option, idx) => {
                const isSelected = selectedAnswer === idx;
                const isCorrectIndex = idx === questionObj.correctIndex;
                
                let optionStyle = "border-gray-150 bg-gray-50 hover:bg-pink-50/40 hover:border-pink-200 text-gray-700";
                
                if (selectedAnswer !== null) {
                  if (isSelected) {
                    optionStyle = isCorrectChoice 
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800 font-bold" 
                      : "border-rose-300 bg-rose-50 text-rose-800 font-bold";
                  } else if (isCorrectIndex) {
                    optionStyle = "border-emerald-200 bg-emerald-50/50 text-emerald-700 font-semibold";
                  } else {
                    optionStyle = "border-gray-100 bg-gray-50/30 text-gray-400";
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleAnswerClick(idx)}
                    disabled={selectedAnswer !== null}
                    className={`flex items-center justify-between border-2 rounded-2xl p-4 text-left text-sm font-semibold transition-all duration-300 ${optionStyle}`}
                  >
                    <span className="flex-1 pr-4">{option}</span>
                    {selectedAnswer !== null && (
                      <div className="flex-shrink-0">
                        {isCorrectIndex ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
                        ) : isSelected ? (
                          <AlertCircle className="w-5 h-5 text-rose-500 fill-rose-100" />
                        ) : null}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Reveal Feedback card */}
            <AnimatePresence>
              {selectedAnswer !== null && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 border-t border-pink-50 pt-5 text-left"
                >
                  <div className="flex items-start gap-3 bg-pink-50/40 p-4 rounded-2xl border border-pink-100/40">
                    <Heart className={`w-5 h-5 mt-0.5 flex-shrink-0 ${isCorrectChoice ? "text-rose-500 fill-rose-400 animate-pulse" : "text-gray-400"}`} />
                    <div>
                      <h5 className={`text-xs font-bold uppercase tracking-wide ${isCorrectChoice ? "text-rose-600" : "text-gray-500"}`}>
                        {isCorrectChoice ? "Oh my gosh, you got it! Correct!" : "Oops, not quite! But still cute!"}
                      </h5>
                      <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                        {questionObj.explanation}
                      </p>
                    </div>
                  </div>

                  {/* Flow Action to next step */}
                  <button
                    onClick={handleNextStep}
                    className="mt-5 w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-2xl text-xs font-extrabold tracking-widest uppercase shadow-md transition-all duration-300"
                    id="next-quiz-step-btn"
                  >
                    <span>{currentIdx + 1 === initialQuestions.length ? "Finish & See Chemistry Score" : "Next Question"}</span>
                    <ArrowRight className="w-4 h-4 animate-bounce" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Scoring details panel */
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-8 border border-pink-100 rounded-3xl shadow-xl text-center relative overflow-hidden"
            id="quiz-result-card"
          >
            {/* Absolute visual decorations */}
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400" />
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-pink-50 rounded-full blur-xl opacity-50" />
            <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-rose-50 rounded-full blur-xl opacity-50" />

            <div className="w-20 h-20 bg-pink-50-important bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xs border border-pink-100">
              <Trophy className="w-10 h-10 text-pink-500" />
            </div>

            <h3 className="text-2xl font-sans font-extrabold text-gray-800">
              Your Chemistry Score
            </h3>
            
            <div className="text-4xl font-extrabold text-rose-500 mt-3 font-mono">
              {quizScore} <span className="text-gray-300">/</span> {initialQuestions.length}
            </div>

            <p className="text-sm font-medium text-gray-500 max-w-sm mx-auto mt-2 leading-relaxed">
              {quizScore === initialQuestions.length 
                ? "OH MY GOD! Perfect score! You truly know me better than anyone else. You are my absolute soulmate! ❤️" 
                : quizScore >= 2
                ? "A fantastic score! You know me so incredibly well and everyday with you is a gorgeous adventure." 
                : "You still got a super sweet score! Let's build a thousand more magical memories together from today."}
            </p>

            <div className="mt-8 border-t border-gray-100 pt-6 flex flex-col md:flex-row gap-3">
              <button
                onClick={restartQuiz}
                className="flex-1 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl py-3.5 text-xs font-bold transition-all"
                id="restart-quiz-btn"
              >
                <RotateCcw className="w-4 h-4" />
                Try Quiz Again
              </button>
              
              <div 
                className="flex-1 bg-rose-50 flex items-center justify-center gap-2 rounded-xl text-rose-700 text-xs font-bold leading-none py-4 border border-rose-100 select-none animate-pulse"
              >
                <Sparkles className="w-4 h-4 text-rose-500" />
                Score Recorded In My Heart!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
