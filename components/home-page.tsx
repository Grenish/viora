import { Button } from "./ui/button";
import Link from "next/link";
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
    alt: "Elegant fine dining restaurant interior with warm lighting, wood paneling, marble accents, and sophisticated table settings.",
    title: "An Atmosphere Worth Savoring",
    description:
      "Immerse yourself in an elegant setting where exceptional hospitality, refined interiors, and unforgettable moments come together.",
  },
  {
    src: "/cuisine.png",
    alt: "Artfully plated fine dining dish on ceramic plate with premium ingredients and elegant restaurant table setting.",
    title: "Crafted by Culinary Excellence",
    description:
      "Discover thoughtfully prepared dishes inspired by global flavors and elevated through precision, creativity, and premium ingredients.",
  },
  {
    src: "/stay.png",
    alt: "Luxury hotel suite with floor-to-ceiling windows, modern interior, king-size bed, and warm ambient lighting.",
    title: "Stay Beyond the Evening",
    description:
      "Retreat to beautifully designed suites that blend comfort, tranquility, and modern luxury for a complete Viora experience.",
  },
];

export default function HomePage() {
  return (
    <div className="bg-cover w-full min-h-dvh bg-hero bg-center relative flex flex-col justify-between">
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-background/80 to-background pointer-events-none" />

      <div className="w-6xl max-w-full px-4 sm:px-6 md:px-8 pt-20 pb-8 md:py-12 mx-auto relative min-h-[40vh] sm:min-h-120 flex-1 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl sm:text-3xl max-w-2xl text-balance text-center mb-2 font-heading font-semibold">
            Food continues to evolve reflecting humanity&apos;s creativity and
            cultural diversity
          </h1>
          <p className="max-w-2xl text-center text-xs sm:text-base text-muted-foreground">
            International spice markets offer aromatic treasures from distant
            regions. The perfect bechamel requires constant whisking and proper
            thickness.
          </p>
          <div className="mt-5 flex flex-row items-center justify-center gap-2">
            <Button className="h-8 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm">
              Explore Viora
            </Button>
            <Link href="/reserve">
              <Button
                variant="outline"
                className="h-8 px-3 text-xs sm:h-10 sm:px-4 sm:text-sm cursor-pointer"
              >
                Reserve a Table
              </Button>
            </Link>
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
