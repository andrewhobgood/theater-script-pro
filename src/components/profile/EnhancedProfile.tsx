import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { 
  User, Mail, Phone, MapPin, Calendar, Globe, 
  Twitter, Instagram, Linkedin, Shield, Bell, 
  Eye, Lock, Settings, Upload
} from 'lucide-react';

export const EnhancedProfile = () => {
  const [profile, setProfile] = useState({
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    bio: 'Award-winning playwright with 15+ years of experience',
    location: 'New York, NY',
    website: 'www.sarahjohnson.com',
    phone: '+1 (555) 123-4567',
    socialLinks: {
      twitter: '@sarahplays',
      instagram: '@sarahjohnson',
      linkedin: 'sarah-johnson-playwright'
    }
  });

  const [settings, setSettings] = useState({
    emailNotifications: true,
    profileVisibility: 'public',
    showStats: true,
    allowMessages: true
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profile Settings</h1>
        <Button>Save Changes</Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center space-x-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src="/placeholder-avatar.jpg" />
                  <AvatarFallback>SJ</AvatarFallback>
                </Avatar>
                <Button variant="outline">
                  <Upload className="h-4 w-4 mr-2" />
                  Change Photo
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={profile.location} onChange={(e) => setProfile({...profile, location: e.target.value})} />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea 
                  id="bio" 
                  value={profile.bio} 
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={profile.website} onChange={(e) => setProfile({...profile, website: e.target.value})} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Profile Visibility</Label>
                  <p className="text-sm text-muted-foreground">Control who can see your profile</p>
                </div>
                <Switch 
                  checked={settings.profileVisibility === 'public'}
                  onCheckedChange={(checked) => setSettings({...settings, profileVisibility: checked ? 'public' : 'private'})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label>Show Performance Stats</Label>
                  <p className="text-sm text-muted-foreground">Display script statistics on your profile</p>
                </div>
                <Switch 
                  checked={settings.showStats}
                  onCheckedChange={(checked) => setSettings({...settings, showStats: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};