"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useCurrency } from "@/lib/use-currency";

const menuData = [
  {
    id: "italian",
    name: "Italian",
    image: "/dish/Italian.png",
    tagline: "The Poetry of Handcrafted Tradition",
    description:
      "Honoring the legacy of Italian regional kitchens, combining fresh house-milled flours, sun-drenched herbs, and aged olive oils.",
    items: [
      {
        name: "Truffle Tagliolini",
        desc: "Hand-cut egg pasta tossed in Piedmontese butter, white truffle essence, and freshly shaved summer truffles.",
        price: "38",
      },
      {
        name: "Wood-Fired Branzino",
        desc: "Whole Mediterranean sea bass, blistered cherry tomatoes, wild fennel, cold-pressed olive oil, charred lemon.",
        price: "46",
      },
      {
        name: "Classic Bistecca Alla Fiorentina",
        desc: "Dry-aged T-bone steak, rosemary-infused sea salt, Tuscan olive oil drizzle, served over wild arugula.",
        price: "72",
      },
    ],
  },
  {
    id: "mediterranean",
    name: "Mediterranean",
    image: "/dish/Mediterranean.png",
    tagline: "Sun, Sea, and Coastal Earthiness",
    description:
      "A celebration of coastal flavors from Spain to Greece, highlighting fresh caught seafood, vibrant citrus, and local harvest.",
    items: [
      {
        name: "Saffron Seafood Paella",
        desc: "Bomba rice infused with Spanish saffron, loaded with wild prawns, local mussels, calamari, and heirloom peas.",
        price: "52",
      },
      {
        name: "Charred Octopus",
        desc: "Slow-braised octopus tentacle, smoked paprika oil, fingerling potatoes, salsa verde, pickled shallots.",
        price: "42",
      },
      {
        name: "Slow-Roasted Lamb Shank",
        desc: "Grass-fed lamb slow-braised in red wine and Greek herbs, served over organic polenta, wild honey glaze.",
        price: "48",
      },
    ],
  },
  {
    id: "european",
    name: "European",
    image: "/dish/European.png",
    tagline: "Classical Foundations, Modern Expressions",
    description:
      "Sophisticated French and Central European techniques blended with contemporary culinary artistry.",
    items: [
      {
        name: "Pan-Seared Duck Breast",
        desc: "Crisp-skinned Moulard duck, tart cherry reduction, parsnip purée, wilted mountain chard.",
        price: "49",
      },
      {
        name: "Classic Beef Wellington",
        desc: "Center-cut prime tenderloin wrapped in wild mushroom duxelles, prosciutto, and flaky puff pastry.",
        price: "68",
      },
      {
        name: "Atlantic Halibut",
        desc: "Butter-poached halibut fillet, asparagus spears, caviar-infused beurre blanc sauce, microgreens.",
        price: "54",
      },
    ],
  },
  {
    id: "middle-eastern",
    name: "Middle Eastern",
    image: "/dish/MiddleEastern.png",
    tagline: "Ancient Spices and Fire-Kissed Herbs",
    description:
      "Bold, aromatic spices meet the warmth of fire-grilled meats and hearth-baked flatbreads.",
    items: [
      {
        name: "Persian Lamb Kofta",
        desc: "Spiced minced lamb skewers, sumac-dusted onions, fire-roasted tomatoes, saffron basmati rice.",
        price: "39",
      },
      {
        name: "Whole Grilled Seabream",
        desc: "Hearth-roasted seabream marinated in zesty chermoula, served with tahini garlic cream and flatbread.",
        price: "45",
      },
      {
        name: "Curated Mezze Platter",
        desc: "Smoky babaganoush, house hummus, wood-fired halloumi, pickled turnips, warm house-made pita.",
        price: "32",
      },
    ],
  },
  {
    id: "pan-asian",
    name: "Pan Asian",
    image: "/dish/PanAsian.png",
    tagline: "Precision, Balance, and Culinary Harmony",
    description:
      "Exploring the delicate balance of sweet, salty, sour, and umami across Southeast Asia.",
    items: [
      {
        name: "Miso-Glazed Black Cod",
        desc: "Sablefish marinated in sweet Kyoto miso for 48 hours, seared over charcoal, baby bok choy.",
        price: "58",
      },
      {
        name: "Crispy Soft Shell Crab",
        desc: "Golden fried soft shell crab, green papaya salad, sweet chili lime dressing, crushed peanuts.",
        price: "36",
      },
      {
        name: "Wagyu Beef Rendang",
        desc: "Slow-simmered A5 Wagyu beef in rich coconut milk, lemongrass, Kaffir lime leaves, jasmine rice.",
        price: "64",
      },
    ],
  },
  {
    id: "indian",
    name: "Indian",
    image: "/dish/Indian.png",
    tagline: "The Symphony of Slow-Cooked Spices",
    description:
      "Deep, complex layers of spices and slow-cooked tandoori classics refined for the modern palate.",
    items: [
      {
        name: "Tandoori Lobster Tail",
        desc: "Maine lobster tail marinated in Kashmiri chili and Greek yogurt, smoked in a clay oven, mint chutney.",
        price: "62",
      },
      {
        name: "Royal Awadhi Lamb Biryani",
        desc: "Fragrant long-grain basmati rice layered with tender lamb, saffron, rose water, cooked under seal.",
        price: "46",
      },
      {
        name: "Paneer Mille-Feuille",
        desc: "Layered house-pressed cheese, spiced spinach purée, rich cashew-tomato gravy, garlic naan.",
        price: "34",
      },
    ],
  },
  {
    id: "chinese",
    name: "Chinese",
    image: "/dish/Chinese.png",
    tagline: "Wok Hei and Imperious Dynasty Flavors",
    description:
      "Mastering the element of fire and wok heat, honoring traditional culinary styles of Canton and Sichuan.",
    items: [
      {
        name: "Imperial Peking Duck",
        desc: "Crisp roasted duck skin, hand-rolled pancakes, sweet bean sauce, cucumber julienne (serves two).",
        price: "88",
      },
      {
        name: "Steamed Lobster Dumplings",
        desc: "Delicate wrappers filled with lobster tail meat, ginger, scallions, topped with black truffle shaving.",
        price: "34",
      },
      {
        name: "Sichuan Peppercorn Filet Mignon",
        desc: "Wok-seared beef tenderloin, dry red chilies, toasted Sichuan peppercorn sauce, snap peas.",
        price: "55",
      },
    ],
  },
  {
    id: "mexican",
    name: "Mexican",
    image: "/dish/Mexican.png",
    tagline: "Ancestral Moles and Nixtamal Heritage",
    description:
      "An elevated approach to authentic Mexican heirloom corn and slow-simmered regional moles.",
    items: [
      {
        name: "Duck Carnitas Mole Negro",
        desc: "Crisp confit duck leg, Oaxacan black mole (made with 34 ingredients), fresh heirloom corn tortillas.",
        price: "44",
      },
      {
        name: "Charred Octopus Tostada",
        desc: "Blue corn tostada, grilled octopus, avocado purée, smoked habanero ash, lime-cured onions.",
        price: "28",
      },
      {
        name: "Lobster Enchiladas",
        desc: "Maine lobster meat wrapped in fresh tortillas, rich creamy tomatillo salsa, broiled Chihuahua cheese.",
        price: "48",
      },
    ],
  },
  {
    id: "american",
    name: "American",
    image: "/dish/American.png",
    tagline: "Bold Frontiers and Wood-Smoke Classics",
    description:
      "Classic American flavors reimagined with dry-aged prime meats, heritage poultry, and artisanal local wood smoke.",
    items: [
      {
        name: "Dry-Aged Tomahawk Ribeye",
        desc: "45-day dry-aged Prime Tomahawk steak, charred bone marrow, smoked sea salt, truffle fries.",
        price: "110",
      },
      {
        name: "Pan-Roasted Sea Scallops",
        desc: "Jumbo scallops, sweet corn purée, applewood smoked bacon lardons, micro-greens garnish.",
        price: "50",
      },
      {
        name: "Heritage Truffle Chicken",
        desc: "Slow-roasted organic chicken, black truffle brioche stuffing under the skin, roasted root vegetables.",
        price: "42",
      },
    ],
  },
  {
    id: "beverages",
    name: "Beverages",
    image: "/dish/Beverages.png",
    tagline: "Liquid Alchemy and Rare Vintages",
    description:
      "Artisanal cocktails, botanical distillates, and premium vintages curated by our Master Sommelier.",
    items: [
      {
        name: "Smoked Rosemary Old Fashioned",
        desc: "Rare reserve bourbon, house bitters, orange peel, smoked rosewood, served over hand-cut ice sphere.",
        price: "24",
      },
      {
        name: "The Viora Elixir",
        desc: "Botanical gin, fresh elderflower liqueur, cucumber ribbon, tonic reduction, gold leaf accent.",
        price: "22",
      },
      {
        name: "Grand Cru Wine Flight",
        desc: "A curated tasting of three rare vintage Bordeaux and Burgundy pours, paired with artisanal cheeses.",
        price: "75",
      },
    ],
  },
];

