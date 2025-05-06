// Define types for User and JWT token structure

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
    password: string;
    profilePhoto: string;
  }
  
  export interface JWTToken {
    id: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
  }
  