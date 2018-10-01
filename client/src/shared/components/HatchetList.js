import PropTypes from "prop-types";
import React from "react";
import { Link } from "react-router-dom";
import utilities from "../../shared/utilities";
import Avatar from "../../shared/components/Avatar";
import VersusImg from "../../shared/components/VersusImg";
import TimeRemaining from "../../shared/components/TimeRemaining";

const TitleRow = props => {
  let firstWord = props.type.split(" ")[0].replace("'", "");
  let categoryImg = utilities.getCategoryImage(firstWord);

  return (
    <td>
      <Link className="button link" to={"/fight/" + props.id}>
        {categoryImg}
        <span className="title">{props.title}</span>
      </Link>
    </td>
  );
};

const ChallengerRow = props => {
  return (
    <td className="challengerRow">
      <div className="part">
        <Avatar width={60} height={60} imgpath={props.avatar} />
        <span className="username">{props.username}</span>
      </div>
      <div className="part">
        <VersusImg />
      </div>
    </td>
  );
};

const DefenderRow = props => {
  return (
    <td className="defenderRow">
      <div className="part">
        <Avatar width={60} height={60} imgpath={props.avatar} />
        <span className="username">{props.username}</span>
      </div>
    </td>
  );
};

const ShowTime = props => {
  const { activatedAt, isExpired } = props;
  return <TimeRemaining isExpired={isExpired} activatedAt={activatedAt} />;
};

const HatchetList = props =>
  props.fights.map(fight => {
    const {
      _id,
      title,
      type,
      activatedAt,
      isExpired,
      antagonist: {
        username: antagonistUsername,
        avatar: antagonistAvatar = ""
      },
      defender: { username: defenderUsername, avatar: defenderAvatar = "" }
    } = fight;

    return (
      <tr key={_id}>
        <TitleRow id={_id} title={title} type={type} />
        <ChallengerRow
          username={antagonistUsername}
          avatar={antagonistAvatar.path}
        />
        <DefenderRow username={defenderUsername} avatar={defenderAvatar.path} />
        <td>
          <ShowTime activatedAt={activatedAt} isExpired={isExpired} />
        </td>
      </tr>
    );
  });

HatchetList.defaultProps = {
  emptyMessage: "It's is lonely here. Not a hatchet in sight."
};

HatchetList.propTypes = {
  fights: PropTypes.array.isRequired
};

export default HatchetList;
