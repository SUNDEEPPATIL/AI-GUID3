import { Category, PriceRange } from './types';
import SmartphoneIcon from './components/icons/SmartphoneIcon';
import WatchIcon from './components/icons/WatchIcon';
import TvIcon from './components/icons/TvIcon';
import RefrigeratorIcon from './components/icons/RefrigeratorIcon';
import WashingMachineIcon from './components/icons/WashingMachineIcon';
import AcIcon from './components/icons/AcIcon';

interface CategoryGroup {
  name: string;
  categories: Category[];
}

export const CATEGORY_GROUPS: Record<string, CategoryGroup> = {
  gadgets: {
    name: 'Gadgets',
    categories: [
      { 
        key: 'mobiles', 
        name: 'Best Mobiles', 
        icon: SmartphoneIcon,
        description: 'Find top phones by performance and camera scores in India.',
        hasPriceRanges: true,
      },
      { 
        key: 'watches', 
        name: 'Best Watches', 
        icon: WatchIcon,
        description: 'Discover the best smartwatches for your lifestyle in India.',
        hasPriceRanges: true,
      },
    ]
  },
  appliances: {
    name: 'Appliances',
    categories: [
      {
        key: 'tvs',
        name: 'Best TVs',
        icon: TvIcon,
        description: 'Explore top-rated TVs for the best viewing experience.',
        hasPriceRanges: true,
      },
      {
        key: 'refrigerators',
        name: 'Best Refrigerators',
        icon: RefrigeratorIcon,
        description: 'Find efficient and spacious refrigerators for your kitchen.',
        hasPriceRanges: true,
      },
      {
        key: 'washing_machines',
        name: 'Best Washing Machines',
        icon: WashingMachineIcon,
        description: 'Discover washing machines that make laundry a breeze.',
        hasPriceRanges: true,
      },
      {
        key: 'acs',
        name: 'Best ACs',
        icon: AcIcon,
        description: 'Get the best air conditioners for cool and comfortable summers.',
        hasPriceRanges: true,
      }
    ]
  }
};

export const PRICE_RANGES: Record<Category['key'], PriceRange[]> = {
  mobiles: [
    { key: '0-15000', label: 'Under ₹15,000' },
    { key: '15000-30000', label: '₹15k - ₹30k' },
    { key: '30000-50000', label: '₹30k - ₹50k' },
    { key: '50000-200000', label: 'Over ₹50k' },
  ],
  watches: [
    { key: '0-5000', label: 'Under ₹5,000' },
    { key: '5000-15000', label: '₹5k - ₹15k' },
    { key: '15000-30000', label: '₹15k - ₹30k' },
    { key: '30000-100000', label: 'Over ₹30k' },
  ],
  tvs: [
    { key: '0-20000', label: 'Under ₹20,000' },
    { key: '20000-40000', label: '₹20k - ₹40k' },
    { key: '40000-70000', label: '₹40k - ₹70k' },
    { key: '70000-500000', label: 'Over ₹70k' },
  ],
  refrigerators: [
    { key: '0-15000', label: 'Under ₹15,000' },
    { key: '15000-30000', label: '₹15k - ₹30k' },
    { key: '30000-50000', label: '₹30k - ₹50k' },
    { key: '50000-200000', label: 'Over ₹50k' },
  ],
  washing_machines: [
    { key: '0-15000', label: 'Under ₹15,000' },
    { key: '15000-25000', label: '₹15k - ₹25k' },
    { key: '25000-40000', label: '₹25k - ₹40k' },
    { key: '40000-150000', label: 'Over ₹40k' },
  ],
  acs: [
    { key: '0-30000', label: 'Under ₹30,000' },
    { key: '30000-40000', label: '₹30k - ₹40k' },
    { key: '40000-50000', label: '₹40k - ₹50k' },
    { key: '50000-100000', label: 'Over ₹50k' },
  ],
};