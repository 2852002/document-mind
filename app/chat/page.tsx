import Navbar from '@/components/Navbar';
import ChatWindow from '@/components/ChatWindow';

export default function ChatPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0F' }}>
      <Navbar />
      <ChatWindow />
    </div>
  );
}