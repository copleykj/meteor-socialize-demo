import { Meteor } from 'meteor/meteor';
import idleTimer from 'idle-timer';

idleTimer({
    callback: () => Meteor.user().setStatusIdle(),
    activeCallback: () => Meteor.user().setStatusOnline(),
});
