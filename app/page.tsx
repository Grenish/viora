import ChefWord from "@/components/chef-word";
import Gallery from "@/components/gallery";
import HomePage from "@/components/home-page";
import Location from "@/components/location";
import Menu from "@/components/menu";
import Reservations from "@/components/reservations";
import Testimonials from "@/components/testimonials";

export default function Home() {
  return (
    <div>
      <HomePage />
      <ChefWord />
      <Menu />
      <Testimonials />
      <Gallery />
      <Reservations />
      <Location />
    </div>
  );
}
