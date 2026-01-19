import { useState, useEffect, useMemo, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ApiClient } from "@/lib/api-client"
import { GradientText } from "@/components/atoms/GradientText"
import { Mail, User, MessageSquare, Phone, Lock } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { isAdminUser } from "@/lib/auth-utils"

const apiClient = new ApiClient()

export function AdminMessagesPage() {
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [error, setError] = useState("")

  const isAdmin = useMemo(() => {
    if (user?.isAdmin === true) return true
    return isAdminUser(user)
  }, [user])

  const loadMessages = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.getAllMessages()
      if (response.success) {
        // response.data should be the array of messages
        const messagesArray = Array.isArray(response.data) ? response.data : []
        // sort by newest first
        const sorted = messagesArray.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        setMessages(sorted)
      } else {
        setError(response.message || "Failed to load messages")
      }
    } catch (error) {
      setError("Failed to load messages")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate('/login')
        return
      }
      if (!isAdmin) {
        setError("Access denied. This page is only available to the site administrator.")
        setLoading(false)
        return
      }
      loadMessages()
    }
  }, [isAuthenticated, isAdmin, authLoading, navigate, loadMessages])

  const formatDate = useCallback((dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [])

  return (
    <div className="relative z-10 min-h-screen pt-20 md:pt-24 pb-20 md:pb-0">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-black mb-6">
            <GradientText>Message Inbox</GradientText>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            View all messages and inquiries from your portfolio visitors
          </p>
        </section>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">Loading messages...</p>
          </div>
        ) : error ? (
          <Card className="bg-card/50 backdrop-blur-xl border-border/50 max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <Lock className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-400 text-lg mb-2">{error}</p>
              <p className="text-muted-foreground text-sm mb-4">
                Only the site administrator can access this page.
              </p>
              <Button onClick={() => navigate('/')} variant="outline">
                Go to Home
              </Button>
            </CardContent>
          </Card>
        ) : messages.length === 0 ? (
          <Card className="bg-card/50 backdrop-blur-xl border-border/50 max-w-2xl mx-auto">
            <CardContent className="py-12 text-center">
              <Mail className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">No messages yet</p>
              <p className="text-muted-foreground/70 mt-2">Messages from your contact form will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Messages List */}
            <div className="lg:col-span-1 space-y-4">
              <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5" />
                    Messages ({messages.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="max-h-[600px] overflow-y-auto space-y-2 p-4">
                    {messages.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => setSelectedMessage(msg)}
                        className={`w-full text-left p-4 rounded-lg border transition-all ${
                          selectedMessage?.id === msg.id
                            ? "bg-primary/20 border-primary/50"
                            : "bg-background/50 border-border/50 hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sm truncate">{msg.subject}</h3>
                          {!msg.read && (
                            <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-1"></span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{msg.userName}</p>
                        <p className="text-xs text-muted-foreground/70">
                          {formatDate(msg.createdAt)}
                        </p>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Message Details */}
            <div className="lg:col-span-2">
              {selectedMessage ? (
                <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-2xl mb-2">{selectedMessage.subject}</CardTitle>
                        <CardDescription className="text-base">
                          {formatDate(selectedMessage.createdAt)}
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedMessage(null)}
                      >
                        Close
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Sender Information */}
                    <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Sender Information
                      </h3>
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm text-muted-foreground">Name</p>
                          <p className="font-medium">{selectedMessage.userName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Email</p>
                          <a
                            href={`mailto:${selectedMessage.userEmail}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {selectedMessage.userEmail}
                          </a>
                        </div>
                        {selectedMessage.userPhone && (
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <a
                              href={`tel:${selectedMessage.userPhone}`}
                              className="font-medium text-primary hover:underline"
                            >
                              {selectedMessage.userPhone}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Message Content */}
                    <div className="bg-background/50 rounded-lg p-4 border border-border/50">
                      <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        Message
                      </h3>
                      <p className="whitespace-pre-wrap text-foreground/90 leading-relaxed">
                        {selectedMessage.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <Button
                        asChild
                        variant="gradient"
                        className="flex-1"
                      >
                        <a href={`mailto:${selectedMessage.userEmail}?subject=Re: ${selectedMessage.subject}`}>
                          <Mail className="w-4 h-4 mr-2" />
                          Reply via Email
                        </a>
                      </Button>
                      {selectedMessage.userPhone && (
                        <Button
                          asChild
                          variant="outline"
                          className="flex-1"
                        >
                          <a href={`tel:${selectedMessage.userPhone}`}>
                            <Phone className="w-4 h-4 mr-2" />
                            Call
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-card/50 backdrop-blur-xl border-border/50">
                  <CardContent className="py-20 text-center">
                    <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground text-lg">Select a message to view details</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
