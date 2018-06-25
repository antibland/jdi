import React, { Component } from 'react';
import { auth } from './Auth';
import Modal from './shared/components/Modal';
import Step1 from './Create/Step1';
import Step2 from './Create/Step2';
import Step3 from './Create/Step3';
import './css/Create.css';
import './css/Form.css';

const PreviousButton = props => (
  <div className="previousButtonWrap">
    <button
      type="submit"
      onClick={props.onClick}
      className="button alt-color">Back
    </button>
  </div>
)
class Wizard extends Component {
  constructor() {
    super();
    this.state = {
      currentStep: 1,
      isModalOpen: false,
      fight: {}
    };

    this._prev = this._prev.bind(this);
    this._next = this._next.bind(this);
    this._gatherData = this._gatherData.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  _submitForm() {
    const { type, title, beef, opponent } = this.state.fight;

    // '/api/:userId/fight' => fightApi.newFight
    fetch(`/api/${auth.user.userid}/fight`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type,
        title,
        beef,
        opponent
      })
    }).then(res => res.json())
      .then(data => {
        if (data.type === 'success') {
          this.setState({ isModalOpen: true })
        }
      });
  }

  _next(e, data, completed=false) {
    e.preventDefault();
    let currentStep = this.state.currentStep;

    if (currentStep >= 2) {
      currentStep = 3;
    } else {
      currentStep += 1;
    }

    this.setState({
      currentStep: currentStep
    });

    setTimeout(() => {
      this._gatherData(data, completed);
    }, 300)
  }

  _prev(e) {
    e.preventDefault();
    let currentStep = this.state.currentStep;
    if (currentStep <= 1) {
      currentStep = 1;
    } else {
      currentStep -= 1;
    }

    this.setState({
      currentStep: currentStep
    });
  }

  _gatherData(data, completed) {
    Object.keys(data).forEach(key => {
      let newState = Object.assign({}, this.state);
      newState.fight[key] = data[key];
      this.setState(newState);
    });

    if (completed === true) {
      this._submitForm();
    }
  }

  closeModal() {
    this.setState({ isModalOpen: false })
    this.props.history.push('/');
  }

  openModal() {
    this.setState({ isModalOpen: true })
  }

  render() {
    let { currentStep, isModalOpen, fight } = this.state;
    let activeStep = `activeStep-${currentStep} stepsContainer`;
    let formAction = `/api/${auth.user.userid}/fight`;
    return (
      <React.Fragment>
        <form action={formAction} method="post" className="stepsForm">
          <div className={activeStep}>
            <Step1 currentStep={currentStep} afterValid={this._next} />
            <Step2 currentStep={currentStep} afterValid={this._next} />
            <Step3 currentStep={currentStep} afterValid={this._next} fightData={fight} />
          </div>
          { currentStep > 1
            ? <PreviousButton onClick={this._prev} />
            : ''
          }
        </form>
        <Modal isOpen={isModalOpen} closeModal={this.closeModal}>
          <p>The fight was created. Everything worked. Now it's up to them. May your hatchet be
            swiftly buried.</p>
        </Modal>
      </React.Fragment>
    );
  }
}

export default Wizard;
