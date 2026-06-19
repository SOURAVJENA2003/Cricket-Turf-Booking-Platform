import React from 'react';
import { STATS } from '../data';
import { Award, Zap, TrendingUp, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function Stats() {
  const getIcon = (label: string) => {
    if (label.includes('Matches') || label.includes('Location')) return <Award className="w-5 h-5 text-emerald-600" />;
    if (label.includes('Players') || label.includes('Hours')) return <Users className="w-5 h-5 text-emerald-600" />;
    if (label.includes('Speed') || label.includes('Weather')) return <Zap className="w-5 h-5 text-emerald-600" />;
    return <TrendingUp className="w-5 h-5 text-emerald-600" />;
  };

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.45, ease: "easeOut" }
    }
  };

  return (
    <section className="bg-white border-b border-slate-100 py-10 md:py-14 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {STATS.map((stat, index) => (
            <motion.div 
              key={index}
              variants={cardVariants}
              whileHover={{ y: -4, transition: { duration: 0.15 } }}
              className="p-6 rounded-xl bg-slate-50/50 hover:bg-slate-50/80 border border-slate-200/60 hover:border-slate-300 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-premium-soft"
            >
              <div>
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200/50">
                  <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                    {getIcon(stat.label)}
                  </div>
                  <span className="text-[10px] font-mono font-bold text-emerald-700 py-0.5 px-2.5 rounded-full bg-emerald-50 border border-emerald-100">
                    {stat.trend}
                  </span>
                </div>

                <div className="text-3xl font-display font-extrabold text-pitch-charcoal tracking-tight">
                  {stat.value}
                </div>
                
                <h3 className="text-sm font-bold text-pitch-charcoal mt-1.5">
                  {stat.label}
                </h3>
              </div>

              <p className="text-xs text-pitch-slate-500 font-sans mt-3 leading-relaxed">
                {stat.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

