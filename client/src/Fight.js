import React, { Component } from 'react';
import Loading from './Loading';
import './css/Fight.css';

function extractRootPath(str) {
  return str.substr(str.lastIndexOf('/')+1);
}

function UserAvatar({
  imgpath,
  username
}) {
  let rootPath = '/avatars/' + extractRootPath(imgpath);

  return (
    <div className="user-avatar">
      <div style={{
        backgroundSize: 'cover',
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        display: 'inline-block',
        backgroundImage: `url(${rootPath})` }}>
      </div>
      <h2>
        {username}
      </h2>
    </div>
  )
};

class Fight extends Component {
  constructor() {
    super();
    this.state = {
      fight: ''
    };
  }

  componentDidMount() {
    let fightId = this.props.match.params.fightId;
    fetch(`/api/${fightId}/fight`)
      .then(res => res.json())
      .then(data => {
        this.setState({ fight: data.fight })
      });
  }

  render() {
    return (
      <div>
      { this.state.fight
        ? <div className="featured-fights-container">
            <div className="user1">
              <UserAvatar
                imgpath={this.state.fight.antagonist.avatar.path}
                username={this.state.fight.antagonist.username}
              />
              <p className="fight-text">{this.state.fight.text.for}</p>
              <p className="total-votes">Votes: {this.state.fight.votes.for}</p>
            </div>
            <img className="versus" src="/versus.png" alt="versus graphic"/>
            <div className="user2">
            <UserAvatar
                imgpath={this.state.fight.antagonist.avatar.path}
                username='Other person'
              />
              <p className="fight-text">Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, iusto quod provident quisquam asperiores ea pariatur animi doloremque, itaque, totam quaerat illo at modi! Voluptatibus possimus repellat dolorum culpa quo.</p>
              <p className="total-votes">Votes: {this.state.fight.votes.against}</p>
            </div>
          </div>
        : <Loading />
      }
      </div>
    )
  }
}

// class FightsContainer extends Component {
//   constructor() {
//     super();
//     this.state = {
//       serverData: {}
//     };
//   }
//   componentDidMount() {
//     this.setState({
//       serverData: fakeServerData
//     });
//   }

//   render() {
//     let fights = null;

//     if (this.state.serverData.fights) {
//       fights = this.state.serverData.fights.map((fight) => {
//         return <Fight key={fight.id} data={fight} />
//       });
//     }
//     return (
//       <div>
//         {this.state.serverData.fights ?

//           <div className="featured-fights-container">
//             {fights}
//           </div> :

//           <h1>Loading…</h1>
//         }
//       </div>
//     )
//   }
// }

export default Fight;
