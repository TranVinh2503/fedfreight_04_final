import { HavingSidebar } from '~/components/Layouts';

import Homepage from '~/pages/Homepage';
import Login from '~/pages/Login';
import Register from '~/pages/Register';
import ContributorList from '~/pages/ContributorList';
import Chat from '~/pages/Chat';
import UploadAvatar from '~/pages/UploadAvatar';
import Tracking from '~/pages/Tracking';
import UpdateOrder from '~/pages/UpdateOrder';
import UpdateProfile from '~/pages/UpdateProfile';
import OrderList from '~/pages/OrderList';
import OrderDetail from '~/pages/OrderDetail';

// Public Routes: Access without login
const publicRoutes = [
    { path: '/', component: Homepage, layout: HavingSidebar},
    { path: '/login', component: Login },
    { path: '/register', component: Register },
];

// Private Routes: Access within login
const privateRoutes = [
    { path: '/contributorList', component: ContributorList, layout: HavingSidebar },
    { path: '/chat', component: Chat },
    { path: '/uploadAvatar', component: UploadAvatar },
    { path: '/tracking', component: Tracking, layout: HavingSidebar },
    { path: '/updateOrder', component: UpdateOrder, layout: HavingSidebar },
    { path: '/updateProfile', component: UpdateProfile, layout: HavingSidebar },
    { path: '/orderList', component: OrderList, layout: HavingSidebar },
    { path: '/orderDetail', component: OrderDetail, layout: HavingSidebar },
];

export { publicRoutes, privateRoutes };
