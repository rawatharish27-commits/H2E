'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Gift,
  CheckCircle2,
  Clock,
  Coins,
  Loader2,
  ChevronRight,
  Star,
  Zap,
  Target,
  Trophy
} from 'lucide-react'
import { useAppStore } from '@/store'

interface StarterTask {
  id: string
  title: string
  titleHi: string | null
  description: string
  descriptionHi: string | null
  icon: string
  type: string
  category: string
  rewardAmount: number
  areaRequired: boolean
  kycRequired: boolean
  maxCompletions: number
  currentCompletions: number
  perUserLimit: number
  isActive: boolean
  createdAt: string
  completed?: boolean
}

interface StarterTasksProps {
  darkMode?: boolean
  compact?: boolean
}

export function StarterTasksDisplay({ darkMode = false, compact = false }: StarterTasksProps) {
  const { user, isSubscriptionActive } = useAppStore()
  const [tasks, setTasks] = useState<StarterTask[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null)
  const [expandedTask, setExpandedTask] = useState<string | null>(null)
  
  const isActive = isSubscriptionActive()
  const language = user?.language || 'hi'

  useEffect(() => {
    fetchTasks()
  }, [user?.id])

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/starter-tasks')
      const data = await res.json()
      
      if (data.success) {
        // Check which tasks user has completed
        if (user?.id) {
          const completedRes = await fetch(`/api/starter-tasks/completed?userId=${user.id}`)
          const completedData = await completedRes.json()
          const completedTaskIds = completedData.taskIds || []
          
          const tasksWithStatus = data.tasks.map((task: StarterTask) => ({
            ...task,
            completed: completedTaskIds.includes(task.id)
          }))
          setTasks(tasksWithStatus)
        } else {
          setTasks(data.tasks)
        }
      }
    } catch (error) {
      console.error('Failed to fetch starter tasks:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    if (!user?.id) return
    
    setCompletingTaskId(taskId)
    try {
      const res = await fetch('/api/starter-tasks/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, userId: user.id })
      })
      
      const data = await res.json()
      
      if (data.success) {
        // Update task status locally
        setTasks(prev => prev.map(t => 
          t.id === taskId ? { ...t, completed: true } : t
        ))
      }
    } catch (error) {
      console.error('Failed to complete task:', error)
    } finally {
      setCompletingTaskId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-purple-500" />
      </div>
    )
  }

  if (tasks.length === 0) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        <Gift className="w-12 h-12 mx-auto mb-3 opacity-50" />
        <p className="text-sm">No platform tasks available right now</p>
        <p className="text-xs mt-1 opacity-75">Check back later for earning opportunities</p>
      </div>
    )
  }

  const availableTasks = tasks.filter(t => !t.completed)
  const completedTasks = tasks.filter(t => t.completed)

  return (
    <div className="space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
            <Zap className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className={`font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Platform Tasks
            </h3>
            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              {availableTasks.length} available • ₹{availableTasks.reduce((sum, t) => sum + t.rewardAmount, 0)} to earn
            </p>
          </div>
        </div>
        {completedTasks.length > 0 && (
          <Badge className="bg-green-500/20 text-green-600 dark:text-green-400">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            {completedTasks.length} done
          </Badge>
        )}
      </div>

      {/* Tasks List */}
      <ScrollArea className={compact ? "max-h-64" : "max-h-96"}>
        <div className="space-y-2 pr-2">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card 
                  className={`
                    overflow-hidden cursor-pointer transition-all
                    ${task.completed 
                      ? darkMode 
                        ? 'bg-green-900/20 border-green-800' 
                        : 'bg-green-50 border-green-200'
                      : darkMode 
                        ? 'bg-gray-800 border-gray-700 hover:border-purple-500'
                        : 'bg-white border-gray-200 hover:border-purple-300'
                    }
                  `}
                  onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      {/* Icon */}
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center text-2xl
                        ${task.completed 
                          ? 'bg-green-500/20' 
                          : 'bg-gradient-to-br from-amber-100 to-orange-100'
                        }
                      `}>
                        {task.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-green-500" />
                        ) : (
                          task.icon
                        )}
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className={`font-semibold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                              {language === 'hi' && task.titleHi ? task.titleHi : task.title}
                            </h4>
                            <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'} line-clamp-1`}>
                              {language === 'hi' && task.descriptionHi ? task.descriptionHi : task.description}
                            </p>
                          </div>
                          
                          {/* Reward Badge */}
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Badge className={`
                              ${task.completed 
                                ? 'bg-green-500 text-white'
                                : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                              }
                            `}>
                              <Coins className="w-3 h-3 mr-1" />
                              ₹{task.rewardAmount}
                            </Badge>
                          </div>
                        </div>
                        
                        {/* Category & Type */}
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {task.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {task.type}
                          </Badge>
                          {task.areaRequired && (
                            <Badge variant="outline" className="text-xs text-orange-600">
                              Area Required
                            </Badge>
                          )}
                        </div>
                        
                        {/* Expanded Content */}
                        <AnimatePresence>
                          {expandedTask === task.id && !task.completed && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                            >
                              <p className={`text-sm mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                                {language === 'hi' && task.descriptionHi ? task.descriptionHi : task.description}
                              </p>
                              
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleCompleteTask(task.id)
                                }}
                                disabled={completingTaskId === task.id}
                                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
                              >
                                {completingTaskId === task.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Processing...
                                  </>
                                ) : (
                                  <>
                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                    Complete & Earn ₹{task.rewardAmount}
                                  </>
                                )}
                              </Button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                        
                        {/* Completed indicator */}
                        {task.completed && (
                          <div className="flex items-center gap-1 mt-2 text-green-600 dark:text-green-400">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-medium">Completed • ₹{task.rewardAmount} earned</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Expand Arrow */}
                      {!task.completed && (
                        <ChevronRight className={`
                          w-4 h-4 transition-transform
                          ${darkMode ? 'text-gray-500' : 'text-gray-400'}
                          ${expandedTask === task.id ? 'rotate-90' : ''}
                        `} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </ScrollArea>

      {/* Footer */}
      {availableTasks.length > 0 && (
        <div className={`text-center pt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <p className="text-xs flex items-center justify-center gap-1">
            <Trophy className="w-3 h-3 text-amber-500" />
            Complete all tasks to earn ₹{tasks.reduce((sum, t) => sum + t.rewardAmount, 0)}
          </p>
        </div>
      )}
    </div>
  )
}
