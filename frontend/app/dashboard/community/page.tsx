"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, MessageSquare, Heart, Share2, Search, Filter, TrendingUp, Award, Calendar, MapPin } from "lucide-react"

const communityPosts = [
  {
    id: 1,
    author: "Sarah Chen",
    avatar: "/placeholder-user.jpg",
    title: "Successfully launched my eco-packaging startup!",
    content:
      "Thanks to BizPilot's market analysis, I identified the perfect niche. Revenue hit $50K in the first quarter!",
    category: "Success Story",
    likes: 124,
    comments: 18,
    timeAgo: "2 hours ago",
    location: "San Francisco, CA",
  },
  {
    id: 2,
    author: "Ahmed Rahman",
    avatar: "/placeholder-user.jpg",
    title: "Looking for co-founder for AI-powered education platform",
    content: "Built an MVP using BizPilot's recommendations. Need a technical co-founder to scale. DM me!",
    category: "Collaboration",
    likes: 89,
    comments: 32,
    timeAgo: "5 hours ago",
    location: "Dhaka, Bangladesh",
  },
  {
    id: 3,
    author: "Maria Rodriguez",
    avatar: "/placeholder-user.jpg",
    title: "Market validation tips that actually work",
    content: "Here are 5 strategies I used to validate my food delivery idea before building anything...",
    category: "Tips & Advice",
    likes: 156,
    comments: 24,
    timeAgo: "1 day ago",
    location: "Mexico City, Mexico",
  },
]

const upcomingEvents = [
  {
    title: "Startup Pitch Night",
    date: "Dec 15, 2024",
    time: "7:00 PM EST",
    attendees: 45,
    type: "Virtual",
  },
  {
    title: "AI in Business Workshop",
    date: "Dec 18, 2024",
    time: "2:00 PM EST",
    attendees: 78,
    type: "Hybrid",
  },
]

export default function CommunityPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Community</h1>
          <p className="text-muted-foreground mt-1">Connect with fellow entrepreneurs and share your journey.</p>
        </div>
        <Button className="btn-primary-enhanced">
          <MessageSquare className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search discussions..." className="pl-10" />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tabs */}
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="feed">Feed</TabsTrigger>
              <TabsTrigger value="success">Success Stories</TabsTrigger>
              <TabsTrigger value="help">Help & Advice</TabsTrigger>
              <TabsTrigger value="collaboration">Collaboration</TabsTrigger>
            </TabsList>

            <TabsContent value="feed" className="space-y-4">
              {/* Create Post */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <Avatar>
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-3">
                      <Textarea placeholder="Share your entrepreneurial journey..." />
                      <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                          <Badge variant="outline">Success Story</Badge>
                          <Badge variant="outline">Tips & Advice</Badge>
                          <Badge variant="outline">Collaboration</Badge>
                        </div>
                        <Button size="sm">Post</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Posts */}
              {communityPosts.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <Avatar>
                        <AvatarImage src={post.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {post.author
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{post.author}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {post.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{post.timeAgo}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                          <MapPin className="w-3 h-3" />
                          {post.location}
                        </div>
                        <h3 className="font-medium mb-2">{post.title}</h3>
                        <p className="text-muted-foreground mb-4">{post.content}</p>
                        <div className="flex items-center gap-6">
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Heart className="w-4 h-4" />
                            {post.likes}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <MessageSquare className="w-4 h-4" />
                            {post.comments}
                          </Button>
                          <Button variant="ghost" size="sm" className="gap-2">
                            <Share2 className="w-4 h-4" />
                            Share
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="success">
              <Card>
                <CardContent className="p-6 text-center">
                  <Award className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Success Stories</h3>
                  <p className="text-muted-foreground">
                    Celebrate wins and learn from successful entrepreneurs in our community.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="help">
              <Card>
                <CardContent className="p-6 text-center">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Help & Advice</h3>
                  <p className="text-muted-foreground">Get guidance from experienced entrepreneurs and mentors.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="collaboration">
              <Card>
                <CardContent className="p-6 text-center">
                  <MessageSquare className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Collaboration</h3>
                  <p className="text-muted-foreground">
                    Find co-founders, partners, and collaborators for your next venture.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Community Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Active Members</span>
                <span className="font-semibold">12,847</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Posts This Week</span>
                <span className="font-semibold">234</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Success Stories</span>
                <span className="font-semibold">89</span>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Upcoming Events
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="border border-border rounded-lg p-3">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {event.date} • {event.time}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{event.attendees} attending</span>
                    <Badge variant="outline" className="text-xs">
                      {event.type}
                    </Badge>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full bg-transparent">
                View All Events
              </Button>
            </CardContent>
          </Card>

          {/* Top Contributors */}
          <Card>
            <CardHeader>
              <CardTitle>Top Contributors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src="/placeholder-user.jpg" />
                    <AvatarFallback>U{i}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">User {i}</p>
                    <p className="text-xs text-muted-foreground">{50 - i * 10} contributions</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    #{i}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
