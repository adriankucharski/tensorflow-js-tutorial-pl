"use client";

import ModelLLM from "@/llm";
import { useState } from "react";

class Message{
  text: string;
  type: "user" | "bot";

  constructor(text: string, type: "user" | "bot") {
    this.text = text;
    this.type = type;
  }
}

export default function Home() {
  const model_url = "/language_model.tfjs/model.json"
  const vocab_url = "/language_model.tfjs/vocab.json"
  const [modelState, _] = useState<ModelLLM>(new ModelLLM(model_url, vocab_url));
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [tokensToGenerate, setTokensToGenerate] = useState<number>(50);
  const [topK, setTopK] = useState<number>(10);


  const handleSendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage = new Message(inputText, "user");
    setMessages((prevMessages) => [...prevMessages, userMessage]);

    const response = await modelState.predict(userMessage.text, tokensToGenerate, topK);
    const botMessage = new Message(response, "bot");
    setMessages((prevMessages) => [...prevMessages, botMessage]);

    setInputText("");
  };


  return (
    <div>
      <center style={{padding: "15px"}}><h2>Model językowy w TensorFlow.js</h2></center>
      <div style={{margin: "20px"}}>
        <div style={{ border: "1px solid #ccc", padding: "10px", height: "400px", overflowY: "scroll" }}>
          {messages.map((message, index) => (
            <div key={index} style={{ textAlign: message.type === "user" ? "right" : "left" }}>
              <p style={{ background: message.type === "user" ? "#dcf8c6" : "#d5e0e7", display: "inline-block", padding: "10px", borderRadius: "10px", margin: "5px 0", maxWidth: "70%" }}>
                {message.text}
              </p>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", marginTop: "10px" }}>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            style={{ flex: 1, padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
          <button onClick={handleSendMessage} style={{ padding: "10px 20px", marginLeft: "10px", borderRadius: "5px", border: "none", background: "#007bff", color: "#fff" }}>
            Wyślij
          </button>
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Liczba tokenów do wygenerowania:</label>
          <input
            type="number"
            value={tokensToGenerate}
            onChange={(e) => setTokensToGenerate(parseInt(e.target.value))}
            style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc", marginLeft: "10px" }}
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>Top K:</label>
          <input
            type="number"
            value={topK}
            onChange={(e) => setTopK(parseInt(e.target.value))}
            style={{ padding: "5px", borderRadius: "5px", border: "1px solid #ccc", marginLeft: "10px" }}
          />
        </div>
      </div>
    </div>
  );
}
