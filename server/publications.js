import { Meteor } from 'meteor/meteor';
import { publishComposite } from 'meteor/reywood:publish-composite';
import { User } from 'meteor/socialize:user-model';
import { ParticipantsCollection } from 'meteor/socialize:messaging';


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

Meteor.publish(null, function appData() {
    return [
        Meteor.users.find({ _id: this.userId }, { fields: User.fieldsToPublish }),
        ParticipantsCollection.find({ userId: this.userId, deleted: { $exists: false } }, { limit: 1, sort: { updatedAt: -1 } }),
    ];
});
