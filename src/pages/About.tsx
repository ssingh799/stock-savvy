import { About3 } from "@/components/ui/about-3";
import { Navbar } from "@/components/Navbar";
import { useState } from "react";
import aboutMain from "@/assets/about-main.jpg";
import aboutSecondary from "@/assets/about-secondary.jpg";

const About = () => {
  const [activeTab, setActiveTab] = useState("market");

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <About3
        mainImage={{ src: aboutMain, alt: "StockSense AI Trading Floor" }}
        secondaryImage={{ src: aboutSecondary, alt: "AI Analytics Dashboard" }}
      />
    </div>
  );
};

export default About;
