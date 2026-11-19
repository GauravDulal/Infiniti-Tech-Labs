import { Geist } from "next/font/google";
import { COMPANY } from "@/lib/site";
import "./globals.css";

// One family for everything: display at 600, text at 400.
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata = {
  title: `${COMPANY}: LoRa hardware and firmware`,
  description:
    "Infiniti Tech Labs designs LoRa sensor nodes, gateways and the ESP32 firmware that runs them, for sites nobody wants to drive out to.",
};

export const viewport = {
  themeColor: "#0f1010",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={geist.variable} suppressHydrationWarning>
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
