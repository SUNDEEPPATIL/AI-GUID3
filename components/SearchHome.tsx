import React from 'react';
import { CATEGORY_GROUPS } from '../constants';
import { Category } from '../types';
import CategorySelector from './CategorySelector';

interface SearchHomeProps {
  onCategorySelect: (category: Category) => void;
}

const SearchHome: React.FC<SearchHomeProps> = ({ onCategorySelect }) => {
  // The search functionality and product carousels have been removed to restore the original, 
  // simpler category-selection homepage. The previous design focused on guiding the user 
  // through categories first, which this change restores.
  return (
    <CategorySelector 
      categoryGroups={CATEGORY_GROUPS} 
      onSelect={onCategorySelect} 
    />
  );
};

export default SearchHome;
