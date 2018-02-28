import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { User } from 'meteor/socialize:user-model';


publishComposite('onlineFriends', {
    find() {
        return User.createEmpty(this.userId).friends();
    },
    children: [
        {
            find(friend) {
                return Meteor.users.find({ _id: friend.friendId, status: { $exists: true } }, { fields: User.fieldsToPublish });
            },
        },
    ],
});
