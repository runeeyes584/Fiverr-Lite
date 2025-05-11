import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import "./Messages.scss";

const socket = io("http://localhost:8800", { withCredentials: true });

const Messages = () => {
  const { user } = useUser(); // lấy user từ Clerk
  const senderId = user?.id || ""; // chính là sender_clerk_id

  const [orderId, setOrderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const contentRef = useRef(null);
  const [isNewMessage, setIsNewMessage] = useState(false);

  // Load tin nhắn khi có orderId
  useEffect(() => {
    if (!orderId) return;

    socket.emit("joinRoom", { orderId });

    fetch(`http://localhost:8800/api/messages/${orderId}`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setMessages(data);
        setTimeout(() => scrollToBottom(), 100);
      })
      .catch((err) => console.error("Load messages error:", err));
  }, [orderId]);

  // Nhận realtime
  useEffect(() => {
    socket.on("receiveMessage", (newMessage) => {
      setMessages((prev) => [...prev, newMessage]);
      setIsNewMessage(true);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  useEffect(() => {
    if (isNewMessage) {
      scrollToBottom();
      setIsNewMessage(false);
    }
  }, [messages, isNewMessage]);

  const scrollToBottom = () => {
    if (contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  };

  const handleSend = () => {
    if (!message.trim() || !orderId || !senderId || !receiverId) return;

    const msgData = {
      order_id: orderId,
      sender_clerk_id: senderId,
      receiver_clerk_id: receiverId,
      message_content: message,
    };

    socket.emit("sendMessage", msgData);
    setMessage("");
    setIsNewMessage(true);
  };

  return (
    <div className="messages">
      <div className="messages__top-form">
        <input
          placeholder="Order ID"
          value={orderId}
          onChange={(e) => setOrderId(e.target.value)}
        />
        <input
          placeholder="Receiver Clerk ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
      </div>

      <div className="messages__content" ref={contentRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`messages__bubble ${msg.sender_clerk_id === senderId ? "sent" : "received"}`}
          >
            {msg.message_content}
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
    </div>
  );
};

export default Messages;
