import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, MapPin, Phone, Send, CheckCircle, Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Please enter a valid email").max(255),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(1000),
});

type ContactValues = z.infer<typeof contactSchema>;

const Contact = () => {
  const [activeTab, setActiveTab] = useState("market");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactValues) => {
    setIsLoading(true);
    // Simulate submission
    await new Promise((r) => setTimeout(r, 1500));
    setIsLoading(false);
    setIsSubmitted(true);
    toast({ title: "Message sent!", description: "We'll get back to you soon." });
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Get in <span className="text-bullish">Touch</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about StockSense AI? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            transition={{ staggerChildren: 0.1 }}
            className="lg:col-span-2 space-y-6"
          >
            {[
              { icon: Mail, label: "Email", value: "support@stocksense.ai" },
              { icon: Phone, label: "Phone", value: "+91 1800-123-4567" },
              { icon: MapPin, label: "Office", value: "Mumbai, Maharashtra, India" },
            ].map((item) => (
              <motion.div
                key={item.label}
                variants={itemVariants}
                className="flex items-start gap-4 p-5 rounded-xl bg-card border border-border"
              >
                <div className="w-10 h-10 rounded-lg bg-bullish/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-bullish" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  <p className="text-foreground font-medium">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 p-6 md:p-8 rounded-xl bg-card border border-border"
          >
            {isSubmitted ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CheckCircle className="w-16 h-16 text-bullish mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Message Sent!</h3>
                <p className="text-muted-foreground mb-6">
                  Thank you for reaching out. Our team will get back to you within 24 hours.
                </p>
                <Button onClick={() => { setIsSubmitted(false); form.reset(); }} variant="outline">
                  Send Another Message
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-5">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="you@example.com" {...field} disabled={isLoading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject</FormLabel>
                        <FormControl>
                          <Input placeholder="How can we help?" {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Tell us more..." rows={5} {...field} disabled={isLoading} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                    {isLoading ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
