'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  X, 
  ArrowRight, 
  CheckCircle, 
  IndianRupee, 
  Star,
  HandHeart,
  Zap,
  TrendingUp,
  Lightbulb,
  Target,
  Navigation
} from 'lucide-react'
import { useState } from 'react'
import { getIncomeStory } from '@/data/incomeStories'

interface IncomeStoryModalProps {
  isOpen: boolean
  onClose: () => void
  card: {
    id: number
    icon: string
    title: string
    titleHi?: string
    gradient: string
    category: string
  }
  darkMode: boolean
  onPostProblem?: () => void
  onNearby?: () => void
}

export function IncomeStoryModal({ isOpen, onClose, card, darkMode, onPostProblem, onNearby }: IncomeStoryModalProps) {
  const [activeStep, setActiveStep] = useState(0)
  const [showResources, setShowResources] = useState(false)
  
  const storyData = getIncomeStory(card.category)
  
  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-end"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
        onClick={(e) => e.stopPropagation()}
        className={`${darkMode ? 'bg-gray-900' : 'bg-white'} w-full rounded-t-3xl shadow-2xl flex flex-col`}
        style={{ height: '90vh', maxHeight: '90vh' }}
      >
        {/* Header - Fixed */}
        <div className="flex-shrink-0">
          <div className="flex justify-center pt-3">
            <div className={`w-12 h-1.5 rounded-full ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
          </div>
          <div className={`flex items-center justify-between p-4 border-b ${darkMode ? 'border-gray-800' : 'border-gray-100'}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${card.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                {card.icon}
              </div>
              <div>
                <h2 className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {storyData.story.title}
                </h2>
                <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {storyData.story.titleHi}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-xl">
              <X className={`w-5 h-5 ${darkMode ? 'text-white' : 'text-gray-600'}`} />
            </Button>
          </div>
        </div>

        {/* Scroll hint */}
        <div className={`flex-shrink-0 px-4 py-2 flex items-center justify-center gap-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>↓ Scroll for more details</span>
          <span className={`text-xs ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>| नीचे स्क्रॉल करें ↓</span>
        </div>
        
        {/* Scrollable Content - Fixed scrolling */}
        <div 
          className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4"
          style={{ 
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain'
          }}
        >
            {/* Income Potential Banner */}
            <div className={`p-4 rounded-2xl bg-gradient-to-r ${card.gradient} text-white`}>
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="font-bold">{storyData.story.income}</span>
              </div>
              <p className="text-sm text-white/80">{storyData.story.incomeHi}</p>
              <div className="flex items-center gap-2 mt-3">
                <IndianRupee className="w-4 h-4" />
                <span className="text-lg font-bold">{storyData.story.incomeRange}</span>
              </div>
            </div>

            {/* Story Section */}
            <div className={`p-4 rounded-2xl ${darkMode ? 'bg-gray-800' : 'bg-blue-50'}`}>
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className={`w-5 h-5 ${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
                <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  💡 Did you know?
                </h3>
              </div>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                {storyData.story.intro}
              </p>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {storyData.story.introHi}
              </p>
              <div className={`mt-3 p-2 rounded-xl ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                <p className={`text-sm font-medium ${darkMode ? 'text-green-400' : 'text-green-700'}`}>
                  📊 {storyData.story.demand}
                </p>
                <p className={`text-xs ${darkMode ? 'text-green-300' : 'text-green-600'}`}>
                  {storyData.story.demandHi}
                </p>
              </div>
            </div>

            {/* Step by Step Workflow */}
            <div>
              <h3 className={`font-bold text-lg mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <Target className="w-5 h-5 text-orange-500" />
                How to Earn - Step by Step
                <span className={`text-xs font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>कैसे कमाएं</span>
              </h3>
              
              <div className="space-y-2">
                {storyData.steps.map((step, index) => (
                  <motion.div
                    key={step.step}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveStep(activeStep === index ? -1 : index)}
                    className={`p-3 rounded-xl cursor-pointer transition-all ${
                      activeStep === index 
                        ? `${darkMode ? 'bg-gradient-to-r from-blue-900/50 to-indigo-900/50 border-blue-500' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-300'} border-2`
                        : `${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border`
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${
                        activeStep === index ? `bg-gradient-to-br ${card.gradient}` : (darkMode ? 'bg-gray-700' : 'bg-gray-100')
                      }`}>
                        {step.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            Step {step.step}:
                          </span>
                          <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                            {step.title}
                          </span>
                        </div>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {step.titleHi}
                        </p>
                      </div>
                      <ArrowRight className={`w-5 h-5 transition-transform ${activeStep === index ? 'rotate-90' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
                    </div>
                    
                    {activeStep === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600"
                      >
                        <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                          {step.description}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-2`}>
                          {step.descriptionHi}
                        </p>
                        {step.tip && (
                          <div className={`flex items-center gap-2 text-xs p-2 rounded-lg ${
                            darkMode ? 'bg-yellow-900/30 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
                          }`}>
                            <Zap className="w-3 h-3" />
                            <span>{step.tip}</span>
                            {step.tipHi && <span className="opacity-60">| {step.tipHi}</span>}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Resources Section */}
            <div>
              <button
                onClick={() => setShowResources(!showResources)}
                className={`w-full p-4 rounded-2xl flex items-center justify-between ${
                  darkMode ? 'bg-gradient-to-r from-purple-900/50 to-pink-900/50' : 'bg-gradient-to-r from-purple-50 to-pink-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">📦</span>
                  <div className="text-left">
                    <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      Resources You Can Use
                    </h3>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      आप जिन संसाधनों का उपयोग कर सकते हैं
                    </p>
                  </div>
                </div>
                <ArrowRight className={`w-5 h-5 transition-transform ${showResources ? 'rotate-90' : ''} ${darkMode ? 'text-gray-400' : 'text-gray-400'}`} />
              </button>
              
              {showResources && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="mt-3 grid grid-cols-2 gap-2"
                >
                  {storyData.resources.map((resource, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className={`p-3 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
                    >
                      <div className="text-2xl mb-2">{resource.icon}</div>
                      <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        {resource.name}
                      </p>
                      <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {resource.nameHi}
                      </p>
                      <div className="flex items-center gap-1 mt-2">
                        <IndianRupee className="w-3 h-3 text-green-500" />
                        <span className="text-sm font-bold text-green-600">{resource.income}</span>
                      </div>
                      <Badge className={`mt-1 text-[10px] ${
                        resource.difficulty === 'Low' || resource.difficulty === 'Very Low' ? 'bg-green-100 text-green-700' :
                        resource.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {resource.difficulty}
                      </Badge>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>

            {/* How App Helps */}
            <div>
              <h3 className={`font-bold text-lg mb-3 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                <HandHeart className="w-5 h-5 text-orange-500" />
                How This App Helps You
                <span className={`text-xs font-normal ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ऐप कैसे मदद करता है</span>
              </h3>
              
              <div className="grid grid-cols-2 gap-2">
                {storyData.appHelp.map((help, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-xl ${darkMode ? 'bg-green-900/30 border-green-800' : 'bg-green-50 border-green-200'} border`}
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                    <p className={`font-medium text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {help.title}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} mb-1`}>
                      {help.titleHi}
                    </p>
                    <p className={`text-xs ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      {help.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className={`flex-shrink-0 p-4 border-t ${darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-100 bg-white'}`}>
          <div className="flex gap-3">
            <Button
              onClick={onNearby}
              variant="outline"
              className={`flex-1 h-12 rounded-xl ${darkMode ? 'border-gray-700' : ''}`}
            >
              <Navigation className="w-4 h-4 mr-2" />
              See Nearby
            </Button>
            <Button
              onClick={onPostProblem}
              className="flex-1 h-12 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold"
            >
              <Zap className="w-4 h-4 mr-2" />
              Start Earning
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
