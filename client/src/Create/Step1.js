import React, { Component } from "react";
import { auth } from "../Auth.js";
import utilities from "../shared/utilities";
import Symbol from "../shared/components/Symbol";
import LookupResult from "./LookupResult";
import SlotsThem from "./SlotsThem";
import SlotsYou from "./SlotsYou";
import VersusImg from "../shared/components/VersusImg";
import shared from "./shared/styles";

const SubmitButton = shared.submitButton();
const StepButtons = shared.stepButtons();

class Step1 extends Component {
  static timeout = null;
  static timeoutInterval = 1200;

  constructor(props) {
    super(props);
    this.state = {
      opponent: "",
      someone: "",
      isValid: false,
      opponentAvatarUrl: "",
      opponentIsValidUser: null
    };
    this.handleChange = this.handleChange.bind(this);
    this.checkForUser = this.checkForUser.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  handleChange(e) {
    this.setState({ opponent: e.target.value });
  }

  handleInput(e) {
    this.setState({
      opponentIsValidUser: null,
      someone: e.target.value,
      opponentAvatarUrl: "",
      isValid: false
    });
    clearTimeout(Step1.timeout);
  }

  handleKeyUp() {
    clearTimeout(Step1.timeout);
    Step1.timeout = setTimeout(this.checkForUser, Step1.timeoutInterval);
  }

  checkForUser() {
    const { someone } = this.state;

    // user can be an email or username — figure this out server-side
    if (someone.length && someone !== auth.user.username) {
      fetch(`/api/${someone}/isUser`)
        .then(res => res.json())
        .then(data => {
          data.isUser // fetch avatar from returned username
            ? fetch(`/api/${data.username}/avatar/username`)
                .then(res => res.json())
                .then(data => {
                  this.setState({
                    opponentAvatarUrl: data.avatar,
                    opponentIsValidUser: true,
                    isValid: true
                  });
                })
            : this.setState({
                opponentAvatarUrl: "",
                opponentIsValidUser: false,
                isValid: utilities.validateEmail(someone)
              });
        })
        .catch(err => {
          console.log("Request failed", err);
        });
    }
  }

  render() {
    const you = auth.user.username;

    const {
      someone,
      opponentIsValidUser,
      opponentAvatarUrl,
      isValid
    } = this.state;

    const notUserIsEmail =
      opponentIsValidUser === false &&
      utilities.validateEmail(someone) === true;
    const notUserNotEmail =
      opponentIsValidUser === false &&
      utilities.validateEmail(someone) === false;
    const isUser = opponentIsValidUser === true && someone !== you;

    const opponentIsValidUserResult = notUserIsEmail ? (
      <LookupResult>
        The email address <strong>{someone}</strong> isn't connected to any of
        our users. After your fight is created, we'll email them and invite them
        to join.
      </LookupResult>
    ) : notUserNotEmail ? (
      <LookupResult>
        We could not locate <strong>{someone}</strong>. You can look people up
        by username or email address.
      </LookupResult>
    ) : isUser ? (
      <LookupResult>
        <Symbol name="checkmark-icon" />
        Current opponent: <strong>{someone}</strong>
      </LookupResult>
    ) : (
      ""
    );

    return (
      <div className="stepContainer">
        <div className="inner">
          <h2>Choose an Opponent</h2>
          <div className="slots">
            <SlotsYou you={you} avatar={auth.user.avatar} />
            <VersusImg />
            <SlotsThem them={someone} opponentAvatarUrl={opponentAvatarUrl} />
          </div>

          <input
            className="featured"
            type="text"
            aria-label="Enter username or email address"
            name="opponent"
            id="opponent"
            required
            autoFocus={true}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            onInput={this.handleInput}
            onKeyUp={this.handleKeyUp}
            placeholder="Enter username or email address"
          />

          {opponentIsValidUserResult}

          <StepButtons>
            <SubmitButton
              type="submit"
              onClick={event =>
                this.props.afterValid(event, { opponent: someone })
              }
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

export default Step1;
