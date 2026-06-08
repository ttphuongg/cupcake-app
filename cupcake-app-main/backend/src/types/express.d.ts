declare global {
  namespace Express {
    interface JwtPayload {
      id: number;
      email: string;
      role: string;
    }
    
    interface Request {
      user?: JwtPayload;
    }
  }
}

// Bắt buộc phải có export {} để TypeScript hiểu đây là module augmentation
export {};
