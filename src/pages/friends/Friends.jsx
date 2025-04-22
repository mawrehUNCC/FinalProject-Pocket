import React, { useState } from "react";
import SideNav from "../../components/sideNav/SideNav";
import messageIcon from "../../assets/Envelope.svg";
import friendToggleIcon from "../../assets/Layer 2.svg";
import add from "../../assets/add.svg";
import compose from "../../assets/compose.svg";
import "./Friends.css";

const initialFriends = [
  {
    id: 1,
    username: "joe_mc95",
    img: "https://images.unsplash.com/photo-1604079629977-3f2e5c2b7b3b",
    status: "online",
    isFriend: true,
  },
  {
    id: 2,
    username: "photo.fab",
    img: "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0",
    status: "offline",
    isFriend: false,
  },
  {
    id: 3,
    username: "kjay.games",
    img: "https://images.unsplash.com/photo-1527980965255-d3b416303d12",
    status: "private",
    isFriend: true,
  },
];
const initialMessages = [
  {
    id: 1,
    sender: "kjay.games",
    text: "Hey! How are you?",
    time: "2m ago",
  },
];

function Friends() {
  const [friends, setFriends] = useState(initialFriends);

  const toggleFriend = (id) => {
    setFriends((prev) =>
      prev.map((f) =>
        f.id === id ? { ...f, isFriend: !f.isFriend } : f
      )
    );
  };

  return (
    <div className="friends-container">
      <SideNav />

      <div className="friends-main">
        <div className="friends-header">
          <h2 className="friends-title">Friends</h2>
          <hr className="divider" />
        </div>

        <div className="friends-grid">
          {friends.map((friend) => (
            <div key={friend.id} className="friend-card">
              <img
                src={friend.img}
                alt={friend.username}
                className="friend-img"
              />

              <div className="friend-info">
                <span className="friend-username">{friend.username}</span>
                <span className={`friend-status ${friend.status}`}>
                  {friend.status}
                </span>
              </div>

              <div className="friend-actions">
                <img
                  src={messageIcon}
                  alt="Message"
                  className="icon clickable"
                  title="Send Message"
                />
                <img
                  src={friend.isFriend ? friendToggleIcon : add}
                  alt={friend.isFriend ? "Remove friend" : "Add friend"}
                  className="icon clickable"
                  onClick={() => toggleFriend(friend.id)}
                  title={friend.isFriend ? "Remove Friend" : "Add Friend"}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="messages-section">
          <div className="messages-header">
            <h2 className="messages-title">Messages</h2>
            <img src={compose} alt="Compose" className="compose" />
          </div>
          <hr className="divider" />
          <div className="messages-content">
              <div className="no-messages">
                <img src={messageIcon} alt="Message" className="icon" />
                <span className="no-messages">No messages yet</span>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Friends;