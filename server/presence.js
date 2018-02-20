import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { User } from 'meteor/socialize:user-model';
import { UserPresence } from 'meteor/socialize:user-presence';
import { Cloudinary } from 'meteor/socialize:cloudinary';
import SimpleSchema from 'simpl-schema';


const StatusSchema = new SimpleSchema({
    status: {
        type: String,
        optional: true,
        allowedValues: ['online', 'idle'],
    },
    avatar: {
        type: String,
        optional: true,
    },
    lastOnline: {
        type: Date,
        optional: true,
    },
});

User.addFieldsToPublish({
    status: 1,
    avatar: 1,
});


Meteor.methods({
    setAvatar(publicId) {
        check(publicId, String);
        if (this.userId) {
            const currentUser = Meteor.users.findOne({ _id: this.userId });
            const { avatar } = currentUser;
            avatar && Cloudinary.api.delete_resources([avatar]);
            currentUser.avatar = publicId;
            currentUser.save();
        }
    },
});


User.attachSchema(StatusSchema);

UserPresence.onCleanup(function onCleanup(sessionIds) {
    if (!sessionIds) {
        Meteor.users.update({}, { $unset: { status: true } }, { multi: true });
    }
});

UserPresence.onUserOnline(function onUserOnline(userId) {
    Meteor.users.update(userId, { $set: { status: 'online', lastOnline: new Date() } });
});

UserPresence.onUserIdle(function onUserIdle(userId) {
    Meteor.users.update(userId, { $set: { status: 'idle' } });
});

UserPresence.onUserOffline(function onUserOffline(userId) {
    Meteor.users.update(userId, { $unset: { status: true } });
});
