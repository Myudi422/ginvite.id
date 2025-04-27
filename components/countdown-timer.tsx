"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: Date
}

export default function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        })
      } else {
        // If the date has passed
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    // Calculate immediately
    calculateTimeLeft()

    // Update every second
    const timer = setInterval(calculateTimeLeft, 1000)

    // Cleanup
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex justify-center space-x-4 w-full">
      <div className="flex flex-col items-center">
        <div className="bg-white w-16 h-16 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold text-blue-600">
          {timeLeft.days}
        </div>
        <span className="text-xs mt-2">Hari</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-white w-16 h-16 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold text-blue-600">
          {timeLeft.hours}
        </div>
        <span className="text-xs mt-2">Jam</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-white w-16 h-16 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold text-blue-600">
          {timeLeft.minutes}
        </div>
        <span className="text-xs mt-2">Menit</span>
      </div>
      <div className="flex flex-col items-center">
        <div className="bg-white w-16 h-16 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold text-blue-600">
          {timeLeft.seconds}
        </div>
        <span className="text-xs mt-2">Detik</span>
      </div>
    </div>
  )
}
