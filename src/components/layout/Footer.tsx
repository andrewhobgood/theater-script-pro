import { Link } from 'react-router-dom';
import { Theater, Twitter, Facebook, Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-curtain text-primary-foreground">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-lg">
                <Theater className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-playfair font-bold text-lg">TheaterScript Pro</h3>
                <p className="text-sm text-primary-foreground/80">Professional Script Licensing</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/70 max-w-xs">
              Connecting playwrights with theater companies through secure, professional script licensing.
            </p>
          </div>

          {/* For Playwrights */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">For Playwrights</h4>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/playwright/upload" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Upload Scripts
              </Link>
              <Link 
                to="/playwright/licensing" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Licensing Options
              </Link>
              <Link 
                to="/playwright/analytics" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Analytics
              </Link>
              <Link 
                to="/copyright" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Copyright Services
              </Link>
            </nav>
          </div>

          {/* For Theater Companies */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">For Theater Companies</h4>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/scripts" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Browse Scripts
              </Link>
              <Link 
                to="/scripts/search" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Advanced Search
              </Link>
              <Link 
                to="/licensing/guide" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Licensing Guide
              </Link>
              <Link 
                to="/theater/reports" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Production Reports
              </Link>
            </nav>
          </div>

          {/* Support & Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-white">Support & Legal</h4>
            <nav className="flex flex-col space-y-2">
              <Link 
                to="/support" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Help Center
              </Link>
              <Link 
                to="/contact" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Contact Us
              </Link>
              <Link 
                to="/privacy" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Privacy Policy
              </Link>
              <Link 
                to="/terms" 
                className="text-primary-foreground/70 hover:text-white transition-colors text-sm"
              >
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-white/20 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-primary-foreground/60">
            © 2024 TheaterScript Pro. All rights reserved.
          </div>
          
          <div className="flex items-center space-x-4">
            <a 
              href="mailto:contact@theaterscriptpro.com" 
              className="text-primary-foreground/70 hover:text-white transition-colors"
              aria-label="Email"
            >
              <Mail className="h-5 w-5" />
            </a>
            <a 
              href="https://twitter.com/theaterscriptpro" 
              className="text-primary-foreground/70 hover:text-white transition-colors"
              aria-label="Twitter"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://facebook.com/theaterscriptpro" 
              className="text-primary-foreground/70 hover:text-white transition-colors"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Facebook className="h-5 w-5" />
            </a>
            <a 
              href="https://instagram.com/theaterscriptpro" 
              className="text-primary-foreground/70 hover:text-white transition-colors"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};