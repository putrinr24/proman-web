import { UserRoleEnum } from '../enums/user-role-enum';

export interface User {
  id: string;
  role_name: string;
  username: string;
  password: string;
  email: string;
  is_verified: boolean;
  name: string;
  phone_no: string;
  address: string;
  role: UserRoleEnum;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface CustomerToSelectedUser {
  customer: {
    customer_id: string;
    name: string;
  };
  user: {
    user_id: string | undefined;
  };
}
