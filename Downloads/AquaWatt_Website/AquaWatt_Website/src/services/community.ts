import { supabase } from '@/integrations/supabase/client';

export interface CommunityPost { id:string; title:string; content:string; created_at:string; user_id:string }
export interface CommunityReply { id:string; post_id:string; content:string; created_at:string; user_id:string }

// New interfaces for community feed
export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  author_id: string;
  created_at: string;
  tags?: string[];
}

export interface Discussion {
  id: string;
  title: string;
  content: string;
  author: string;
  author_id: string;
  reply_count: number;
  like_count: number;
  created_at: string;
  last_activity: string;
  tags?: string[];
}

export interface TrendingTopic {
  id: string;
  title: string;
  content: string;
  author: string;
  author_id: string;
  view_count: number;
  share_count: number;
  engagement_score: number;
  created_at: string;
  tags?: string[];
}

export interface CommunityEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'online' | 'offline';
  location?: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_at: string;
}

export async function listPosts(): Promise<CommunityPost[]> {
  const { data, error } = await supabase.from('community_posts').select('*').order('created_at',{ascending:false}).limit(20);
  if (error) { console.warn('listPosts error', error); return []; }
  return data as any as CommunityPost[];
}

// Announcements functions
export async function listAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await supabase
    .from('announcements')
    .select(`
      id,
      title,
      content,
      date,
      author,
      author_id,
      created_at,
      tags
    `)
    .order('created_at', { ascending: false })
    .limit(10);
    
  if (error) { 
    console.warn('listAnnouncements error', error); 
    // Return mock data as fallback
    return [
      {
        id: '1',
        title: "Venus Electronics Discount Sale",
        content: "Energy Saving - Sigma BLDC Ceiling Fan-Lightning deals. 2,500. 5,000 Save 2,500. Exclusive offer. 50% OFF on MRP. View Detail Buy Online.",
        date: "October 2025",
        author: "Venus Team",
        author_id: "system",
        created_at: new Date().toISOString(),
        tags: ['Promotion']
      },
      {
        id: '2',
        title: "Smart Meter Integration Update",
        content: "Enhanced compatibility with leading smart meter brands now available. Connect your devices seamlessly.",
        date: "September 2025",
        author: "Technical Team",
        author_id: "system",
        created_at: new Date(Date.now() - 86400000).toISOString(),
        tags: ['technology']
      },
      {
        id: '3',
        title: "Mobile App Version 2.1 Released",
        content: "New features include real-time leak alerts, improved analytics dashboard, and enhanced user experience.",
        date: "September 2025",
        author: "Product Team",
        author_id: "system",
        created_at: new Date(Date.now() - 172800000).toISOString(),
        tags: ['update']
      }
    ];
  }
  return data as Announcement[];
}

// Most discussed functions
export async function listMostDiscussed(): Promise<Discussion[]> {
  const { data, error } = await supabase
    .from('discussions')
    .select(`
      id,
      title,
      content,
      author,
      author_id,
      reply_count,
      like_count,
      created_at,
      last_activity,
      tags
    `)
    .order('reply_count', { ascending: false })
    .limit(10);
    
  if (error) { 
    console.warn('listMostDiscussed error', error); 
    // Return mock data as fallback
    return [
      {
        id: '1',
        title: "Best practices for reducing water bills?",
        content: "Looking for community advice on effective water conservation methods that have worked for your household.",
        author: "Sarah Chen",
        author_id: "user1",
        reply_count: 42,
        like_count: 89,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        last_activity: new Date(Date.now() - 3600000).toISOString(),
        tags: ['conservation', 'tips']
      },
      {
        id: '2',
        title: "Smart home integration experiences",
        content: "Share your experiences integrating WaterLight with other smart home systems. What works best?",
        author: "Mike Rodriguez",
        author_id: "user2",
        reply_count: 38,
        like_count: 67,
        created_at: new Date(Date.now() - 259200000).toISOString(),
        last_activity: new Date(Date.now() - 7200000).toISOString(),
        tags: ['smart-home', 'integration']
      },
      {
        id: '3',
        title: "Leak detection success stories",
        content: "Has anyone caught a major leak early using the app? Share your story and help others!",
        author: "Jennifer Kim",
        author_id: "user3",
        reply_count: 29,
        like_count: 156,
        created_at: new Date(Date.now() - 345600000).toISOString(),
        last_activity: new Date(Date.now() - 10800000).toISOString(),
        tags: ['leak-detection', 'success']
      },
      {
        id: '4',
        title: "Monthly usage tracking tips",
        content: "What's your strategy for tracking and reducing monthly water usage? Share your methods!",
        author: "David Park",
        author_id: "user4",
        reply_count: 31,
        like_count: 73,
        created_at: new Date(Date.now() - 432000000).toISOString(),
        last_activity: new Date(Date.now() - 14400000).toISOString(),
        tags: ['tracking', 'usage']
      }
    ];
  }
  return data as Discussion[];
}

