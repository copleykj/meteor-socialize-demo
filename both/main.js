import { ReactRouterSSR } from 'meteor/reactrouter:react-router-ssr';
import Routes from '../imports/config/routes.jsx';
import '../imports/api/user.js';

ReactRouterSSR.Run(Routes);
