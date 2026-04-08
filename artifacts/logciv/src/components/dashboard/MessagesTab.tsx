import { useState } from "react";
import { useStore } from "@/lib/store";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, User } from "lucide-react";

export default function MessagesTab() {
  const { currentUser } = useAuth();
  const { threads, messages, properties, sendMessage } = useStore();
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");

  const myThreads = threads
    .filter((t) => t.participants.includes(currentUser?.id ?? ""))
    .sort((a, b) => new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime());

  const currentThread = myThreads.find((t) => t.id === selectedThread) ?? myThreads[0];
  const threadMessages = messages.filter((m) => m.threadId === (selectedThread ?? currentThread?.id));

  const getOtherParticipant = (thread: typeof threads[0]) =>
    thread.participants.find((p) => p !== currentUser?.id) ?? "";
  const getParticipantName = (thread: typeof threads[0]) => {
    const otherId = getOtherParticipant(thread);
    return thread.participantNames?.[otherId] ?? otherId;
  };
  const getProperty = (id?: string) => properties.find((p) => p.id === id);

  const handleSend = () => {
    const threadId = selectedThread ?? currentThread?.id;
    if (!newMessage.trim() || !threadId || !currentUser) return;
    sendMessage(threadId, currentUser.id, newMessage.trim());
    setNewMessage("");
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-foreground">Messages</h2>
        <p className="text-sm text-muted-foreground mt-0.5">{myThreads.length} conversation{myThreads.length !== 1 ? "s" : ""}</p>
      </div>

      {myThreads.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-12 text-center">
          <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="font-semibold text-foreground mb-1">Aucun message</h3>
          <p className="text-sm text-muted-foreground">Vos conversations apparaîtront ici.</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden flex h-[500px]">
          {/* Thread list */}
          <div className="w-64 border-r border-border flex flex-col shrink-0">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {myThreads.map((t) => {
                const isActive = (selectedThread ?? currentThread?.id) === t.id;
                const prop = getProperty(t.propertyId);
                return (
                  <button key={t.id} type="button"
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors border-b border-border/50 ${isActive ? "bg-primary/5" : ""}`}
                    onClick={() => setSelectedThread(t.id)}>
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                        {getParticipantName(t)}
                      </p>
                      {prop && <p className="text-xs text-muted-foreground truncate">{prop.titre}</p>}
                      {t.lastMessage && <p className="text-xs text-muted-foreground truncate mt-0.5">{t.lastMessage}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat */}
          {currentThread ? (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-5 py-3 border-b border-border flex items-center gap-3 bg-muted/20">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{getParticipantName(currentThread)}</p>
                  {currentThread.propertyId && (
                    <p className="text-xs text-muted-foreground">{getProperty(currentThread.propertyId)?.titre}</p>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {threadMessages.map((msg) => {
                  const isMe = msg.senderId === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-primary text-white rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
                        <p>{msg.content}</p>
                        <p className={`text-xs mt-1 ${isMe ? "text-white/70" : "text-muted-foreground"}`}>
                          {new Date(msg.timestamp).toLocaleTimeString("fr-CI", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-5 py-3 border-t border-border flex gap-3">
                <Input value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrire un message..." className="flex-1"
                  onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  data-testid="input-message" />
                <Button className="bg-primary text-white px-4 gap-2 shrink-0" onClick={handleSend} data-testid="button-send-message">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">Sélectionnez une conversation</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
