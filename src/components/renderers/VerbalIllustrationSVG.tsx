import React from 'react';
import {
  Sun,
  Moon,
  TreePine,
  Leaf,
  Droplet,
  Wind,
  Flame,
  Snowflake,
  Mountain,
  Anchor,
  Compass,
  Heart,
  Shield,
  Zap,
  Smile,
  Radio,
  Disc,
  Box,
  Fish,
  Bug,
  Palette,
  Star,
  Shapes,
  Circle,
  Square,
  PenTool,
  Bike,
  Car,
  Ship,
  Bus,
  Activity,
  Thermometer,
  Waves,
  Ruler,
  Gem,
  Filter,
  Bell,
  Eraser,
  Hammer,
  HelpCircle,
  Apple,
  Cloud,
  Guitar,
  Scale,
  Feather,
} from 'lucide-react';
import { CellVisual, VerbalGridData } from '../../types/ngat';

export interface VerbalIllustrationSVGProps {
  visual?: CellVisual;
  item?: VerbalGridData['items'][number];
  size?: number | string;
  showWordLabel?: boolean;
  showCategory?: boolean;
  className?: string;
}

export const VerbalIllustrationSVG: React.FC<VerbalIllustrationSVGProps> = ({
  visual,
  item,
  size = 110,
  showWordLabel = true,
  showCategory = false,
  className = '',
}) => {
  // Extract word, category, and iconName from either item or visual
  const word = item?.word ?? (visual?.type === 'verbal-word' ? visual.word : '');
  const category = item?.category ?? (visual?.type === 'verbal-word' ? visual.category : '');
  const iconName = (item as any)?.iconName ?? (visual?.type === 'verbal-word' ? visual.iconName : '') ?? '';

  const cleanWord = word.trim().toUpperCase();

  // Dynamic Icon Selection & Custom Precision SVG Embellishments
  const renderIcon = () => {
    const iconProps = { className: 'w-10 h-10', strokeWidth: 2.2 };
    const name = iconName.toLowerCase();
    const w = cleanWord.toLowerCase();

    // 1. Astronomy & Planets (Distinct planetary embellishments)
    if (w.includes('saturn')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Saturn with rings">
          <circle cx="20" cy="20" r="9.5" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <ellipse
            cx="20"
            cy="20"
            rx="18"
            ry="6"
            fill="none"
            stroke="#D97706"
            strokeWidth="2.5"
            transform="rotate(-22 20 20)"
          />
        </svg>
      );
    }
    if (w.includes('jupiter')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Jupiter with banded stripes and red spot">
          <circle cx="20" cy="20" r="13" fill="#EA580C" stroke="#9A3412" strokeWidth="1.5" />
          <path d="M 8,16 Q 20,18 32,16" stroke="#FED7AA" strokeWidth="2" fill="none" />
          <path d="M 7,24 Q 20,26 33,24" stroke="#FED7AA" strokeWidth="2" fill="none" />
          <circle cx="25" cy="21" r="2.5" fill="#DC2626" />
        </svg>
      );
    }
    if (w.includes('mars')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Mars with polar cap">
          <circle cx="20" cy="20" r="11" fill="#DC2626" stroke="#991B1B" strokeWidth="1.5" />
          <ellipse cx="20" cy="11.5" rx="4" ry="2" fill="#FFFFFF" opacity="0.9" />
          <circle cx="16" cy="22" r="2" fill="#991B1B" opacity="0.6" />
        </svg>
      );
    }
    if (w.includes('neptune')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Neptune azure ice giant">
          <circle cx="20" cy="20" r="12" fill="#2563EB" stroke="#1D4ED8" strokeWidth="1.5" />
          <path d="M 9,20 Q 20,22 31,20" stroke="#93C5FD" strokeWidth="1.5" fill="none" opacity="0.8" />
        </svg>
      );
    }
    if (w.includes('venus')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Venus glowing planet">
          <circle cx="20" cy="20" r="11" fill="#FBBF24" stroke="#D97706" strokeWidth="1.5" />
          <ellipse cx="20" cy="20" rx="11" ry="6" fill="none" stroke="#FEF08A" strokeWidth="1.5" />
        </svg>
      );
    }
    if (name.includes('moon') || w.includes('moon') || w.includes('titan')) {
      return <Moon {...iconProps} className="w-10 h-10 text-indigo-500" />;
    }
    if (name.includes('planet') || w.includes('pluto') || w.includes('ceres') || w.includes('eris') || w.includes('makemake') || w.includes('haumea')) {
      return <Disc {...iconProps} className="w-10 h-10 text-blue-600" />;
    }
    if (name.includes('sun') || w.includes('sun') || w.includes('solar')) {
      return <Sun {...iconProps} className="w-10 h-10 text-amber-500" />;
    }

    // 2. Animals (Mammals, Reptiles, Aquatic)
    if (name.includes('dolphin') || w.includes('dolphin')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Dolphin jumping">
          <path
            d="M 6,24 C 10,16 22,12 30,14 C 33,15 36,17 38,16 C 36,20 30,24 24,24 C 18,24 14,28 6,24 Z"
            fill="#0284C7"
            stroke="#0369A1"
            strokeWidth="1.2"
          />
          <path d="M 20,13 L 23,8 L 25,14 Z" fill="#0284C7" stroke="#0369A1" strokeWidth="1" />
          <circle cx="32" cy="16" r="1" fill="#FFFFFF" />
        </svg>
      );
    }
    if (name.includes('elephant') || w.includes('elephant')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Elephant silhouette">
          <path
            d="M 8,28 L 8,20 C 8,14 14,10 24,10 C 30,10 32,14 34,18 L 34,26 C 33,28 30,28 30,24 L 30,18 C 29,18 28,24 26,28 Z"
            fill="#64748B"
            stroke="#334155"
            strokeWidth="1.2"
          />
          <circle cx="22" cy="14" r="5" fill="#94A3B8" stroke="#334155" strokeWidth="1" />
        </svg>
      );
    }
    if (name.includes('crocodile') || w.includes('crocodile') || w.includes('alligator')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Crocodile reptile">
          <path
            d="M 4,24 C 8,20 14,20 20,20 C 26,19 32,16 38,18 C 34,21 30,24 24,25 C 18,26 12,28 4,24 Z"
            fill="#15803D"
            stroke="#166534"
            strokeWidth="1.2"
          />
          <polygon points="12,19 14,16 16,19 18,16 20,19 22,16 24,19" fill="#15803D" />
          <circle cx="31" cy="17" r="1.5" fill="#FEF08A" />
        </svg>
      );
    }
    if (name.includes('kangaroo') || w.includes('kangaroo')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Kangaroo marsupial">
          <path
            d="M 8,30 C 14,28 16,22 18,16 C 18,12 22,8 24,8 C 25,8 26,10 25,12 C 27,11 28,12 26,14 C 23,17 22,22 25,27 C 27,30 24,32 18,32 C 14,32 10,31 8,30 Z"
            fill="#B45309"
            stroke="#78350F"
            strokeWidth="1.2"
          />
        </svg>
      );
    }
    if (name.includes('bat') || w.includes('bat')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Bat flying mammal">
          <path
            d="M 20,18 C 18,14 14,12 6,14 C 10,22 15,22 18,24 C 18,27 22,27 22,24 C 25,22 30,22 34,14 C 26,12 22,14 20,18 Z"
            fill="#334155"
            stroke="#0F172A"
            strokeWidth="1.2"
          />
        </svg>
      );
    }
    if (name.includes('otter') || w.includes('otter')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Otter aquatic mammal">
          <path
            d="M 6,26 C 10,24 14,20 20,18 C 26,16 32,16 35,18 C 36,20 34,23 30,22 C 24,21 16,24 6,26 Z"
            fill="#78350F"
            stroke="#451A03"
            strokeWidth="1.2"
          />
        </svg>
      );
    }
    if (name.includes('butterfly') || w.includes('butterfly') || w.includes('dragonfly')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Butterfly insect">
          <path d="M 20,16 C 16,8 8,10 8,18 C 8,24 16,24 20,22 Z" fill="#C084FC" stroke="#7E22CE" strokeWidth="1.2" />
          <path d="M 20,16 C 24,8 32,10 32,18 C 32,24 24,24 20,22 Z" fill="#C084FC" stroke="#7E22CE" strokeWidth="1.2" />
          <line x1="20" y1="12" x2="20" y2="28" stroke="#374151" strokeWidth="2" />
        </svg>
      );
    }
    if (name.includes('bee') || w.includes('bee') || w.includes('honeybee')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Honeybee">
          <ellipse cx="20" cy="20" rx="9" ry="6" fill="#FACC15" stroke="#854D0E" strokeWidth="1.5" />
          <line x1="16" y1="14" x2="16" y2="26" stroke="#1E293B" strokeWidth="2" />
          <line x1="20" y1="14" x2="20" y2="26" stroke="#1E293B" strokeWidth="2" />
          <line x1="24" y1="14" x2="24" y2="26" stroke="#1E293B" strokeWidth="2" />
        </svg>
      );
    }
    if (name.includes('spider') || w.includes('spider')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Spider arachnid">
          <circle cx="20" cy="20" r="5" fill="#1E293B" />
          <circle cx="20" cy="14" r="3" fill="#1E293B" />
          <path d="M 16,18 L 10,12 M 16,20 L 8,20 M 16,22 L 10,28 M 24,18 L 30,12 M 24,20 L 32,20 M 24,22 L 30,28" stroke="#1E293B" strokeWidth="1.5" />
        </svg>
      );
    }
    if (name.includes('bug') || w.includes('ant') || w.includes('beetle') || w.includes('grasshopper')) {
      return <Bug {...iconProps} className="w-10 h-10 text-amber-700" />;
    }
    if (name.includes('fish') || w.includes('shark') || w.includes('salmon') || w.includes('trout') || w.includes('clownfish') || w.includes('squid')) {
      return <Fish {...iconProps} className="w-10 h-10 text-teal-600" />;
    }
    if (name.includes('anchor') || w.includes('whale') || w.includes('marine') || w.includes('sea') || w.includes('ocean')) {
      return <Anchor {...iconProps} className="w-10 h-10 text-blue-700" />;
    }

    // 3. Musical Instruments (Distinct orchestral designs)
    if (w.includes('trumpet')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Brass trumpet">
          <path d="M 6,22 L 28,22 L 35,16 L 35,28 L 28,22 Z" fill="#F59E0B" stroke="#B45309" strokeWidth="1.5" />
          <line x1="6" y1="18" x2="26" y2="18" stroke="#F59E0B" strokeWidth="2" />
          <rect x="15" y="14" width="2" height="6" fill="#D97706" />
          <rect x="19" y="14" width="2" height="6" fill="#D97706" />
          <rect x="23" y="14" width="2" height="6" fill="#D97706" />
        </svg>
      );
    }
    if (w.includes('harp') || name.includes('harp')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Triangular string harp">
          <path d="M 10,6 C 10,6 28,8 28,16 C 28,24 18,34 10,34 Z" fill="none" stroke="#D97706" strokeWidth="2.5" />
          <line x1="10" y1="6" x2="10" y2="34" stroke="#B45309" strokeWidth="2.5" />
          <line x1="14" y1="9" x2="14" y2="34" stroke="#92400E" strokeWidth="1" />
          <line x1="18" y1="12" x2="18" y2="34" stroke="#92400E" strokeWidth="1" />
          <line x1="22" y1="15" x2="22" y2="32" stroke="#92400E" strokeWidth="1" />
        </svg>
      );
    }
    if (w.includes('guitar') || name.includes('guitar')) {
      return <Guitar {...iconProps} className="w-10 h-10 text-amber-700" />;
    }
    if (w.includes('cello') || name.includes('cello')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Orchestral cello">
          <path
            d="M 16,8 C 12,13 18,17 14,24 C 11,28 13,34 20,34 C 27,34 29,28 26,24 C 22,17 28,13 24,8 Z"
            fill="#78350F"
            stroke="#451A03"
            strokeWidth="1.2"
          />
          <line x1="20" y1="34" x2="20" y2="38" stroke="#451A03" strokeWidth="1.5" />
          <line x1="20" y1="3" x2="20" y2="34" stroke="#FEF3C7" strokeWidth="0.8" />
        </svg>
      );
    }
    if (w.includes('violin') || w.includes('viola') || name.includes('violin') || name.includes('viola')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Classical violin">
          <path
            d="M 17,9 C 14,14 20,16 16,22 C 14,25 15,31 20,31 C 25,31 26,25 24,22 C 20,16 26,14 23,9 Z"
            fill="#92400E"
            stroke="#451A03"
            strokeWidth="1.2"
          />
          <rect x="19" y="3" width="2" height="7" fill="#451A03" />
          <line x1="20" y1="3" x2="20" y2="30" stroke="#FEF3C7" strokeWidth="0.8" />
        </svg>
      );
    }

    // 4. Kitchen Utensils (Distinct cutlery & cooking tools)
    if (w.includes('spoon')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Dining spoon">
          <ellipse cx="20" cy="14" rx="7" ry="9" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
          <path d="M 20,23 L 20,36" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (w.includes('fork')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Dining fork">
          <path d="M 14,7 L 14,18 C 14,21 26,21 26,18 L 26,7" fill="none" stroke="#334155" strokeWidth="1.5" />
          <line x1="18" y1="7" x2="18" y2="18" stroke="#334155" strokeWidth="1.5" />
          <line x1="22" y1="7" x2="22" y2="18" stroke="#334155" strokeWidth="1.5" />
          <line x1="20" y1="21" x2="20" y2="36" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (w.includes('knife')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Kitchen knife">
          <path d="M 18,6 C 18,6 23,8 23,22 L 18,22 Z" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
          <rect x="17" y="22" width="4" height="14" rx="1.5" fill="#475569" />
        </svg>
      );
    }
    if (w.includes('whisk')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Wire balloon whisk">
          <ellipse cx="20" cy="15" rx="8" ry="10" fill="none" stroke="#64748B" strokeWidth="1.5" />
          <ellipse cx="20" cy="15" rx="4" ry="10" fill="none" stroke="#64748B" strokeWidth="1.5" />
          <line x1="20" y1="5" x2="20" y2="25" stroke="#64748B" strokeWidth="1.5" />
          <rect x="18.5" y="25" width="3" height="12" rx="1" fill="#334155" />
        </svg>
      );
    }
    if (w.includes('spatula')) {
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Slotted cooking spatula">
          <rect x="14" y="6" width="12" height="16" rx="2" fill="#94A3B8" stroke="#334155" strokeWidth="1.5" />
          <line x1="18" y1="9" x2="18" y2="19" stroke="#334155" strokeWidth="1" />
          <line x1="22" y1="9" x2="22" y2="19" stroke="#334155" strokeWidth="1" />
          <line x1="20" y1="22" x2="20" y2="36" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      );
    }
    if (name.includes('hammer') || w.includes('hammer')) {
      return <Hammer {...iconProps} className="w-10 h-10 text-zinc-700" />;
    }

    // 5. Fruits & Food
    if (name.includes('apple') || w.includes('apple')) {
      return <Apple {...iconProps} className="w-10 h-10 text-rose-600" />;
    }
    if (name.includes('fruit') || w.includes('orange') || w.includes('lemon') || w.includes('lime') || w.includes('grapefruit') || w.includes('tangerine')) {
      const isYellow = w.includes('lemon') || w.includes('lime');
      return (
        <svg viewBox="0 0 40 40" className="w-10 h-10" aria-label="Citrus fruit segment wheel">
          <circle cx="20" cy="20" r="14" fill={isYellow ? '#EAB308' : '#F97316'} stroke={isYellow ? '#A16207' : '#C2410C'} strokeWidth="1.5" />
          <circle cx="20" cy="20" r="12" fill={isYellow ? '#FEF08A' : '#FED7AA'} stroke={isYellow ? '#EAB308' : '#F97316'} strokeWidth="1" />
          <line x1="20" y1="8" x2="20" y2="32" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="8" y1="20" x2="32" y2="20" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="11.5" y1="11.5" x2="28.5" y2="28.5" stroke="#FFFFFF" strokeWidth="1.5" />
          <line x1="11.5" y1="28.5" x2="28.5" y2="11.5" stroke="#FFFFFF" strokeWidth="1.5" />
          <circle cx="20" cy="20" r="2" fill={isYellow ? '#EAB308' : '#F97316'} />
        </svg>
      );
    }

    // 6. Nature, Plants & Elements
    if (name.includes('tree') || w.includes('tree') || w.includes('forest') || w.includes('taiga') || w.includes('oak')) {
      return <TreePine {...iconProps} className="w-10 h-10 text-emerald-600" />;
    }
    if (name.includes('leaf') || w.includes('plant') || w.includes('fern') || w.includes('moss') || w.includes('algae') || w.includes('cactus') || w.includes('mushroom')) {
      return <Leaf {...iconProps} className="w-10 h-10 text-emerald-500" />;
    }
    if (name.includes('drop') || w.includes('water') || w.includes('rain') || w.includes('liquid') || w.includes('liter')) {
      return <Droplet {...iconProps} className="w-10 h-10 text-sky-500" />;
    }
    if (name.includes('wind') || w.includes('air') || w.includes('gas') || w.includes('oxygen') || w.includes('helium') || w.includes('argon') || w.includes('neutrino')) {
      return <Wind {...iconProps} className="w-10 h-10 text-cyan-600" />;
    }
    if (name.includes('flame') || w.includes('fire') || w.includes('heat') || w.includes('coal') || w.includes('boil')) {
      return <Flame {...iconProps} className="w-10 h-10 text-orange-500" />;
    }
    if (name.includes('snow') || w.includes('ice') || w.includes('freeze') || w.includes('tundra')) {
      return <Snowflake {...iconProps} className="w-10 h-10 text-sky-400" />;
    }
    if (name.includes('cloud') || w.includes('vapor') || w.includes('evaporation') || w.includes('troposphere') || w.includes('stratosphere') || w.includes('condensation')) {
      return <Cloud {...iconProps} className="w-10 h-10 text-slate-500" />;
    }
    if (name.includes('mountain') || w.includes('rock') || w.includes('stone') || w.includes('himalaya') || w.includes('granite') || w.includes('sandstone') || w.includes('shale')) {
      return <Mountain {...iconProps} className="w-10 h-10 text-stone-600" />;
    }

    // 7. Science, Physics & Tools
    if (name.includes('compass')) return <Compass {...iconProps} className="w-10 h-10 text-blue-600" />;
    if (name.includes('heart')) return <Heart {...iconProps} className="w-10 h-10 text-rose-500" />;
    if (name.includes('shield')) return <Shield {...iconProps} className="w-10 h-10 text-indigo-600" />;
    if (name.includes('zap') || w.includes('electric') || w.includes('energy') || w.includes('electron') || w.includes('x-ray') || w.includes('copper')) {
      return <Zap {...iconProps} className="w-10 h-10 text-yellow-500" />;
    }
    if (name.includes('smile') || w.includes('human')) return <Smile {...iconProps} className="w-10 h-10 text-amber-500" />;
    if (name.includes('star') || w.includes('starfish')) return <Star {...iconProps} className="w-10 h-10 text-yellow-500" />;
    if (name.includes('radio') || w.includes('microwave') || w.includes('signal')) return <Radio {...iconProps} className="w-10 h-10 text-violet-600" />;
    if (name.includes('disc') || name.includes('wheel') || name.includes('pulley') || w.includes('cylinder')) {
      return <Disc {...iconProps} className="w-10 h-10 text-slate-700" />;
    }
    if (name.includes('box') || name.includes('cube') || name.includes('prism') || w.includes('carbon') || w.includes('quark')) {
      return <Box {...iconProps} className="w-10 h-10 text-blue-600" />;
    }
    if (name.includes('shapes') || name.includes('polygon') || name.includes('triangle') || w.includes('pyramid') || w.includes('tetrahedron')) {
      return <Shapes {...iconProps} className="w-10 h-10 text-indigo-600" />;
    }
    if (name.includes('circle')) return <Circle {...iconProps} className="w-10 h-10 text-blue-600" />;
    if (name.includes('square')) return <Square {...iconProps} className="w-10 h-10 text-blue-600" />;
    if (name.includes('palette') || w.includes('crayon') || w.includes('color')) return <Palette {...iconProps} className="w-10 h-10 text-pink-500" />;
    if (name.includes('pencil') || name.includes('pen') || w.includes('marker') || w.includes('chalk')) {
      return <PenTool {...iconProps} className="w-10 h-10 text-slate-700" />;
    }
    if (name.includes('eraser')) return <Eraser {...iconProps} className="w-10 h-10 text-rose-400" />;
    if (name.includes('bike') || name.includes('motorcycle') || w.includes('bicycle')) return <Bike {...iconProps} className="w-10 h-10 text-emerald-600" />;
    if (name.includes('car') || name.includes('automobile')) return <Car {...iconProps} className="w-10 h-10 text-blue-600" />;
    if (name.includes('bus')) return <Bus {...iconProps} className="w-10 h-10 text-amber-500" />;
    if (name.includes('ship') || name.includes('sailboat')) return <Ship {...iconProps} className="w-10 h-10 text-sky-600" />;
    if (name.includes('thermometer') || w.includes('temperature') || w.includes('melt')) return <Thermometer {...iconProps} className="w-10 h-10 text-rose-500" />;
    if (name.includes('waves') || w.includes('tide') || w.includes('ocean')) return <Waves {...iconProps} className="w-10 h-10 text-blue-500" />;
    if (name.includes('ruler') || w.includes('meter') || w.includes('centimeter') || w.includes('kilometer')) return <Ruler {...iconProps} className="w-10 h-10 text-amber-600" />;
    if (name.includes('gem') || w.includes('diamond') || w.includes('gold') || w.includes('silver') || w.includes('quartz') || w.includes('pyrite')) {
      return <Gem {...iconProps} className="w-10 h-10 text-amber-500" />;
    }
    if (name.includes('filter') || w.includes('kidney')) return <Filter {...iconProps} className="w-10 h-10 text-indigo-500" />;
    if (name.includes('bell') || w.includes('sound') || w.includes('ear')) return <Bell {...iconProps} className="w-10 h-10 text-amber-500" />;
    if (name.includes('activity') || w.includes('lever') || w.includes('muscle') || w.includes('cow') || w.includes('horse') || w.includes('sheep') || w.includes('deer')) {
      return <Activity {...iconProps} className="w-10 h-10 text-blue-600" />;
    }
    if (w.includes('eagle') || name.includes('feather')) {
      return <Feather {...iconProps} className="w-10 h-10 text-amber-800" />;
    }
    if (name.includes('scale')) {
      return <Scale {...iconProps} className="w-10 h-10 text-indigo-600" />;
    }

    // Universal fallback
    return <HelpCircle {...iconProps} className="w-10 h-10 text-gray-500" />;
  };

  return (
    <div
      data-testid="verbal-illustration-svg"
      className={`inline-flex flex-col items-center justify-center p-2 rounded-xl bg-white border border-gray-100 shadow-sm transition-all select-none ${className}`}
      style={{
        width: typeof size === 'number' ? `${size}px` : size,
        minHeight: typeof size === 'number' ? `${size}px` : size,
      }}
    >
      {/* Visual Icon Badge */}
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-b from-gray-50 to-blue-50/60 border border-gray-200/80 flex items-center justify-center shadow-inner">
        {renderIcon()}
      </div>

      {/* Word Text Label (Optional) */}
      {showWordLabel && cleanWord && (
        <span className="mt-2 text-xs font-black tracking-wide text-gray-900 text-center uppercase leading-tight line-clamp-1 max-w-full px-1">
          {cleanWord}
        </span>
      )}

      {/* Category sub-pill */}
      {showCategory && category && (
        <span className="mt-0.5 text-[10px] font-semibold text-gray-500 text-center tracking-tight leading-none line-clamp-1">
          {category}
        </span>
      )}
    </div>
  );
};
