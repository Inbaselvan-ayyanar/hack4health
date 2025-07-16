import { useState } from 'react';
import { Users, Plus, Heart, Calendar, Share2, UserPlus, MessageCircle, Shield } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Circle {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  type: 'family' | 'support' | 'condition';
  adherenceRate: number;
  lastActivity: string;
  isJoined: boolean;
}

interface Member {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  adherenceRate: number;
}

const mockCircles: Circle[] = [
  {
    id: '1',
    name: 'Johnson Family',
    description: 'Supporting each other with medication adherence',
    memberCount: 4,
    type: 'family',
    adherenceRate: 87,
    lastActivity: '2 hours ago',
    isJoined: true
  },
  {
    id: '2',
    name: 'Diabetes Support Group',
    description: 'Community for people managing diabetes',
    memberCount: 156,
    type: 'condition',
    adherenceRate: 82,
    lastActivity: '1 day ago',
    isJoined: true
  },
  {
    id: '3',
    name: 'Heart Health Champions',
    description: 'Supporting cardiovascular medication adherence',
    memberCount: 89,
    type: 'support',
    adherenceRate: 91,
    lastActivity: '3 days ago',
    isJoined: false
  }
];

const mockMembers: Member[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Family Member',
    adherenceRate: 95
  },
  {
    id: '2',
    name: 'Mike Johnson',
    role: 'Family Member',
    adherenceRate: 88
  },
  {
    id: '3',
    name: 'Dr. Williams',
    role: 'Healthcare Provider',
    adherenceRate: 100
  }
];

export const AdherenceCircles = () => {
  const [circles] = useState<Circle[]>(mockCircles);
  const [selectedCircle, setSelectedCircle] = useState<Circle | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCircleName, setNewCircleName] = useState('');
  const [newCircleDescription, setNewCircleDescription] = useState('');

  const getCircleTypeColor = (type: Circle['type']) => {
    switch (type) {
      case 'family':
        return 'bg-blue-100 text-blue-800';
      case 'support':
        return 'bg-green-100 text-green-800';
      case 'condition':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCircleTypeIcon = (type: Circle['type']) => {
    switch (type) {
      case 'family':
        return <Heart className="h-4 w-4" />;
      case 'support':
        return <Users className="h-4 w-4" />;
      case 'condition':
        return <Shield className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const handleCreateCircle = () => {
    if (newCircleName.trim()) {
      // In a real app, this would create a new circle
      alert(`Creating circle: ${newCircleName}`);
      setIsCreateDialogOpen(false);
      setNewCircleName('');
      setNewCircleDescription('');
    }
  };

  const joinCircle = (circleId: string) => {
    alert(`Joining circle ${circleId}`);
  };

  const shareProgress = (circleId: string) => {
    alert(`Sharing progress with circle ${circleId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Adherence Circles</h1>
          <p className="text-muted-foreground">
            Connect with family and support groups for better medication adherence
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create Circle
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Circle</DialogTitle>
              <DialogDescription>
                Create a new support circle to share your medication adherence journey
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="circle-name">Circle Name</Label>
                <Input
                  id="circle-name"
                  value={newCircleName}
                  onChange={(e) => setNewCircleName(e.target.value)}
                  placeholder="Enter circle name"
                />
              </div>
              <div>
                <Label htmlFor="circle-description">Description</Label>
                <Input
                  id="circle-description"
                  value={newCircleDescription}
                  onChange={(e) => setNewCircleDescription(e.target.value)}
                  placeholder="Describe your circle"
                />
              </div>
              <Button onClick={handleCreateCircle} className="w-full">
                Create Circle
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* My Circles */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">My Circles</h2>
        
        <div className="grid gap-4">
          {circles
            .filter(circle => circle.isJoined)
            .map((circle) => (
              <Card key={circle.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getCircleTypeIcon(circle.type)}
                        {circle.name}
                        <Badge className={getCircleTypeColor(circle.type)}>
                          {circle.type}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {circle.description}
                      </CardDescription>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{circle.adherenceRate}%</div>
                      <div className="text-muted-foreground">adherence</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {circle.memberCount} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {circle.lastActivity}
                    </span>
                  </div>
                  
                  {circle.id === '1' && (
                    <div>
                      <h4 className="font-medium mb-2">Recent Members</h4>
                      <div className="flex -space-x-2">
                        {mockMembers.slice(0, 3).map((member) => (
                          <Avatar key={member.id} className="border-2 border-background h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => shareProgress(circle.id)}
                    >
                      <Share2 className="h-4 w-4 mr-2" />
                      Share Progress
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Chat
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>

      {/* Discover Circles */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Discover Circles</h2>
        
        <div className="grid gap-4">
          {circles
            .filter(circle => !circle.isJoined)
            .map((circle) => (
              <Card key={circle.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {getCircleTypeIcon(circle.type)}
                        {circle.name}
                        <Badge className={getCircleTypeColor(circle.type)}>
                          {circle.type}
                        </Badge>
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {circle.description}
                      </CardDescription>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-medium">{circle.adherenceRate}%</div>
                      <div className="text-muted-foreground">avg adherence</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {circle.memberCount} members
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {circle.lastActivity}
                    </span>
                  </div>
                  
                  <Button 
                    onClick={() => joinCircle(circle.id)}
                    className="w-full"
                  >
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Circle
                  </Button>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};