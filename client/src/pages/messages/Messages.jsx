
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./Messages.scss";
import React from "react";

const socket = io("http://localhost:8800", {
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

const Messages = () => {
  const { user } = useUser();
  const senderId = user?.id || "";
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const contentRef = useRef(null);
  const [isNewMessage, setIsNewMessage] = useState(false);

  // Lấy danh sách ticket
  useEffect(() => {
    if (!senderId) return;
    const fetchTickets = async () => {
      try {
        const response = await fetch(`http://localhost:8800/api/messages/tickets?clerk_id=${senderId}`, {
          credentials: "include",
        });
        const data = await response.json();
        if (data.success) {
          setTickets(data.tickets || []);
          setError("");
        } else {
          setError(data.message || "Failed to load tickets");
        }
      } catch (err) {
        setError("Network error");
        console.error("Fetch tickets error:", err);
      }
    };
    fetchTickets();
  }, [senderId]);

  // Join room và lấy tin nhắn khi chọn ticket
  useEffect(() => {
    if (!selectedTicket) return;
    socket.emit("joinOrder", { orderId: selectedTicket.order_id });
    fetchMessages(selectedTicket.order_id);

    // Emit event to mark messages as read when the receiver views the chat
    if (selectedTicket.buyer_clerk_id !== senderId || selectedTicket.seller_clerk_id !== senderId) {
      socket.emit("viewChat", { orderId: selectedTicket.order_id, userId: senderId });
    }
  }, [selectedTicket, senderId]);

  // Nhận tin nhắn và cập nhật ticket thời gian thực
  useEffect(() => {
    socket.on("newMessage", (newMessage) => {
      // Cập nhật danh sách tickets để hiển thị tin nhắn cuối cùng trong sidebar
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.order_id === newMessage.order_id
          ? { ...ticket, last_message: newMessage, message_count: ticket.message_count + 1 }
          : ticket
      )
    );

    // Chỉ thêm tin nhắn vào state messages nếu nó thuộc về ticket đang được chọn
    if (selectedTicket && newMessage.order_id === selectedTicket.order_id) {
      setMessages((prev) => [
        ...prev,
        { ...newMessage, status: newMessage.sender_clerk_id === senderId ? "sent" : "seen" },
      ]);
      setIsNewMessage(true);
    }
    });

    socket.on("ticketUpdated", ({ order_id, ticket_status }) => {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.order_id === order_id ? { ...ticket, status: ticket_status } : ticket
        )
      );
    });

    socket.on("error", ({ message }) => {
      setError(message);
    });

    socket.on("messagesRead", ({ orderId, messageIds }) => {
      setMessages((prev) =>
        prev.map((msg) =>
          messageIds.includes(msg.id) ? { ...msg, status: "seen", is_read: true } : msg
        )
      );
    });

    return () => {
      socket.off("newMessage");
      socket.off("ticketUpdated");
      socket.off("error");
      socket.off("messagesRead");
    };
  }, [selectedTicket, senderId]);

  // Cuộn đến tin nhắn mới
  useEffect(() => {
    if (isNewMessage && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
      setIsNewMessage(false);
    }
  }, [messages, isNewMessage]);

  const fetchMessages = async (orderId) => {
    try {
      const response = await fetch(`http://localhost:8800/api/messages?order_id=${orderId}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (data.success) {
        setMessages((data.messages || []).map((msg) => ({
          ...msg,
          status: msg.is_read ? "seen" : msg.sender_clerk_id === senderId ? "sent" : "seen",
        })));
        setError("");
      } else {
        setError(data.message || "Failed to load messages");
      }
    } catch (err) {
      setError("Network error");
      console.error("Fetch messages error:", err);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || !selectedTicket) {
      setError("Please select a ticket and enter a message");
      return;
    }

    const receiverId =
      selectedTicket.buyer_clerk_id === senderId
        ? selectedTicket.seller_clerk_id
        : selectedTicket.buyer_clerk_id;

    const msgData = {
      order_id: selectedTicket.order_id,
      sender_clerk_id: senderId,
      receiver_clerk_id: receiverId,
      message_content: message,
    };

    try {
      const response = await new Promise((resolve) =>
        socket.emit("sendMessage", msgData, (res) => resolve(res))
      );
      if (response.success) {
        setMessage("");
        setError("");
        // Fetch messages again to get the updated list with proper sent_at
        fetchMessages(selectedTicket.order_id);
      } else {
        setError(response.error || "Failed to send message");
      }
    } catch (err) {
      setError("Socket error");
      console.error("Send message error:", err);
    }
  };

  const handleUpdateTicketStatus = async (status) => {
    if (!selectedTicket) return;
    try {
      const response = await fetch(`http://localhost:8800/api/messages/tickets`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          order_id: selectedTicket.order_id,
          ticket_status: status,
          clerk_id: senderId,
        }),
      });
      const data = await response.json();
      if (!data.success) {
        setError(data.message || "Failed to update ticket status");
      } else {
        setError("");
      }
    } catch (err) {
      setError("Network error");
      console.error("Update ticket status error:", err);
    }
  };

  // Function to safely format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? "" : date.toLocaleTimeString(); // Remove "Just now" fallback
  };

  return (
    <div className="messages">
      <div className="messages__container">
        <div className="messages__sidebar">
          <h2>Tickets</h2>
          {tickets.length === 0 && <p>No tickets available</p>}
          {tickets.map((ticket) => (
            <div
              key={ticket.order_id}
              className={`messages__ticket ${selectedTicket?.order_id === ticket.order_id ? "selected" : ""}`}
              onClick={() => setSelectedTicket(ticket)}
            >
              <p><strong>Order ID:</strong> {ticket.order_id}</p>
              <p><strong>Order Status:</strong> {ticket.order_status || "Unknown"}</p>
              <p><strong>Ticket Status:</strong> {ticket.status}</p>
              <p><strong>Messages:</strong> {ticket.message_count}</p>
              {ticket.last_message && (
                <p><strong>Last:</strong> {ticket.last_message.message_content.slice(0, 30)}...</p>
              )}
            </div>
          ))}
        </div>

        <div className="messages__main">
          {selectedTicket ? (
            <>
              <div className="messages__header">
                <h2>Ticket #{selectedTicket.order_id} ({selectedTicket.status})</h2>
                <div className="messages__status-buttons">
                  <button onClick={() => handleUpdateTicketStatus("open")}>Open</button>
                  <button onClick={() => handleUpdateTicketStatus("closed")}>Close</button>
                </div>
              </div>
              <div className="messages__content" ref={contentRef}>
                {messages.map((msg, index) => (
                  <div
                    key={msg.id || index}
                    className={`messages__bubble ${msg.sender_clerk_id === senderId ? "sent" : "received"}`}
                  >
                    <p>{msg.message_content}</p>
                    <div className="messages__meta">
                      <span className="messages__time">{formatDate(msg.sent_at)}</span>
                      {msg.sender_clerk_id === senderId && (
                        <span className={`messages__status ${msg.status}`}>
                          {msg.status === "sent" ? (
                            <>
                              sent <span className="checkmark">✓</span>
                            </>
                          ) : (
                            <>
                              seen <span className="checkmark">✓✓</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="messages__input-area">
                <input
                  type="text"
                  placeholder="Nhập tin nhắn..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button onClick={handleSend}>➤</button>
              </div>
            </>
          ) : (
            <p>Please select a ticket to view messages</p>
          )}
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Messages;