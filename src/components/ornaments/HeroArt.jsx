import logo from "../../assets/logo.png";
import Gunungan from "./Gunungan";
import FoodImage from "./FoodImage";
import Uap from "./Uap";

// Ilustrasi hero: logo di dalam gunungan, dikelilingi piring bulat. Tanpa kotak sama sekali.
export default function HeroArt({ className = "" }) {
  return (
    <div className={`relative mx-auto aspect-[4/5] w-full max-w-md ${className}`}>
      <Gunungan className="absolute inset-x-[6%] top-0 h-full w-[88%] text-emas-400" />
      <div className="absolute inset-x-[16%] top-[16%] bottom-[10%] overflow-hidden bg-gading-50" style={{ clipPath: "url(#klip-gunungan)" }}>
        <div className="batik-kawung absolute inset-0 opacity-40" />
        <img src={logo} alt="Simbok Pawon Simbok tersenyum menyapa" className="relative h-full w-full object-contain" />
      </div>
      <FoodImage kategori="Makanan" shape="bulat" aksen={0} alt="Nasi" className="absolute -left-2 bottom-[8%] w-[30%] border-4 border-soga-800 shadow-kartu" />
      <FoodImage kategori="Minuman" shape="bunga" aksen={1} alt="Minuman" className="absolute -right-1 top-[28%] w-[26%] shadow-kartu" />
      <FoodImage kategori="Jajanan" shape="daun" aksen={2} alt="Jajanan" className="absolute -right-3 bottom-[4%] w-[28%] shadow-kartu" />
      <Uap className="absolute left-[10%] top-[6%] h-14 w-14 text-soga-300" />
    </div>
  );
}
