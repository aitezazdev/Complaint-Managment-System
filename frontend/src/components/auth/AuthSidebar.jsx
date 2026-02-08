import React from 'react';
import { CheckCircle2, Shield, Clock, BarChart3 } from 'lucide-react';

const AuthSidebar = () => {
  const features = [
    {
      icon: CheckCircle2,
      title: 'Easy Tracking',
      description: 'Submit and track your complaints in real-time with instant updates'
    },
    {
      icon: Clock,
      title: 'Quick Resolution',
      description: 'Get faster responses with our streamlined complaint management'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Monitor complaint status and resolution patterns at a glance'
    }
  ];

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden rounded-tl-4xl">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, rgb(255 255 255 / 0.15) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      <div className="relative z-10 flex flex-col justify-center px-12 py-6 w-full">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Complaint Management System
          </h1>
          <p className="text-slate-300 text-lg leading-relaxed">
            A modern platform to submit, track, and resolve complaints efficiently. 
            Experience transparency and accountability in every interaction.
          </p>
        </div>

        <div className="space-y-6">
          {features.map((feature, index) => (
            <div key={index} className="flex items-start gap-4 group">
              <div className="flex-shrink-0 w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center group-hover:bg-slate-700 transition-colors">
                <feature.icon className="w-6 h-6 text-slate-300" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800">
          <p className="text-slate-500 text-sm">
            Trusted by thousands of users for efficient complaint resolution
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthSidebar;