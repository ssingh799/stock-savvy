import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { PremiumContact } from "@/components/ui/premium-contact";

const Contact = () => {
  const [activeTab, setActiveTab] = useState("market");

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />
      <PremiumContact />
    </div>
  );
};

export default Contact;
