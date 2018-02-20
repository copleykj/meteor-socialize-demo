import { Meteor } from 'meteor/meteor';
import { Cloudinary } from 'meteor/socialize:cloudinary';

const { cloudinary: clSettings } = Meteor.settings;
const { cloudinary: clSettingsPublic } = Meteor.settings.public;

const { cloud_name, api_key } = clSettingsPublic;
const { api_secret } = clSettings;

Cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
});

Cloudinary.rules.sign_upload = function signUpload() {
    if (!this.userId) throw new Meteor.Error('Not Authorized', 'You must be logged in to upload');
};
