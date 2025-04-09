import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Globe, 
  Palette, 
  Save, 
  Clock,
  Smartphone,
  Moon 
} from "lucide-react";

// Form schemas
const profileFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  bio: z.string().optional(),
  role: z.string(),
  phone: z.string().optional(),
  address: z.string().optional(),
});

const securityFormSchema = z.object({
  currentPassword: z.string().min(1, { message: "Current password is required" }),
  newPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z.string().min(8, { message: "Password must be at least 8 characters." }),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const notificationFormSchema = z.object({
  emailNotifications: z.boolean(),
  smsNotifications: z.boolean(),
  appointmentReminders: z.boolean(),
  updateNotifications: z.boolean(),
  marketingEmails: z.boolean(),
});

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const { toast } = useToast();
  
  const { data: currentUser } = useQuery({
    queryKey: ['/api/users/current'],
  });
  
  // Profile form
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: currentUser?.name || "",
      email: currentUser?.email || "",
      bio: "",
      role: currentUser?.role || "",
      phone: "",
      address: "",
    },
  });
  
  // Security form
  const securityForm = useForm<z.infer<typeof securityFormSchema>>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Notification form
  const notificationForm = useForm<z.infer<typeof notificationFormSchema>>({
    resolver: zodResolver(notificationFormSchema),
    defaultValues: {
      emailNotifications: true,
      smsNotifications: true,
      appointmentReminders: true,
      updateNotifications: true,
      marketingEmails: false,
    },
  });
  
  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    // In a real app, we would submit this data to an API
    console.log(values);
    toast({
      title: "Profile Updated",
      description: "Your profile information has been updated successfully.",
    });
  }
  
  function onSecuritySubmit(values: z.infer<typeof securityFormSchema>) {
    // In a real app, we would submit this data to an API
    console.log(values);
    toast({
      title: "Password Changed",
      description: "Your password has been changed successfully.",
    });
    securityForm.reset({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  }
  
  function onNotificationSubmit(values: z.infer<typeof notificationFormSchema>) {
    // In a real app, we would submit this data to an API
    console.log(values);
    toast({
      title: "Notification Settings Saved",
      description: "Your notification preferences have been updated.",
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account settings and preferences.</p>
      </div>
      
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 md:w-fit w-full">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            <span className="hidden md:inline">Security</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden md:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span className="hidden md:inline">Appearance</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile and personal information.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={currentUser?.avatar} alt={currentUser?.name} />
                  <AvatarFallback>{currentUser?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    Change Avatar
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, GIF or PNG. Max size 2MB.
                  </p>
                </div>
              </div>
              
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="role"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Role</FormLabel>
                          <FormControl>
                            <Input readOnly {...field} />
                          </FormControl>
                          <FormDescription>Your role cannot be changed.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Your phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="md:col-span-2">
                      <FormField
                        control={profileForm.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="Your address" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <FormField
                        control={profileForm.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us a little about yourself" 
                                className="resize-none h-20"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-primary hover:bg-blue-600">
                      <Save className="h-4 w-4 mr-2" />
                      Save Profile
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>
                Change your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)} className="space-y-6">
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Current password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>New Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="New password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Password must be at least 8 characters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Confirm password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-primary hover:bg-blue-600">
                      Change Password
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Two-Factor Authentication</CardTitle>
              <CardDescription>
                Add an extra layer of security to your account.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Authenticator App</h4>
                  <p className="text-sm text-gray-500">
                    Use an authenticator app to generate one-time codes.
                  </p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">SMS Authentication</h4>
                  <p className="text-sm text-gray-500">
                    Receive a code via SMS to verify your identity.
                  </p>
                </div>
                <Button variant="outline">Enable</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Sessions</CardTitle>
              <CardDescription>
                Manage your active sessions and sign out from other devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Smartphone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">Current Device</h4>
                    <p className="text-xs text-gray-500">
                      {navigator.userAgent.includes("Windows") ? "Windows" : 
                       navigator.userAgent.includes("Mac") ? "MacOS" : "Unknown"} - 
                      {navigator.userAgent.includes("Chrome") ? "Chrome" : 
                       navigator.userAgent.includes("Firefox") ? "Firefox" : 
                       navigator.userAgent.includes("Safari") ? "Safari" : "Unknown Browser"}
                    </p>
                  </div>
                </div>
                <span className="text-xs bg-green-100 text-green-800 py-1 px-2 rounded-full">
                  Active Now
                </span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button variant="destructive">Sign Out All Devices</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>
                Choose how you receive notifications and updates.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...notificationForm}>
                <form onSubmit={notificationForm.handleSubmit(onNotificationSubmit)} className="space-y-6">
                  <div className="space-y-4">
                    <FormField
                      control={notificationForm.control}
                      name="emailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-medium">Email Notifications</FormLabel>
                            <FormDescription>
                              Receive emails about your account activity.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="smsNotifications"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-medium">SMS Notifications</FormLabel>
                            <FormDescription>
                              Receive text messages for important updates.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="appointmentReminders"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-medium">Appointment Reminders</FormLabel>
                            <FormDescription>
                              Get reminders about upcoming appointments.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="updateNotifications"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-medium">System Updates</FormLabel>
                            <FormDescription>
                              Receive notifications about system updates and maintenance.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={notificationForm.control}
                      name="marketingEmails"
                      render={({ field }) => (
                        <FormItem className="flex justify-between items-center rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base font-medium">Marketing Emails</FormLabel>
                            <FormDescription>
                              Receive emails about new features and services.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch 
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button type="submit" className="bg-primary hover:bg-blue-600">
                      Save Notification Settings
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the look and feel of the application.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Theme</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer bg-primary/5">
                    <Palette className="h-8 w-8 text-primary" />
                    <span className="text-sm font-medium">Light</span>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer">
                    <Moon className="h-8 w-8 text-gray-400" />
                    <span className="text-sm">Dark</span>
                  </div>
                  <div className="border rounded-lg p-4 flex flex-col items-center gap-2 cursor-pointer">
                    <Globe className="h-8 w-8 text-gray-400" />
                    <span className="text-sm">System</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Time Zone</h3>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gray-400" />
                  <span>Current timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium mb-4">Language</h3>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <span>Current language: English (US)</span>
                </div>
                <Button variant="outline" className="mt-2">
                  Change Language
                </Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end border-t pt-6">
              <Button className="bg-primary hover:bg-blue-600">
                Save Appearance Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
