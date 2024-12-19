import React from 'react';
import { Card } from 'react-bootstrap';
import addIcon from '../assets/images/addIcon.svg';
import gettingStarted from '../assets/images/gettingStarted.svg';
import myAccountIcon from '../assets/images/myAccountIcon.svg';
import paymentIcon from '../assets/images/paymentIcon.svg';
import loanIcon from '../assets/images/loanIcon.svg';
import other from '../assets/images/other.svg';
import swalletIcon from '../assets/images/swalletIcon.svg';
import TopBar from '../components/Topbar';

export default function HelpCenterPage() {
  return (
    <div className="main-content">
      <TopBar/>
      <div className="help-center-title">
        We are here to help!
      </div>

      <div className="cards-row">
        <Card style={{flex:'1', minWidth:'300px'}}>
          <Card.Body>
            <div className="help-subtitle">
              Call us for tele-support<br/><br/>
              For payment issues,<br/>(210) 987-6543<br/><br/>
              For account and all other support,<br/>(210) 123-4567<br/><br/>
              Our support team is available:<br/>
              Monday - 8:00AM to 8:00PM<br/>
              Tuesday - 8:00AM to 8:00PM<br/>
              Wednesday - 8:00AM to 8:00PM<br/>
              Thursday - 8:00AM to 8:00PM<br/>
              Friday - 8:00AM to 8:00PM
            </div>
          </Card.Body>
        </Card>

        <Card style={{flex:'1', minWidth:'300px'}}>
          <Card.Body>
            <div className="help-subtitle">
              Report a technical problem<br/><br/>
              Email us at <br/>helpcenter@getswallet.io<br/><br/>
              Reach us at<br/>(210) 123 - 4567<br/><br/>
              Mail us at<br/>
              123 Main Street,<br/>
              Any Town,<br/>
              San Antonio - 78123
            </div>
          </Card.Body>
        </Card>
      </div>

      <Card style={{maxWidth:'100%', margin:'40px auto', padding:'20px', height:'350px'}}>
        <div className="help-center-section-title">
          How can we help you?
        </div>

        <div className="help-icons-row">
          <div className="help-icon-item">
            <img src={gettingStarted} style={{backgroundColor:'#FFF1FF', height:'70px',width:'70px', padding:'15px',borderRadius:'15px'}} alt="Add"/>
            <div>Getting started</div>
          </div>
          <div className="help-icon-item">
            <img src={myAccountIcon} style={{backgroundColor:'#FFF1FF', height:'70px',width:'70px', padding:'15px',borderRadius:'15px'}} alt="Add"/>
            <div>My Account</div>
          </div>
          <div className="help-icon-item">
            <img src={paymentIcon} style={{backgroundColor:'#FFF1FF', height:'70px',width:'70px', padding:'15px',borderRadius:'15px'}} alt="Add"/>
            <div>Payments</div>
          </div>
          <div className="help-icon-item">
            <img src={loanIcon} style={{backgroundColor:'#FFF1FF', height:'70px',width:'70px', padding:'15px',borderRadius:'15px'}} alt="Add"/>
            <div>Loans</div>
          </div>
          <div className="help-icon-item">
            <img src={swalletIcon} style={{backgroundColor:'#FFF1FF', height:'70px',width:'70px', padding:'15px',borderRadius:'15px'}} alt="Add"/>
            <div>Wallet</div>
          </div>
          <div className="help-icon-item">
            <img src={other} style={{backgroundColor:'#FFF1FF', height:'70px',width:'70px', padding:'15px',borderRadius:'15px'}} alt="Add"/>
            <div>Other</div>
          </div>
        </div>
      </Card>
    </div>
  );
}
