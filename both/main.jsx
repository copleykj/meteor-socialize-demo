import React from 'react';
import { renderWithSSR } from 'meteor/communitypackages:react-router-ssr';
import '../imports/api/user.js';
import '../imports/api/user-profile.js';
import App from '../imports/ui/App';


renderWithSSR(<App />);
