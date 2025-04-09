import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Search, Send, Plus, Users, MessageSquare, Archive, Star, Trash2 } from "lucide-react";
import { format } from "date-fns";

interface Message {
  id: number;
  sender: {
    id: number;
    name: string;
    avatar: string;
  };
  content: string;
  timestamp: Date;
  read: boolean;
}

// For demonstration purposes, we'll use this sample data since there's no messages API
const sampleMessages: Message[] = [
  {
    id: 1,
    sender: {
      id: 1,
      name: "Dr. Wade Warren",
      avatar: "https://randomuser.me/api/portraits/women/87.jpg"
    },
    content: "Hello, I have a question about patient #1234. Can we discuss their treatment plan?",
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: false,
  },
  {
    id: 2,
    sender: {
      id: 2,
      name: "Dr. Dianne Russell",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    content: "The lab results for Mrs. Johnson are ready. Please review them at your earliest convenience.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: true,
  },
  {
    id: 3,
    sender: {
      id: 3,
      name: "Dr. Bessie Cooper",
      avatar: "https://randomuser.me/api/portraits/women/53.jpg"
    },
    content: "We need to discuss the department meeting agenda for next week. When are you available?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
  },
  {
    id: 4,
    sender: {
      id: 4,
      name: "Dr. Kathryn Murphy",
      avatar: "https://randomuser.me/api/portraits/women/72.jpg"
    },
    content: "I've updated the protocol for the clinical trial. Please review and provide feedback.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
  },
  {
    id: 5,
    sender: {
      id: 5,
      name: "Dr. Jerome Bell",
      avatar: "https://randomuser.me/api/portraits/men/22.jpg"
    },
    content: "Can you cover my shift next Friday? I have a family emergency.",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
    read: true,
  },
];

export default function Messages() {
  const [selectedTab, setSelectedTab] = useState("inbox");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [replyText, setReplyText] = useState("");
  
  // In a real app, we would fetch messages from an API
  const { data: doctors = [] } = useQuery({
    queryKey: ['/api/doctors'],
  });

  // Filter messages based on search query
  const filteredMessages = sampleMessages.filter(message =>
    message.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get unread count
  const unreadCount = sampleMessages.filter(message => !message.read).length;

  const handleSendReply = () => {
    if (!replyText.trim() || !selectedMessage) return;
    
    // In a real app, we would send the reply to an API
    alert(`Reply sent to ${selectedMessage.sender.name}: ${replyText}`);
    setReplyText("");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">Messages</h1>
        <Button className="bg-primary hover:bg-blue-600">
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Search and Tabs */}
          <Card>
            <CardHeader className="pb-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search messages..."
                  className="pl-10 w-full"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            
            <CardContent className="pb-1">
              <Tabs defaultValue="inbox" onValueChange={setSelectedTab}>
                <TabsList className="grid grid-cols-4 mb-4">
                  <TabsTrigger value="inbox" className="relative">
                    Inbox
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="starred">Starred</TabsTrigger>
                  <TabsTrigger value="sent">Sent</TabsTrigger>
                  <TabsTrigger value="trash">Trash</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>
          
          {/* Contact List */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            </CardHeader>
            <CardContent className="px-2 py-0">
              <div className="space-y-1">
                {doctors.map((doctor) => (
                  <div 
                    key={doctor.id}
                    className="flex items-center gap-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={doctor.avatar} alt={doctor.name} />
                      <AvatarFallback>{doctor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium leading-none">{doctor.name}</p>
                      <p className="text-xs text-gray-500">{doctor.specialty}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Messages List and Detail */}
        <div className="lg:col-span-2">
          <Card className="h-[calc(100vh-180px)]">
            <div className="flex h-full">
              {/* Messages List */}
              <div className="w-1/3 border-r h-full overflow-auto">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}</h3>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Users className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div>
                  {filteredMessages.length === 0 ? (
                    <div className="p-6 text-center text-gray-500">No messages found</div>
                  ) : (
                    filteredMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                          selectedMessage?.id === message.id ? "bg-blue-50" : ""
                        } ${!message.read ? "bg-blue-50" : ""}`}
                        onClick={() => setSelectedMessage(message)}
                      >
                        <div className="flex gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
                            <AvatarFallback>{message.sender.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-center">
                              <p className={`text-sm font-medium ${!message.read ? "font-semibold" : ""}`}>
                                {message.sender.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {format(message.timestamp, "h:mm a")}
                              </p>
                            </div>
                            <p className="text-xs text-gray-500 truncate">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              
              {/* Message Detail */}
              <div className="w-2/3 flex flex-col h-full">
                {selectedMessage ? (
                  <>
                    <div className="p-4 border-b flex justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={selectedMessage.sender.avatar} alt={selectedMessage.sender.name} />
                          <AvatarFallback>{selectedMessage.sender.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{selectedMessage.sender.name}</p>
                          <p className="text-xs text-gray-500">
                            {format(selectedMessage.timestamp, "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Archive className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Star className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex-1 p-6 overflow-auto">
                      <p className="text-sm">{selectedMessage.content}</p>
                    </div>
                    
                    <Separator />
                    
                    <div className="p-4">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Type your reply..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <Button 
                          className="bg-primary hover:bg-blue-600"
                          onClick={handleSendReply}
                          disabled={!replyText.trim()}
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                      <MessageSquare className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Select a message to view</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
