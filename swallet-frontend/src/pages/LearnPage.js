import React, { useState, useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';
import { Form, Button, Card } from 'react-bootstrap';
import { LanguageContext } from '../contexts/LanguageContext';
import { t } from '../i18n';
import TopBar from '../components/Topbar';

export default function LearnPage() {
  const { authToken } = useContext(AuthContext);
  const { language } = useContext(LanguageContext);

  const [messages, setMessages] = useState([]);
  const [userMessage, setUserMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    if (userMessage.trim() === '') return;

    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setLoading(true);
    setUserMessage('');

    try {
      const response = await axios.post('/api/learn/chat', { userMessage }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      const aiResponse = response.data.aiResponse || "I'm sorry, I have no response.";
      setMessages(prev => [...prev, { role: 'assistant', text: aiResponse }]);
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, { role: 'assistant', text: "Sorry, I couldn't get a response." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content">
      <TopBar />
      <h2>{ 'Learn with SWallet'}</h2>
      <Card style={{ maxWidth: '600px', marginTop:'20px' }}>
        <Card.Body>
          <h4 style={{ marginBottom:'20px' }}>{ 'Ask a Question'}</h4>
          <div style={{maxHeight:'300px', overflowY:'auto', marginBottom:'10px', border:'1px solid #ccc', borderRadius:'5px', padding:'10px'}}>
            {messages.length === 0 ? (
              <div style={{color:'#888'}}>No messages yet. Ask me anything about personal finance!</div>
            ) : (
              messages.map((msg, i) => (
                <div key={i} style={{marginBottom:'10px'}}>
                  <strong style={{color: msg.role === 'user' ? '#600FA0' : '#310083'}}>
                    {msg.role === 'user' ? (t('you', language) || 'You') : (t('assistant', language) || 'Assistant')}:
                  </strong>
                  <div>{msg.text}</div>
                </div>
              ))
            )}
          </div>

          <Form onSubmit={handleSend} style={{display:'flex', gap:'10px'}}>
            <Form.Control
              type="text"
              className="form-control"
              placeholder={'Type your question...'}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              disabled={loading}
            />
            <Button variant="primary" type="submit" disabled={loading || userMessage.trim() === ''}>
              {loading ? (t('loading', language) || 'Loading...') : (t('send', language) || 'Send')}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
