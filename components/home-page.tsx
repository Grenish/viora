import { Button } from "./ui/button";
import {
  InteractiveGallery,
  InteractiveGalleryContent,
  InteractiveGalleryGroup,
  InteractiveGalleryMedia,
} from "./interactive-gallery";

const images: {
  src: string;
  alt: string;
  title: string;
  description: string;
}[] = [
  {
    src: "/experience.png",
    alt: "Ultra luxury fine dining restaurant interior, warm ambient lighting, rich walnut wood panels, marble accents, elegant table settings, crystal glassware, soft candlelight, sophisticated atmosphere, cinematic depth of field, high-end hospitality photography, Michelin star restaurant aesthetic, premium architecture, guests subtly visible in the background.",
    title: "An Atmosphere Worth Savoring",
    description:
      "Immerse yourself in an elegant setting where exceptional hospitality, refined interiors, and unforgettable moments come together.",
  },
  {
    src: "/cuisine.png",
    alt: "Exquisite fine dining signature dish served on a handcrafted ceramic plate, gourmet continental cuisine, artistic plating, premium ingredients, chef's tasting menu presentation, dramatic restaurant lighting, shallow depth of field, luxury culinary photography, Michelin star food styling, elegant table setting.",
    title: "Crafted by Culinary Excellence",
    description:
      "Discover thoughtfully prepared dishes inspired by global flavors and elevated through precision, creativity, and premium ingredients.",
  },
  {
    src: "/stay.png",
    alt: "Luxury hotel suite connected to a premium restaurant resort, floor-to-ceiling windows, elegant modern interior, king-size bed, warm indirect lighting, natural stone and wood materials, designer furniture, sophisticated hospitality design, peaceful atmosphere, luxury travel magazine photography.",
    title: "Stay Beyond the Evening",
    description:
      "Retreat to beautifully designed suites that blend comfort, tranquility, and modern luxury for a complete Viora experience.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-cover w-full min-h-dvh bg-hero bg-center relative">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/80 to-background" />
      <div className="w-6xl max-w-full px-4 sm:px-6 md:px-8 py-8 md:py-12 mx-auto relative min-h-[40vh] sm:min-h-120 flex items-center justify-center">
        <div>
          <h2 className="text-2xl sm:text-3xl max-w-2xl text-balance text-center mb-2">
            Food continues to evolve reflecting humanity&apos;s creativity and
            cultural diversity
          </h2>
          <p className="max-w-2xl text-center text-sm sm:text-base text-muted-foreground">
            International spice markets offer aromatic treasures from distant
            regions. The perfect bechamel requires constant whisking and proper
            thickness.
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <Button>Explore Viora</Button>
            <Button variant="outline">Reserve a Table</Button>
          </div>
        </div>
      </div>
      <div className="w-5xl max-w-full px-4 sm:px-6 md:px-8 pb-12 md:pb-16 mx-auto relative">
        <InteractiveGallery>
          {images.map((image, index) => (
            <InteractiveGalleryGroup key={index}>
              <InteractiveGalleryMedia src={image.src} alt={image.alt} />
              <InteractiveGalleryContent>
                <h3>{image.title}</h3>
                <p>{image.description}</p>
              </InteractiveGalleryContent>
            </InteractiveGalleryGroup>
          ))}
        </InteractiveGallery>
      </div>
    </div>
  );
}
