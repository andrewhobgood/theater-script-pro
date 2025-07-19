import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Shield, Zap, Award, Globe } from "lucide-react";

const About = () => {
  const stats = [
    { label: "Scripts Available", value: "10,000+", icon: Globe },
    { label: "Active Playwrights", value: "2,500+", icon: Users },
    { label: "Theater Companies", value: "1,200+", icon: Award },
    { label: "Scripts Licensed", value: "50,000+", icon: Zap },
  ];

  const team = [
    {
      name: "Sarah Mitchell",
      role: "Founder & CEO",
      bio: "Former theater director with 15 years of experience in the industry.",
      image: "/placeholder-avatar.jpg"
    },
    {
      name: "David Chen",
      role: "CTO",
      bio: "Full-stack developer passionate about making theater more accessible.",
      image: "/placeholder-avatar.jpg"
    },
    {
      name: "Emily Rodriguez",
      role: "Head of Playwright Relations",
      bio: "Award-winning playwright and advocate for emerging voices in theater.",
      image: "/placeholder-avatar.jpg"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="curtain-bg py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-6xl font-bold theater-heading mb-6">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            TheaterScript Pro was born from a simple belief: great theater should be accessible to everyone. 
            We're connecting playwrights with theater companies worldwide, making it easier than ever to 
            discover, license, and produce exceptional dramatic works.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Heart className="mr-2 h-4 w-4" />
              Passion-Driven
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Shield className="mr-2 h-4 w-4" />
              Secure & Trusted
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Users className="mr-2 h-4 w-4" />
              Community-Focused
            </Badge>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center theater-card">
                <CardContent className="pt-6">
                  <stat.icon className="h-8 w-8 mx-auto mb-4 text-primary" />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 theater-heading">
              Our Mission
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="theater-card">
                <CardHeader>
                  <Heart className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Support Artists</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We believe playwrights deserve fair compensation and recognition for their creative work. 
                    Our platform ensures artists are properly credited and paid for their contributions to theater.
                  </p>
                </CardContent>
              </Card>

              <Card className="theater-card">
                <CardHeader>
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Build Community</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Theater thrives on connection. We're fostering a global community where playwrights, 
                    directors, and theater companies can collaborate and share their passion for dramatic arts.
                  </p>
                </CardContent>
              </Card>

              <Card className="theater-card">
                <CardHeader>
                  <Zap className="h-8 w-8 text-primary mb-2" />
                  <CardTitle>Innovate Theater</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We're modernizing how theater business is conducted, using technology to streamline 
                    licensing, protect intellectual property, and make great scripts more discoverable.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-secondary/10">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-12 theater-heading">
            Meet Our Team
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <Card key={index} className="theater-card text-center">
                <CardHeader>
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                    {member.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription className="text-primary font-medium">
                    {member.role}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 theater-heading">
              Our Values
            </h2>
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Transparency</h3>
                <p className="text-muted-foreground">
                  We believe in clear, honest communication. Our licensing terms are straightforward, 
                  our fees are transparent, and our processes are open.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Quality</h3>
                <p className="text-muted-foreground">
                  We curate only the finest dramatic works, ensuring that every script on our platform 
                  meets high artistic and technical standards.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Accessibility</h3>
                <p className="text-muted-foreground">
                  Great theater should be available to all communities, regardless of budget or location. 
                  We offer flexible licensing options to make this possible.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Innovation</h3>
                <p className="text-muted-foreground">
                  We're constantly exploring new ways to improve the theater experience, from digital 
                  perusal tools to advanced analytics for playwrights.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 curtain-bg">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6 theater-heading">
            Join Our Community
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Whether you're a playwright looking to share your work or a theater company 
            seeking your next great production, we'd love to have you as part of our community.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="spotlight-button">
              Get Started Today
            </Button>
            <Button size="lg" variant="outline">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;