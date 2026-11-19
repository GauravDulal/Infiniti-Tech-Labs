import { Barlow, Barlow_Condensed } from "next/font/google";
import { COMPANY } from "@/lib/site";
import "./globals.css";

// Road-sign type for hardware: condensed for titles, normal width for text.
const display = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-display",
  display: "swap",
});

const text = Barlow({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-text",
  display: "swap",
});

export const metadata = {
  title: `${COMPANY}: LoRa hardware and firmware`,
  description:
    "Infiniti Tech Labs designs LoRa sensor nodes, gateways and the ESP32 firmware that runs them, for sites nobody wants to drive out to.",
};

export const viewport = {
  themeColor: "#181715",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${text.variable}`} suppressHydrationWarning>
      <body>
        <script
          // Marks the page as scripted before paint, so entrances can start hidden
          // without hiding anything when JavaScript is off.
          dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }}
        />
        {children}
      </body>
    </html>
  );
}
