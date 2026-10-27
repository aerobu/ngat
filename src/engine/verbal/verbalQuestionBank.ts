import {
  DifficultyLevel,
  NGATQuestion,
  ChoiceOption,
  VerbalGridData,
  CellVisual,
  CognitiveTrapType,
} from '../../types/ngat';
import { PRNG } from '../utils/prng';

interface VerbalItemDef {
  word: string;
  category: string;
  iconName: string;
  isOutlier?: boolean;
  explanation: string; // If distractor: why it belongs to the group. If outlier: why it doesn't belong.
}

interface VerbalQuestionDef {
  id: string;
  difficulty: DifficultyLevel;
  theme: string;
  sharedRule: string;
  outlierReason: string;
  items: [
    VerbalItemDef,
    VerbalItemDef,
    VerbalItemDef,
    VerbalItemDef,
    VerbalItemDef,
    VerbalItemDef
  ];
  hints: [string, string, string];
  stepByStepExplanation: string[];
  speedTip: string;
}

// 36 Curated 5th-Grade Verbal Classification Questions (9 per difficulty level)
const CURATED_VERBAL_QUESTIONS: VerbalQuestionDef[] = [
  // ==========================================================================
  // DIFFICULTY 1: Fundamental Concept & Habitat Classification (9 Questions)
  // ==========================================================================
  {
    id: 'verbal-d1-01',
    difficulty: 1,
    theme: 'Warm-Blooded Mammals vs Reptiles',
    sharedRule: 'All items are mammals that nurse their young, except the crocodile which is a cold-blooded reptile.',
    outlierReason: 'Crocodile is a cold-blooded reptile that lays eggs, while the other five are warm-blooded mammals.',
    items: [
      { word: 'Dolphin', category: 'Marine Mammal', iconName: 'dolphin', explanation: 'Dolphins are warm-blooded mammals that breathe air and nurse their calves.' },
      { word: 'Elephant', category: 'Land Mammal', iconName: 'elephant', explanation: 'Elephants are terrestrial mammals with warm blood and live young.' },
      { word: 'Crocodile', category: 'Reptile', iconName: 'crocodile', isOutlier: true, explanation: 'The crocodile is a cold-blooded reptile covered in scales that reproduces by laying leathery eggs.' },
      { word: 'Kangaroo', category: 'Marsupial Mammal', iconName: 'kangaroo', explanation: 'Kangaroos are warm-blooded marsupial mammals that nurse their joeys in pouches.' },
      { word: 'Bat', category: 'Flying Mammal', iconName: 'bat', explanation: 'Bats are the only flying mammals; they are warm-blooded and give birth to live pups.' },
      { word: 'Otter', category: 'Aquatic Mammal', iconName: 'otter', explanation: 'River and sea otters are mammals with dense fur and warm-blooded metabolism.' },
    ],
    hints: [
      'Think about how each animal regulates its body temperature and reproduces.',
      'Five of these animals are warm-blooded mammals that produce milk for their young.',
      'The crocodile is the only cold-blooded reptile among five warm-blooded mammals.',
    ],
    stepByStepExplanation: [
      'Examine the biological classification of each animal.',
      'Dolphins, elephants, kangaroos, bats, and otters are all mammals.',
      'The crocodile is an ectothermic (cold-blooded) reptile, making it the odd one out.',
    ],
    speedTip: 'When classifying animals, check body covering (fur vs scales) and birth type immediately.',
  },
  {
    id: 'verbal-d1-02',
    difficulty: 1,
    theme: 'Planets of the Solar System',
    sharedRule: 'All items are planets orbiting the Sun, except the Moon which is a natural satellite.',
    outlierReason: 'The Moon is a satellite orbiting Earth, while the other five are planets orbiting the Sun directly.',
    items: [
      { word: 'Mars', category: 'Terrestrial Planet', iconName: 'planet', explanation: 'Mars is the fourth planet from the Sun in our Solar System.' },
      { word: 'Jupiter', category: 'Gas Giant Planet', iconName: 'planet', explanation: 'Jupiter is the largest planet orbiting the Sun.' },
      { word: 'Moon', category: 'Natural Satellite', iconName: 'moon', isOutlier: true, explanation: 'The Moon orbits planet Earth as a natural satellite rather than orbiting the Sun directly as a primary planet.' },
      { word: 'Saturn', category: 'Gas Giant Planet', iconName: 'planet', explanation: 'Saturn is the sixth planet from the Sun, famous for its ring system.' },
      { word: 'Venus', category: 'Terrestrial Planet', iconName: 'planet', explanation: 'Venus is the second planet from the Sun with a dense atmosphere.' },
      { word: 'Neptune', category: 'Ice Giant Planet', iconName: 'planet', explanation: 'Neptune is the eighth and outermost recognized major planet in the Solar System.' },
    ],
    hints: [
      'Consider what celestial body each object orbits directly.',
      'Five of these objects orbit the Sun directly and have cleared their orbital neighborhoods.',
      'The Moon orbits Earth rather than the Sun, making it a natural satellite, not a primary planet.',
    ],
    stepByStepExplanation: [
      'Compare celestial bodies: Mars, Jupiter, Saturn, Venus, and Neptune orbit the Sun as major planets.',
      'The Moon orbits planet Earth, making it a natural satellite rather than a planet.',
    ],
    speedTip: 'Distinguish between primary planets and orbiting moons right away in astronomy questions.',
  },
  {
    id: 'verbal-d1-03',
    difficulty: 1,
    theme: 'Musical String Instruments',
    sharedRule: 'All items are acoustic stringed instruments, except the trumpet which is a brass instrument.',
    outlierReason: 'Trumpet is a brass wind instrument played with lip vibration, while the other five use vibrating strings.',
    items: [
      { word: 'Violin', category: 'String Instrument', iconName: 'violin', explanation: 'A violin produces sound from bowed or plucked strings over a wooden resonance box.' },
      { word: 'Cello', category: 'String Instrument', iconName: 'cello', explanation: 'A cello is a low-pitched member of the orchestral violin string family.' },
      { word: 'Trumpet', category: 'Brass Wind', iconName: 'trumpet', isOutlier: true, explanation: 'The trumpet produces sound via vibrating lips into a brass mouthpiece, not via vibrating strings.' },
      { word: 'Harp', category: 'String Instrument', iconName: 'harp', explanation: 'A harp has forty-seven plucked strings set in a triangular wooden frame.' },
      { word: 'Guitar', category: 'String Instrument', iconName: 'guitar', explanation: 'A guitar has six strings tuned across a fretted fingerboard.' },
      { word: 'Viola', category: 'String Instrument', iconName: 'viola', explanation: 'A viola is an alto stringed instrument played with a bow between violin and cello.' },
    ],
    hints: [
      'Look at how sound is generated in each musical instrument.',
      'Five of these instruments produce sound by vibrating strings.',
      'The trumpet produces sound through brass air vibration, not strings.',
    ],
    stepByStepExplanation: [
      'Identify the instrument family: violin, cello, harp, guitar, and viola belong to the chordophone (string) family.',
      'The trumpet is an aerophone belonging to the brass wind family.',
    ],
    speedTip: 'Categorize instruments by vibration source: strings, air columns, vibrating reeds, or percussion.',
  },
  {
    id: 'verbal-d1-04',
    difficulty: 1,
    theme: 'Kitchen Cutting Tools',
    sharedRule: 'All items are kitchen cooking and eating utensils, except the hammer which is a construction tool.',
    outlierReason: 'A hammer is a striking hand tool for nails and carpentry, while the other five are culinary utensils.',
    items: [
      { word: 'Spoon', category: 'Kitchen Utensil', iconName: 'utensils', explanation: 'A spoon is a culinary utensil used for scooping liquid or soft food.' },
      { word: 'Fork', category: 'Kitchen Utensil', iconName: 'utensils', explanation: 'A fork is a pronged dining utensil used for lifting food to the mouth.' },
      { word: 'Hammer', category: 'Carpentry Tool', iconName: 'hammer', isOutlier: true, explanation: 'A hammer is a heavy construction hand tool for driving nails, completely unrelated to cooking.' },
      { word: 'Knife', category: 'Kitchen Utensil', iconName: 'utensils', explanation: 'A knife is an edged culinary utensil for slicing and preparing food.' },
      { word: 'Whisk', category: 'Kitchen Utensil', iconName: 'utensils', explanation: 'A whisk is a wire cooking tool used to blend and whip ingredients.' },
      { word: 'Spatula', category: 'Kitchen Utensil', iconName: 'utensils', explanation: 'A spatula is a broad flat kitchen utensil used for flipping food on a skillet.' },
    ],
    hints: [
      'Think about where each tool is used in daily life.',
      'Five of these tools are found in a kitchen for cooking and dining.',
      'The hammer is a carpentry hardware tool, not a food preparation utensil.',
    ],
    stepByStepExplanation: [
      'Spoon, fork, knife, whisk, and spatula are all culinary kitchen utensils.',
      'The hammer belongs in a toolbox for construction and carpentry.',
    ],
    speedTip: 'Identify the setting (kitchen vs workshop) to rapidly spot the outlier.',
  },
  {
    id: 'verbal-d1-05',
    difficulty: 1,
    theme: 'Citrus Fruits',
    sharedRule: 'All items are citrus fruits with thick rinds and pulpy segments, except the apple which is a pome fruit.',
    outlierReason: 'An apple is a pome fruit with a core of seeds, whereas the other five are segmented citrus fruits.',
    items: [
      { word: 'Orange', category: 'Citrus Fruit', iconName: 'fruit', explanation: 'Oranges are round citrus fruits divided into juicy pulp segments inside a zesty rind.' },
      { word: 'Lemon', category: 'Citrus Fruit', iconName: 'fruit', explanation: 'Lemons are acidic yellow citrus fruits rich in citric acid.' },
      { word: 'Apple', category: 'Pome Fruit', iconName: 'apple', isOutlier: true, explanation: 'An apple is a deciduous pome fruit growing from a flower receptacle with an internal central core.' },
      { word: 'Lime', category: 'Citrus Fruit', iconName: 'fruit', explanation: 'Limes are small green citrus fruits with tart, acidic juice vesicles.' },
      { word: 'Grapefruit', category: 'Citrus Fruit', iconName: 'fruit', explanation: 'Grapefruit is a subtropical citrus fruit known for its relatively large size and bitter-sweet pulp.' },
      { word: 'Tangerine', category: 'Citrus Fruit', iconName: 'fruit', explanation: 'Tangerines are easy-peel citrus fruits closely related to mandarins.' },
    ],
    hints: [
      'Notice the botanical structure and thick oily rind of the fruits.',
      'Five of these fruits are segmented citrus fruits containing citric acid.',
      'The apple is a core-centered pome fruit, unlike the five citrus fruits.',
    ],
    stepByStepExplanation: [
      'Orange, lemon, lime, grapefruit, and tangerine are all citrus fruits (genus Citrus).',
      'The apple belongs to genus Malus and has a central seeded core, making it the botanical outlier.',
    ],
    speedTip: 'Notice sub-categories within fruits: citrus vs berries vs stone fruits vs pome fruits.',
  },
  {
    id: 'verbal-d1-06',
    difficulty: 1,
    theme: 'Invertebrate Insects',
    sharedRule: 'All items are six-legged insects with three body segments, except the spider which is an eight-legged arachnid.',
    outlierReason: 'A spider is an arachnid with eight legs and two body sections, while the other five are true insects.',
    items: [
      { word: 'Ant', category: 'Insect', iconName: 'bug', explanation: 'Ants are true insects with six jointed legs and three distinct body segments.' },
      { word: 'Beetle', category: 'Insect', iconName: 'bug', explanation: 'Beetles are six-legged insects with hardened protective wing cases (elytra).' },
      { word: 'Spider', category: 'Arachnid', iconName: 'spider', isOutlier: true, explanation: 'A spider is an eight-legged arachnid with only two main body tagmata and no antennae.' },
      { word: 'Grasshopper', category: 'Insect', iconName: 'bug', explanation: 'Grasshoppers are six-legged herbivorous insects with large jumping hind legs.' },
      { word: 'Butterfly', category: 'Insect', iconName: 'butterfly', explanation: 'Butterflies are flying insects with six legs, compound eyes, and three body parts.' },
      { word: 'Honeybee', category: 'Insect', iconName: 'bee', explanation: 'Honeybees are colonial insects possessing six legs and antennae.' },
    ],
    hints: [
      'Count the number of walking legs and body segments on each organism.',
      'Five of these organisms are insects with exactly six legs and three body sections.',
      'The spider has eight legs and two body parts, classifying it as an arachnid, not an insect.',
    ],
    stepByStepExplanation: [
      'Ant, beetle, grasshopper, butterfly, and honeybee are insects with 6 legs and 3 body sections (head, thorax, abdomen).',
      'A spider is an arachnid with 8 legs and a cephalothorax, making it the biological outlier.',
    ],
    speedTip: 'Arachnids (8 legs, no antennae) are classic distractors in insect (6 legs) questions.',
  },
  {
    id: 'verbal-d1-07',
    difficulty: 1,
    theme: 'Geometric 2D Polygons',
    sharedRule: 'All items are flat two-dimensional polygons made of straight edges, except the circle which has no edges.',
    outlierReason: 'A circle is formed by a continuous curved boundary with zero straight sides or vertices.',
    items: [
      { word: 'Triangle', category: 'Polygon', iconName: 'shapes', explanation: 'A triangle is a closed three-sided polygon with three straight vertices.' },
      { word: 'Square', category: 'Polygon', iconName: 'square', explanation: 'A square is a regular four-sided polygon with four equal straight sides.' },
      { word: 'Pentagon', category: 'Polygon', iconName: 'shapes', explanation: 'A pentagon is a five-sided polygon with straight edges and interior angles.' },
      { word: 'Circle', category: 'Curved Shape', iconName: 'circle', isOutlier: true, explanation: 'A circle consists of all points equidistant from a center along a smooth curve without straight edges.' },
      { word: 'Hexagon', category: 'Polygon', iconName: 'shapes', explanation: 'A hexagon is a polygon with six straight line segments and six vertices.' },
      { word: 'Octagon', category: 'Polygon', iconName: 'shapes', explanation: 'An octagon is an eight-sided straight-edged polygon.' },
    ],
    hints: [
      'Observe whether each shape is constructed from straight line segments.',
      'Five shapes are polygons bounded by straight lines and sharp vertices.',
      'The circle has a continuous curved perimeter with zero straight edges or vertices.',
    ],
    stepByStepExplanation: [
      'Polygons are closed 2D shapes composed of straight line segments: triangle, square, pentagon, hexagon, octagon.',
      'A circle is defined by a curve of constant radius from a point, lacking straight line edges.',
    ],
    speedTip: 'Check whether boundaries are composed of straight segments or continuous curves.',
  },
  {
    id: 'verbal-d1-08',
    difficulty: 1,
    theme: 'Writing Implements',
    sharedRule: 'All items are instruments used to apply marks or pigment to paper, except the eraser which removes them.',
    outlierReason: 'An eraser removes pigment and graphite from paper, while the other five apply marks onto paper.',
    items: [
      { word: 'Pencil', category: 'Marking Tool', iconName: 'pencil', explanation: 'A pencil deposits graphite pigment onto a writing surface.' },
      { word: 'Pen', category: 'Marking Tool', iconName: 'pen', explanation: 'A pen transfers liquid ink onto paper to produce written words.' },
      { word: 'Crayon', category: 'Marking Tool', iconName: 'palette', explanation: 'A crayon applies colored wax pigment to draw on paper surfaces.' },
      { word: 'Marker', category: 'Marking Tool', iconName: 'pen', explanation: 'A marker dispenses bright alcohol- or water-based ink through a felt tip.' },
      { word: 'Eraser', category: 'Removal Tool', iconName: 'eraser', isOutlier: true, explanation: 'An eraser frictionally lifts and removes graphite or ink from paper rather than applying marks.' },
      { word: 'Chalk', category: 'Marking Tool', iconName: 'pencil', explanation: 'Chalk deposits mineral calcium carbonate lines on blackboards or paper.' },
    ],
    hints: [
      'Determine the functional action of each item on paper.',
      'Five of these items add marks or colors onto paper.',
      'The eraser does the opposite: it removes marks from the paper.',
    ],
    stepByStepExplanation: [
      'Pencil, pen, crayon, marker, and chalk are tools designed to create marks and drawings.',
      'An eraser has the opposite function: it erases and deletes marks from the page.',
    ],
    speedTip: 'Look for tools that perform an opposite or reversing action (e.g. erasing vs writing).',
  },
  {
    id: 'verbal-d1-09',
    difficulty: 1,
    theme: 'Vehicles Powered by Land Wheels',
    sharedRule: 'All items are land transport vehicles that ride on wheels, except the sailboat which sails on water.',
    outlierReason: 'A sailboat travels across water using wind pressure on sails, while the other five are wheeled land vehicles.',
    items: [
      { word: 'Bicycle', category: 'Wheeled Land Vehicle', iconName: 'bike', explanation: 'A bicycle travels on land supported by two wheeled tires powered by pedals.' },
      { word: 'Automobile', category: 'Wheeled Land Vehicle', iconName: 'car', explanation: 'An automobile is a motor vehicle that drives on road surfaces using four wheels.' },
      { word: 'Sailboat', category: 'Watercraft', iconName: 'ship', isOutlier: true, explanation: 'A sailboat is a marine watercraft that floats on water and relies on canvas sails and wind.' },
      { word: 'Bus', category: 'Wheeled Land Vehicle', iconName: 'bus', explanation: 'A bus is a large wheeled land vehicle designed to carry many passengers on roads.' },
      { word: 'Motorcycle', category: 'Wheeled Land Vehicle', iconName: 'bike', explanation: 'A motorcycle is a two-wheeled land vehicle driven by an internal combustion engine.' },
      { word: 'Skateboard', category: 'Wheeled Land Vehicle', iconName: 'activity', explanation: 'A skateboard is a short deck mounted on four small wheels for riding on pavements.' },
    ],
    hints: [
      'Consider the medium of travel: land, water, or air.',
      'Five of these vehicles roll on wheels along solid ground.',
      'The sailboat navigates across water using wind sails, not wheels on land.',
    ],
    stepByStepExplanation: [
      'Bicycle, automobile, bus, motorcycle, and skateboard all travel on ground surfaces with wheels.',
      'The sailboat is an aquatic vessel designed to sail on open water without wheels.',
    ],
    speedTip: 'Sort vehicles by travel domain: terrestrial (land), marine (water), or aerospace (air).',
  },

  // ==========================================================================
  // DIFFICULTY 2: 5th Grade Science & Intermediate Classification (9 Questions)
  // ==========================================================================
  {
    id: 'verbal-d2-01',
    difficulty: 2,
    theme: 'Renewable Clean Energy Sources',
    sharedRule: 'All items are renewable clean energy sources, except coal which is a finite fossil fuel.',
    outlierReason: 'Coal is a non-renewable fossil fuel formed from buried prehistoric swamps, unlike naturally replenished energies.',
    items: [
      { word: 'Solar Power', category: 'Renewable Energy', iconName: 'sun', explanation: 'Solar energy harnesses electromagnetic radiation directly from the Sun.' },
      { word: 'Wind Power', category: 'Renewable Energy', iconName: 'wind', explanation: 'Wind turbines generate electrical energy from naturally flowing atmospheric air currents.' },
      { word: 'Hydroelectric', category: 'Renewable Energy', iconName: 'droplet', explanation: 'Hydroelectric generators harness the natural gravitational flow of running water.' },
      { word: 'Coal', category: 'Fossil Fuel', iconName: 'flame', isOutlier: true, explanation: 'Coal is a finite, combustible sedimentary fossil fuel that takes millions of years to form and depletes.' },
      { word: 'Geothermal', category: 'Renewable Energy', iconName: 'thermometer', explanation: 'Geothermal energy taps natural thermal heat stored deep inside the Earth crust.' },
      { word: 'Tidal Energy', category: 'Renewable Energy', iconName: 'waves', explanation: 'Tidal energy utilizes the gravitational pull of the Moon on oceanic tides.' },
    ],
    hints: [
      'Think about whether each energy source can be naturally replenished on a human timescale.',
      'Five of these energies are inexhaustible renewable resources.',
      'Coal is a non-renewable fossil fuel that takes millions of years to form and cannot be quickly replenished.',
    ],
    stepByStepExplanation: [
      'Solar, wind, hydro, geothermal, and tidal energies are infinite renewable clean energy sources.',
      'Coal is a carbon-rich fossil fuel that depletes upon combustion and emits greenhouse gases.',
    ],
    speedTip: 'Renewable vs non-renewable is one of the most tested 5th-grade NGAT science categories.',
  },
  {
    id: 'verbal-d2-02',
    difficulty: 2,
    theme: 'Three-Dimensional Polyhedra',
    sharedRule: 'All items are polyhedra bounded entirely by flat polygon faces, except the cylinder which has a curved side.',
    outlierReason: 'A cylinder has a continuous curved lateral surface, while the other five are flat-faced polyhedra.',
    items: [
      { word: 'Cube', category: 'Polyhedron', iconName: 'box', explanation: 'A cube is a regular polyhedron bounded entirely by six flat square faces.' },
      { word: 'Pyramid', category: 'Polyhedron', iconName: 'shapes', explanation: 'A pyramid is a polyhedron with a polygon base and flat triangular sloping faces.' },
      { word: 'Cylinder', category: 'Curved Solid', iconName: 'disc', isOutlier: true, explanation: 'A cylinder is bounded by a curved continuous lateral surface connecting two parallel circular bases.' },
      { word: 'Prism', category: 'Polyhedron', iconName: 'box', explanation: 'A prism is a polyhedron consisting of two congruent polygon bases linked by flat rectangular sides.' },
      { word: 'Tetrahedron', category: 'Polyhedron', iconName: 'shapes', explanation: 'A tetrahedron is a triangular pyramid formed by four flat triangular faces.' },
      { word: 'Octahedron', category: 'Polyhedron', iconName: 'shapes', explanation: 'An octahedron is a solid polyhedron with eight flat triangular faces.' },
    ],
    hints: [
      'Examine the surfaces of these 3D geometric shapes: are they all flat polygons?',
      'Five of these shapes are polyhedra made exclusively of flat polygonal faces.',
      'The cylinder has a curved lateral surface, meaning it is not a true polyhedron.',
    ],
    stepByStepExplanation: [
      'A polyhedron is a 3D solid bounded strictly by flat polygonal faces (cube, pyramid, prism, tetrahedron, octahedron).',
      'A cylinder features a smooth curved surface wrapping around its axis, classifying it as a non-polyhedral solid.',
    ],
    speedTip: 'Polyhedra must have 100% flat polygon faces; any curve (cylinder, cone, sphere) breaks the rule.',
  },
  {
    id: 'verbal-d2-03',
    difficulty: 2,
    theme: 'States of Matter Phase Changes (Endothermic: Absorbing Heat)',
    sharedRule: 'All items represent endothermic phase changes requiring added heat, except freezing which releases heat.',
    outlierReason: 'Freezing is an exothermic phase change that releases heat into the environment, unlike melting or evaporating.',
    items: [
      { word: 'Melting', category: 'Phase Change (Endothermic)', iconName: 'thermometer', explanation: 'Melting requires heat energy absorption to break solid bonds into liquid.' },
      { word: 'Evaporation', category: 'Phase Change (Endothermic)', iconName: 'cloud', explanation: 'Evaporation absorbs thermal energy to transform liquid molecules into vapor.' },
      { word: 'Boiling', category: 'Phase Change (Endothermic)', iconName: 'flame', explanation: 'Boiling absorbs continuous thermal heat to rapidly convert bulk liquid to gas.' },
      { word: 'Sublimation', category: 'Phase Change (Endothermic)', iconName: 'wind', explanation: 'Sublimation absorbs energy to convert solid directly to gas without becoming liquid.' },
      { word: 'Freezing', category: 'Phase Change (Exothermic)', iconName: 'snowflake', isOutlier: true, explanation: 'Freezing releases thermal heat energy as liquid molecules settle into fixed crystalline solid lattices.' },
      { word: 'Vaporization', category: 'Phase Change (Endothermic)', iconName: 'cloud', explanation: 'Vaporization requires thermal heat input to overcome molecular attractions.' },
    ],
    hints: [
      'Consider the thermodynamic direction: does the substance absorb heat or release heat?',
      'Five of these phase transitions require heating the substance up.',
      'Freezing occurs when thermal energy is removed (cooling down), releasing heat into surroundings.',
    ],
    stepByStepExplanation: [
      'Melting, evaporation, boiling, sublimation, and vaporization are endothermic: they absorb heat to loosen bonds.',
      'Freezing is exothermic: molecules slow down and release thermal energy to solidify.',
    ],
    speedTip: 'Classify phase changes by heating up (solid->liquid->gas) vs cooling down (gas->liquid->solid).',
  },
  {
    id: 'verbal-d2-04',
    difficulty: 2,
    theme: 'Atmospheric Layers of Earth',
    sharedRule: 'All items are concentric gaseous atmospheric layers surrounding Earth, except the lithosphere which is solid rock.',
    outlierReason: 'The lithosphere is the rigid solid rocky crust and upper mantle of Earth, not a gaseous atmospheric layer.',
    items: [
      { word: 'Troposphere', category: 'Atmospheric Layer', iconName: 'cloud', explanation: 'The troposphere is the lowest gaseous layer where Earth weather occurs.' },
      { word: 'Stratosphere', category: 'Atmospheric Layer', iconName: 'cloud', explanation: 'The stratosphere contains the protective ozone layer above the troposphere.' },
      { word: 'Lithosphere', category: 'Geological Layer', iconName: 'mountain', isOutlier: true, explanation: 'The lithosphere comprises Earth solid rocky crust and uppermost solid mantle, not gaseous air.' },
      { word: 'Mesosphere', category: 'Atmospheric Layer', iconName: 'wind', explanation: 'The mesosphere is the middle atmospheric layer where meteors burn upon entry.' },
      { word: 'Thermosphere', category: 'Atmospheric Layer', iconName: 'sun', explanation: 'The thermosphere is an upper atmospheric layer with high ultraviolet ionization.' },
      { word: 'Exosphere', category: 'Atmospheric Layer', iconName: 'compass', explanation: 'The exosphere is the outermost diffuse atmospheric boundary merging into space.' },
    ],
    hints: [
      'Differentiate between the gaseous sky layers and the solid crust beneath your feet.',
      'Five of these are atmospheric gas layers ending in -sphere.',
      'The lithosphere is the solid rocky crust of the geosphere, not an atmospheric gas layer.',
    ],
    stepByStepExplanation: [
      'Troposphere, stratosphere, mesosphere, thermosphere, and exosphere constitute Earth gaseous atmosphere.',
      'The lithosphere refers to the brittle rocky surface crust of the geosphere.',
    ],
    speedTip: 'Notice deceptive suffixes: all end in "-sphere", but one is solid geology while five are air.',
  },
  {
    id: 'verbal-d2-05',
    difficulty: 2,
    theme: 'Photosynthetic Autotrophs (Plants & Algae)',
    sharedRule: 'All items are photosynthetic autotrophs that produce their own food, except the mushroom which is a decomposing fungus.',
    outlierReason: 'Mushroom is a heterotrophic fungus that absorbs decomposed organic nutrients, incapable of photosynthesis.',
    items: [
      { word: 'Oak Tree', category: 'Autotroph / Plant', iconName: 'tree', explanation: 'Oak trees carry out photosynthesis using chlorophyll inside leaf chloroplasts.' },
      { word: 'Fern', category: 'Autotroph / Plant', iconName: 'leaf', explanation: 'Ferns are vascular green plants that synthesize carbohydrates via sunlight.' },
      { word: 'Mushroom', category: 'Heterotroph / Fungus', iconName: 'leaf', isOutlier: true, explanation: 'Mushrooms are fungal fruiting bodies that lack chlorophyll and must absorb nutrients from decaying organic matter.' },
      { word: 'Cactus', category: 'Autotroph / Plant', iconName: 'leaf', explanation: 'Cacti are succulent green plants that perform photosynthesis in their stems.' },
      { word: 'Green Algae', category: 'Autotroph / Protist', iconName: 'droplet', explanation: 'Green algae use photosynthetic pigments to manufacture sugars from sunlight.' },
      { word: 'Moss', category: 'Autotroph / Plant', iconName: 'leaf', explanation: 'Mosses are non-vascular green plants possessing chlorophyll for photosynthesis.' },
    ],
    hints: [
      'Think about how each organism acquires its food and energy: sunlight or decomposition?',
      'Five of these organisms possess chlorophyll and create their own food through photosynthesis.',
      'The mushroom is a fungus with no chlorophyll; it obtains nutrients by decomposing organic matter.',
    ],
    stepByStepExplanation: [
      'Oak, fern, cactus, green algae, and moss are autotrophic producers using sunlight and chlorophyll.',
      'Mushrooms belong to Kingdom Fungi: they lack chlorophyll and feed heterotrophically on decomposing matter.',
    ],
    speedTip: 'Fungi (mushrooms, molds) are never plants and never perform photosynthesis.',
  },
  {
    id: 'verbal-d2-06',
    difficulty: 2,
    theme: 'Warm-Blooded Marine Mammals that Breathe with Lungs',
    sharedRule: 'All items are marine mammals that breathe oxygen with lungs, except the shark which is a fish with gills.',
    outlierReason: 'A shark is a cartilaginous fish that breathes dissolved oxygen with gills, not a lung-breathing mammal.',
    items: [
      { word: 'Blue Whale', category: 'Marine Mammal', iconName: 'anchor', explanation: 'Blue whales are warm-blooded baleen mammals that surface to breathe air with lungs.' },
      { word: 'Seal', category: 'Marine Mammal', iconName: 'shield', explanation: 'Seals are semiaquatic pinniped mammals with fur and pulmonary lung respiration.' },
      { word: 'Shark', category: 'Cartilaginous Fish', iconName: 'fish', isOutlier: true, explanation: 'Sharks are cold-blooded cartilaginous fish that extract dissolved oxygen through gill slits.' },
      { word: 'Walrus', category: 'Marine Mammal', iconName: 'shield', explanation: 'Walruses are large flippered arctic mammals that nurse their young with milk.' },
      { word: 'Sea Lion', category: 'Marine Mammal', iconName: 'shield', explanation: 'Sea lions are eared marine mammals that breathe atmospheric air with lungs.' },
      { word: 'Manatee', category: 'Marine Mammal', iconName: 'anchor', explanation: 'Manatees are fully aquatic herbivorous mammals that surface for atmospheric oxygen.' },
    ],
    hints: [
      'Look at how each sea animal breathes: through lungs surfacing for air, or through gills underwater?',
      'Five of these creatures are marine mammals that give birth to live calves and have lungs.',
      'The shark is a fish with gills and a cartilaginous skeleton, not a mammal.',
    ],
    stepByStepExplanation: [
      'Whales, seals, walruses, sea lions, and manatees are all mammals with lungs and warm blood.',
      'A shark is a class Chondrichthyes fish that uses gills to breathe underwater.',
    ],
    speedTip: 'Distinguish marine mammals (whales, seals, manatees) from marine fish (sharks, tuna).',
  },
  {
    id: 'verbal-d2-07',
    difficulty: 2,
    theme: 'Metric Measurement Units of Length',
    sharedRule: 'All items are metric units of distance and length, except the liter which measures liquid volume.',
    outlierReason: 'A liter is a metric measurement unit of capacity and volume, whereas the other five measure linear distance.',
    items: [
      { word: 'Meter', category: 'Metric Length', iconName: 'ruler', explanation: 'The meter is the base SI unit of linear length and distance.' },
      { word: 'Centimeter', category: 'Metric Length', iconName: 'ruler', explanation: 'A centimeter is one-hundredth of a meter, measuring short distances.' },
      { word: 'Kilometer', category: 'Metric Length', iconName: 'ruler', explanation: 'A kilometer equals one thousand meters, measuring geographic road distances.' },
      { word: 'Liter', category: 'Metric Volume', iconName: 'droplet', isOutlier: true, explanation: 'A liter is a metric unit of liquid volume and capacity (equal to 1,000 cm³), not linear distance.' },
      { word: 'Millimeter', category: 'Metric Length', iconName: 'ruler', explanation: 'A millimeter is one-thousandth of a meter, measuring precise physical lengths.' },
      { word: 'Decimeter', category: 'Metric Length', iconName: 'ruler', explanation: 'A decimeter equals ten centimeters, a linear unit of length.' },
    ],
    hints: [
      'Determine what physical dimension each metric unit measures: distance or volume?',
      'Five of these units measure how long or tall an object is.',
      'The liter measures capacity or liquid volume (like soda or water), not distance.',
    ],
    stepByStepExplanation: [
      'Meter, centimeter, kilometer, millimeter, and decimeter all measure 1-dimensional length and distance.',
      'The liter measures 3-dimensional volume/capacity, making it the dimensional outlier.',
    ],
    speedTip: 'Match units to physical properties: length vs volume vs mass vs time.',
  },
  {
    id: 'verbal-d2-08',
    difficulty: 2,
    theme: 'Herbivorous Grazing Animals',
    sharedRule: 'All items are strict herbivores that feed exclusively on plants, except the lion which is an obligate carnivore.',
    outlierReason: 'A lion is an obligate carnivore that hunts other animals for meat, unlike plant-grazing herbivores.',
    items: [
      { word: 'Cow', category: 'Herbivore', iconName: 'activity', explanation: 'Cows are ruminant herbivores that graze exclusively on grasses and foliage.' },
      { word: 'Sheep', category: 'Herbivore', iconName: 'activity', explanation: 'Sheep are herbivorous ruminants with specialized teeth for clipping vegetation.' },
      { word: 'Lion', category: 'Obligate Carnivore', iconName: 'shield', isOutlier: true, explanation: 'Lions are apex predatory carnivores that feed exclusively on animal prey flesh.' },
      { word: 'Horse', category: 'Herbivore', iconName: 'activity', explanation: 'Horses are large grazing herbivores with single-chambered stomachs adapted to pasture.' },
      { word: 'Deer', category: 'Herbivore', iconName: 'activity', explanation: 'Deer are browsing herbivores that consume leaves, twigs, and bark.' },
      { word: 'Zebra', category: 'Herbivore', iconName: 'activity', explanation: 'Zebras are African herbivorous equines that feed on tall savanna grasses.' },
    ],
    hints: [
      'Examine the primary diet of each animal: plants only or hunted meat?',
      'Five of these animals are peaceful plant-grazing herbivores.',
      'The lion is a predatory carnivore that hunts other animals for meat.',
    ],
    stepByStepExplanation: [
      'Cow, sheep, horse, deer, and zebra are primary consumers (herbivores).',
      'The lion is a secondary/tertiary consumer (carnivore) that preys on other mammals.',
    ],
    speedTip: 'Dietary role (herbivore vs carnivore vs omnivore) is a central 5th-grade NGAT concept.',
  },
  {
    id: 'verbal-d2-09',
    difficulty: 2,
    theme: 'Sedimentary Rock Formations',
    sharedRule: 'All items are sedimentary rocks formed by deposited mineral layers, except marble which is metamorphic.',
    outlierReason: 'Marble is a metamorphic rock formed when limestone is altered under extreme heat and tectonic pressure.',
    items: [
      { word: 'Sandstone', category: 'Sedimentary Rock', iconName: 'mountain', explanation: 'Sandstone forms through compaction and cementation of mineral sand grains over geological time.' },
      { word: 'Limestone', category: 'Sedimentary Rock', iconName: 'mountain', explanation: 'Limestone is a sedimentary rock formed from accumulated calcite shells and coral fragments.' },
      { word: 'Shale', category: 'Sedimentary Rock', iconName: 'mountain', explanation: 'Shale is a fine-grained sedimentary rock formed by compacted silt and clay mud layers.' },
      { word: 'Marble', category: 'Metamorphic Rock', iconName: 'mountain', isOutlier: true, explanation: 'Marble is a metamorphic rock recrystallized under intense subterranean heat and tectonic pressure.' },
      { word: 'Conglomerate', category: 'Sedimentary Rock', iconName: 'mountain', explanation: 'Conglomerate is a clastic sedimentary rock containing rounded river gravel cemented in a matrix.' },
      { word: 'Siltstone', category: 'Sedimentary Rock', iconName: 'mountain', explanation: 'Siltstone is a sedimentary rock formed by consolidated silt particles.' },
    ],
    hints: [
      'Think about the rock cycle category: igneous, sedimentary, or metamorphic.',
      'Five of these rocks are sedimentary, formed by deposition and compression of sediments.',
      'Marble is formed when existing limestone undergoes high heat and pressure, making it metamorphic.',
    ],
    stepByStepExplanation: [
      'Sandstone, limestone, shale, conglomerate, and siltstone are all sedimentary rocks.',
      'Marble is a metamorphic rock formed by the recrystallization of limestone under heat and pressure.',
    ],
    speedTip: 'The three rock types (igneous, sedimentary, metamorphic) frequently anchor earth science items.',
  },

  // ==========================================================================
  // DIFFICULTY 3: Advanced Concepts, Systems, & Relational Semantics (9 Questions)
  // ==========================================================================
  {
    id: 'verbal-d3-01',
    difficulty: 3,
    theme: 'Invertebrates with Open Circulatory Systems',
    sharedRule: 'All items are invertebrates with exoskeletons and open circulation, except the frog which is an amphibian vertebrate.',
    outlierReason: 'A frog is a vertebrate amphibian with an internal bony skeleton and closed circulation with a 3-chambered heart.',
    items: [
      { word: 'Lobster', category: 'Arthropod Invertebrate', iconName: 'fish', explanation: 'Lobsters are marine arthropods with chitinous exoskeletons and hemolymph open circulation.' },
      { word: 'Beetle', category: 'Arthropod Invertebrate', iconName: 'bug', explanation: 'Beetles are invertebrate insects with external hard carapaces and open circulatory systems.' },
      { word: 'Frog', category: 'Amphibian Vertebrate', iconName: 'activity', isOutlier: true, explanation: 'Frogs are vertebrates with internal bone skeletons, spinal cords, and closed arterial circulation.' },
      { word: 'Crab', category: 'Arthropod Invertebrate', iconName: 'shield', explanation: 'Crabs are decapod invertebrates with calcified exoskeletons and no internal spine.' },
      { word: 'Grasshopper', category: 'Arthropod Invertebrate', iconName: 'bug', explanation: 'Grasshoppers are invertebrate insects with open body cavities bathed in hemolymph.' },
      { word: 'Dragonfly', category: 'Arthropod Invertebrate', iconName: 'butterfly', explanation: 'Dragonflies are flying arthropod invertebrates lacking any internal bone structure.' },
    ],
    hints: [
      'Check for an internal backbone and spinal column vs an external chitin exoskeleton.',
      'Five of these organisms are invertebrates with hard outer shells and no internal bones.',
      'The frog is a vertebrate amphibian with an internal skeletal system and spine.',
    ],
    stepByStepExplanation: [
      'Lobster, beetle, crab, grasshopper, and dragonfly are all arthropods: invertebrates with exoskeletons.',
      'A frog is a vertebrate possessing an internal endoskeleton with a backbone.',
    ],
    speedTip: 'Vertebrate (internal skeleton) vs Invertebrate (no spine) is a higher-tier biological discriminator.',
  },
  {
    id: 'verbal-d3-02',
    difficulty: 3,
    theme: 'Pure Chemical Elements (Single Atomic Species)',
    sharedRule: 'All items are pure elemental substances from the periodic table, except water which is a chemical compound.',
    outlierReason: 'Water is a chemical compound made of two bonded elements (H₂O), whereas the other five are pure single elements.',
    items: [
      { word: 'Gold', category: 'Chemical Element (Au)', iconName: 'gem', explanation: 'Gold is a pure metallic element consisting solely of atoms with 79 protons.' },
      { word: 'Oxygen', category: 'Chemical Element (O)', iconName: 'wind', explanation: 'Oxygen is a pure chemical element consisting exclusively of atoms with atomic number 8.' },
      { word: 'Water', category: 'Chemical Compound (H₂O)', iconName: 'droplet', isOutlier: true, explanation: 'Water is a molecular compound chemically bonded from two distinct elements: hydrogen and oxygen.' },
      { word: 'Iron', category: 'Chemical Element (Fe)', iconName: 'shield', explanation: 'Iron is a pure transition metal element found on the periodic table.' },
      { word: 'Carbon', category: 'Chemical Element (C)', iconName: 'box', explanation: 'Carbon is a fundamental nonmetallic chemical element with atomic number 6.' },
      { word: 'Silver', category: 'Chemical Element (Ag)', iconName: 'gem', explanation: 'Silver is a pure lustrous elemental transition metal.' },
    ],
    hints: [
      'Distinguish between pure chemical elements and bonded molecular compounds.',
      'Five of these substances appear directly on the periodic table of elements as single symbols.',
      'Water is a compound composed of two hydrogen atoms bonded to one oxygen atom (H₂O).',
    ],
    stepByStepExplanation: [
      'Gold (Au), Oxygen (O), Iron (Fe), Carbon (C), and Silver (Ag) are pure chemical elements.',
      'Water (H₂O) is a chemical compound formed by chemical bonds between different elements.',
    ],
    speedTip: 'If a substance has a chemical formula uniting two different elements, it is a compound, not an element.',
  },
  {
    id: 'verbal-d3-03',
    difficulty: 3,
    theme: 'Digestive System Organs (Alimentary Tract)',
    sharedRule: 'All items are organs of the human gastrointestinal digestive tract, except the kidney which belongs to the urinary system.',
    outlierReason: 'The kidney is an excretory organ that filters metabolic blood waste into urine, not an organ of the digestive canal.',
    items: [
      { word: 'Stomach', category: 'Digestive Organ', iconName: 'heart', explanation: 'The stomach secretes gastric acid and digestive enzymes to break down ingested food.' },
      { word: 'Small Intestine', category: 'Digestive Organ', iconName: 'activity', explanation: 'The small intestine absorbs broken-down nutrients into the bloodstream.' },
      { word: 'Kidney', category: 'Excretory / Urinary Organ', iconName: 'filter', isOutlier: true, explanation: 'The kidney filters nitrogenous wastes and excess salts from the bloodstream to produce urine.' },
      { word: 'Esophagus', category: 'Digestive Organ', iconName: 'activity', explanation: 'The esophagus is the muscular tube conducting food from the pharynx to the stomach via peristalsis.' },
      { word: 'Large Intestine', category: 'Digestive Organ', iconName: 'activity', explanation: 'The large intestine absorbs remaining water and compacts digestive waste into feces.' },
      { word: 'Pancreas', category: 'Digestive Accessory Organ', iconName: 'activity', explanation: 'The pancreas secretes vital digestive enzymes into the duodenum to break down macronutrients.' },
    ],
    hints: [
      'Consider the biological body system each organ belongs to: digestion vs blood waste filtration.',
      'Five of these organs participate directly in digesting food and absorbing nutritional calories.',
      'The kidney is part of the urinary excretory system, filtering blood to make urine.',
    ],
    stepByStepExplanation: [
      'Stomach, small intestine, esophagus, large intestine, and pancreas are integral organs of the human digestive system.',
      'Kidneys belong to the urinary/excretory system, responsible for renal blood filtration.',
    ],
    speedTip: 'Watch out for organs located near the abdomen: map each to its specific body system (digestive vs urinary).',
  },
  {
    id: 'verbal-d3-04',
    difficulty: 3,
    theme: 'Terrestrial Biomes Governed by Low Temperatures',
    sharedRule: 'All items are cold-climate subpolar biomes characterized by snow or permafrost, except the tropical savanna.',
    outlierReason: 'The tropical savanna is a warm grassland with distinct wet and dry seasons, not a cold subpolar biome.',
    items: [
      { word: 'Tundra', category: 'Cold Biome', iconName: 'snowflake', explanation: 'Tundra is a frigid subarctic biome characterized by permafrost and dwarf vegetation.' },
      { word: 'Taiga', category: 'Cold Biome', iconName: 'tree', explanation: 'Taiga is a vast circumpolar coniferous boreal forest with long sub-freezing winters.' },
      { word: 'Tropical Savanna', category: 'Warm Biome', iconName: 'sun', isOutlier: true, explanation: 'A tropical savanna is a hot grassland biome with warm temperatures year-round and seasonal monsoons.' },
      { word: 'Boreal Forest', category: 'Cold Biome', iconName: 'tree', explanation: 'Boreal forests are cold high-latitude ecosystems dominated by evergreen spruce and fir.' },
      { word: 'Polar Ice Cap', category: 'Cold Biome', iconName: 'snowflake', explanation: 'Polar ice caps are high-latitude frozen biomes covered permanently by thick ice sheets.' },
      { word: 'Alpine Tundra', category: 'Cold Biome', iconName: 'mountain', explanation: 'Alpine tundra consists of cold high-elevation zones above the tree line with freezing temperatures.' },
    ],
    hints: [
      'Look at the average annual temperature and latitude of these global biomes.',
      'Five of these biomes are frozen, subarctic, or alpine cold-weather environments.',
      'The tropical savanna is located near the equator with warm year-round temperatures and dry seasons.',
    ],
    stepByStepExplanation: [
      'Tundra, taiga, boreal forest, polar ice cap, and alpine tundra are cold-climate biomes shaped by snow, ice, or permafrost.',
      'The tropical savanna is a hot tropical grassland, making it the climatic outlier.',
    ],
    speedTip: 'Group biomes by climate bands: polar/cold vs temperate vs equatorial/tropical.',
  },
  {
    id: 'verbal-d3-05',
    difficulty: 3,
    theme: 'Electromagnetic Spectrum Radiations',
    sharedRule: 'All items are wavelengths of electromagnetic radiation traveling at light speed, except sound which is mechanical.',
    outlierReason: 'Sound is a mechanical pressure wave requiring a physical matter medium, unlike electromagnetic waves.',
    items: [
      { word: 'Visible Light', category: 'Electromagnetic Wave', iconName: 'sun', explanation: 'Visible light is the band of electromagnetic spectrum wavelengths detected by human photoreceptors.' },
      { word: 'X-Rays', category: 'Electromagnetic Wave', iconName: 'zap', explanation: 'X-rays are high-energy electromagnetic waves capable of passing through soft tissues.' },
      { word: 'Sound Waves', category: 'Mechanical Pressure Wave', iconName: 'bell', isOutlier: true, explanation: 'Sound is a mechanical longitudinal compression wave that cannot travel through a vacuum and travels much slower.' },
      { word: 'Microwaves', category: 'Electromagnetic Wave', iconName: 'radio', explanation: 'Microwaves are electromagnetic radiation waves utilized in radar and thermal heating.' },
      { word: 'Radio Waves', category: 'Electromagnetic Wave', iconName: 'radio', explanation: 'Radio waves are the longest-wavelength electromagnetic waves used for telecommunication.' },
      { word: 'Infrared Waves', category: 'Electromagnetic Wave', iconName: 'flame', explanation: 'Infrared is electromagnetic thermal radiation emitted by warm objects.' },
    ],
    hints: [
      'Think about whether the wave can travel through empty outer space (a vacuum).',
      'Five of these waves are electromagnetic radiation that can travel through empty space at the speed of light.',
      'Sound is a mechanical wave created by physical particle collisions and cannot travel through a vacuum.',
    ],
    stepByStepExplanation: [
      'Visible light, X-rays, microwaves, radio waves, and infrared are electromagnetic oscillations traveling at 300,000 km/s in vacuum.',
      'Sound waves are mechanical pressure waves requiring physical gas, liquid, or solid media to propagate.',
    ],
    speedTip: 'Electromagnetic waves (travel in vacuum) vs Mechanical waves (require matter) is a classic physics test rule.',
  },
  {
    id: 'verbal-d3-06',
    difficulty: 3,
    theme: 'Thermal and Electrical Conductors',
    sharedRule: 'All items are good electrical and thermal conductors, except rubber which is an electrical insulator.',
    outlierReason: 'Rubber is an electrical and thermal insulator that prevents the flow of electrons, unlike conductive metals.',
    items: [
      { word: 'Copper', category: 'Conductor', iconName: 'zap', explanation: 'Copper has free valence electrons that allow electric current and heat to flow with minimal resistance.' },
      { word: 'Silver', category: 'Conductor', iconName: 'gem', explanation: 'Silver has the highest electrical conductivity of any metal at room temperature.' },
      { word: 'Rubber', category: 'Insulator', iconName: 'shield', isOutlier: true, explanation: 'Rubber tightly binds its valence electrons, blocking electron flow and serving as a safety insulator.' },
      { word: 'Aluminum', category: 'Conductor', iconName: 'box', explanation: 'Aluminum is a lightweight metal with high electrical and thermal conductivity.' },
      { word: 'Iron', category: 'Conductor', iconName: 'shield', explanation: 'Iron possesses metallic bonding that permits thermal and electrical conduction.' },
      { word: 'Gold', category: 'Conductor', iconName: 'gem', explanation: 'Gold is an excellent non-corrosive electrical conductor used in sensitive electronic contacts.' },
    ],
    hints: [
      'Consider how each material reacts when an electric voltage or thermal heat is applied.',
      'Five of these materials are metals that freely conduct electricity and heat.',
      'Rubber is an insulator used to coat wires because it resists and blocks electric current.',
    ],
    stepByStepExplanation: [
      'Copper, silver, aluminum, iron, and gold are metallic conductors with free electrons.',
      'Rubber is a polymer insulator with high electrical resistance, preventing current flow.',
    ],
    speedTip: 'Conductors allow electricity and heat to flow; insulators block flow. Look for the lone insulator.',
  },
  {
    id: 'verbal-d3-07',
    difficulty: 3,
    theme: 'Water Cycle Physical Processes',
    sharedRule: 'All items are natural hydrologic cycle processes moving water across Earth, except photosynthesis which is biochemical.',
    outlierReason: 'Photosynthesis is a biochemical process synthesizing sugars in plants, not a phase of the physical water cycle.',
    items: [
      { word: 'Evaporation', category: 'Water Cycle Process', iconName: 'cloud', explanation: 'Evaporation lifts liquid surface water into atmospheric water vapor via solar heating.' },
      { word: 'Condensation', category: 'Water Cycle Process', iconName: 'cloud', explanation: 'Condensation cools water vapor into visible cloud droplets and fog in the atmosphere.' },
      { word: 'Precipitation', category: 'Water Cycle Process', iconName: 'droplet', explanation: 'Precipitation returns atmospheric water to Earth surface as rain, sleet, snow, or hail.' },
      { word: 'Photosynthesis', category: 'Biochemical Process', iconName: 'leaf', isOutlier: true, explanation: 'Photosynthesis is a cellular metabolic process converting carbon dioxide and water into glucose and oxygen.' },
      { word: 'Transpiration', category: 'Water Cycle Process', iconName: 'leaf', explanation: 'Transpiration releases water vapor through microscopic plant leaf stomata into the atmosphere.' },
      { word: 'Infiltration', category: 'Water Cycle Process', iconName: 'droplet', explanation: 'Infiltration describes precipitation soaking downward through surface soil into groundwater aquifers.' },
    ],
    hints: [
      'Focus on the physical hydrological cycle that circulates water around the planet.',
      'Five of these terms describe stages of the water cycle: evaporating, condensing, raining, soaking, etc.',
      'Photosynthesis is a metabolic chemical reaction in plants that manufactures food, not a water cycle step.',
    ],
    stepByStepExplanation: [
      'Evaporation, condensation, precipitation, transpiration, and infiltration are phases of the global hydrologic cycle.',
      'Photosynthesis is a biochemical sugar-synthesizing reaction, making it the conceptual outlier.',
    ],
    speedTip: 'Separate physical transport cycles (water cycle) from cellular biochemical reactions (photosynthesis, cellular respiration).',
  },
  {
    id: 'verbal-d3-08',
    difficulty: 3,
    theme: 'Fundamental Mechanical Simple Machines',
    sharedRule: 'All items are classical simple machines that provide mechanical advantage, except the internal combustion engine.',
    outlierReason: 'An internal combustion engine is a complex powered motorized machine composed of hundreds of moving parts.',
    items: [
      { word: 'Lever', category: 'Simple Machine', iconName: 'activity', explanation: 'A lever is a rigid bar that pivots on a fulcrum to amplify applied mechanical force.' },
      { word: 'Pulley', category: 'Simple Machine', iconName: 'disc', explanation: 'A pulley is a grooved wheel with a rope designed to change force direction or multiply effort.' },
      { word: 'Engine', category: 'Complex Machine', iconName: 'zap', isOutlier: true, explanation: 'An engine is a complex mechanized multi-component device converting chemical fuel into mechanical work.' },
      { word: 'Inclined Plane', category: 'Simple Machine', iconName: 'mountain', explanation: 'An inclined plane is a flat sloping surface allowing loads to be lifted with less effort over greater distance.' },
      { word: 'Wedge', category: 'Simple Machine', iconName: 'shield', explanation: 'A wedge consists of two back-to-back inclined planes used to split, cut, or hold objects.' },
      { word: 'Wheel and Axle', category: 'Simple Machine', iconName: 'disc', explanation: 'A wheel and axle is a simple machine where a larger wheel rotates around a smaller central shaft.' },
    ],
    hints: [
      'Think about the 6 classical simple machines studied in elementary physics.',
      'Five of these are fundamental simple machines without motorized parts.',
      'The engine is a complex powered machine with hundreds of internal moving components.',
    ],
    stepByStepExplanation: [
      'Lever, pulley, inclined plane, wedge, and wheel and axle are members of the 6 classical simple machines.',
      'An engine is a complex compound machine with pistons, valves, and combustion chambers.',
    ],
    speedTip: 'Simple machines have few or zero moving parts; complex machines combine multiple mechanisms and external power.',
  },
  {
    id: 'verbal-d3-09',
    difficulty: 3,
    theme: 'Non-Vascular Seedless Plants vs Gymnosperms',
    sharedRule: 'All items are non-vascular bryophytes or seedless spore plants, except the pine tree which is a seeded gymnosperm.',
    outlierReason: 'A pine tree is a vascular gymnosperm that reproduces using woody seed cones, unlike spore-reproducing plants.',
    items: [
      { word: 'Moss', category: 'Spore-Producing Plant', iconName: 'leaf', explanation: 'Mosses are non-vascular bryophytes that reproduce by releasing microscopic spores into damp air.' },
      { word: 'Liverwort', category: 'Spore-Producing Plant', iconName: 'leaf', explanation: 'Liverworts are primitive non-vascular land plants that reproduce via spores and gemmae cups.' },
      { word: 'Pine Tree', category: 'Gymnosperm (Seed Plant)', iconName: 'tree', isOutlier: true, explanation: 'A pine tree is a vascular gymnosperm bearing true seeds inside specialized woody ovulate cones.' },
      { word: 'Hornwort', category: 'Spore-Producing Plant', iconName: 'leaf', explanation: 'Hornworts are non-vascular spore-bearing bryophytes with elongated sporangia.' },
      { word: 'Fern', category: 'Spore-Producing Plant', iconName: 'leaf', explanation: 'Ferns are vascular seedless plants that reproduce strictly through spores produced on frond sori.' },
      { word: 'Horsetail', category: 'Spore-Producing Plant', iconName: 'leaf', explanation: 'Horsetails are primitive seedless vascular plants producing spores from terminal strobili.' },
    ],
    hints: [
      'Consider the reproductive strategy: microscopic single-cell spores vs true seeds in cones.',
      'Five of these plants reproduce by releasing spores rather than seeds.',
      'The pine tree is a conifer that produces true seeds housed in woody pine cones.',
    ],
    stepByStepExplanation: [
      'Moss, liverwort, hornwort, fern, and horsetail reproduce without seeds using spores.',
      'Pine trees are gymnosperms: advanced seed plants that produce winged seeds in cones.',
    ],
    speedTip: 'Spore reproduction vs seed reproduction is a key botanical distinction tested on gifted assessments.',
  },

  // ==========================================================================
  // DIFFICULTY 4: 97th Percentile TAG Challenge & Deep Semantic Traps (9 Questions)
  // ==========================================================================
  {
    id: 'verbal-d4-01',
    difficulty: 4,
    theme: 'Noble Gases (Full Valence Shells) vs Reactive Non-Metals',
    sharedRule: 'All items are Group 18 noble gases with full valence electron shells, except chlorine which is a reactive halogen.',
    outlierReason: 'Chlorine is a highly reactive Group 17 halogen with 7 valence electrons, while the other five are inert noble gases.',
    items: [
      { word: 'Helium', category: 'Noble Gas (Group 18)', iconName: 'wind', explanation: 'Helium is an inert noble gas with a complete 2-electron valence shell, forming virtually no compounds.' },
      { word: 'Neon', category: 'Noble Gas (Group 18)', iconName: 'zap', explanation: 'Neon is a colorless, odorless noble gas with a full stable octet of eight valence electrons.' },
      { word: 'Chlorine', category: 'Halogen (Group 17)', iconName: 'droplet', isOutlier: true, explanation: 'Chlorine is a toxic, highly reactive halogen that aggressively attracts an eighth electron to complete its shell.' },
      { word: 'Argon', category: 'Noble Gas (Group 18)', iconName: 'wind', explanation: 'Argon is an abundant inert atmospheric noble gas with zero chemical reactivity under standard conditions.' },
      { word: 'Krypton', category: 'Noble Gas (Group 18)', iconName: 'zap', explanation: 'Krypton is a dense noble gas with a stable octet utilized in high-efficiency flash lamps.' },
      { word: 'Xenon', category: 'Noble Gas (Group 18)', iconName: 'zap', explanation: 'Xenon is a heavy noble gas with a full valence electron shell.' },
    ],
    hints: [
      'Consider the chemical reactivity and periodic table column (Group 18 vs Group 17).',
      'Five of these elements are completely inert noble gases with full outer electron shells.',
      'Chlorine is a halogen with 7 valence electrons that is extremely reactive, not an inert noble gas.',
    ],
    stepByStepExplanation: [
      'Helium, neon, argon, krypton, and xenon form Group 18 (the noble gases), known for chemical inertness.',
      'Chlorine belongs to Group 17 (the halogens): it is a vigorously reactive nonmetal, making it the chemical outlier.',
    ],
    speedTip: 'TAG Trap Alert: All six are nonmetal gases at room temperature, but only five are inert noble gases.',
  },
  {
    id: 'verbal-d4-02',
    difficulty: 4,
    theme: 'Vestigial Structures in Human Evolutionary Biology',
    sharedRule: 'All items are vestigial structures with reduced or lost ancestral functions, except the heart which is vital.',
    outlierReason: 'The heart is an indispensable vital circulatory organ, whereas the other five are rudimentary vestigial anatomical structures.',
    items: [
      { word: 'Wisdom Teeth', category: 'Vestigial Structure', iconName: 'smile', explanation: 'Wisdom teeth are vestigial third molars once needed by ancestral hominids for grinding coarse foliage.' },
      { word: 'Appendix', category: 'Vestigial Structure', iconName: 'shield', explanation: 'The human vermiform appendix is a reduced anatomical structure derived from an ancestral cecum.' },
      { word: 'Heart', category: 'Vital Organ', iconName: 'heart', isOutlier: true, explanation: 'The heart is an essential, actively vital muscular pump without which systemic oxygenated blood delivery fails immediately.' },
      { word: 'Tailbone (Coccyx)', category: 'Vestigial Structure', iconName: 'activity', explanation: 'The coccyx is a fused vestigial remnant of an ancestral mammalian skeletal tail.' },
      { word: 'Ear Muscles', category: 'Vestigial Structure', iconName: 'bell', explanation: 'Human auricularis ear muscles are vestigial remnants that once swiveled ears toward distant sounds.' },
      { word: 'Goosebumps Muscles', category: 'Vestigial Structure', iconName: 'activity', explanation: 'Arrector pili muscles are vestigial structures that once fluffed ancestral fur for insulation and intimidation.' },
    ],
    hints: [
      'Think about whether human survival depends on the primary function of each structure.',
      'Five of these structures are evolutionary leftovers (vestigial) that are no longer essential for human life.',
      'The heart is a vital organ essential for immediate survival, unlike the five vestigial structures.',
    ],
    stepByStepExplanation: [
      'Wisdom teeth, appendix, coccyx, auricular muscles, and arrector pili are vestigial evolutionary remnants.',
      'The heart is a critical organ necessary for circulating blood; its failure is fatal.',
    ],
    speedTip: 'Vestigial organs lack crucial modern survival functions; contrast them against vital organs.',
  },
  {
    id: 'verbal-d4-03',
    difficulty: 4,
    theme: 'Symbiotic Mutualistic Relationships (Both Species Benefit)',
    sharedRule: 'All items are mutualistic symbioses where both species benefit (+/+), except tick and deer which is parasitism (+/-).',
    outlierReason: 'Tick feeding on a deer is parasitism where the parasite benefits while the host is harmed, unlike mutualism.',
    items: [
      { word: 'Bee and Flower', category: 'Mutualism (+/+)', iconName: 'bee', explanation: 'Bees receive nutritional nectar while flowers achieve vital cross-pollination (+/+).' },
      { word: 'Clownfish and Anemone', category: 'Mutualism (+/+)', iconName: 'fish', explanation: 'Clownfish obtain stinging defense while anemones receive food scraps and water aeration (+/+).' },
      { word: 'Tick and Deer', category: 'Parasitism (+/-)', iconName: 'bug', isOutlier: true, explanation: 'The tick feeds on blood while transmitting pathogens to the host deer, a harmful parasitic relationship (+/-).' },
      { word: 'Fungus and Algae (Lichen)', category: 'Mutualism (+/+)', iconName: 'leaf', explanation: 'The fungus supplies moisture/minerals while photosynthetic algae manufacture carbohydrates (+/+).' },
      { word: 'Plover Bird and Alligator', category: 'Mutualism (+/+)', iconName: 'activity', explanation: 'The bird cleans parasites and food scraps from the reptile teeth while obtaining a nutritious meal (+/+).' },
      { word: 'Gut Bacteria and Humans', category: 'Mutualism (+/+)', iconName: 'heart', explanation: 'Bacterial colonies digest fiber and produce vitamin K while enjoying a protected, nutrient-rich habitat (+/+).' },
    ],
    hints: [
      'Analyze the ecological outcome for BOTH partners: do both benefit (+/+), or is one harmed (+/-)?',
      'Five pairs represent mutualism where both partner organisms gain clear advantages.',
      'The tick harms the deer by sucking blood and spreading disease, making it a parasitic (+/-) relationship.',
    ],
    stepByStepExplanation: [
      'Bee/flower, clownfish/anemone, lichen, plover/alligator, and gut bacteria/human are mutualistic (+/+).',
      'Tick and deer represents parasitism (+/-): the tick benefits at the expense and harm of the host deer.',
    ],
    speedTip: 'Code ecological relationships: Mutualism (+/+), Commensalism (+/0), Parasitism (+/-).',
  },
  {
    id: 'verbal-d4-04',
    difficulty: 4,
    theme: 'Tectonic Plate Divergent and Rift Boundaries',
    sharedRule: 'All items are divergent boundaries where tectonic plates pull apart, except the Himalayas which are a convergent collision.',
    outlierReason: 'The Himalayas were formed by convergent collision between the Indian and Eurasian continental plates.',
    items: [
      { word: 'Mid-Atlantic Ridge', category: 'Divergent Boundary', iconName: 'waves', explanation: 'The Mid-Atlantic Ridge is a divergent underwater mountain system where ocean plates pull apart and create new crust.' },
      { word: 'East African Rift', category: 'Divergent Boundary', iconName: 'mountain', explanation: 'The East African Rift is an active continental rift zone where the African plate is splitting into two.' },
      { word: 'Himalayas', category: 'Convergent Collision', iconName: 'mountain', isOutlier: true, explanation: 'The Himalayas are a convergent orogenic belt formed by the head-on collision of the Indian and Eurasian continental plates.' },
      { word: 'Iceland Rift Valley', category: 'Divergent Boundary', iconName: 'flame', explanation: 'Iceland sits astride a subaerial spreading center where the North American and Eurasian plates diverge.' },
      { word: 'Red Sea Rift', category: 'Divergent Boundary', iconName: 'anchor', explanation: 'The Red Sea is a young diverging ocean basin formed by the separation of the African and Arabian plates.' },
      { word: 'Pacific-Antarctic Ridge', category: 'Divergent Boundary', iconName: 'compass', explanation: 'The Pacific-Antarctic Ridge is a divergent seafloor spreading boundary in the South Pacific.' },
    ],
    hints: [
      'Determine the direction of tectonic motion: plates pulling apart (diverging) vs crashing together (converging).',
      'Five of these geological features are divergent rifts where new crust is created by separating plates.',
      'The Himalayas are massive mountains formed by two continental plates colliding head-on (convergence).',
    ],
    stepByStepExplanation: [
      'Mid-Atlantic Ridge, East African Rift, Iceland Rift, Red Sea Rift, and Pacific-Antarctic Ridge are divergent rifts.',
      'The Himalayas represent a convergent continental-continental collision zone where crust is buckled upward.',
    ],
    speedTip: 'Tectonic motion rule: Spreading/rifting (divergent) vs Colliding/mountain-building (convergent).',
  },
  {
    id: 'verbal-d4-05',
    difficulty: 4,
    theme: 'Subatomic Quarks and Leptons (Standard Model Particles)',
    sharedRule: 'All items are fundamental elementary particles of the Standard Model, except the proton which is a composite baryon.',
    outlierReason: 'A proton is a composite particle made of three quarks (two up and one down), not an indivisible elementary particle.',
    items: [
      { word: 'Electron', category: 'Elementary Lepton', iconName: 'zap', explanation: 'The electron is a fundamental indivisible lepton of the Standard Model.' },
      { word: 'Up Quark', category: 'Elementary Quark', iconName: 'box', explanation: 'The up quark is an elementary point particle carrying a fractional charge of +2/3 e.' },
      { word: 'Proton', category: 'Composite Baryon', iconName: 'shield', isOutlier: true, explanation: 'A proton is a composite hadron (baryon) composed of three bound quarks (two up and one down).' },
      { word: 'Down Quark', category: 'Elementary Quark', iconName: 'box', explanation: 'The down quark is an elementary particle possessing a fractional electrical charge of -1/3 e.' },
      { word: 'Muon', category: 'Elementary Lepton', iconName: 'zap', explanation: 'A muon is an elementary lepton identical to the electron but with roughly 207 times greater mass.' },
      { word: 'Neutrino', category: 'Elementary Lepton', iconName: 'wind', explanation: 'A neutrino is an elementary fundamental neutral lepton with near-zero rest mass.' },
    ],
    hints: [
      'Distinguish between truly indivisible elementary particles and composite particles made of smaller constituents.',
      'Five of these particles cannot be broken down into smaller pieces (elementary particles).',
      'The proton is not elementary: it is built from three quarks (up, up, down) bound by gluons.',
    ],
    stepByStepExplanation: [
      'Electron, up quark, down quark, muon, and neutrino are indivisible elementary particles.',
      'The proton is a composite hadron made of three bonded quarks, making it the particle physics outlier.',
    ],
    speedTip: 'Protons and neutrons are composite (hadrons); electrons and quarks are indivisible (elementary).',
  },
  {
    id: 'verbal-d4-06',
    difficulty: 4,
    theme: 'Organisms with Bilateral Symmetry as Adults',
    sharedRule: 'All items exhibit bilateral symmetry with defined left and right halves, except the starfish with radial symmetry.',
    outlierReason: 'Adult starfish display five-part (pentaradial) symmetry, whereas the other five exhibit bilateral body symmetry.',
    items: [
      { word: 'Human', category: 'Bilateral Symmetry', iconName: 'smile', explanation: 'Humans have bilateral symmetry: a single sagittal plane divides the body into mirroring left and right halves.' },
      { word: 'Eagle', category: 'Bilateral Symmetry', iconName: 'wind', explanation: 'Eagles possess bilateral body symmetry with matching paired wings, eyes, and talons.' },
      { word: 'Starfish', category: 'Radial Symmetry', iconName: 'star', isOutlier: true, explanation: 'Adult sea stars (starfish) exhibit pentaradial symmetry arranged around a central oral axis.' },
      { word: 'Lobster', category: 'Bilateral Symmetry', iconName: 'fish', explanation: 'Lobsters display bilateral anatomical symmetry across their dorsal-ventral axis.' },
      { word: 'Beetle', category: 'Bilateral Symmetry', iconName: 'bug', explanation: 'Beetles are bilaterally symmetrical arthropods with matching antennae, legs, and elytra.' },
      { word: 'Fish', category: 'Bilateral Symmetry', iconName: 'fish', explanation: 'Fish are bilaterally symmetrical vertebrates whose left and right sides reflect each other.' },
    ],
    hints: [
      'Consider the biological body symmetry: left/right mirror halves vs circular spokes around a central hub.',
      'Five of these animals display bilateral symmetry with matching left and right halves.',
      'Adult starfish exhibit radial symmetry with 5 arms radiating outwards from a central point.',
    ],
    stepByStepExplanation: [
      'Human, eagle, lobster, beetle, and fish are Bilateria: their bodies have matching left and right mirror halves.',
      'An adult starfish is an echinoderm displaying five-part radial symmetry centered on a circle.',
    ],
    speedTip: 'Bilateral symmetry (left/right split) vs Radial symmetry (circular wheel spokes).',
  },
  {
    id: 'verbal-d4-07',
    difficulty: 4,
    theme: 'Pure Mineral Chemical Compounds vs Polymineralic Rocks',
    sharedRule: 'All items are definitive minerals with precise chemical formulas and crystalline structures, except granite.',
    outlierReason: 'Granite is a composite rock composed of multiple distinct minerals (quartz, feldspar, mica), not a single mineral.',
    items: [
      { word: 'Quartz', category: 'Pure Mineral (SiO₂)', iconName: 'gem', explanation: 'Quartz is a pure mineral crystal composed strictly of silicon dioxide in a continuous SiO₄ framework.' },
      { word: 'Feldspar', category: 'Pure Mineral', iconName: 'gem', explanation: 'Feldspar is an abundant group of rock-forming tectosilicate minerals with defined crystal lattices.' },
      { word: 'Granite', category: 'Composite Rock', iconName: 'mountain', isOutlier: true, explanation: 'Granite is a heterogeneous igneous rock composed of a physical mixture of multiple minerals, not a single mineral.' },
      { word: 'Diamond', category: 'Pure Mineral (C)', iconName: 'gem', explanation: 'Diamond is a pure native mineral element composed entirely of carbon atoms in a covalent isometric lattice.' },
      { word: 'Calcite', category: 'Pure Mineral (CaCO₃)', iconName: 'gem', explanation: 'Calcite is a pure carbonate mineral with a specific chemical formula and trigonal crystal structure.' },
      { word: 'Pyrite', category: 'Pure Mineral (FeS₂)', iconName: 'gem', explanation: 'Pyrite (fool gold) is an iron disulfide mineral with a definite isometric chemical crystal structure.' },
    ],
    hints: [
      'Recall the geological difference between a single pure mineral and a composite rock.',
      'Five of these are specific minerals with definite chemical formulas and crystal lattice shapes.',
      'Granite is a rock: an aggregate mixture containing chunks of quartz, feldspar, and mica.',
    ],
    stepByStepExplanation: [
      'Quartz, feldspar, diamond, calcite, and pyrite are minerals with specific chemical formulas and crystal structures.',
      'Granite is a composite igneous rock made up of an aggregate mixture of various mineral crystals.',
    ],
    speedTip: 'TAG Trap: Rocks are mixtures of multiple minerals; a mineral has a single definite chemical composition.',
  },
  {
    id: 'verbal-d4-08',
    difficulty: 4,
    theme: 'Dwarf Planets of the Kuiper Belt and Asteroid Belt',
    sharedRule: 'All items are officially recognized dwarf planets, except Titan which is a massive moon of Saturn.',
    outlierReason: 'Titan is a giant natural satellite orbiting Saturn, whereas the other five orbit the Sun directly as dwarf planets.',
    items: [
      { word: 'Pluto', category: 'Dwarf Planet', iconName: 'planet', explanation: 'Pluto is a dwarf planet located in the Kuiper Belt orbiting the Sun directly.' },
      { word: 'Ceres', category: 'Dwarf Planet', iconName: 'planet', explanation: 'Ceres is the largest object in the main asteroid belt, classified as a dwarf planet.' },
      { word: 'Titan', category: 'Natural Satellite (Moon)', iconName: 'moon', isOutlier: true, explanation: 'Titan is a massive natural moon orbiting the ringed planet Saturn, not an independent planet or dwarf planet.' },
      { word: 'Eris', category: 'Dwarf Planet', iconName: 'planet', explanation: 'Eris is a massive dwarf planet in the scattered disc of the outer Solar System.' },
      { word: 'Haumea', category: 'Dwarf Planet', iconName: 'planet', explanation: 'Haumea is an elongated, fast-spinning dwarf planet beyond Neptune.' },
      { word: 'Makemake', category: 'Dwarf Planet', iconName: 'planet', explanation: 'Makemake is a dwarf planet located in the Kuiper Belt orbiting the Sun.' },
    ],
    hints: [
      'Look at what primary body each object orbits: the Sun directly or a giant planet?',
      'Five of these objects are officially classified as dwarf planets orbiting the Sun directly.',
      'Titan is a moon orbiting the planet Saturn, not a dwarf planet.',
    ],
    stepByStepExplanation: [
      'Pluto, Ceres, Eris, Haumea, and Makemake are the five IAU-recognized dwarf planets orbiting the Sun.',
      'Titan is a natural satellite (moon) orbiting planet Saturn.',
    ],
    speedTip: 'Do not confuse dwarf planets (orbit the Sun directly) with large planetary moons (orbit a host planet).',
  },
  {
    id: 'verbal-d4-09',
    difficulty: 4,
    theme: 'Invertebrate Marine Cephalopods (Tentacled Mollusks)',
    sharedRule: 'All items are tentacled cephalopod mollusks, except the starfish which is an echinoderm.',
    outlierReason: 'Starfish is an echinoderm with tube feet and a water-vascular system, not a tentacled cephalopod mollusk.',
    items: [
      { word: 'Octopus', category: 'Cephalopod Mollusk', iconName: 'shield', explanation: 'An octopus is a soft-bodied cephalopod mollusk with eight sucker-bearing arms and a prominent mantle.' },
      { word: 'Squid', category: 'Cephalopod Mollusk', iconName: 'fish', explanation: 'A squid is an active swimming cephalopod mollusk with eight arms, two tentacles, and a chitinous pen.' },
      { word: 'Starfish', category: 'Echinoderm', iconName: 'star', isOutlier: true, explanation: 'A starfish is an echinoderm with a calcareous endoskeleton and hydraulic tube feet, unrelated to mollusks.' },
      { word: 'Cuttlefish', category: 'Cephalopod Mollusk', iconName: 'fish', explanation: 'Cuttlefish are marine cephalopod mollusks possessing an internal porous cuttlebone and W-shaped pupils.' },
      { word: 'Nautilus', category: 'Cephalopod Mollusk', iconName: 'shield', explanation: 'The chambered nautilus is a primitive shelled cephalopod mollusk with up to ninety retractile tentacles.' },
      { word: 'Giant Squid', category: 'Cephalopod Mollusk', iconName: 'anchor', explanation: 'The giant squid is an oceanic cephalopod mollusk capable of growing to enormous proportions in the deep sea.' },
    ],
    hints: [
      'Identify the phylum: are they tentacled cephalopod mollusks, or spiny-skinned echinoderms?',
      'Five of these creatures belong to the mollusk class Cephalopoda with tentacles and complex nervous systems.',
      'The starfish belongs to phylum Echinodermata with a water-vascular system and tube feet, not a cephalopod.',
    ],
    stepByStepExplanation: [
      'Octopus, squid, cuttlefish, nautilus, and giant squid belong to class Cephalopoda within phylum Mollusca.',
      'A starfish belongs to phylum Echinodermata, making it the marine invertebrate outlier.',
    ],
    speedTip: 'Marine invertebrate families: Cephalopods (squid/octopus) vs Echinoderms (starfish/urchin) vs Cnidarians (jellyfish).',
  },
];

