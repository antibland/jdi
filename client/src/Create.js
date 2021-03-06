import React, { Component } from "react";
import { auth } from "./Auth";
import Modal from "./shared/components/Modal";
import Step1 from "./Create/Step1";
import Step2 from "./Create/Step2";
import Step3 from "./Create/Step3";
import Step4 from "./Create/Step4";
import styled from "styled-components";
import "./css/Create.css";
import "./css/Form.css";

const PreviousButton = props => (
  <button
    type="submit"
    onClick={props.onClick}
    className="button primary alt maxWidth"
  >
    Back
  </button>
);

const StepsContainer = styled.div`
  width: 400vw;
`;
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
    this.scrollToTop = this.scrollToTop.bind(this);
  }

  scrollToTop() {
    window.scroll({ behavior: "smooth", top: 0 });
  }

  _submitForm() {
    const {
      type,
      title,
      beef,
      opponent,
      bother,
      takeAction
    } = this.state.fight;

    // '/api/:userId/fight' => fightApi.newFight
    fetch(`/api/${auth.user.userid}/fight`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        type,
        title,
        beef,
        opponent,
        bother,
        takeAction,
        username: auth.user.username
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.type === "success") {
          this.setState({ isModalOpen: true });
        }
      })
      .catch(err => {
        console.error(err);
      });
  }

  _next(e, data, completed = false) {
    e.preventDefault();

    this.setState(
      prevState => ({
        currentStep:
          prevState.currentStep >= Wizard.TOTAL_STEPS
            ? Wizard.TOTAL_STEPS
            : ++prevState.currentStep
      }),
      () => this.scrollToTop()
    );

    setTimeout(() => {
      this._gatherData(data, completed);
    }, 300);
  }

  _prev(e) {
    e.preventDefault();

    this.setState(
      prevState => ({
        currentStep: prevState.currentStep <= 1 ? 1 : --prevState.currentStep
      }),
      () => this.scrollToTop()
    );
  }

  _gatherData(data, completed) {
    if (completed === true) {
      this._submitForm();
    } else {
      Object.keys(data).forEach(key => {
        let newState = Object.assign({}, this.state);
        newState.fight[key] = data[key];
        this.setState(newState);
      });
    }
  }

  closeModal() {
    this.setState({ isModalOpen: false });
    this.props.history.push("/");
  }

  openModal() {
    this.setState({ isModalOpen: true });
  }

  render() {
    let { currentStep, isModalOpen, fight } = this.state;
    let activeStep = `activeStep-${currentStep} stepsContainer`;
    let formAction = `/api/${auth.user.userid}/fight`;
    return (
      <>
        <form action={formAction} method="post" className="stepsForm">
          <StepsContainer className={activeStep}>
            <Step1
              currentStep={currentStep}
              afterValid={this._next}
              fightData={fight}
            />
            <Step2
              currentStep={currentStep}
              afterValid={this._next}
              fightData={fight}
            >
              <PreviousButton onClick={this._prev} />
            </Step2>
            <Step3
              currentStep={currentStep}
              afterValid={this._next}
              fightData={fight}
            >
              <PreviousButton onClick={this._prev} />
            </Step3>
            <Step4
              currentStep={currentStep}
              afterValid={this._next}
              fightData={fight}
            >
              <PreviousButton onClick={this._prev} />
            </Step4>
          </StepsContainer>
        </form>
        <Modal isOpen={isModalOpen} onAction={this.closeModal}>
          <p>
            The fight was created. Everything worked. Now it's up to them. May
            your hatchet be swiftly buried.
          </p>
        </Modal>
      </>
    );
  }
}

Wizard.TOTAL_STEPS = 4;

export default Wizard;
