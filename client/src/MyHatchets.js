import React, { Component } from "react";
import { auth } from "./Auth";
import Loading from "./Loading";
import { Link } from "react-router-dom";
import styled, { css } from "styled-components";
import utilities from "./shared/utilities";
import CancelFight from "./CancelFight";
import SurrenderButton from "./Surrender";
import TimeRemaining from "./shared/components/TimeRemaining";

const sharedButtonStyles = css`
  padding: 1em 2.5em !important;
  font-size: 0.9rem !important;
  min-width: 200px !important;
  text-align: center;
  font-weight: bold;
`;

const Record = styled.h2`
  padding: 15px 0 0;
`;

const RecordHighlight = styled.strong`
  background: var(--dark-text);
  color: white;
  padding: 0 10px;
  animation: simpleFadeIn 0.8s forwards ease-in 0.2s;
  opacity: 0;
  visibility: hidden;
  text-shadow: 0 0 1px var(--red);
`;

const HatchetListWrapper = styled.div`
  padding-bottom: 3em;
  padding-top: 3em;
`;

const HatchetListTable = styled.table`
  &.hatchetList {
    margin-top: 2em;
    display: block;

    ${utilities.media.phone`
      max-width: 100%;
    `};

    td {
      padding: 15px 0;
    }
  }

  &.activeList tbody {
    tr {
      ${utilities.media.phone`
        flex-wrap: nowrap;
        padding-bottom: 0.5em;
        padding-top: 0.5em;
      `};
    }

    td {
      ${utilities.media.phone`
        padding: 0;
    `};
    }
  }

  tbody {
    td:first-child {
      width: 100%;
      font-size: 95%;
      padding-right: 10px;

      ${utilities.media.phone`
        padding-bottom: 0;
      `};
    }

    td:not(:first-child) {
      ${utilities.media.phone`
        flex: 1;
        width: 50%;
        text-align: center !important;
      `};

      .button {
        ${utilities.media.phone`
          min-width: auto !important;
          padding: 1em 0 !important;
          width: 100%;
          max-width: 200px;
        `};
      }
    }

    tr {
      ${utilities.media.phone`
        display: flex;
        flex-wrap: wrap;
        padding: 0.25em 1em 0.5em;
        width: 100vw;
      `};
    }
  }
`;

const HatchetListHeader = styled.th`
  text-align: left !important;
  padding: 0 0 0.5em !important;
  font-size: 100% !important;

  &.pending {
    color: var(--red) !important;
  }

  &.active {
    color: var(--teal) !important;
  }

  ${utilities.media.phone`
    padding-left: 1em !important;
  `};
`;

const Highlight = styled.span`
  color: var(--teal);
`;

const RedLink = styled(Link)`
  color: var(--red);
`;

const HatchetListButton = styled.button`
  ${sharedButtonStyles};
`;

const HatchetListLink = styled(Link)`
  ${sharedButtonStyles};

  &.top {
    ${utilities.media.phone`
      margin-top: 2em !important;
    `};
  }
`;

class MyHatchets extends Component {
  constructor() {
    super();
    this.state = {
      waitingOnYou: [],
      waitingOnThem: [],
      activeChallenger: [],
      activeDefender: [],
      loading: true,
      ties: 0,
      wins: 0,
      losses: 0
    };

    this.handleRemindThemClick = this.handleRemindThemClick.bind(this);
  }

  getUserFights() {
    // /api/:userId/fights => getUserFights
    let url = `/api/${auth.user.userid}/fights`;
    return fetch(url).then(res => res.json());
  }

  getUserRecord() {
    // /api/:userId/record => getUserRecord
    let url = `/api/${auth.user.userid}/record`;
    return fetch(url).then(res => res.json());
  }

  getFightsAndUserRecord() {
    return Promise.all([this.getUserFights(), this.getUserRecord()]);
  }

  componentDidMount() {
    this.getFightsAndUserRecord().then(([fights, user]) => {
      let { active, waitingOnYou, waitingOnThem } = fights;
      let { ties, wins, losses } = user.record;

      this.setState({
        activeChallenger: active.filter(
          fight => fight.antagonist.username === auth.user.username
        ),
        activeDefender: active.filter(
          fight => fight.antagonist.username !== auth.user.username
        ),
        waitingOnYou,
        waitingOnThem,
        loading: false,
        ties,
        wins,
        losses
      });
    });
  }

  handleRemindThemClick() {
    alert("handle remind them");
  }

