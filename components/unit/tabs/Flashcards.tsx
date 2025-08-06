'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, RotateCcw, Shuffle, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface FlashcardsProps {
  unitId: string
}

interface Flashcard {
  id: string
  front: string
  back: string
  difficulty: 'easy' | 'medium' | 'hard'
}

export function Flashcards({ unitId }: FlashcardsProps) {
  // Mock flashcards data
  const flashcards: Flashcard[] = [
    {
      id: '1',
      front: 'What is Market Risk?',
      back: 'Market risk is the risk of losses due to changes in market prices, including equity prices, interest rates, foreign exchange rates, and commodity prices.',
      difficulty: 'easy'
    },
    {
      id: '2',
      front: 'Define Credit Risk',
      back: 'Credit risk is the possibility that a borrower or counterparty will fail to meet their obligations in accordance with agreed terms.',
      difficulty: 'medium'
    },
    {
      id: '3',
      front: 'What does VaR stand for and what does it measure?',
      back: 'VaR stands for Value at Risk. It measures the potential loss in value of a portfolio over a defined period for a given confidence interval.',
      difficulty: 'hard'
    },
    {
      id: '4',
      front: 'What are the four main risk treatment strategies?',
      back: 'The four main risk treatment strategies are: Risk Avoidance, Risk Reduction, Risk Transfer, and Risk Acceptance.',
      difficulty: 'medium'
    },
    {
      id: '5',
      front: 'What is Operational Risk?',
      back: 'Operational risk is the risk of loss resulting from inadequate or failed internal processes, people, and systems, or from external events.',
      difficulty: 'easy'
    },
    {
      id: '6',
      front: 'Explain the difference between Quantitative and Qualitative Risk Assessment',
      back: 'Quantitative assessment uses numerical methods and statistical models to measure risk (VaR, ES, Beta). Qualitative assessment relies on subjective judgment and descriptive scales, useful when data is limited.',
      difficulty: 'hard'
    }
  ]

  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [shuffled, setShuffled] = useState(false)
  const [studiedCards, setStudiedCards] = useState<Set<string>>(new Set())

  const currentCard = flashcards[currentIndex]
  const progress = ((studiedCards.size) / flashcards.length) * 100

  const nextCard = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setIsFlipped(false)
    }
  }

  const prevCard = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
      setIsFlipped(false)
    }
  }

  const flipCard = () => {
    setIsFlipped(!isFlipped)
    if (!isFlipped) {
      setStudiedCards(prev => new Set([...prev, currentCard.id]))
    }
  }

  const shuffleCards = () => {
    // In a real implementation, you would shuffle the array
    setShuffled(!shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const resetProgress = () => {
    setStudiedCards(new Set())
    setCurrentIndex(0)
    setIsFlipped(false)
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'hard': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Flashcards</h2>
          <p className="text-sm text-gray-600">
            Practice key concepts with interactive flashcards
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={shuffleCards}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <Shuffle className="h-4 w-4" />
            {shuffled ? 'Shuffled' : 'Shuffle'}
          </Button>
          <Button
            onClick={resetProgress}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Study Progress</span>
          <span>{studiedCards.size}/{flashcards.length} cards studied</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Card Navigation */}
      <div className="flex items-center justify-between mb-4">
        <Button
          onClick={prevCard}
          disabled={currentIndex === 0}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">
            Card {currentIndex + 1} of {flashcards.length}
          </span>
          <Badge className={getDifficultyColor(currentCard.difficulty)}>
            {currentCard.difficulty}
          </Badge>
        </div>
        
        <Button
          onClick={nextCard}
          disabled={currentIndex === flashcards.length - 1}
          size="sm"
          variant="outline"
          className="flex items-center gap-2"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Flashcard */}
      <div className="flex justify-center mb-6">
        <Card 
          className="w-full max-w-2xl h-80 cursor-pointer transition-all duration-300 hover:shadow-lg"
          onClick={flipCard}
        >
          <CardContent className="p-8 h-full flex flex-col justify-center items-center text-center relative">
            {/* Flip indicator */}
            <div className="absolute top-4 right-4">
              {isFlipped ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </div>
            
            {/* Card content */}
            <div className="flex-1 flex items-center justify-center">
              <div className="space-y-4">
                <div className="text-xs uppercase tracking-wide text-gray-500 font-medium">
                  {isFlipped ? 'Answer' : 'Question'}
                </div>
                <p className="text-lg leading-relaxed text-gray-800">
                  {isFlipped ? currentCard.back : currentCard.front}
                </p>
              </div>
            </div>
            
            {/* Flip instruction */}
            <div className="text-xs text-gray-400 mt-4">
              Click to {isFlipped ? 'see question' : 'reveal answer'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        <Button
          onClick={flipCard}
          className="flex items-center gap-2"
          variant={isFlipped ? "outline" : "default"}
        >
          {isFlipped ? (
            <>
              <EyeOff className="h-4 w-4" />
              Show Question
            </>
          ) : (
            <>
              <Eye className="h-4 w-4" />
              Reveal Answer
            </>
          )}
        </Button>
      </div>

      {/* Study Statistics */}
      <div className="mt-8 grid grid-cols-3 gap-4">
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{studiedCards.size}</div>
          <div className="text-sm text-gray-600">Cards Studied</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{flashcards.length - studiedCards.size}</div>
          <div className="text-sm text-gray-600">Remaining</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{Math.round(progress)}%</div>
          <div className="text-sm text-gray-600">Complete</div>
        </Card>
      </div>
    </div>
  )
}