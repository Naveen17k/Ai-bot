import React, { useState } from 'react';
import { MdSend } from 'react-icons/md';
import { FaUser } from 'react-icons/fa';

function Chatbot() {
    const API_KEY = "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";
    const systemMessage = {
        "role": "system",
        "content": "Explain things like you're talking to a software professional with 2 years of experience."
    }

    const [messages, setMessages] = useState([
        {
            message: "Hello, I'm Mining Help Bot Feel free to ask your queries!",
            sentTime: "just now",
            sender: "Mining Bot"
        }
    ]);

    const [isTyping, setIsTyping] = useState(false);

    const handleSend = async (event) => {
        event.preventDefault();
        const message = event.target.userMessage.value;

        const newMessage = {
            message,
            sentTime: "just now",  // Placeholder for demonstration
            sender: "user"
        };

        setMessages(prevMessages => [...prevMessages, newMessage]);

        setIsTyping(true);
        await processMessageToChatGPT([...messages, newMessage]);
    };

    async function processMessageToChatGPT(chatMessages) {
        let apiMessages = chatMessages.map((messageObject) => {
            let role = (messageObject.sender === "Mining Bot") ? "assistant" : "user";
            return { role: role, content: messageObject.message }
        });

        const apiRequestBody = {
            "model": "gpt-3.5-turbo",
            "messages": [
                systemMessage,
                ...apiMessages
            ]
        };

        await fetch("https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + API_KEY,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(apiRequestBody)
            }).then((data) => {
                return data.json();
            }).then((data) => {
                setMessages([...chatMessages, {
                    message: data.choices[0].message.content,
                    sender: "Mining Bot"
                }]);
                setIsTyping(false);
            });
    }

    return (

      <div className="App h-screen bg-black text-white flex">
      {/* Sidebar */}
      <div className="w-1/4 h-full bg-black border-r border-gray-700">
          <div className="bg-gray-800 text-white text-xl font-bold p-4 border-b border-gray-700">
              Mining Help Bot
          </div>

          {/* Optionally add more sidebar content here */}
          <div className="bg-gray-800 text-white text-xl font-bold p-4 border-b mt-[610px] border-gray-700 flex items-center">
    <FaUser size={20} className="mr-2" />
    Naveen Kumar
</div>
</div>


      {/* Chat area */}
      <div className="w-3/4 h-full flex flex-col justify-between bg-black">
          {/* Message area */}
          <div className="overflow-y-auto p-4">
              {messages.map((message, i) => (
                  <div key={i} className={`mb-4 ${message.sender === 'user' ? 'text-right' : ''}`}>
                      <div className={`inline-block ${message.sender === 'user' ? 'bg-gray-500 text-white' : 'bg-gray-800 text-white  '} rounded-lg px-4 py-2`}>
                          {message.message}
                      </div>
                  </div>
              ))}
              {isTyping && <div className="text-gray-400">Mining Bot is typing...</div>}
          </div>

          {/* Input area */}
          <div className="border-t border-gray-700 p-4">
              <form onSubmit={handleSend} className="flex">
                  <input
                      className="flex-1 rounded-l-lg p-4 outline-none text-black"
                      type="text"
                      placeholder="Type message here"
                      name="userMessage"
                  />
                  <button type="submit" className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 focus:outline-none focus:bg-blue-700">
                                      <MdSend size={27} />

                  </button>
              </form>
          </div>
      </div>
  </div>
          );
      }
      


export default Chatbot;
