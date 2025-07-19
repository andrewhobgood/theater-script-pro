import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, HelpCircle, Bug } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: ""
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "support@theaterscriptpro.com",
      description: "We'll respond within 24 hours"
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri, 9AM-6PM EST"
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "123 Theater District, New York, NY 10001",
      description: "By appointment only"
    },
    {
      icon: Clock,
      title: "Support Hours",
      content: "Monday - Friday: 9AM - 6PM EST",
      description: "Weekend support via email"
    }
  ];

  const faqCategories = [
    {
      icon: MessageSquare,
      title: "General Questions",
      description: "Billing, accounts, and platform basics"
    },
    {
      icon: HelpCircle,
      title: "Technical Support",
      description: "Upload issues, download problems, bugs"
    },
    {
      icon: Bug,
      title: "Licensing Help",
      description: "Rights, permissions, and usage questions"
    }
  ];

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold theater-heading mb-4">Get in Touch</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Have questions about our platform? Need help with licensing? We're here to support you 
            and the theater community.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Send us a Message</CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as possible
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">General Question</SelectItem>
                          <SelectItem value="technical">Technical Support</SelectItem>
                          <SelectItem value="licensing">Licensing Help</SelectItem>
                          <SelectItem value="billing">Billing Issue</SelectItem>
                          <SelectItem value="partnership">Partnership Inquiry</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="Brief description of your inquiry"
                        value={formData.subject}
                        onChange={(e) => setFormData({...formData, subject: e.target.value})}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      placeholder="Please provide as much detail as possible about your question or issue..."
                      rows={6}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full spotlight-button">
                    <Send className="mr-2 h-4 w-4" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Contact Info Sidebar */}
          <div className="space-y-6">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>Multiple ways to reach us</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <info.icon className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium">{info.title}</h3>
                      <p className="text-sm font-mono">{info.content}</p>
                      <p className="text-xs text-muted-foreground">{info.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Quick Help</CardTitle>
                <CardDescription>Common support categories</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqCategories.map((category, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
                    <category.icon className="h-5 w-5 text-primary mt-1" />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">{category.title}</h3>
                      <p className="text-xs text-muted-foreground">{category.description}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">General Inquiries</span>
                  <Badge variant="secondary">24 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Technical Issues</span>
                  <Badge variant="secondary">12 hours</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Urgent Matters</span>
                  <Badge variant="secondary">4 hours</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8 theater-heading">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            <Card className="theater-card">
              <CardHeader>
                <CardTitle className="text-lg">How do I license a script?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Browse our script library, select the script you want, choose your licensing type 
                  (perusal or full production), and complete the payment process. You'll receive 
                  instant access to your licensed materials.
                </p>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle className="text-lg">What's included with a license?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Full production licenses include the complete script, performance rights for your 
                  specified dates and venue, director's notes, and technical requirements. Perusal 
                  licenses include a watermarked script for evaluation purposes only.
                </p>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle className="text-lg">Can I modify the script?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Script modifications require special permission from the playwright. Contact us 
                  with your specific needs, and we'll work with the rights holder to determine 
                  what's possible for your production.
                </p>
              </CardContent>
            </Card>

            <Card className="theater-card">
              <CardHeader>
                <CardTitle className="text-lg">How do I upload my scripts?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Playwrights can upload scripts through their dashboard. We review all submissions 
                  for quality and format compliance. Once approved, your scripts will be available 
                  in our marketplace with your specified licensing terms.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;