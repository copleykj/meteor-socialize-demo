import { Meteor } from 'meteor/meteor';
import { DDP } from 'meteor/ddp';
import idleTimer from 'idle-timer';
import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';
import Routes from '../imports/config/routes.jsx';

idleTimer({
    callback: () => Meteor.user().setStatusIdle(),
    activeCallback: () => Meteor.user().setStatusOnline(),
});

window.firstLoad = true;
const handle = Meteor.setInterval(() => {
    const allReady = DDP._allSubscriptionsReady();
    window.firstLoad = !allReady;
    if (allReady) {
        Meteor.clearInterval(handle);
    }
}, 250);

ReactRouterSSR.Run(Routes);
