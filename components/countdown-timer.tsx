"use client"

import { useState, useEffect } from "react"

interface CountdownTimerProps {
  targetDate: Date
  className?: string
  style?: React.CSSProperties
  numberStyle?: string
  labelStyle?: string
}

export default function CountdownTimer({
  targetDate,
  className = "",
  style,
  numberStyle = "bg-white w-16 h-16 rounded-lg shadow-md flex items-center justify-center text-2xl font-bold",
  labelStyle = "text-xs mt-2",
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = targetDate.getTime() - new Date().getTime()
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div
      className={`flex justify-center space-x-4 w-full ${className}`}
      style={style}
    >
      {(["days","hours","minutes","seconds"] as const).map((unit, i) => (
        <div key={unit} className="flex flex-col items-center">
          <div className={numberStyle}>
            {timeLeft[unit]}
          </div>
          <span className={labelStyle}>
            {unit === "days" ? "Hari"
             : unit === "hours" ? "Jam"
             : unit === "minutes" ? "Menit"
             : "Detik"}
          </span>
        </div>
      ))}
    </div>
  )
}
