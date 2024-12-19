import React, { useEffect, useState, useContext } from "react";
import TopBar from "../components/Topbar";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, Form, Button, Modal, Alert } from "react-bootstrap";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const PaymentPage = () => {
  const { authToken, user } = useContext(AuthContext);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();
  const query = useQuery();
  const recipientId = query.get("recipient");

  const [recipient, setRecipient] = useState(null);
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState("");

  useEffect(() => {
    if (!recipientId) {
      setMessage("No recipient specified.");
      return;
    }

    axios
      .get(`${API_URL}/api/users/check/${recipientId}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      })
      .then((res) => {
        if (res.data.exists) {
          setRecipient(res.data.user);
        } else {
          setMessage("Recipient not found.");
        }
      })
      .catch((err) => {
        console.error("Error fetching recipient:", err);
        setMessage("Error fetching recipient");
      });
  }, [recipientId, API_URL, authToken]);

  const handleSendClick = () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      setMessage("Enter a valid amount.");
      return;
    }
    setShowPinModal(true);
  };

  const handlePinConfirm = async () => {
    setPinError("");
    if (!enteredPin) {
      setPinError("Please enter your PIN.");
      return;
    }

    try {
      // Verify PIN
      await axios.post(`${API_URL}/api/auth/verify-pin`, { pin: enteredPin }, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      // If PIN is correct, proceed 
      await handleTransfer();

    } catch (error) {
      console.error("Error verifying PIN:", error);
      setPinError(error.response?.data?.message || "Invalid PIN.");
    }
  };

  const handleTransfer = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/funds/transfer`,
        {
          recipientSwalletId: recipientId,
          amount: amount,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setMessage(res.data.message);
      setTimeout(() => {
        navigate("/transactions");
      }, 2000);
    } catch (err) {
      console.error("Error sending money:", err);
      setMessage(err.response?.data?.message || "Error sending money.");
    } finally {
      setShowPinModal(false);
      setEnteredPin("");
    }
  };

  return (
    <>
      <div className="main-content">
        <TopBar />
        {message && (
          <div
            style={{ color: "red", marginBottom: "10px", textAlign: "center" }}
          >
            {message}
          </div>
        )}
        <Card
          style={{
            maxWidth: "500px",
            height: "400px",
            margin: "0 auto",
            marginTop: "80px",
            padding: "20px",
            borderRadius: "15px",
          }}
        >
          <Card.Body>
            <div
              style={{
                color: "#600FA0",
                fontSize: "24px",
                fontWeight: "700",
                textAlign: "center",
              }}
            >
              Pay
            </div>
            {recipient && (
              <>
                <div
                  style={{
                    color: "black",
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  Paying {recipient.name}
                </div>
                <div
                  style={{
                    color: "black",
                    fontSize: "14px",
                    fontWeight: "400",
                    marginTop: "20px",
                    textAlign: "center",
                  }}
                >
                  Choose amount to transfer.
                </div>
                <Form.Group className="mt-3">
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      color: "#600FA0",
                      fontSize: "32px",
                      backgroundColor: "#FFF1FF",
                      fontWeight: "700",
                      textAlign: "center",
                      height: "90px",
                    }}
                  />
                </Form.Group>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: "20px",
                    fontSize: "14px",
                  }}
                >
                  Paying from {user?.name}'s Swallet.
                </div>
                <Button
                  variant="primary"
                  className="w-100 mt-3"
                  onClick={handleSendClick}
                >
                  Send
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      </div>

      <Modal show={showPinModal} onHide={() => setShowPinModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter SWallet PIN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pinError && <Alert variant="danger">{pinError}</Alert>}
          <Form.Group>
           
            <Form.Control
              type="password"
              value={enteredPin}
              onChange={(e) => setEnteredPin(e.target.value)}
              placeholder="SWallet PIN"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPinModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePinConfirm}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PaymentPage;
