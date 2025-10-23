import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Send, User, MessageSquare, Lightbulb, Phone, Mail, Clock, Zap, Droplets } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
  type?: 'text' | 'suggestion' | 'quick-action';
  suggestions?: string[];
}

interface QuickAction {
  label: string;
  icon: React.ElementType;
  action: () => void;
}

export function AdvancedChatbot() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      sender: 'bot',
      content: '👋 Hello! I\'m your AQUAWATT smart assistant. I can help you with device control, usage analytics, billing information, and energy optimization tips. How can I assist you today?',
      timestamp: new Date(),
      type: 'text',
      suggestions: [
        'Check my water usage',
        'Show electricity trends',
        'Control my devices',
        'Billing information'
      ]
    }
  ]);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatMode, setChatMode] = useState<'assistant' | 'support'>('assistant');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const quickActions: QuickAction[] = [
    {
      label: 'Usage Summary',
      icon: Zap,
      action: () => handleQuickMessage('Show me my current usage summary')
    },
    {
      label: 'Device Status',
      icon: MessageSquare,
      action: () => handleQuickMessage('What\'s the status of my connected devices?')
    },
    {
      label: 'Energy Tips',
      icon: Lightbulb,
      action: () => handleQuickMessage('Give me energy saving tips')
    },
    {
      label: 'Contact Support',
      icon: Phone,
      action: () => setChatMode('support')
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Device control responses
    if (message.includes('turn on') || message.includes('turn off') || message.includes('control') || message.includes('device')) {
      return `🎛️ I can help you control your connected devices! Currently, you have 8 devices connected. Would you like me to:\n\n• Show device status\n• Control specific devices\n• Set up automation schedules\n\nYou can also visit the Devices section for manual control.`;
    }
    
    // Usage and analytics
    if (message.includes('usage') || message.includes('consumption') || message.includes('analytics') || message.includes('trend')) {
      return `📊 Here's your current usage overview:\n\n💧 **Water**: 3.2 kL this month (↓ 5% from last month)\n⚡ **Electricity**: 195 kWh this month (↑ 3% from last month)\n💰 **Current bill**: ₹3,885\n\n**Smart insights**: Your electricity usage peaked during 6-9 PM. Consider shifting some activities to off-peak hours to save costs!`;
    }
    
    // Billing information
    if (message.includes('bill') || message.includes('cost') || message.includes('payment') || message.includes('charge')) {
      return `💰 **Current Billing Information**:\n\n📅 **This Month**: ₹3,885 (Water: ₹1,575 | Electricity: ₹2,310)\n📈 **vs Last Month**: +4.5% (₹169.50 increase)\n🎯 **Budget Status**: Within 90% of monthly budget\n\n💡 **Tip**: You're trending to exceed your budget by 5%. Consider reducing peak-hour electricity usage!`;
    }
    
    // Energy saving tips
    if (message.includes('tip') || message.includes('save') || message.includes('optimize') || message.includes('efficiency')) {
      return `💡 **Smart Energy Saving Tips**:\n\n🌙 **Off-peak usage**: Shift washing machine and dishwasher to 11 PM - 6 AM (30% cheaper rates)\n🌡️ **AC optimization**: Set to 24°C instead of 22°C (save up to 20%)\n💧 **Water efficiency**: Fix that small bathroom leak I detected (save ₹150/month)\n⏰ **Smart scheduling**: Auto-turn off devices when not in use\n\n**Potential monthly savings**: ₹450-600`;
    }
    
    // Weather and seasonal advice
    if (message.includes('weather') || message.includes('season') || message.includes('temperature')) {
      return `🌤️ **Weather-Smart Recommendations**:\n\nToday's weather suggests:\n• 🌡️ Temperature rising - consider pre-cooling your home at off-peak rates\n• 💧 Low humidity - reduce AC dehumidification mode\n• ☀️ Sunny day - perfect for solar water heating if available\n\n**Tomorrow's forecast**: Cloudy with chances of rain - plan indoor activities to optimize energy usage.`;
    }
    
    // Technical support
    if (message.includes('problem') || message.includes('issue') || message.includes('help') || message.includes('support')) {
      return `🔧 **Technical Support Available**:\n\nI can help with:\n• 📱 App navigation and features\n• 🔌 Device connectivity issues\n• 📊 Understanding your usage data\n• ⚙️ Account settings and preferences\n\n**For urgent issues**: Call +91 8122129450\n**Email support**: enquiries@aquawatt.com\n\n**Live chat**: I'm here 24/7 to assist you!`;
    }
    
    // Greetings
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('good')) {
      return `Hello! 👋 Welcome back to AQUAWATT! I see you're online at ${new Date().toLocaleTimeString()}.\n\n**Quick status update**:\n• 🟢 All devices online\n• 📊 Today's usage: Normal patterns\n• 💰 Monthly budget: 85% used\n\nWhat would you like to explore today?`;
    }
    
    // Default response with smart suggestions
    return `I'm here to help with all things AQUAWATT! 🏠\n\n**I can assist you with**:\n• 🎛️ Device control and automation\n• 📊 Usage analytics and insights\n• 💰 Billing and cost optimization\n• 💡 Energy efficiency recommendations\n• 🔧 Technical support\n\n**Try asking**: "Show my usage trends" or "Give me energy tips"`;
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate API delay
    setTimeout(() => {
      const response = generateBotResponse(input);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: response,
        timestamp: new Date(),
        suggestions: input.toLowerCase().includes('device') ? [
          'Show all devices',
          'Turn off bedroom lights',
          'Set AC temperature'
        ] : input.toLowerCase().includes('usage') ? [
          'Weekly usage report',
          'Compare with last month',
          'Export usage data'
        ] : [
          'Energy saving tips',
          'Device automation',
          'Billing details'
        ]
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleQuickMessage = (message: string) => {
    setInput(message);
    setTimeout(() => handleSendMessage(), 100);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleQuickMessage(suggestion);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleContactSupport = () => {
    toast({
      title: "Connecting to Support",
      description: "Redirecting to human support agent...",
    });
    setChatMode('support');
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-primary" />
          AQUAWATT Smart Assistant
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0 h-full">
        {/* Quick Actions */}
        <div className="px-3 md:px-4 pb-3 md:pb-4 border-b">
          <div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={action.action}
                className="flex items-center gap-1 text-xs h-8 px-2 md:px-3"
              >
                <action.icon className="h-3 w-3" />
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 space-y-3 min-h-0">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] md:max-w-[80%] ${message.sender === 'user' ? 'order-2' : 'order-1'}`}>
                <div
                  className={`rounded-lg px-3 py-2 md:px-4 md:py-3 ${
                    message.sender === 'user'
                      ? 'bg-primary text-primary-foreground ml-2 md:ml-4'
                      : 'bg-muted mr-2 md:mr-4'
                  }`}
                >
                  <div className="flex items-start gap-1 md:gap-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 text-primary flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <div className="whitespace-pre-line text-xs md:text-sm leading-relaxed">{message.content}</div>
                      <div className="flex items-center gap-1 mt-1 md:mt-2 text-xs opacity-70">
                        <Clock className="h-3 w-3" />
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Suggestions */}
                {message.suggestions && (
                  <div className="mt-2 flex flex-wrap gap-1 max-w-full">
                    {message.suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-xs h-auto py-1 px-2 text-muted-foreground hover:text-foreground break-words whitespace-normal text-left"
                      >
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {/* Typing Indicator */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-3 py-2 md:px-4 md:py-3 mr-2 md:mr-4">
                <div className="flex items-center gap-1 md:gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-3 md:p-4 border-t bg-background">
          <div className="flex gap-2 items-end">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask me about your usage, devices, or energy tips..."
              className="flex-1 text-sm"
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage} 
              disabled={!input.trim()}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-2 text-center leading-tight">
            💡 Try: "Show my water usage" • "Control bedroom lights" • "Energy saving tips"
          </div>
        </div>
      </CardContent>
    </Card>
  );
}