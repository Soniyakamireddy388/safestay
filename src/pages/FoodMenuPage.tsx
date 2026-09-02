import React, { useState, useEffect } from 'react';
import { foodService } from '../services/apiServices';
import { FoodMenuItem } from '../types';
import { Utensils, Clock, CheckCircle2, Heart, Sparkles, Coffee, Sun, Moon, Cookie } from 'lucide-react';

export const FoodMenuPage: React.FC = () => {
  const [menu, setMenu] = useState<FoodMenuItem[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('Monday');

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  useEffect(() => {
    const loadMenu = async () => {
      const data = await foodService.getWeeklyMenu();
      setMenu(data);
    };
    loadMenu();
  }, []);

  const dayMeals = menu.filter((m) => m.day === selectedDay);

  const getMealIcon = (mealType: string) => {
    switch (mealType) {
      case 'Breakfast':
        return Coffee;
      case 'Lunch':
        return Sun;
      case 'Snacks':
        return Cookie;
      default:
        return Moon;
    }
  };

  return (
    <div className="space-y-6 pb-12 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 font-['Outfit',sans-serif]">
            Weekly Cafeteria & Dining Menu
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Nutritious four-meal dining schedule managed by SafeStay Central Catering.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-orange-50 text-orange-800 border border-orange-200">
            Certified FSSAI Hygienic Kitchen
          </span>
        </div>
      </div>

      {/* Days Tabs (Monday – Sunday) */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-xs flex items-center gap-1.5 overflow-x-auto">
        {days.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedDay === day
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      {/* Meals Grid for Selected Day */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {dayMeals.map((meal) => {
          const Icon = getMealIcon(meal.mealType);
          return (
            <div
              key={meal.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 flex flex-col justify-between hover:shadow-md transition-all group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 rounded-2xl bg-orange-50 text-orange-600 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                    {meal.dietary}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 font-['Outfit',sans-serif]">{meal.mealType}</h3>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono mt-1 mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{meal.time}</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                  {meal.items}
                </div>
              </div>

              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>SafeStay Central Mess</span>
                <span className="text-emerald-700 font-bold">Unlimited Servings</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
