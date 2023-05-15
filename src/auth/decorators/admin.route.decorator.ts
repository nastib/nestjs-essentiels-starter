import { SetMetadata } from '@nestjs/common';

// Class context decorator
const ADMIN_ROUTE = 'isAdminRoute';
export const AdminRoute = () => SetMetadata(ADMIN_ROUTE, true);
