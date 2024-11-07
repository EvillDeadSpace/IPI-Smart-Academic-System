import { FC, useState } from "react";
import Lottie from "lottie-react";
import animation from "../assets/wired-gradient-981-consultation-hover-conversation.json";

const Chat: FC = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <>
      <div className='lottie-container' onClick={toggleChat}>
        <Lottie animationData={animation} className='lottie-icon' />
      </div>
      {isChatOpen && (
        <div className='chat-window'>
          <p>Chat je otvoren!</p>
        </div>
      )}
    </>
  );
};

export default Chat;
