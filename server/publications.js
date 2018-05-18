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

Meteor.publish('newUsers', function publishNewUsers() {
    return Meteor.users.find({ _id: { $ne: this.userId } }, { limit: 18, sort: { createdAt: -1 }, fields: { ...User.fieldsToPublish, createdAt: 1 } });
});

publishComposite(null, {
    find() {
        return ParticipantsCollection.find({ userId: this.userId, deleted: { $exists: false } }, { fields: { conversationId: 1 }, limit: 1, sort: { updatedAt: -1 } });
    },
    collectionName: 'latestConversation',
});

Meteor.publish(null, function appData() {
    return Meteor.users.find({ _id: this.userId }, { fields: { ...User.fieldsToPublish, friendCount: 1 } });
}, { is_auto: true });

Meteor.publish('unreadConversations', function unread() {
    return ParticipantsCollection.find({ userId: this.userId, deleted: { $exists: false }, read: false });
});
