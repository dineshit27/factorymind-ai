import React, { useEffect, useState } from 'react';
import { DashboardHeader } from '@/components/DashboardHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { listPosts, addPost, CommunityPost } from '@/services/community';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { MessageSquare, Users, Globe2, BarChart3, Plus, Loader2, ArrowUpRight, Facebook, Youtube, Instagram, Linkedin, Globe, Twitter, Award, HelpCircle, Share2, Search } from 'lucide-react';
import { CommunityIntro } from '@/components/CommunityIntro';
import { CommunityFeed } from '@/components/CommunityFeed';
import { CommunityQuickLinks } from '@/components/CommunityQuickLinks';

// Community page: modern intro + posts + side panels
const Community: React.FC = () => {
  const { user } = useSupabaseAuth();
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [activePost, setActivePost] = useState<CommunityPost | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [creating, setCreating] = useState(false);

  const loadPosts = async () => {
    setLoading(true);
    const data = await listPosts();
    setPosts(data);
    setLoading(false);
  };

  useEffect(() => { loadPosts(); }, []);

  const openPost = (post: CommunityPost) => {
    setActivePost(post);
  };

  const handleCreatePost = async () => {
    if (!user) { 
      toast({ title: 'Sign in', description: 'Sign in to post', variant: 'destructive' }); 
      return; 
    }
    if (!newTitle.trim() || !newContent.trim()) return;
    setCreating(true);
    const created = await addPost(newTitle.trim(), newContent.trim());
    if (created) {
      setPosts(prev => [created, ...prev]);
      setNewTitle('');
      setNewContent('');
      toast({ title: 'Posted', description: 'New community post created' });
    } else {
      toast({ title: 'Error', description: 'Failed to create post', variant: 'destructive' });
    }
    setCreating(false);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 flex flex-col w-full md:w-auto pb-12 md:pb-16">
        <DashboardHeader />
        {/* Keep content slightly below the sticky header */}
        <div className="pt-4 md:pt-6">
          {/* Modern Community Intro Section */}
          <CommunityIntro />

          {/* Quick Links Section (new) */}
          <CommunityQuickLinks
            links={[
              { highlight: 'Feeds:', title: 'Where your community thrives', href: '#feed', badge: 'NEW' },
              { title: 'Customer community platform', description: 'to engage customers', href: '/contact' },
              { highlight: 'Landing page:', title: 'Welcome the right people', href: '/' },
              { title: 'The enterprise‑grade', description: 'B2B community platform', href: '/contact' },
            ]}
          />

          {/* Community Feed Section */}
          <section id="feed" className="scroll-mt-24">
            <CommunityFeed />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Community;