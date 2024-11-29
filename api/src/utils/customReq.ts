import { Request } from 'express';

interface CustomRequest extends Request {
  file?: {
    buffer: Buffer;
    originalname: string;
  };
  files?: {
    [key: string]: { buffer: Buffer; originalname: string }[];
  };
}

export default CustomRequest;
