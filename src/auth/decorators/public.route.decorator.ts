import { SetMetadata } from '@nestjs/common';

// Class context decorator
const PUBLIC_ROUTE = 'isPublicRoute';
export const PublicRoute = () => SetMetadata(PUBLIC_ROUTE, true);
