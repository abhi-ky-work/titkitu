import React, { useState } from "react";
import PartnerLayout from "../components/partner/PartnerLayout";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Alert, AlertDescription } from "../components/ui/alert";
import { 
  Send, 
  TestTube, 
  Mail, 
  MessageSquare, 
  Users, 
  CheckCircle, 
  AlertTriangle 
} from "lucide-react";

export default function UserNotification() {
  const [emailMessage, setEmailMessage] = useState("");
  const [smsMessage, setSmsMessage] = useState("");
  const [testEmail, setTestEmail] = useState("");
  const [testPhone, setTestPhone] = useState("");
  const [isTesting, setIsTesting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const handleTestNotification = async (type) => {
    setIsTesting(true);
    setTestResult(null);
    
    // Simulate API call
    setTimeout(() => {
      setTestResult({
        type: type,
        success: true,
        message: `Test ${type} sent successfully!`
      });
      setIsTesting(false);
    }, 2000);
  };

  const handleSendToUsers = async () => {
    setIsSending(true);
    
    // Simulate API call
    setTimeout(() => {
      alert("Notifications sent to all ticket holders successfully!");
      setIsSending(false);
      // Reset form
      setEmailMessage("");
      setSmsMessage("");
    }, 3000);
  };

  const emailCharCount = emailMessage.length;
  const smsCharCount = smsMessage.length;
  const smsLimit = 160;

  return (
    <PartnerLayout>
      <div className="p-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">User Notifications</h1>
          <p className="text-gray-600">Send notifications to your event attendees</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notification Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Message Composition */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Compose Messages
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="email" className="space-y-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="email">Email Message</TabsTrigger>
                    <TabsTrigger value="sms">SMS Message</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="email" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-message">Email Message</Label>
                      <Textarea
                        id="email-message"
                        placeholder="Write your email message here..."
                        value={emailMessage}
                        onChange={(e) => setEmailMessage(e.target.value)}
                        rows={8}
                        className="resize-none"
                      />
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>Use this for detailed information and updates</span>
                        <span>{emailCharCount} characters</span>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="sms" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="sms-message">SMS Message</Label>
                      <Textarea
                        id="sms-message"
                        placeholder="Write your SMS message here..."
                        value={smsMessage}
                        onChange={(e) => setSmsMessage(e.target.value)}
                        rows={4}
                        className="resize-none"
                        maxLength={smsLimit}
                      />
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Keep it short and concise</span>
                        <span className={smsCharCount > smsLimit * 0.9 ? "text-red-500" : "text-gray-500"}>
                          {smsCharCount}/{smsLimit}
                        </span>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Test Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TestTube className="w-5 h-5" />
                  Test Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm">
                  Test your messages before sending them to all attendees
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="test-email">Test Email Address</Label>
                    <Input
                      id="test-email"
                      type="email"
                      placeholder="your@email.com"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleTestNotification('email')}
                      disabled={!emailMessage || !testEmail || isTesting}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Test Email
                    </Button>
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="test-phone">Test Phone Number</Label>
                    <Input
                      id="test-phone"
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={testPhone}
                      onChange={(e) => setTestPhone(e.target.value)}
                    />
                    <Button 
                      variant="outline" 
                      className="w-full"
                      onClick={() => handleTestNotification('sms')}
                      disabled={!smsMessage || !testPhone || isTesting}
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Test SMS
                    </Button>
                  </div>
                </div>

                {/* Test Result */}
                {testResult && (
                  <Alert className={testResult.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}>
                    {testResult.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-red-600" />
                    )}
                    <AlertDescription className={testResult.success ? "text-green-800" : "text-red-800"}>
                      {testResult.message}
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            {/* Send to All Users */}
            <Card className="border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-700">
                  <Send className="w-5 h-5" />
                  Send to All Attendees
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Alert>
                    <AlertTriangle className="w-4 h-4" />
                    <AlertDescription>
                      This will send notifications to all ticket holders. Make sure to test your messages first.
                    </AlertDescription>
                  </Alert>
                  
                  <Button 
                    className="w-full luxury-gradient text-white text-lg py-3"
                    onClick={handleSendToUsers}
                    disabled={(!emailMessage && !smsMessage) || isSending}
                  >
                    {isSending ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Sending Notifications...
                      </div>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send to All Ticket Holders
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  Notification Recipients
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Ticket Holders</span>
                  <span className="font-semibold">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email Addresses</span>
                  <span className="font-semibold">247</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone Numbers</span>
                  <span className="font-semibold">198</span>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Best Practices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Test your messages before sending to all attendees</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Keep SMS messages under 160 characters for best delivery</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Include event name and key information in your message</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span>Send notifications at appropriate times (not too late/early)</span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Notifications */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Recent Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">Event Reminder</span>
                    <span className="text-xs text-gray-500">2 hours ago</span>
                  </div>
                  <p className="text-gray-600 text-xs">Sent to 247 attendees</p>
                </div>
                <div className="text-sm">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium">Venue Update</span>
                    <span className="text-xs text-gray-500">1 day ago</span>
                  </div>
                  <p className="text-gray-600 text-xs">Sent to 247 attendees</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PartnerLayout>
  );
}