import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import StarIconFull from './icons/StarIconFull';
import StarIconHalf from './icons/StarIconHalf';
import StarIconEmpty from './icons/StarIconEmpty';
const StarRating = ({ rating, maxRating = 5 }) => {
    if (typeof rating !== 'number' || isNaN(rating)) {
        return null;
    }
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5 ? 1 : 0;
    const emptyStars = maxRating - fullStars - halfStar;
    return (_jsxs("div", { className: "flex items-center", "aria-label": `Rating: ${rating} out of ${maxRating} stars`, children: [Array.from({ length: fullStars }, (_, i) => (_jsx(StarIconFull, { className: "w-4 h-4 text-amber-400" }, `full-${i}`))), halfStar === 1 && _jsx(StarIconHalf, { className: "w-4 h-4 text-amber-400" }), Array.from({ length: emptyStars }, (_, i) => (_jsx(StarIconEmpty, { className: "w-4 h-4 text-gray-500" }, `empty-${i}`)))] }));
};
export default StarRating;
