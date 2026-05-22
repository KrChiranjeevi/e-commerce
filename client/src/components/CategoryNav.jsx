import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import beautyToysImg from '../assets/beauty-toys.png';

const categories = [
    { name: 'Mobiles', label: 'Mobiles & Tablets', image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=100&q=80' },
    { name: 'Fashion', label: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=100&q=80', hasDropdown: true },
    { name: 'Electronics', label: 'Electronics', image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=100&q=80', hasDropdown: true },
    { name: 'TVs', label: 'TVs & Appliances', image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&w=100&q=80' },
    { name: 'Home', label: 'Home & Furniture', image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=100&q=80', hasDropdown: true },
    { name: 'Beauty', label: 'Beauty, Toys & More', image: beautyToysImg, hasDropdown: true },
    { name: 'Grocery', label: 'Grocery', image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=100&q=80' },
];

const CategoryNav = ({ onSelectCategory }) => {
    const navigate = useNavigate();
    const containerRef = useRef(null);

    useGSAP(() => {
        const items = gsap.utils.toArray('.category-item');

        gsap.fromTo(items,
            { y: 30, opacity: 0, scale: 0.8 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: "elastic.out(1, 0.5)",
                clearProps: "all"
            }
        );
    }, { scope: containerRef });

    const handleMouseEnter = (e) => {
        gsap.to(e.currentTarget, {
            scale: 1.05,
            y: -5,
            duration: 0.3,
            ease: "power2.out"
        });
        const img = e.currentTarget.querySelector('img');
        gsap.to(img, {
            scale: 1.1,
            duration: 0.3
        });
    };

    const handleMouseLeave = (e) => {
        gsap.to(e.currentTarget, {
            scale: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
        const img = e.currentTarget.querySelector('img');
        gsap.to(img, {
            scale: 1,
            duration: 0.3
        });
    };

    return (
        <div className="sticky top-4 z-30 mb-12 px-4 sm:px-6 lg:px-8 pointer-events-none">
            <div
                ref={containerRef}
                className="pointer-events-auto mx-auto max-w-7xl bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl shadow-2xl shadow-indigo-500/10 rounded-2xl overflow-hidden"
            >
                <div className="flex justify-between items-start gap-1 py-4 px-2 overflow-x-auto no-scrollbar touch-pan-x">
                    {categories.map((cat) => (
                        <div
                            key={cat.name}
                            className="category-item flex flex-col items-center group cursor-pointer min-w-[5rem] p-2 rounded-xl transition-colors hover:bg-indigo-50/50 dark:hover:bg-indigo-900/20"
                            onClick={() => onSelectCategory ? onSelectCategory(cat.name) : navigate(`/?category=${cat.name}`)}
                            onMouseEnter={handleMouseEnter}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div className="w-[4rem] h-[4rem] mb-2 rounded-full shadow-md overflow-hidden">
                                <div className="w-full h-full bg-white dark:bg-slate-900 flex items-center justify-center">
                                    <img
                                        src={cat.image}
                                        alt={cat.label}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>

                            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 text-center uppercase tracking-wide leading-tight px-1">
                                {cat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoryNav;
