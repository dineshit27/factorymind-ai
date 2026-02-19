import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Users, MessageCircle, Calendar, Award, Lightbulb, TrendingUp, ArrowRight, ExternalLink, Heart } from 'lucide-react';

const communityStats = [
  { icon: Users, label: 'Active Members', value: '2,500+', color: 'text-accent' },
  { icon: MessageCircle, label: 'Discussions', value: '1,200+', color: 'text-primary' },
  { icon: Award, label: 'Success Stories', value: '450+', color: 'text-accent' },
  { icon: Lightbulb, label: 'Ideas Shared', value: '800+', color: 'text-primary' },
];

const upcomingEvents = [
  { 
    title: 'Energy Optimization Workshop',
    date: 'March 15, 2026',
    time: '2:00 PM IST',
    type: 'Webinar',
    attendees: 150
  },
  { 
    title: 'Case Study: 40% Energy Reduction',
    date: 'March 22, 2026',
    time: '3:00 PM IST',
    type: 'Live Session',
    attendees: 200
  },
  { 
    title: 'AI in Manufacturing Q&A',
    date: 'April 5, 2026',
    time: '11:00 AM IST',
    type: 'Interactive',
    attendees: 300
  },
];

const topContributors = [
  { name: 'Rajesh Kumar', role: 'Energy Consultant', contributions: 45, badge: '🏆' },
  { name: 'Priya Sharma', role: 'Factory Owner', contributions: 38, badge: '⭐' },
  { name: 'Amit Patel', role: 'Operations Manager', contributions: 32, badge: '💎' },
  { name: 'Meena Reddy', role: 'Sustainability Lead', contributions: 28, badge: '🎯' },
  { name: 'Vikram Singh', role: 'Maintenance Head', contributions: 25, badge: '🔥' },
];

const recentDiscussions = [
  { 
    title: 'Best practices for compressor maintenance?',
    author: 'Suresh M.',
    replies: 12,
    views: 145,
    category: 'Maintenance'
  },
  { 
    title: 'ROI comparison: Repair vs Replace motors',
    author: 'Anjali K.',
    replies: 8,
    views: 98,
    category: 'ROI'
  },
  { 
    title: 'Reducing HVAC energy consumption in summer',
    author: 'Karthik R.',
    replies: 15,
    views: 203,
    category: 'HVAC'
  },
  { 
    title: 'Success story: Saved ₹2L with simple fixes',
    author: 'Ravi B.',
    replies: 24,
    views: 356,
    category: 'Success'
  },
];

export default function Community() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-accent/5 to-background py-20">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 mb-6">
              <Users className="h-4 w-4 text-accent" />
              <span className="text-sm font-medium text-accent">Join 2,500+ Factory Owners</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              FactoryMind <span className="gradient-text">Community</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Connect with fellow factory owners, share experiences, and learn from experts in energy optimization
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Join Community <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="hero-outline" size="lg">
                Browse Discussions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {communityStats.map((stat, i) => (
            <div key={i} className="glass-card rounded-xl p-6 text-center transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30 cursor-pointer group">
              <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3 transition-transform duration-300 group-hover:scale-125`} />
              <div className="font-display text-3xl font-bold mb-1 transition-colors duration-300 group-hover:text-accent">{stat.value}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Recent Discussions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl font-bold">Recent Discussions</h2>
              <Button variant="outline" size="sm">View All</Button>
            </div>
            <div className="space-y-4">
              {recentDiscussions.map((discussion, i) => (
                <div key={i} className="glass-card rounded-xl p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-accent/10 hover:border-accent/30 cursor-pointer group">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent">
                          {discussion.category}
                        </span>
                      </div>
                      <h3 className="font-semibold mb-2 transition-colors duration-300 group-hover:text-accent">
                        {discussion.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>by {discussion.author}</span>
                        <span>•</span>
                        <span>{discussion.replies} replies</span>
                        <span>•</span>
                        <span>{discussion.views} views</span>
                      </div>
                    </div>
                    <MessageCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 transition-all duration-300 group-hover:text-accent group-hover:scale-125" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Upcoming Events */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-accent" />
                <h3 className="font-display text-xl font-bold">Upcoming Events</h3>
              </div>
              <div className="space-y-3">
                {upcomingEvents.map((event, i) => (
                  <div key={i} className="glass-card rounded-lg p-4 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:border-accent/30 cursor-pointer group">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-sm transition-colors duration-300 group-hover:text-accent">
                        {event.title}
                      </h4>
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-accent/10 text-accent flex-shrink-0">
                        {event.type}
                      </span>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div>{event.date} • {event.time}</div>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        <span>{event.attendees} registered</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Contributors */}
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Award className="h-5 w-5 text-accent" />
                <h3 className="font-display text-xl font-bold">Top Contributors</h3>
              </div>
              <div className="glass-card rounded-xl p-4">
                <div className="space-y-3">
                  {topContributors.map((contributor, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg transition-all duration-200 hover:bg-accent/5 cursor-pointer group">
                      <div className="text-2xl transition-transform duration-300 group-hover:scale-125">{contributor.badge}</div>
                      <div className="flex-1">
                        <div className="font-semibold text-sm transition-colors duration-300 group-hover:text-accent">
                          {contributor.name}
                        </div>
                        <div className="text-xs text-muted-foreground">{contributor.role}</div>
                      </div>
                      <div className="text-sm font-bold text-accent">{contributor.contributions}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 pb-20">
        <div className="glass-card rounded-2xl p-8 md:p-12 text-center energy-glow">
          <Heart className="h-12 w-12 text-accent mx-auto mb-4" />
          <h2 className="font-display text-2xl md:text-3xl font-bold mb-3">Join Our Growing Community</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Share your experiences, learn from others, and contribute to a sustainable future
          </p>
          <Button variant="hero" size="lg">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
