import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Choice, Question } from "@/types/quiz";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Bot, Loader2, Send, User, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Markdown } from "./markdown";
import { Button } from "./ui/button";

interface ChatAssistantDialogProps {
  question: Question;
  selectedAnswers: Choice[];
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const ChatAssistantDialog: React.FC<ChatAssistantDialogProps> = ({
  question,
  selectedAnswers,
  open: controlledOpen,
  onOpenChange,
}) => {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasInitializedRef = useRef(false);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat-llm",
    }),
  });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send context message only once when dialog opens for the first time with no messages
  useEffect(() => {
    if (open && messages.length === 0 && !hasInitializedRef.current) {
      hasInitializedRef.current = true;

      const contextMessage = `I'm working on this question: "${question.question}". The options are: ${question.options.map((opt, i) => `${String.fromCharCode(65 + i)}) ${opt}`).join(", ")}. Can you help me understand this better?`;
      sendMessage({ text: contextMessage });
    }
  }, [open, question, sendMessage, messages.length]);

  const formatTime = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || status === "streaming") return;
    sendMessage({
      text: input,
    });
    setInput("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="fixed w-full sm:w-[450px] md:w-[500px] lg:w-[550px] rounded-none shadow-2xl border-l overflow-hidden p-0 m-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-right-full data-[state=closed]:slide-out-to-right"
        style={{
          right: 0,
          top: 0,
          bottom: 0,
          left: "auto",
          transform: "none",
        }}
      >
        <div className="flex flex-col h-screen bg-background">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-primary/5 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-5 w-5 text-primary" />
              </div>
              <div>
                <DialogTitle className="text-base font-semibold">
                  AI Assistant
                </DialogTitle>
                <DialogDescription className="text-xs">
                  Ask questions about this quiz
                </DialogDescription>
              </div>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 bg-muted/20 min-h-0">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start gap-3 animate-in slide-in-from-bottom-2 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1 ${
                    message.role === "user" ? "order-2" : ""
                  }`}
                >
                  {message.role === "assistant" ? (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  ) : (
                    <User className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <div
                  className={`flex flex-col gap-1 max-w-[85%] ${
                    message.role === "user" ? "items-end" : "items-start"
                  }`}
                >
                  <div
                    className={`rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-white dark:bg-gray-800 border shadow-sm rounded-bl-md"
                    }`}
                  >
                    {message.parts.map((part, idx) => {
                      if (part.type === "text") {
                        return message.role === "assistant" ? (
                          <div key={idx} className="text-sm leading-relaxed">
                            <Markdown>{part.text}</Markdown>
                          </div>
                        ) : (
                          <p
                            key={idx}
                            className="text-sm whitespace-pre-wrap leading-relaxed"
                          >
                            {part.text}
                          </p>
                        );
                      }
                      return null;
                    })}
                    {message.role === "assistant" &&
                      status === "streaming" &&
                      message.id === messages[messages.length - 1].id && (
                        <div className="flex items-center gap-2 mt-2">
                          <Loader2 className="h-3 w-3 animate-spin text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Thinking...
                          </span>
                        </div>
                      )}
                  </div>
                  <span
                    className={`text-xs px-1 ${
                      message.role === "user"
                        ? "text-right text-muted-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(new Date())}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading indicator when waiting for response */}
            {status === "submitted" && (
              <div className="flex items-start gap-3 animate-in slide-in-from-bottom-2">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center mt-1">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div className="flex flex-col gap-1">
                  <div className="rounded-2xl px-4 py-3 bg-white dark:bg-gray-800 border shadow-sm rounded-bl-md">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t bg-background p-4 shrink-0">
            <form onSubmit={onSubmit} className="flex gap-2 items-end">
              <div className="flex-1 relative">
                <textarea
                  name="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      if (input.trim() && status !== "streaming") {
                        sendMessage({ text: input });
                        setInput("");
                      }
                    }
                  }}
                  placeholder="Type your message..."
                  className="w-full min-h-[50px] max-h-[120px] resize-none rounded-xl border border-input bg-background px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all"
                  disabled={status === "streaming"}
                  rows={1}
                />
              </div>
              {status === "streaming" ? (
                <Button
                  type="button"
                  onClick={stop}
                  className="h-[50px] w-[50px] rounded-xl shrink-0"
                  size="icon"
                  variant="destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={!input.trim()}
                  className="h-[50px] w-[50px] rounded-xl shrink-0"
                  size="icon"
                >
                  <Send className="h-4 w-4" />
                </Button>
              )}
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatAssistantDialog;
