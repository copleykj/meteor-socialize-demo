import { Profile } from 'meteor/socialize:user-profile';
import SimpleSchema from 'simpl-schema';

Profile.attachSchema(new SimpleSchema({
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    about: {
        type: String,
    },
}));

Profile.methods({
    fullName() {
        return this.firstName && this.lastName && `${this.firstName} ${this.lastName}`;
    },
});
