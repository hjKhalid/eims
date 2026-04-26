import { useState, useEffect } from 'react';
import { Send, User, MessageCircle, AlertCircle, RefreshCw, Paperclip, ChevronRight } from 'lucide-react';
import api from '../lib/api';
import { useAuthStore } from '../store/authStore';

export default function Messages() {
  const user = useAuthStore(state => state.user);
  const [inbox, setInbox] = useState<any[]>([]);
  const [activePartner, setActivePartner] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [error, setError] = useState('');
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => { fetchInbox(); }, []);

  useEffect(() => {
    if (activePartner) {
      fetchChat(activePartner.id);
      // Mark read
      api.patch('/messages/read', { partnerId: activePartner.id }).then(() => fetchInbox()).catch(() => {});
    }
  }, [activePartner]);

  const fetchInbox = async () => {
    setLoading(true); setError('');
    try {
      const res = await api.get('/messages/inbox');
      setInbox(res.data);
    } catch { setError('Failed to load inbox'); }
    finally { setLoading(false); }
  };

  const fetchChat = async (partnerId: string) => {
    setLoadingChat(true);
    try {
      const res = await api.get(`/messages?with=${partnerId}`);
      setMessages(res.data);
    } catch {}
    finally { setLoadingChat(false); }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !activePartner) return;
    setSending(true);
    try {
      const res = await api.post('/messages', { receiverId: activePartner.id, body: draft });
      setMessages(prev => [...prev, res.data]);
      setDraft('');
      fetchInbox(); // update last message
    } catch {}
    finally { setSending(false); }
  };

  return (
    <div style={{ maxWidth: 1200, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: -0.6, color: 'rgba(255,255,255,0.95)', marginBottom: 6 }}>Messages</h1>
          <p style={{ fontSize: 13.5, color: 'rgba(255,255,255,0.4)' }}>Communicate with teachers, students, and staff</p>
        </div>
        <button onClick={fetchInbox} className="btn-ghost" style={{ padding: '10px 14px' }} disabled={loading}><RefreshCw size={15} /></button>
      </div>

      {error && <div style={{ marginBottom: 18, padding: '12px 16px', background: 'rgba(255,59,48,0.1)', border: '1px solid rgba(255,59,48,0.2)', borderRadius: 12, color: '#ff8a80', fontSize: 13.5, display: 'flex', gap: 8 }}><AlertCircle size={15} />{error}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 20, flex: 1, minHeight: 0 }}>
        {/* Inbox Sidebar */}
        <div className="content-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div className="card-header"><span className="card-title">Recent Conversations</span></div>
          <div className="card-body" style={{ padding: 0, overflowY: 'auto', flex: 1 }}>
            {loading && inbox.length === 0 ? <div style={{ padding: 40, textAlign: 'center' }}><div className="spinner" style={{ margin: '0 auto' }}/></div> :
             inbox.length === 0 ? <div className="empty-state" style={{ padding: 40 }}><MessageCircle size={32} style={{ opacity: 0.2 }} /><p>No messages yet.</p></div> :
             inbox.map(thread => (
              <div key={thread.partner.id} onClick={() => setActivePartner(thread.partner)} style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.04)', background: activePartner?.id === thread.partner.id ? 'rgba(255,255,255,0.04)' : 'transparent', transition: 'background 0.2s ease' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'} onMouseLeave={e => e.currentTarget.style.background = activePartner?.id === thread.partner.id ? 'rgba(255,255,255,0.04)' : 'transparent'}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #7c6dff, #5b8ef5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white' }}>{thread.partner.name[0]?.toUpperCase()}</div>
                  {thread.unread > 0 && <div style={{ position: 'absolute', top: -2, right: -2, background: '#ff8a80', color: '#1a1a2e', fontSize: 10, fontWeight: 800, width: 18, height: 18, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #1a1a2e' }}>{thread.unread}</div>}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.9)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{thread.partner.name}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>{new Date(thread.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                  <div style={{ fontSize: 13, color: thread.unread > 0 ? '#6ee7b7' : 'rgba(255,255,255,0.5)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: thread.unread > 0 ? 600 : 400 }}>{thread.lastMessage.body}</div>
                </div>
              </div>
             ))
            }
          </div>
        </div>

        {/* Chat Area */}
        <div className="content-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activePartner ? (
            <>
              {/* Chat Header */}
              <div style={{ padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 14, background: 'rgba(255,255,255,0.02)' }}>
                <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'linear-gradient(135deg, #7c6dff, #5b8ef5)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 700, color: 'white' }}>{activePartner.name[0]?.toUpperCase()}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>{activePartner.name}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>Select to view profile</div>
                </div>
              </div>

              {/* Chat Messages */}
              <div style={{ flex: 1, padding: 24, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                {loadingChat ? <div style={{ display: 'flex', justifyContent: 'center', padding: 40 }}><div className="spinner" /></div> :
                 messages.map(m => {
                   const isMe = m.senderId === user?.id;
                   return (
                     <div key={m.id} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '75%', display: 'flex', flexDirection: 'column', alignItems: isMe ? 'flex-end' : 'flex-start' }}>
                       <div style={{ padding: '12px 16px', borderRadius: 16, borderBottomRightRadius: isMe ? 4 : 16, borderBottomLeftRadius: isMe ? 16 : 4, background: isMe ? 'linear-gradient(135deg, #7c6dff, #5b8ef5)' : 'rgba(255,255,255,0.06)', color: isMe ? 'white' : 'rgba(255,255,255,0.85)', fontSize: 14, lineHeight: 1.5, boxShadow: isMe ? '0 4px 12px rgba(124,109,255,0.2)' : 'none' }}>
                         {m.body}
                       </div>
                       <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginTop: 6, [isMe ? 'marginRight' : 'marginLeft']: 4 }}>
                         {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                     </div>
                   );
                 })
                }
              </div>

              {/* Input */}
              <div style={{ padding: 20, borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.02)' }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: 12 }}>
                  <div style={{ flex: 1, position: 'relative' }}>
                    <input type="text" value={draft} onChange={e => setDraft(e.target.value)} placeholder="Type a message..." style={{ width: '100%', padding: '14px 20px', paddingRight: 44, borderRadius: 24, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: 14 }} />
                    <button type="button" style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', padding: 4 }}><Paperclip size={18} /></button>
                  </div>
                  <button type="submit" disabled={!draft.trim() || sending} style={{ width: 46, height: 46, borderRadius: '50%', background: 'linear-gradient(135deg, #7c6dff, #5b8ef5)', border: 'none', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', opacity: (!draft.trim() || sending) ? 0.5 : 1, transition: 'all 0.2s ease', boxShadow: '0 4px 12px rgba(124,109,255,0.3)' }}>
                    {sending ? <div className="spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <Send size={18} style={{ marginLeft: 2 }} />}
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, opacity: 0.5 }}>
              <MessageCircle size={48} />
              <div style={{ fontSize: 15, fontWeight: 500 }}>Select a conversation to start messaging</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