  render() {
    const {
      waitingOnYou,
      waitingOnThem,
      activeChallenger,
      activeDefender,
      loading
    } = this.state;

    const PendingHeaders = () => (
      <thead>
        <tr>
          <HatchetListHeader className="pending">Pending</HatchetListHeader>
        </tr>
      </thead>
    );

    const PendingBody = () => (
      <tbody>
        {_waitingOnYou}
        {_waitingOnThem}
      </tbody>
    );

    const ActiveHeaders = props => (
      <thead>
        <tr>
          <HatchetListHeader className="active">{props.side}</HatchetListHeader>
        </tr>
      </thead>
    );

    const ChallengerBody = () => <tbody>{_activeChallenger}</tbody>;
    const DefenderBody = () => <tbody>{_activeDefender}</tbody>;

    const ShowTime = props => {
      const { activatedAt, isExpired } = props;
      return <TimeRemaining isExpired={isExpired} activatedAt={activatedAt} />;
    };

    const _activeChallenger = activeChallenger.length ? (
      activeChallenger.map(fight => {
        return (
          <tr key={fight._id}>
            <td>
              <Link to={`/fight/${fight._id}`}>{fight.title}</Link>
            </td>
            <td>
              <ShowTime
                activatedAt={fight.activatedAt}
                isExpired={fight.isExpired}
              />
            </td>
          </tr>
        );
      })
    ) : (
      <React.Fragment />
    );

    const _activeDefender = activeDefender.length ? (
      activeDefender.map(fight => {
        return (
          <tr key={fight._id}>
            <td>
              <Link to={`/fight/${fight._id}`}>{fight.title}</Link>
            </td>
            <td>
              <TimeRemaining
                isExpired={fight.isExpired}
                activatedAt={fight.activatedAt}
              />
            </td>
          </tr>
        );
      })
    ) : (
      <React.Fragment />
    );

    const HatchetListWrapperComponent = props => {
      if (props.type === "pending") {
        return waitingOnYou.length || waitingOnThem.length ? (
          props.children
        ) : (
          <React.Fragment />
        );
      } else if (props.type === "challenger") {
        return activeChallenger.length ? props.children : <React.Fragment />;
      } else if (props.type === "defender") {
        return activeDefender.length ? props.children : <React.Fragment />;
      }
    };

    const FightRecord = () => {
      const { ties, wins, losses } = this.state;
      return (
        <React.Fragment>
          <Record>
            Your record is{" "}
            <RecordHighlight>
              {wins}-{losses}-{ties}
            </RecordHighlight>
          </Record>
        </React.Fragment>
      );
    };

    const HatchetList = () => (
      <React.Fragment>
        <HatchetListWrapperComponent type="pending">
          <HatchetListTable className="fightList hatchetList">
            <PendingHeaders />
            <PendingBody />
          </HatchetListTable>
        </HatchetListWrapperComponent>

        <HatchetListWrapperComponent type="challenger">
          <HatchetListTable className="fightList hatchetList activeList">
            <ActiveHeaders side="Challenger" />
            <ChallengerBody />
          </HatchetListTable>
        </HatchetListWrapperComponent>

        <HatchetListWrapperComponent type="defender">
          <HatchetListTable className="fightList hatchetList activeList">
            <ActiveHeaders side="Defender" />
            <DefenderBody />
          </HatchetListTable>
        </HatchetListWrapperComponent>
      </React.Fragment>
    );

    const _waitingOnYou = waitingOnYou.length ? (
      waitingOnYou.map(fight => {
        return (
          <tr key={fight._id}>
            <td>
              <React.Fragment>
                <Highlight>{fight.antagonist.username}</Highlight> has an{" "}
                <RedLink to={`/defend/${fight._id}`}>Axe to Grind</RedLink> with
                you!
              </React.Fragment>
            </td>
            <td>
              <SurrenderButton
                type="button"
                fightId={fight._id}
                classes="button primary alt"
                opponent={fight.antagonist.username}
              >
                Surrender
              </SurrenderButton>
            </td>
            <td>
              <HatchetListLink
                className="button primary"
                to={`/defend/${fight._id}`}
              >
                Respond
              </HatchetListLink>
            </td>
          </tr>
        );
      })
    ) : (
      <React.Fragment />
    );

    const _waitingOnThem = waitingOnThem.length ? (
      waitingOnThem.map(fight => {
        return (
          <tr key={fight._id}>
            <td>
              <React.Fragment>
                You started a{" "}
                <RedLink to={`/fight/${fight._id}`}>Hatchet</RedLink> with{" "}
                <Highlight>{fight.defender.username}</Highlight>.
              </React.Fragment>
            </td>
            <td>
              <CancelFight fightId={fight._id} classes="button primary alt" />
            </td>
            <td>
              <HatchetListButton
                type="button"
                onClick={this.handleRemindThemClick}
                className="button primary"
              >
                Remind them
              </HatchetListButton>
            </td>
          </tr>
        );
      })
    ) : (
      <React.Fragment />
    );

    const noContent =
      waitingOnThem.length === 0 &&
      waitingOnYou.length === 0 &&
      activeChallenger.length === 0 &&
      activeDefender.length === 0;

    return (
      <HatchetListWrapper>
        {loading === true ? (
          <Loading />
        ) : (
          <React.Fragment>
            <HatchetListLink to="/create" className="button primary top">
              Start a new Hatchet
            </HatchetListLink>

            {noContent ? (
              <p>You've got no hatchets.</p>
            ) : (
              <React.Fragment>
                <FightRecord />
                <HatchetList />
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </HatchetListWrapper>
    );
  }
}

export default MyHatchets;
