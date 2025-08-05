// app/panel/blog-admin/AIStats.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { SparklesIcon, TrendingUpIcon, ClockIcon } from 'lucide-react';

interface AIStatsProps {
  blogs: any[];
}

export default function AIStats({ blogs }: AIStatsProps) {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    aiGeneratedToday: 0,
    aiGeneratedThisWeek: 0,
    totalAIGenerated: 0
  });

  useEffect(() => {
    calculateStats();
  }, [blogs]);

  const calculateStats = () => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    today.setHours(0, 0, 0, 0);
    
    let aiGeneratedToday = 0;
    let aiGeneratedThisWeek = 0;
    let totalAIGenerated = 0;

    blogs.forEach(blog => {
      const createdDate = new Date(blog.created_at);
      
      // Assume AI generated blogs have specific patterns or we can add a flag
      // For now, we'll consider blogs with 'General' category as AI generated
      const isAIGenerated = blog.category === 'General' || 
                           blog.content.length > 800 || // Long articles likely AI generated
                           blog.title.includes('Tips') || 
                           blog.title.includes('Cara');

      if (isAIGenerated) {
        totalAIGenerated++;
        
        if (createdDate >= today) {
          aiGeneratedToday++;
        }
        
        if (createdDate >= weekAgo) {
          aiGeneratedThisWeek++;
        }
      }
    });

    setStats({
      totalBlogs: blogs.length,
      aiGeneratedToday,
      aiGeneratedThisWeek,
      totalAIGenerated
    });
  };

  return (
    <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-2xl p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <SparklesIcon className="h-6 w-6 text-purple-600" />
        <h3 className="text-lg font-semibold text-purple-800">AI Blog Statistics</h3>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{stats.totalBlogs}</div>
          <div className="text-sm text-purple-700">Total Artikel</div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="text-2xl font-bold text-indigo-600">{stats.totalAIGenerated}</div>
          <div className="text-sm text-indigo-700">AI Generated</div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <ClockIcon className="h-4 w-4 text-green-600" />
            <div className="text-2xl font-bold text-green-600">{stats.aiGeneratedToday}</div>
          </div>
          <div className="text-sm text-green-700">Hari Ini</div>
        </div>
        
        <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4 text-center">
          <div className="flex items-center justify-center gap-1 mb-1">
            <TrendingUpIcon className="h-4 w-4 text-blue-600" />
            <div className="text-2xl font-bold text-blue-600">{stats.aiGeneratedThisWeek}</div>
          </div>
          <div className="text-sm text-blue-700">Minggu Ini</div>
        </div>
      </div>
      
      {stats.totalBlogs > 0 && (
        <div className="mt-4 text-center">
          <div className="text-sm text-purple-600">
            AI Coverage: {Math.round((stats.totalAIGenerated / stats.totalBlogs) * 100)}% 
            dari total artikel
          </div>
        </div>
      )}
    </div>
  );
}
