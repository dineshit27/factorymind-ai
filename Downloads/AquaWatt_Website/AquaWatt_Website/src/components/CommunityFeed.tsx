import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, User, MapPin, Globe, MessageSquare, Heart, Eye, Share2, TrendingUp, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  listAnnouncements, 
  listMostDiscussed, 
  listTrendingTopics, 
  listUpcomingEvents,
  Announcement,
  Discussion,
  TrendingTopic,
  CommunityEvent
} from '@/services/community';

export function CommunityFeed() {
  const [activeTab, setActiveTab] = useState('announcements');
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [trending, setTrending] = useState<TrendingTopic[]>([]);
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [announcementsData, discussionsData, trendingData, eventsData] = await Promise.all([
          listAnnouncements(),
          listMostDiscussed(),
          listTrendingTopics(),
          listUpcomingEvents()
        ]);
        
        setAnnouncements(announcementsData);
        setDiscussions(discussionsData);
        setTrending(trendingData);
        setEvents(eventsData);
      } catch (error) {
        console.error('Error loading community data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)}w ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)}mo ago`;
    return `${Math.floor(diffInDays / 365)}y ago`;
  };

  const AnnouncementItem = ({ item, index }: { item: Announcement, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer border-l-4 border-l-blue-500">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg text-gray-900 hover:text-blue-600 transition-colors flex-1">
              {item.title}
            </h3>
            {item.tags && (
              <div className="flex gap-1 ml-4">
                {item.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{item.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{formatTimeAgo(item.created_at)}</span>
            </div>
            <div className="flex items-center gap-1">
              <User className="h-4 w-4" />
              <span>{item.author}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const DiscussionItem = ({ item, index }: { item: Discussion, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer border-l-4 border-l-green-500">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg text-gray-900 hover:text-green-600 transition-colors flex-1">
              {item.title}
            </h3>
            {item.tags && (
              <div className="flex gap-1 ml-4">
                {item.tags.slice(0, 2).map(tag => (
                  <Badge key={tag} variant="outline" className="text-xs border-green-200">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{item.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTimeAgo(item.last_activity)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-green-600">
                <MessageSquare className="h-4 w-4" />
                <span>{item.reply_count}</span>
              </div>
              <div className="flex items-center gap-1 text-red-500">
                <Heart className="h-4 w-4" />
                <span>{item.like_count}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  const TrendingItem = ({ item, index }: { item: TrendingTopic, index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-300 cursor-pointer border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-50 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-semibold text-lg text-gray-900 hover:text-purple-600 transition-colors flex-1">
              {item.title}
            </h3>
            <div className="flex items-center gap-1 text-purple-600 ml-4">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm font-semibold">{item.engagement_score.toFixed(1)}</span>
            </div>
          </div>
          <p className="text-gray-600 mb-4 line-clamp-2">{item.content}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{item.author}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{formatTimeAgo(item.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1 text-blue-500">
                <Eye className="h-4 w-4" />
                <span>{item.view_count}</span>
              </div>
              <div className="flex items-center gap-1 text-purple-500">
                <Share2 className="h-4 w-4" />
                <span>{item.share_count}</span>
              </div>
            </div>
          </div>
          {item.tags && (
            <div className="flex gap-1 mt-3">
              {item.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs border-purple-200 text-purple-700">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const EventItem = ({ event, index }: { event: CommunityEvent, index: number }) => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-3 text-gray-900">
            {event.title}
          </h3>
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-1">
              {event.type === 'online' ? (
                <Globe className="h-4 w-4" />
              ) : (
                <MapPin className="h-4 w-4" />
              )}
              <span>{event.location || 'Online event'}</span>
            </div>
          </div>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            {event.type === 'online' ? 'JOIN ONLINE' : 'REGISTER NOW'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <Card key={i} className="animate-pulse">
          <CardContent className="p-6">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="flex gap-4">
              <div className="h-3 bg-gray-200 rounded w-20"></div>
              <div className="h-3 bg-gray-200 rounded w-20"></div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <section className="bg-blue-50/60 py-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left side - Announcements/Discussions/Trending */}
          <div className="lg:col-span-2">
            <div id="announcements" className="-mt-16 pt-16" />
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="announcements" className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 text-xs sm:text-sm">
                  <span className="inline-block w-2.5 h-2.5 shrink-0 bg-blue-500 rounded-full" aria-hidden="true"></span>
                  <span className="truncate max-w-[7.5rem] sm:max-w-none">Announcements</span>
                </TabsTrigger>
                <TabsTrigger value="discussions" className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 text-xs sm:text-sm">
                  <span className="inline-block w-2.5 h-2.5 shrink-0 bg-green-500 rounded-full" aria-hidden="true"></span>
                  <span className="truncate max-w-[7.5rem] sm:max-w-none">Most Discussed</span>
                </TabsTrigger>
                <TabsTrigger value="trending" className="flex items-center justify-center gap-1.5 sm:gap-2 min-w-0 text-xs sm:text-sm">
                  <span className="inline-block w-2.5 h-2.5 shrink-0 bg-purple-500 rounded-full" aria-hidden="true"></span>
                  <span className="truncate max-w-[7.5rem] sm:max-w-none">Trending</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="announcements" className="space-y-6">
                {loading ? (
                  <LoadingSkeleton />
                ) : announcements.length > 0 ? (
                  announcements.map((item, index) => (
                    <AnnouncementItem key={item.id} item={item} index={index} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No announcements yet</h3>
                    <p className="text-gray-500">Check back soon for updates from the team</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="discussions" className="space-y-6">
                {loading ? (
                  <LoadingSkeleton />
                ) : discussions.length > 0 ? (
                  discussions.map((item, index) => (
                    <DiscussionItem key={item.id} item={item} index={index} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No discussions yet</h3>
                    <p className="text-gray-500">Be the first to start a conversation!</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="trending" className="space-y-6">
                {loading ? (
                  <LoadingSkeleton />
                ) : trending.length > 0 ? (
                  trending.map((item, index) => (
                    <TrendingItem key={item.id} item={item} index={index} />
                  ))
                ) : (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No trending topics yet</h3>
                    <p className="text-gray-500">Popular discussions will appear here</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Right side - Upcoming Events */}
          <div id="events" className="scroll-mt-24">
            <div className="sticky top-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {loading ? (
                    <div className="space-y-4">
                      {[1, 2].map(i => (
                        <div key={i} className="animate-pulse">
                          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-8 bg-gray-200 rounded w-full"></div>
                        </div>
                      ))}
                    </div>
                  ) : events.length > 0 ? (
                    events.map((event, index) => (
                      <EventItem key={event.id} event={event} index={index} />
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500 text-sm">No upcoming events</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        {/* Simple resources anchor marker (content could be added later) */}
        <div id="resources" className="sr-only">Resources anchor</div>
      </div>
    </section>
  );
}