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
    if (!user) { toast({ title: 'Sign in', description: 'Sign in to post', variant: 'destructive' }); return; }
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
      <main className="flex-1 flex flex-col w-full md:w-auto">
        <DashboardHeader />
        {/* Modern Community Intro Section */}
        <CommunityIntro />
        {/* Body */}
        <div className="max-w-7xl mx-auto p-6">
            {/* Zoho-style Three Column Feature Section */}
            <section className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3 py-12 mb-8">
              {/* Ask questions */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-full max-w-[280px] h-[200px] mb-6">
                  {/* Illustration */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-400/40 rounded-[40%_60%_70%_30%/60%_30%_70%_40%]" />
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 text-7xl">🤔</div>
                  <div className="absolute top-2 left-8 text-3xl">❓</div>
                  <div className="absolute top-4 right-8 text-2xl">?!</div>
                  <div className="absolute bottom-12 left-12 text-2xl">💡</div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Ask questions</h3>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed max-w-sm">
                  Over 100,000 members and experts comprise AquaWatt Community—so why not ask a question or share an idea?
                </p>
                <button className="inline-flex items-center gap-1.5 text-base font-medium border-b-2 border-black dark:border-white pb-0.5 hover:opacity-70 transition">
                  ✍️ Post now
                </button>
              </div>

              {/* Give answers */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-full max-w-[280px] h-[200px] mb-6">
                  {/* Illustration */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2 gap-3 p-8">
                    <div className="bg-gradient-to-br from-green-300/80 to-green-200/60 rounded-lg" />
                    <div className="bg-gradient-to-br from-pink-300/80 to-pink-200/60 rounded-lg" />
                    <div className="bg-gradient-to-br from-yellow-300/80 to-yellow-200/60 rounded-lg" />
                    <div className="bg-gradient-to-br from-blue-300/80 to-blue-200/60 rounded-lg" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white dark:bg-card rounded-lg shadow-lg px-4 py-2.5 text-sm font-medium ring-1 ring-black/5">
                      YES OR NO ?
                    </div>
                  </div>
                  <div className="absolute bottom-6 right-6 text-4xl">👍</div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Give answers</h3>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed max-w-sm">
                  Want to return the favor? Help fellow users out with your AquaWatt expertise and gain points along the way!
                </p>
                <button className="inline-flex items-center gap-1.5 text-base font-medium border-b-2 border-black dark:border-white pb-0.5 hover:opacity-70 transition">
                  🎯 Answer now
                </button>
              </div>

              {/* Join a ZUG */}
              <div className="flex flex-col items-center text-center">
                <div className="relative w-full max-w-[280px] h-[200px] mb-6">
                  {/* Illustration - colorful grid of people */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 gap-2 p-4">
                    <div className="bg-gradient-to-br from-yellow-300 to-yellow-200 rounded-xl" />
                    <div className="bg-gradient-to-br from-cyan-300 to-cyan-200 rounded-xl" />
                    <div className="bg-gradient-to-br from-green-300 to-green-200 rounded-xl" />
                    <div className="bg-gradient-to-br from-lime-300 to-lime-200 rounded-xl" />
                    <div className="bg-gradient-to-br from-pink-300 to-pink-200 rounded-xl" />
                    <div className="bg-gradient-to-br from-purple-300 to-purple-200 rounded-xl" />
                    <div className="bg-gradient-to-br from-amber-300 to-amber-200 rounded-xl" />
                    <div className="bg-gradient-to-br from-orange-300 to-orange-200 rounded-xl" />
                    <div className="bg-gradient-to-br from-blue-300 to-blue-200 rounded-xl" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Join a ZUG near you</h3>
                <p className="text-base text-muted-foreground mb-6 leading-relaxed max-w-sm">
                  Choose from over 140 AquaWatt User Groups(ZUG) across the world to stay informed of meetups near you.
                </p>
                <button className="inline-flex items-center gap-1.5 text-base font-medium border-b-2 border-black dark:border-white pb-0.5 hover:opacity-70 transition">
                  👨‍💼 Join now
                </button>
              </div>
            </section>

            {/* Main Grid: Posts + Sidebar */}
            <div className="grid gap-8 md:grid-cols-3">
              <div className="md:col-span-2 space-y-6">
                {/* Create Post Inline */}
                <Card className="border-dashed">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold">Create a Post</h2>
                    {!user && <span className="text-sm text-muted-foreground">Sign in to post</span>}
                  </div>
                  <div className="space-y-2">
                    <Input placeholder="Title" value={newTitle} onChange={e=>setNewTitle(e.target.value)} disabled={!user || creating} />
                    <Textarea placeholder="Share your thoughts or question..." value={newContent} onChange={e=>setNewContent(e.target.value)} disabled={!user || creating} />
                    <div className="flex justify-end">
                      <Button size="sm" onClick={handleCreatePost} disabled={!user || creating || !newTitle.trim() || !newContent.trim()}> {creating ? <><Loader2 className="h-4 w-4 mr-1 animate-spin"/>Posting</> : <><Plus className="h-4 w-4 mr-1"/>Post</>} </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <h2 className="text-xl font-semibold flex items-center gap-2"><MessageSquare className="h-5 w-5"/> Community Posts</h2>
              {loading && <div className="text-base text-muted-foreground">Loading posts...</div>}
              {!loading && posts.length === 0 && <div className="text-base text-muted-foreground">No posts yet.</div>}
              <div className="space-y-4">
                {posts.map(p => (
                  <Card key={p.id} className={`cursor-pointer hover:shadow-sm transition ${activePost?.id===p.id ? 'ring-2 ring-primary/40' : ''}`} onClick={()=>openPost(p)}>
                    <CardHeader className="pb-2"><CardTitle className="text-lg line-clamp-1">{p.title}</CardTitle></CardHeader>
                    <CardContent className="text-sm md:text-base text-muted-foreground line-clamp-3 whitespace-pre-wrap">{p.content}</CardContent>
                  </Card>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Upcoming Events</CardTitle></CardHeader>
                <CardContent className="text-sm space-y-4">
                  <div><p className="font-medium">Community Meetup</p><p className="text-muted-foreground">September 13, 2025 • Monthly virtual meetup</p></div>
                  <div><p className="font-medium">AquaWatt Workshop</p><p className="text-muted-foreground">October 02, 2025 • Advanced features & tips</p></div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2"><CardTitle className="text-base">Community & Social</CardTitle></CardHeader>
                <CardContent className="grid gap-4 text-sm">
                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Venus Electric</div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="Facebook">
                        <a href="https://www.facebook.com/search/top?q=Venus%20Electric" target="_blank" rel="noopener noreferrer" aria-label="Venus Electric on Facebook">
                          <Facebook className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="YouTube">
                        <a href="https://www.youtube.com/results?search_query=Venus+Electric" target="_blank" rel="noopener noreferrer" aria-label="Venus Electric on YouTube">
                          <Youtube className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="Twitter">
                        <a href="https://twitter.com/search?q=Venus%20Electric" target="_blank" rel="noopener noreferrer" aria-label="Venus Electric on Twitter">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="Website">
                        <a href="https://www.google.com/search?q=Venus+Electric+official+website" target="_blank" rel="noopener noreferrer" aria-label="Venus Electric official website">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="Instagram">
                        <a href="https://www.instagram.com/explore/search/keyword/?q=Venus%20Electric" target="_blank" rel="noopener noreferrer" aria-label="Venus Electric on Instagram">
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="LinkedIn">
                        <a href="https://www.linkedin.com/search/results/companies/?keywords=Venus%20Electric" target="_blank" rel="noopener noreferrer" aria-label="Venus Electric on LinkedIn">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs uppercase tracking-wide text-muted-foreground">Bajaj Electronics</div>
                    <div className="flex flex-wrap gap-2">
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="Facebook">
                        <a href="https://www.facebook.com/search/top?q=Bajaj%20Electronics" target="_blank" rel="noopener noreferrer" aria-label="Bajaj Electronics on Facebook">
                          <Facebook className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="YouTube">
                        <a href="https://www.youtube.com/results?search_query=Bajaj+Electronics" target="_blank" rel="noopener noreferrer" aria-label="Bajaj Electronics on YouTube">
                          <Youtube className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="Twitter">
                        <a href="https://twitter.com/search?q=Bajaj%20Electronics" target="_blank" rel="noopener noreferrer" aria-label="Bajaj Electronics on Twitter">
                          <Twitter className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="Website">
                        <a href="https://www.bajajelectronics.com" target="_blank" rel="noopener noreferrer" aria-label="Bajaj Electronics official website">
                          <Globe className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="Instagram">
                        <a href="https://www.instagram.com/explore/search/keyword/?q=Bajaj%20Electronics" target="_blank" rel="noopener noreferrer" aria-label="Bajaj Electronics on Instagram">
                          <Instagram className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button asChild size="icon" variant="outline" className="h-9 w-9" title="LinkedIn">
                        <a href="https://www.linkedin.com/search/results/companies/?keywords=Bajaj%20Electronics" target="_blank" rel="noopener noreferrer" aria-label="Bajaj Electronics on LinkedIn">
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {activePost && (
                <Card>
                  <CardHeader className="pb-2"><CardTitle className="text-base truncate">{activePost.title}</CardTitle></CardHeader>
                  <CardContent className="text-sm md:text-base whitespace-pre-wrap">{activePost.content}</CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Community;