/**
 * Returns the entire calibrated question bank of 36 rich verbal classification questions.
 */
export function getAllVerbalQuestions(): NGATQuestion[] {
  return CURATED_VERBAL_QUESTIONS.map((qDef) => {
    return transformDefToQuestion(qDef, 42);
  });
}

/**
 * Generates or deterministically selects a verbal question for a given difficulty and seed.
 */
export function generateVerbalQuestion(
  difficulty: DifficultyLevel = 2,
  seed?: number
): NGATQuestion {
  const prng = new PRNG(seed !== undefined ? seed : Date.now());

  // Filter bank by requested difficulty
  const candidates = CURATED_VERBAL_QUESTIONS.filter((q) => q.difficulty === difficulty);
  const pickedDef = candidates.length > 0 ? prng.pick(candidates) : prng.pick(CURATED_VERBAL_QUESTIONS);

  return transformDefToQuestion(pickedDef, seed ?? prng.nextInt(1000, 9999));
}

function transformDefToQuestion(qDef: VerbalQuestionDef, seed: number): NGATQuestion {
  const prng = new PRNG(seed);

  // Stimulus items
  const stimulusItems = qDef.items.map((item, idx) => ({
    id: `stim-item-${qDef.id}-${idx}`,
    word: item.word,
    category: item.category,
    isOutlier: item.isOutlier,
    definitionHint: item.explanation,
  }));

  const stimulus: VerbalGridData = {
    type: 'verbal-grid',
    items: stimulusItems,
    sharedRule: qDef.sharedRule,
    archetypeVariant: 'odd-one-out',
    outlierReason: qDef.outlierReason,
  };

  // Map choices: exactly 6 choices A through F
  // The outlier item is the correct choice!
  const rawChoices = qDef.items.map((item, idx) => {
    const visual: CellVisual = {
      type: 'verbal-word',
      word: item.word,
      category: item.category,
      iconName: item.iconName,
    };

    if (item.isOutlier) {
      return {
        id: `opt-raw-${idx}`,
        visual,
        trapType: 'correct' as CognitiveTrapType,
        trapExplanation: '',
        isCorrect: true,
      };
    } else {
      const trap: CognitiveTrapType =
        idx % 2 === 0 ? 'superficial-category-trap' : 'distractor';
      return {
        id: `opt-raw-${idx}`,
        visual,
        trapType: trap,
        trapExplanation: `This item is not the odd one out: ${item.explanation}`,
        isCorrect: false,
      };
    }
  });

  // Shuffle the 6 options deterministically
  const shuffledChoices = prng.shuffle(rawChoices);
  const correctIndex = shuffledChoices.findIndex((c) => c.isCorrect);

  const labels: ('A' | 'B' | 'C' | 'D' | 'E' | 'F')[] = ['A', 'B', 'C', 'D', 'E', 'F'];
  const options: ChoiceOption[] = shuffledChoices.map((c, i) => ({
    id: `opt-v-${qDef.id}-${i}-${c.visual.type === 'verbal-word' ? c.visual.word : i}`,
    label: labels[i],
    visual: c.visual,
    trapType: c.trapType,
    trapExplanation: c.trapExplanation,
  }));

  return {
    id: `${qDef.id}-s${seed}`,
    subtest: 'verbal',
    archetype: 'verbal-classification',
    difficulty: qDef.difficulty,
    stimulus,
    options,
    correctIndex,
    hints: qDef.hints,
    ruleSummary: qDef.sharedRule,
    stepByStepExplanation: qDef.stepByStepExplanation,
    speedTip: qDef.speedTip,
    estimatedSeconds: qDef.difficulty * 15 + 20,
  };
}
