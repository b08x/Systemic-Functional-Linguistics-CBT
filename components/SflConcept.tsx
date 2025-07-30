import React from 'react';

interface SflConceptProps {
  title: React.ReactNode;
  children: React.ReactNode;
}

const SflConcept: React.FC<SflConceptProps> = ({ title, children }) => {
  return (
    <div 
      className="bg-[#333e48] p-6 rounded-xl border border-[#5c6f7e] shadow-2xl transition-all duration-200 focus-within:ring-2 focus-within:ring-[#e2a32d]"
    >
      <h2 className="text-xl font-semibold text-[#e2a32d] mb-2">{title}</h2>
      <div className="text-gray-200 space-y-2">
        {children}
      </div>
    </div>
  );
};

export default SflConcept;