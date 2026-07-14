import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageSquare, Send, User } from "lucide-react";

function unwrapList(data: any) {
  if (Array.isArray(data)) return data;
  return data?.results ?? [];
}

interface MessagesTabProps {
  initialConversationId?: string;
}

export default function MessagesTab({ initialConversationId }: MessagesTabProps = {}) {
  const { currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [selectedThread, setSelectedThread] = useState<string | null>(initialConversationId ?? null);
  const [newMessage, setNewMessage] = useState("");
  const currentUsername = (currentUser as any)?.username;

  const conversationsQuery = useQuery({
    queryKey: ["dashboard", "messages", "conversations"],
    queryFn: () => api.chat.conversations(),
    enabled: !!currentUser,
    staleTime: 30_000,
  });

  const currentThreadId = selectedThread;
  const messagesQuery = useQuery({
    queryKey: ["dashboard", "messages", "conversation", currentThreadId],
    queryFn: () => api.chat.conversation(currentThreadId as string),
    enabled: !!currentUser && !!currentThreadId,
    staleTime: 10_000,
  });

  const sendMutation = useMutation({
    mutationFn: (payload: any) => api.chat.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "messages"] });
      setNewMessage("");
    },
  });

  const myThreads = useMemo(() => {
    const apiThreads = unwrapList(conversationsQuery.data);
    return apiThreads.sort((a: any, b: any) =>
      new Date(b.lastMessageAt ?? b.last_message_at ?? 0).getTime() -
      new Date(a.lastMessageAt ?? a.last_message_at ?? 0).getTime()
    );
  }, [conversationsQuery.data]);

  const currentThread = myThreads.find((t: any) => String(t.id) === String(selectedThread)) ?? myThreads[0];
  const threadMessages = useMemo(() => {
    const apiMessages = unwrapList(messagesQuery.data);
    return apiMessages;
  }, [messagesQuery.data]);

  useEffect(() => {
    if (!selectedThread && myThreads[0]?.id) {
      setSelectedThread(String(myThreads[0].id));
    }
  }, [myThreads, selectedThread]);

  // Depuis une notification "nouveau message", on force l'ouverture de la
  // conversation visee meme si l'onglet Messages etait deja affiche.
  useEffect(() => {
    if (initialConversationId) {
      setSelectedThread(initialConversationId);
    }
  }, [initialConversationId]);

  const getOtherParticipant = (thread: any) =>
    thread.participants?.find((p: string) => p !== currentUsername && p !== currentUser?.id) ?? "";
  const getParticipantName = (thread: any) => {
    const otherId = getOtherParticipant(thread);
    return thread.participantNames?.[otherId] ?? thread.other_name ?? thread.title ?? otherId;
  };
  const handleSend = () => {
    const threadId = selectedThread ?? currentThread?.id;
    const receiverId = currentThread?.receiverId ?? currentThread?.receiver_id;
    if (!newMessage.trim() || !threadId || !currentUser || !receiverId) return;

    sendMutation.mutate({
      conversation_id: String(threadId),
      content: newMessage.trim(),
      receiver: receiverId,
    });
  };
  const canSend = !!(currentThread?.receiverId ?? currentThread?.receiver_id);

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
          <div className="w-64 border-r border-border flex flex-col shrink-0">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-sm font-semibold text-foreground">Conversations</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {myThreads.map((t: any) => {
                const isActive = String((selectedThread ?? currentThread?.id) ?? "") === String(t.id);
                const prop = t.property ?? t.bien ?? null;
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-muted/40 transition-colors border-b border-border/50 ${isActive ? "bg-primary/5" : ""}`}
                    onClick={() => setSelectedThread(String(t.id))}
                  >
                    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                      <User className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-foreground"}`}>
                        {getParticipantName(t)}
                      </p>
                      {prop && <p className="text-xs text-muted-foreground truncate">{prop.titre}</p>}
                      {(t.lastMessage ?? t.last_message) && <p className="text-xs text-muted-foreground truncate mt-0.5">{t.lastMessage ?? t.last_message}</p>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {currentThread ? (
            <div className="flex-1 flex flex-col min-w-0">
              <div className="px-5 py-3 border-b border-border flex items-center gap-3 bg-muted/20">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{getParticipantName(currentThread)}</p>
                  {(currentThread.property || currentThread.bien) && (
                    <p className="text-xs text-muted-foreground">{(currentThread.property ?? currentThread.bien)?.titre}</p>
                  )}
                </div>
              </div>
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {threadMessages.map((msg: any) => {
                  const isMe = msg.senderId === currentUser?.id || msg.sender_id === currentUser?.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${isMe ? "bg-primary text-white rounded-br-sm" : "bg-muted text-foreground rounded-bl-sm"}`}>
                        <p>{msg.content ?? msg.message}</p>
                        <p className={`text-xs mt-1 ${isMe ? "text-white/70" : "text-muted-foreground"}`}>
                          {new Date(msg.timestamp ?? msg.created_at ?? Date.now()).toLocaleTimeString("fr-CI", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-5 py-3 border-t border-border flex gap-3">
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1"
                  disabled={!canSend}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  data-testid="input-message"
                />
                <Button className="bg-primary text-white px-4 gap-2 shrink-0" onClick={handleSend} data-testid="button-send-message" disabled={!canSend}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              {!canSend && (
                <p className="px-5 pb-3 text-xs text-muted-foreground">
                  L'envoi du message depend encore de l'identifiant du destinataire cote backend.
                </p>
              )}
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
