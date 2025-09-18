import React from 'react';
import StarIconFull from './icons/StarIconFull';
import StarIconHalf from './icons/StarIconHalf';
import StarIconEmpty from './icons/StarIconEmpty';

interface StarRatingProps {
  rating?: number;
  maxRating?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, maxRating = 5 }) => {
  if (typeof rating !== 'number' || isNaN(rating)) {
    return null;
  }

  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5 ? 1 : 0;
  const emptyStars = maxRating - fullStars - halfStar;

  return (
    <div className="flex items-center" aria-label={`Rating: ${rating} out of ${maxRating} stars`}>
      {Array.from({ length: fullStars }, (_, i) => (
        <StarIconFull key={`full-${i}`} className="w-4 h-4 text-amber-400" />
      ))}
      {halfStar === 1 && <StarIconHalf className="w-4 h-4 text-amber-400" />}
      {Array.from({ length: emptyStars }, (_, i) => (
        <StarIconEmpty key={`empty-${i}`} className="w-4 h-4 text-gray-500" />
      ))}
    </div>
  );
};

export default StarRating;