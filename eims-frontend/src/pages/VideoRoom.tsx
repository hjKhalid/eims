import { useParams, useNavigate } from 'react-router-dom';
import { JitsiMeeting } from '@jitsi/react-sdk';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function VideoRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const [loading, setLoading] = useState(true);

  if (!roomId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', gap: 16 }}>
        <h2>Invalid Room ID</h2>
        <button onClick={() => navigate('/sessions')} className="btn-primary">Go Back</button>
      </div>
    );
  }

  const handleReadyToClose = () => {
    navigate('/sessions');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', width: '100%', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 24px', background: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={() => navigate('/sessions')} className="btn-ghost" style={{ padding: 8 }}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: 'white' }}>Live Session Room</h2>
          <p style={{ fontSize: 12, margin: 0, color: 'rgba(255,255,255,0.4)' }}>Room ID: {roomId}</p>
        </div>
      </div>
      
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', borderRadius: '0 0 16px 16px', background: '#000' }}>
        {loading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#121212', zIndex: 10 }}>
            <Loader2 size={32} className="spinner" style={{ animation: 'spin 1s linear infinite' }} />
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Connecting to secure video server...</div>
          </div>
        )}
        
        <JitsiMeeting
          domain="meet.jit.si"
          roomName={roomId}
          configOverwrite={{
            startWithAudioMuted: true,
            disableModeratorIndicator: true,
            startScreenSharing: true,
            enableEmailInStats: false,
            prejoinPageEnabled: false,
          }}
          interfaceConfigOverwrite={{
            DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
            SHOW_CHROME_EXTENSION_BANNER: false,
          }}
          userInfo={{
            displayName: user?.name || 'Participant',
            email: user?.email || '',
          }}
          onApiReady={(externalApi) => {
            setLoading(false);
            externalApi.addListener('readyToClose', handleReadyToClose);
            externalApi.addListener('videoConferenceLeft', handleReadyToClose);
          }}
          getIFrameRef={(iframeRef) => {
            iframeRef.style.height = '100%';
            iframeRef.style.width = '100%';
            iframeRef.style.border = 'none';
          }}
        />
      </div>
    </div>
  );
}
