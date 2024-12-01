import localFont from "next/font/local";
import {
  Manrope,
  Poppins,
  Roboto,
} from "next/font/google";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600", "700"],
});

const roboto = Roboto({
  subsets: ["latin"],
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
});

const GeistMono = localFont({
  src: "./GeistMonoVF.woff",
  variable: "--font-geist-mono",
  display: "swap", // Để font được load sau khi font chính được load
});

const GeistVF = localFont({
  src: "./GeistVF.woff",
  variable: "--font-geist-sans",
  display: "swap",
});

export { manrope, poppins, roboto, GeistMono, GeistVF };
