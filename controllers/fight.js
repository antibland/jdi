const Fight = require('../models/fight');
const User = require('../models/user');
const validator = require("email-validator");

exports.getFights = async (req, res) => {
  await Fight.find({}, (err, fights) => {
    if (err) throw err;
    res.status(200).json(fights);
  })
}

exports.getFight = async (req, res) => {
  let { fightId } = req.params;

  let fight = await Fight.findById(fightId)
    .populate({ path: 'antagonist', select: 'username avatar' });

  if (!fight) {
    return res.status(500).json({
      type: 'failure',
      message: 'You came here for a fight and got an error. WTF? Please try again.'
    });
  }

  return res.status(200).json({
    type: 'success',
    fight
  });
}

exports.getUserFights = async (req, res) => {
  let { userId } = req.params;
  let user = await User.findById(userId).populate('fights');

  if (user) {
    res.status(200).json({
      type: 'success',
      fights: user.fights
    });
  }
}

exports.newFight = async (req, res) => {
  let user = await User.findById(req.params.userId);
  let target = req.body.target;
  let userOptions = {
    email: user.email,
    username: user.username
  };
  let fightOptions = {
    type: req.body.type,
    title: req.body.title,
    antagonist: user,
    text: {
      for: req.body.beef
    }
  };

  const fightSomeone = async () => {
    let oppenentRef = req.body.opponent;
    let findBy = validator.validate(oppenentRef)
                  ? { email: oppenentRef }
                  : { username: oppenentRef };

    await User.findOne(findBy)
      .exec(function (err, user) {
        if (err) {
          return res.status(401).json({
            type: 'failure',
            message: 'User lookup error'
          });
        } else if (!user) {
          // Could not find the user
          console.log('User not found—email info sent.')
        } else {
          // User found
          console.log(`We've let ${user.username} know you've got an axe to grind.`);
          fightOptions.defender = user;
        }
      });
  };

  if (target === 'someone') {
    await fightSomeone();
  } else {
    fightOptions.isLive = true;
  }

  let fight = await new Fight(fightOptions);

  await fight.save(err => {
    if (err) throw err;
  });

  await user.fights.push(fight);
  await user.save(err => {
    if (err) throw err;
    res.redirect('back');
  });
}