export default function Menu() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { formatPrice } = useCurrency();

  const activeCuisine = menuData[activeIndex];

  return (
    <div className="relative w-full min-h-screen py-24 px-4 md:px-8 overflow-hidden flex flex-col justify-center">
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `,
        }}
      />

      <div className="absolute inset-0 z-0">
        <AnimatePresence>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 0.28, scale: 1.01 }}
            exit={{ opacity: 0, scale: 1.06 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={activeCuisine.image}
              alt={activeCuisine.name}
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 bg-linear-to-b from-background/10 via-background/85 to-background" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-16">
        <div className="w-full flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border">
          <div className="max-w-xl">
            <h2 className="text-4xl md:text-6xl font-normal tracking-tight">
              Culinary Chapters
            </h2>
          </div>
          <p className="max-w-xs text-xs md:text-sm opacity-55 leading-relaxed">
            An immersive sensory expedition. Ten regional definitions
            celebrating slow tradition and the artistry of global fires.
          </p>
        </div>

        <div className="hidden lg:grid grid-cols-12 gap-12 items-center min-h-120">
          <div className="col-span-5 flex flex-col gap-5">
            {menuData.map((cuisine, idx) => {
              const isActive = cuisine.id === activeCuisine.id;
              const num = String(idx + 1).padStart(2, "0");
              return (
                <button
                  key={cuisine.id}
                  onClick={() => setActiveIndex(idx)}
                  onMouseEnter={() => setActiveIndex(idx)}
                  className="flex items-baseline gap-4 text-left group cursor-pointer focus:outline-none w-fit"
                >
                  <span className="font-mono text-xs text-muted-foreground/60 group-hover:text-foreground transition-colors duration-300">
                    {num}
                  </span>
                  <span
                    className={cn(
                      "text-2xl xl:text-3xl font-light tracking-wide transition-all duration-300",
                      isActive
                        ? "pl-4 text-primary"
                        : "opacity-55 hover:opacity-100 hover:pl-2",
                    )}
                  >
                    {cuisine.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="col-span-7 flex flex-col justify-center w-full pr-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, x: 25 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -25 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex flex-col gap-8"
              >
                <div>
                  <span className="font-serif italic text-lg mb-1.5 block">
                    {activeCuisine.tagline}
                  </span>
                  <p className="text-sm opacity-50 leading-relaxed max-w-xl">
                    {activeCuisine.description}
                  </p>
                </div>

                <div className="h-px bg-border my-1" />

                <div className="flex flex-col gap-6">
                  {activeCuisine.items.map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex justify-between items-baseline gap-4">
                        <h3 className="font-heading font-medium text-base md:text-lg">
                          {item.name}
                        </h3>
                        <div className="flex-1 border-b border-dotted border-border mx-3 h-0 self-center" />
                        <span className="font-mono text-sm md:text-base font-semibold text-primary">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="text-xs md:text-sm opacity-50 mt-1.5 leading-relaxed max-w-xl">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="flex lg:hidden flex-col gap-8 w-full">
          <div className="flex overflow-x-auto gap-2 pb-4 no-scrollbar -mx-4 px-4">
            {menuData.map((cuisine, idx) => {
              const isActive = cuisine.id === activeCuisine.id;
              return (
                <button
                  key={cuisine.id}
                  onClick={() => setActiveIndex(idx)}
                  className={cn(
                    "px-5 py-2.5 text-xs font-medium rounded-full transition-all duration-300 shrink-0 border cursor-pointer",
                    isActive
                      ? "bg-primary text-primary-foreground border-primary shadow-sm"
                      : "bg-background text-foreground border-border hover:bg-muted",
                  )}
                >
                  {cuisine.name}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-6 min-h-90">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col gap-6"
              >
                <div>
                  <span className="font-serif italic text-base mb-1.5 block">
                    {activeCuisine.tagline}
                  </span>
                  <p className="text-xs opacity-50 leading-relaxed">
                    {activeCuisine.description}
                  </p>
                </div>

                <div className="h-px bg-border my-1" />

                <div className="flex flex-col gap-5">
                  {activeCuisine.items.map((item, index) => (
                    <div key={index} className="flex flex-col">
                      <div className="flex justify-between items-baseline gap-3">
                        <h3 className="font-heading font-medium text-sm">
                          {item.name}
                        </h3>
                        <div className="flex-1 border-b border-dotted border-border mx-2 h-0 self-center" />
                        <span className="font-mono text-xs font-semibold text-primary">
                          {formatPrice(item.price)}
                        </span>
                      </div>
                      <p className="text-[11px] opacity-50 mt-1 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
