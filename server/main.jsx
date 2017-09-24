import { Meteor } from 'meteor/meteor';

import { RequestsCollection } from 'meteor/socialize:requestable';
import { FriendsCollection } from 'meteor/socialize:friendships';
import { BlocksCollection } from 'meteor/socialize:user-blocking';
import { PostsCollection } from 'meteor/socialize:postable';
import { LikesCollection } from 'meteor/socialize:likeable';
import { CommentsCollection } from 'meteor/socialize:commentable';
import { ProfilesCollection } from 'meteor/socialize:user-profile';
import {
    MessagesCollection,
    ConversationsCollection,
    ParticipantsCollection,
} from 'meteor/socialize:messaging';


Meteor.publish(null, function nullPublish() {
    return [
        Meteor.users.find(),
        RequestsCollection.find(),
        FriendsCollection.find(),
        BlocksCollection.find(),
        MessagesCollection.find(),
        ConversationsCollection.find(),
        ParticipantsCollection.find(),
        PostsCollection.find(),
        LikesCollection.find(),
        CommentsCollection.find(),
        ProfilesCollection.find(),
    ];
}, { is_auto: true });
