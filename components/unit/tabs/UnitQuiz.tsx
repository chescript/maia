'use client'

import { useState } from 'react'
import { CheckCircle, XCircle, RotateCcw, Trophy, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface UnitQuizProps {
  unitId: string
}

interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic: string
}

interface QuizResult {
  questionId: string
  selectedAnswer: number | null
  isCorrect: boolean
  timeSpent: number
}

export function UnitQuiz({ unitId }: UnitQuizProps) {
  // Mock quiz questions
  const questions: QuizQuestion[] = [
    {
      id: '1',
      question: 'What does VaR (Value at Risk) measure?',
      options: [
        'The maximum profit a portfolio can generate',
        'The potential loss in value over a defined period at a given confidence level',
        'The average return of a portfolio',
        'The volatility of market prices'
      ],
      correctAnswer: 1,
      explanation: 'VaR measures the potential loss in value of a portfolio over a defined period for a given confidence interval. For example, a 1-day 95% VaR of $1 million means there is a 5% chance of losing more than $1 million in one day.',
      difficulty: 'medium',
      topic: 'Risk Measurement'
    },
    {
      id: '2',
      question: 'Which of the following is NOT one of the four main types of financial risk?',
      options: [
        'Market Risk',
        'Credit Risk',
        'Inflation Risk',
        'Operational Risk'
      ],
      correctAnswer: 2,
      explanation: 'The four main types of financial risk are Market Risk, Credit Risk, Operational Risk, and Liquidity Risk. Inflation Risk is a subset of Market Risk.',
      difficulty: 'easy',
      topic: 'Risk Types'
    },
    {
      id: '3',
      question: 'What is the minimum Common Equity Tier 1 (CET1) capital ratio under Basel III?',
      options: [
        '3.5%',
        '4.5%',
        '6.0%',
        '8.0%'
      ],
      correctAnswer: 1,
      explanation: 'Under Basel III, the minimum Common Equity Tier 1 (CET1) capital ratio is 4.5%. This is the highest quality capital that can absorb losses while the institution remains viable.',
      difficulty: 'hard',
      topic: 'Regulation'
    },
    {
      id: '4',
      question: 'Which risk treatment strategy involves eliminating the risk entirely?',
      options: [
        'Risk Transfer',
        'Risk Reduction',
        'Risk Avoidance',
        'Risk Acceptance'
      ],
      correctAnswer: 2,
      explanation: 'Risk Avoidance involves eliminating the risk entirely by not engaging in the activity that creates the risk. This is the most effective but often the most costly strategy.',
      difficulty: 'easy',
      topic: 'Risk Treatment'
    },
    {
      id: '5',
      question: 'What is operational risk primarily concerned with?',
      options: [
        'Changes in market prices',
        'Counterparty default',
        'Failed internal processes, people, and systems',
        'Interest rate fluctuations'
      ],
      correctAnswer: 2,
      explanation: 'Operational risk is the risk of loss resulting from inadequate or failed internal processes, people, and systems, or from external events. It includes fraud, system failures, and human errors.',
      difficulty: 'medium',
      topic: 'Risk Types'
    },
    {
      id: '6',
      question: 'In portfolio theory, diversification primarily helps to reduce which type of risk?',
      options: [
        'Systematic risk',
        'Unsystematic risk',
        'Market risk',
        'Liquidity risk'
      ],
      correctAnswer: 1,
      explanation: 'Diversification primarily helps reduce unsystematic (specific) risk by spreading investments across different assets. Systematic risk affects the entire market and cannot be diversified away.',
      difficulty: 'medium',
      topic: 'Portfolio Theory'
    },
    {
      id: '7',
      question: 'What is the key difference between qualitative and quantitative risk assessment?',
      options: [
        'Qualitative is more accurate',
        'Quantitative uses numerical methods, qualitative uses descriptive scales',
        'Qualitative is faster to perform',
        'There is no significant difference'
      ],
      correctAnswer: 1,
      explanation: 'Quantitative risk assessment uses numerical methods and statistical models to measure risk, while qualitative assessment relies on subjective judgment and descriptive scales (low, medium, high).',
      difficulty: 'easy',
      topic: 'Risk Assessment'
    },
    {
      id: '8',
      question: 'Which of the following best describes credit risk?',
      options: [
        'Risk of technology system failures',
        'Risk of market price volatility',
        'Risk that a counterparty will fail to meet obligations',
        'Risk of regulatory changes'
      ],
      correctAnswer: 2,
      explanation: 'Credit risk is the possibility that a borrower or counterparty will fail to meet their obligations in accordance with agreed terms. This includes default risk and credit spread risk.',
      difficulty: 'easy',
      topic: 'Risk Types'
    },
    {
      id: '9',
      question: 'What does a 99% confidence level VaR tell you?',
      options: [
        'You will definitely not lose more than the VaR amount',
        'There is a 1% chance of losing more than the VaR amount',
        'You will lose exactly the VaR amount 99% of the time',
        'The portfolio will gain money 99% of the time'
      ],
      correctAnswer: 1,
      explanation: 'A 99% confidence level VaR means there is a 1% probability that losses will exceed the VaR amount over the specified time period. It does not guarantee that losses will not exceed this amount.',
      difficulty: 'hard',
      topic: 'Risk Measurement'
    },
    {
      id: '10',
      question: 'Which approach is most appropriate when historical data is limited?',
      options: [
        'Quantitative risk assessment only',
        'Qualitative risk assessment',
        'Monte Carlo simulation',
        'Historical simulation'
      ],
      correctAnswer: 1,
      explanation: 'When historical data is limited, qualitative risk assessment is most appropriate as it relies on expert judgment and experience rather than statistical analysis of historical data.',
      difficulty: 'medium',
      topic: 'Risk Assessment'
    }
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(new Array(questions.length).fill(null))
  const [showResults, setShowResults] = useState(false)
  const [quizStartTime] = useState(Date.now())
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [results, setResults] = useState<QuizResult[]>([])

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers]
    newAnswers[currentQuestion] = answerIndex
    setSelectedAnswers(newAnswers)
  }

  const handleNext = () => {
    const timeSpent = Date.now() - questionStartTime
    const newResult: QuizResult = {
      questionId: questions[currentQuestion].id,
      selectedAnswer: selectedAnswers[currentQuestion],
      isCorrect: selectedAnswers[currentQuestion] === questions[currentQuestion].correctAnswer,
      timeSpent
    }
    
    const newResults = [...results]
    newResults[currentQuestion] = newResult
    setResults(newResults)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setQuestionStartTime(Date.now())
    } else {
      setShowResults(true)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setQuestionStartTime(Date.now())
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswers(new Array(questions.length).fill(null))
    setShowResults(false)
    setResults([])
    setQuestionStartTime(Date.now())
  }

  const calculateScore = () => {
    const correctAnswers = results.filter(r => r.isCorrect).length
    return Math.round((correctAnswers / questions.length) * 100)
  }

  const getTotalTime = () => {
    return Math.round((Date.now() - quizStartTime) / 1000)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100

  if (showResults) {
    const score = calculateScore()
    const correctCount = results.filter(r => r.isCorrect).length
    
    return (
      <div className="p-6">
        {/* Results Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className={`p-4 rounded-full ${
              score >= 80 ? 'bg-green-100' : score >= 60 ? 'bg-yellow-100' : 'bg-red-100'
            }`}>
              <Trophy className={`h-8 w-8 ${
                score >= 80 ? 'text-green-600' : score >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Complete!</h2>
          <p className="text-gray-600">Here are your results</p>
        </div>

        {/* Score Summary */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="text-center p-4">
            <div className="text-3xl font-bold text-blue-600 mb-1">{score}%</div>
            <div className="text-sm text-gray-600">Final Score</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl font-bold text-green-600 mb-1">{correctCount}/{questions.length}</div>
            <div className="text-sm text-gray-600">Correct Answers</div>
          </Card>
          <Card className="text-center p-4">
            <div className="text-3xl font-bold text-purple-600 mb-1">{getTotalTime()}s</div>
            <div className="text-sm text-gray-600">Total Time</div>
          </Card>
        </div>

        {/* Detailed Results */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const result = results[index]
                const isCorrect = result?.isCorrect
                
                return (
                  <div key={question.id} className="border-b pb-4 last:border-b-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-1 rounded-full ${
                        isCorrect ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">Question {index + 1}</span>
                          <Badge className={getDifficultyColor(question.difficulty)}>
                            {question.difficulty}
                          </Badge>
                          <Badge variant="outline">{question.topic}</Badge>
                        </div>
                        <p className="text-gray-800 mb-3">{question.question}</p>
                        
                        <div className="space-y-2 mb-3">
                          {question.options.map((option, optionIndex) => {
                            const isSelected = result?.selectedAnswer === optionIndex
                            const isCorrectOption = optionIndex === question.correctAnswer
                            
                            return (
                              <div key={optionIndex} className={`p-2 rounded border ${
                                isCorrectOption ? 'bg-green-50 border-green-200' :
                                isSelected && !isCorrectOption ? 'bg-red-50 border-red-200' :
                                'bg-gray-50 border-gray-200'
                              }`}>
                                <div className="flex items-center gap-2">
                                  {isCorrectOption && <CheckCircle className="h-4 w-4 text-green-600" />}
                                  {isSelected && !isCorrectOption && <XCircle className="h-4 w-4 text-red-600" />}
                                  <span className={isCorrectOption ? 'font-medium' : ''}>
                                    {option}
                                  </span>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded border border-blue-200">
                          <div className="text-xs font-medium text-blue-600 mb-1">Explanation:</div>
                          <div className="text-sm text-blue-800">{question.explanation}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4">
          <Button onClick={resetQuiz} className="flex items-center gap-2">
            <RotateCcw className="h-4 w-4" />
            Retake Quiz
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Unit Quiz</h2>
            <p className="text-sm text-gray-600">Test your knowledge with 10 questions</p>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
          </div>
        </div>
        
        <Progress value={progress} className="h-2" />
      </div>

      {/* Current Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getDifficultyColor(questions[currentQuestion].difficulty)}>
                {questions[currentQuestion].difficulty}
              </Badge>
              <Badge variant="outline">{questions[currentQuestion].topic}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-gray-800 mb-6 text-lg leading-relaxed">
            {questions[currentQuestion].question}
          </p>
          
          <RadioGroup
            value={selectedAnswers[currentQuestion]?.toString() || ''}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            <div className="space-y-3">
              {questions[currentQuestion].options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 cursor-pointer">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          variant="outline"
        >
          Previous
        </Button>
        
        <Button
          onClick={handleNext}
          disabled={selectedAnswers[currentQuestion] === null}
        >
          {currentQuestion === questions.length - 1 ? 'Finish Quiz' : 'Next'}
        </Button>
      </div>
    </div>
  )
}