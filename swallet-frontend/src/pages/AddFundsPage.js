import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const AddFundsPage = () => {
  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <Row>
        <Col>
          <Card className="text-center shadow">
            <Card.Body>
              <Card.Title style={{ color: '#542de8', fontSize: '2em' }}>
                Add Funds
              </Card.Title>
              <Card.Text>
                The Add Funds functionality is coming soon! Stay tuned for updates.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddFundsPage;
