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
  Music,
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
  Utensils,
  HelpCircle,
} from 'lucide-react';
import { CellVisual, VerbalGridData } from '../../types/ngat';

export interface VerbalIllustrationSVGProps {
  visual?: CellVisual;
  item?: VerbalGridData['items'][number];
  size?: number | string;
  showWordLabel?: boolean;
  className?: string;
}

export const VerbalIllustrationSVG: React.FC<VerbalIllustrationSVGProps> = ({
  visual,
  item,
  size = 110,
  showWordLabel = true,
  className = '',
}) => {
  // Extract word, category, and iconName from either item or visual
  const word = item?.word ?? (visual?.type === 'verbal-word' ? visual.word : '');
  const category = item?.category ?? (visual?.type === 'verbal-word' ? visual.category : '');
  const iconName = (item as any)?.iconName ?? (visual?.type === 'verbal-word' ? visual.iconName : '') ?? '';

  const cleanWord = word.trim().toUpperCase();

  // Dynamic Icon Selection
  const renderIcon = () => {
    const iconProps = { className: 'w-10 h-10', strokeWidth: 2.2 };
    const name = iconName.toLowerCase();
    const w = cleanWord.toLowerCase();

    if (name.includes('sun') || w.includes('sun') || w.includes('solar')) return <Sun {...iconProps} className="w-10 h-10 text-amber-500" />;
    if (name.includes('moon') || w.includes('moon')) return <Moon {...iconProps} className="w-10 h-10 text-indigo-500" />;
    if (name.includes('planet') || w.includes('mars') || w.includes('jupiter') || w.includes('saturn') || w.includes('pluto')) {
      return <Disc {...iconProps} className="w-10 h-10 text-blue-600" />;
    }
    if (name.includes('tree') || w.includes('tree') || w.includes('forest') || w.includes('taiga')) return <TreePine {...iconProps} className="w-10 h-10 text-emerald-600" />;
    if (name.includes('leaf') || w.includes('plant') || w.includes('fern') || w.includes('moss') || w.includes('algae')) return <Leaf {...iconProps} className="w-10 h-10 text-emerald-500" />;
    if (name.includes('drop') || w.includes('water') || w.includes('rain') || w.includes('liquid')) return <Droplet {...iconProps} className="w-10 h-10 text-sky-500" />;
    if (name.includes('wind') || w.includes('air') || w.includes('gas') || w.includes('oxygen')) return <Wind {...iconProps} className="w-10 h-10 text-cyan-600" />;
    if (name.includes('flame') || w.includes('fire') || w.includes('heat') || w.includes('coal')) return <Flame {...iconProps} className="w-10 h-10 text-orange-500" />;
    if (name.includes('snow') || w.includes('ice') || w.includes('freeze') || w.includes('tundra')) return <Snowflake {...iconProps} className="w-10 h-10 text-sky-400" />;
    if (name.includes('mountain') || w.includes('rock') || w.includes('stone') || w.includes('himalaya')) return <Mountain {...iconProps} className="w-10 h-10 text-stone-600" />;
    if (name.includes('anchor') || w.includes('whale') || w.includes('marine') || w.includes('sea')) return <Anchor {...iconProps} className="w-10 h-10 text-blue-700" />;
    if (name.includes('fish') || w.includes('shark') || w.includes('salmon') || w.includes('trout')) return <Fish {...iconProps} className="w-10 h-10 text-teal-600" />;
    if (name.includes('bug') || name.includes('spider') || name.includes('bee') || w.includes('ant') || w.includes('insect')) {
      return <Bug {...iconProps} className="w-10 h-10 text-amber-700" />;
    }
    if (name.includes('compass')) return <Compass {...iconProps} className="w-10 h-10 text-blue-600" />;
    if (name.includes('heart')) return <Heart {...iconProps} className="w-10 h-10 text-rose-500" />;
    if (name.includes('shield')) return <Shield {...iconProps} className="w-10 h-10 text-indigo-600" />;
    if (name.includes('zap') || w.includes('electric') || w.includes('energy') || w.includes('electron')) return <Zap {...iconProps} className="w-10 h-10 text-yellow-500" />;
    if (name.includes('smile') || w.includes('human')) return <Smile {...iconProps} className="w-10 h-10 text-amber-500" />;
    if (name.includes('star') || w.includes('starfish')) return <Star {...iconProps} className="w-10 h-10 text-yellow-500" />;
    if (name.includes('radio') || w.includes('microwave') || w.includes('signal')) return <Radio {...iconProps} className="w-10 h-10 text-violet-600" />;
    if (name.includes('disc') || name.includes('wheel') || name.includes('pulley')) return <Disc {...iconProps} className="w-10 h-10 text-slate-700" />;
    if (name.includes('box') || name.includes('cube') || name.includes('prism')) return <Box {...iconProps} className="w-10 h-10 text-blue-600" />;
    if (name.includes('shapes') || name.includes('polygon') || name.includes('triangle')) return <Shapes {...iconProps} className="w-10 h-10 text-indigo-600" />;
    if (name.includes('circle')) return <Circle {...iconProps} className="w-10 h-10 text-blue-600" />;
    if (name.includes('square')) return <Square {...iconProps} className="w-10 h-10 text-blue-600" />;
    if (name.includes('music') || name.includes('violin') || name.includes('cello') || name.includes('trumpet') || name.includes('guitar')) {
      return <Music {...iconProps} className="w-10 h-10 text-purple-600" />;
    }
    if (name.includes('palette') || w.includes('crayon') || w.includes('color')) return <Palette {...iconProps} className="w-10 h-10 text-pink-500" />;
    if (name.includes('pencil') || name.includes('pen') || w.includes('marker')) return <PenTool {...iconProps} className="w-10 h-10 text-slate-700" />;
    if (name.includes('eraser')) return <Eraser {...iconProps} className="w-10 h-10 text-rose-400" />;
    if (name.includes('hammer')) return <Hammer {...iconProps} className="w-10 h-10 text-zinc-700" />;
    if (name.includes('utensils') || w.includes('spoon') || w.includes('fork') || w.includes('knife')) return <Utensils {...iconProps} className="w-10 h-10 text-slate-600" />;
    if (name.includes('bike') || name.includes('motorcycle')) return <Bike {...iconProps} className="w-10 h-10 text-emerald-600" />;
    if (name.includes('car') || name.includes('automobile')) return <Car {...iconProps} className="w-10 h-10 text-blue-600" />;
    if (name.includes('bus')) return <Bus {...iconProps} className="w-10 h-10 text-amber-500" />;
    if (name.includes('ship') || name.includes('sailboat')) return <Ship {...iconProps} className="w-10 h-10 text-sky-600" />;
    if (name.includes('thermometer') || w.includes('temperature') || w.includes('melt')) return <Thermometer {...iconProps} className="w-10 h-10 text-rose-500" />;
    if (name.includes('waves') || w.includes('tide') || w.includes('ocean')) return <Waves {...iconProps} className="w-10 h-10 text-blue-500" />;
    if (name.includes('ruler') || w.includes('meter') || w.includes('centimeter')) return <Ruler {...iconProps} className="w-10 h-10 text-amber-600" />;
    if (name.includes('gem') || w.includes('diamond') || w.includes('gold') || w.includes('silver')) return <Gem {...iconProps} className="w-10 h-10 text-amber-500" />;
    if (name.includes('filter') || w.includes('kidney')) return <Filter {...iconProps} className="w-10 h-10 text-indigo-500" />;
    if (name.includes('bell') || w.includes('sound')) return <Bell {...iconProps} className="w-10 h-10 text-amber-500" />;
    if (name.includes('activity') || w.includes('lever') || w.includes('muscle')) return <Activity {...iconProps} className="w-10 h-10 text-blue-600" />;

    // General fallback
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
      {showWordLabel && category && (
        <span className="mt-0.5 text-[10px] font-semibold text-gray-500 text-center tracking-tight leading-none line-clamp-1">
          {category}
        </span>
      )}
    </div>
  );
};
