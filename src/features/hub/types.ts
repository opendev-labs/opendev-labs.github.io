export interface HeartbeatAgent {
  id: string;
  name: string;
  avatarUrl?: string;
  status: 'sleeping' | 'awake' | 'thinking';
  lastHeartbeat: string;
  wakeTime: string;  
  sleepTime: string; 
  timezone: string;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}
