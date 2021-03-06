import React, { Component } from "react";
import Categories from "../Categories";
import shared from "./shared/styles";

const StepButtons = shared.stepButtons();
const SubmitButton = shared.submitButton();

class Step2 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isValid: false,
      type: ""
    };
    this.handleButtonClick = this.handleButtonClick.bind(this);
  }

  handleButtonClick(type) {
    this.setState({
      isValid: true,
      type
    });
  }

  render() {
    const { isValid, type } = this.state;

    return (
      <div className="stepContainer">
        <div className="inner">
          <h2>Pick a Category</h2>
          <Categories view="stepsPage" onClick={this.handleButtonClick} />
          <StepButtons>
            {this.props.children}
            <SubmitButton
              type="submit"
              onClick={event => this.props.afterValid(event, { type: type })}
              disabled={!isValid}
              className="button primary"
            >
              Continue
            </SubmitButton>
          </StepButtons>
        </div>
      </div>
    );
  }
}

export default Step2;
