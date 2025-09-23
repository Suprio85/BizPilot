"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Play, Clock, Award, Users, Star, ArrowRight, Download, Video, FileText } from "lucide-react"

const courses = [
  {
    id: 1,
    title: "Business Model Canvas Mastery",
    description: "Learn to create and validate business models using the proven canvas framework.",
    instructor: "Sarah Johnson",
    duration: "2h 30m",
    lessons: 12,
    level: "Beginner",
    rating: 4.8,
    students: 1247,
    progress: 0,
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Strategy",
  },
  {
    id: 2,
    title: "Market Research & Validation",
    description: "Master the art of understanding your market and validating your business ideas.",
    instructor: "David Chen",
    duration: "3h 15m",
    lessons: 18,
    level: "Intermediate",
    rating: 4.9,
    students: 892,
    progress: 65,
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Research",
  },
  {
    id: 3,
    title: "Financial Planning for Startups",
    description: "Build solid financial foundations and create compelling investor presentations.",
    instructor: "Maria Rodriguez",
    duration: "4h 45m",
    lessons: 24,
    level: "Advanced",
    rating: 4.7,
    students: 634,
    progress: 30,
    thumbnail: "/placeholder.svg?height=200&width=300",
    category: "Finance",
  },
]

const resources = [
  {
    title: "Startup Toolkit 2024",
    type: "PDF Guide",
    size: "2.4 MB",
    downloads: 5420,
    icon: FileText,
  },
  {
    title: "Pitch Deck Templates",
    type: "PowerPoint",
    size: "15.2 MB",
    downloads: 3210,
    icon: FileText,
  },
  {
    title: "Business Plan Template",
    type: "Word Document",
    size: "1.8 MB",
    downloads: 4150,
    icon: FileText,
  },
]

const webinars = [
  {
    title: "AI in Business: Opportunities & Challenges",
    date: "Dec 20, 2024",
    time: "2:00 PM EST",
    speaker: "Dr. Alex Thompson",
    attendees: 234,
    status: "upcoming",
  },
  {
    title: "Scaling Your Startup in 2025",
    date: "Dec 15, 2024",
    time: "7:00 PM EST",
    speaker: "Jennifer Kim",
    attendees: 456,
    status: "live",
  },
]

export default function LearningPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Learning Hub</h1>
          <p className="text-muted-foreground mt-1">
            Expand your entrepreneurial knowledge with expert-led courses and resources.
          </p>
        </div>
        <Button className="btn-primary-enhanced">
          <BookOpen className="w-4 h-4 mr-2" />
          Browse All Courses
        </Button>
      </div>

      {/* Learning Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Courses Enrolled</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-muted-foreground">Certificates Earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">24h</p>
                <p className="text-sm text-muted-foreground">Learning Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="webinars">Webinars</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="certificates">Certificates</TabsTrigger>
        </TabsList>

        <TabsContent value="courses" className="space-y-6">
          {/* Continue Learning */}
          <Card>
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses
                  .filter((course) => course.progress > 0)
                  .map((course) => (
                    <div key={course.id} className="flex items-center gap-4 p-4 border border-border rounded-lg">
                      <img
                        src={course.thumbnail || "/placeholder.svg"}
                        alt={course.title}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{course.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">by {course.instructor}</p>
                        <div className="flex items-center gap-4">
                          <Progress value={course.progress} className="flex-1" />
                          <span className="text-sm text-muted-foreground">{course.progress}%</span>
                        </div>
                      </div>
                      <Button size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Continue
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>

          {/* All Courses */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <div className="aspect-video relative">
                  <img
                    src={course.thumbnail || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <Button size="sm" className="bg-white/90 text-black hover:bg-white">
                      <Play className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {course.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {course.level}
                    </Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{course.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {course.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {course.students}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </div>
                  </div>
                  <Button className="w-full" size="sm">
                    {course.progress > 0 ? "Continue" : "Start Course"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="webinars" className="space-y-4">
          {webinars.map((webinar, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{webinar.title}</h3>
                      <p className="text-sm text-muted-foreground">by {webinar.speaker}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {webinar.date} • {webinar.time}
                        </span>
                        <Badge variant={webinar.status === "live" ? "default" : "secondary"}>
                          {webinar.status === "live" ? "Live Now" : "Upcoming"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-2">{webinar.attendees} registered</p>
                    <Button size="sm" variant={webinar.status === "live" ? "default" : "outline"}>
                      {webinar.status === "live" ? "Join Now" : "Register"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {resources.map((resource, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <resource.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{resource.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {resource.type} • {resource.size}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">{resource.downloads} downloads</p>
                    </div>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="certificates">
          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Your Certificates</h3>
              <p className="text-muted-foreground mb-4">
                Complete courses to earn certificates and showcase your expertise.
              </p>
              <Button>View All Certificates</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
