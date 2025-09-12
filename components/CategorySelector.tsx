

import React, { useState } from 'react';
import { Category } from '../types';
import Tooltip from './Tooltip';

interface CategoryGroup {
  name: string;
  categories: Category[];
}

interface CategorySelectorProps {
  categoryGroups: Record<string, CategoryGroup>;
  onSelect: (category: Category) => void;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({ categoryGroups, onSelect }) => {
  const groupKeys = Object.keys(categoryGroups);
  const [activeGroupKey, setActiveGroupKey] = useState(groupKeys[0]);

  const activeGroup = categoryGroups[activeGroupKey];

  return (
    <section aria-labelledby="category-selector-heading" className="flex flex-col items-center justify-center pt-10 md:pt-20">
        <div className="text-center mb-12">
            <h2 id="category-selector-heading" className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Welcome!</h2>
            <p className="mt-4 text-lg text-gray-400 max-w-xl mx-auto">
                Let our AI guide you to the perfect product. Select a category to get started.
            </p>
        </div>
        
        <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 p-1 bg-gray-800 rounded-full border border-gray-700/50">
                {groupKeys.map(key => (
                  <Tooltip key={key} text={`View ${categoryGroups[key].name}`}>
                    <button
                        onClick={() => setActiveGroupKey(key)}
                        className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-cyan-400 ${
                        activeGroupKey === key ? 'bg-cyan-500 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700/50'
                        }`}
                    >
                        {categoryGroups[key].name}
                    </button>
                  </Tooltip>
                ))}
            </div>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
            {activeGroup.categories.map((category) => (
                <li key={category.key}>
                  <Tooltip text={`Explore ${category.name}`}>
                    <button
                        onClick={() => onSelect(category)}
                        className="group relative p-8 bg-gray-800 rounded-2xl border border-gray-700/50 hover:bg-gray-700/80 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-gray-900 overflow-hidden w-full h-full text-left"
                    >
                        <div className="relative z-10 flex flex-col items-center text-center">
                            <category.icon className="w-16 h-16 mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
                            <h3 className="text-2xl font-bold text-white">{category.name}</h3>
                            <p className="mt-2 text-gray-400">{category.description}</p>
                        </div>
                         <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </Tooltip>
                </li>
            ))}
        </ul>
    </section>
  );
};

export default CategorySelector;