// Trending topics functions
export async function listTrendingTopics(): Promise<TrendingTopic[]> {
  const { data, error } = await supabase
    .from('trending_topics')
    .select(`
      id,
      title,
      content,
      author,
      author_id,
      view_count,
      share_count,
      engagement_score,
      created_at,
      tags
    `)
    .order('engagement_score', { ascending: false })
    .limit(10);
    
  if (error) { 
    console.warn('listTrendingTopics error', error); 
    // Return mock data as fallback
    return [
      {
        id: '1',
        title: "🔥 October Water Challenge Results",
        content: "Amazing results from our community! See who saved the most water this month and claim your badges.",
        author: "Community Team",
        author_id: "system",
        view_count: 1247,
        share_count: 89,
        engagement_score: 95.8,
        created_at: new Date(Date.now() - 86400000).toISOString(),
        tags: ['challenge', 'results', 'trending']
      },
      {
        id: '2',
        title: "⚡ New Energy Tracking Features",
        content: "The latest app update includes revolutionary energy monitoring capabilities. Early access available now!",
        author: "Product Team",
        author_id: "system",
        view_count: 2156,
        share_count: 134,
        engagement_score: 92.3,
        created_at: new Date(Date.now() - 172800000).toISOString(),
        tags: ['features', 'energy', 'trending']
      },
      {
        id: '3',
        title: "🏆 Top 10 Water Saving Hacks",
        content: "Community-contributed tips that are saving households hundreds on their utility bills. Must read!",
        author: "Alex Thompson",
        author_id: "user4",
        view_count: 3421,
        share_count: 267,
        engagement_score: 89.7,
        created_at: new Date(Date.now() - 259200000).toISOString(),
        tags: ['tips', 'savings', 'popular']
      },
      {
        id: '4',
        title: "💡 Smart Irrigation Success Stories",
        content: "How community members are using WaterLight to optimize their garden watering and save big!",
        author: "Emma Wilson",
        author_id: "user5",
        view_count: 1876,
        share_count: 145,
        engagement_score: 87.2,
        created_at: new Date(Date.now() - 345600000).toISOString(),
        tags: ['irrigation', 'gardening', 'success']
      }
    ];
  }
  return data as TrendingTopic[];
}

// Events functions
export async function listUpcomingEvents(): Promise<CommunityEvent[]> {
  const { data, error } = await supabase
    .from('community_events')
    .select('*')
    .eq('status', 'upcoming')
    .order('date', { ascending: true })
    .limit(5);
    
  if (error) { 
    console.warn('listUpcomingEvents error', error); 
    // Return mock data as fallback
    return [
      {
        id: '1',
        title: "Community Water Conservation Webinar",
        description: "Learn advanced techniques for water conservation with expert tips and Q&A session.",
        date: "OCT 15, 2025",
        type: 'online',
        status: 'upcoming',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        title: "Smart Home Integration Workshop",
        description: "Hands-on workshop for integrating WaterLight with popular smart home platforms.",
        date: "OCT 22, 2025",
        type: 'online',
        status: 'upcoming',
        created_at: new Date().toISOString()
      },
    ];
  }
  return data as CommunityEvent[];
}

export async function listReplies(postId: string): Promise<CommunityReply[]> {
  const { data, error } = await supabase.from('community_replies').select('*').eq('post_id', postId).order('created_at',{ascending:true});
  if (error) { console.warn('listReplies error', error); return []; }
  return data as any as CommunityReply[];
}

export async function addPost(title:string, content:string): Promise<CommunityPost|null> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id; if (!uid) return null;
  const { data, error } = await (supabase as any).from('community_posts').insert({ user_id: uid, title, content }).select('*').single();
  if (error) { console.warn('addPost error', error); return null; }
  return data as any as CommunityPost;
}

export async function addReply(postId:string, content:string): Promise<CommunityReply|null> {
  const { data: auth } = await supabase.auth.getUser();
  const uid = auth?.user?.id; if (!uid) return null;
  const { data, error } = await (supabase as any).from('community_replies').insert({ user_id: uid, post_id: postId, content }).select('*').single();
  if (error) { console.warn('addReply error', error); return null; }
  return data as any as CommunityReply;
}
