import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';


declare global {
    namespace Express {
        interface Request {
            user?: string | JwtPayload; // Modify based on what your decoded token contains
        }
    }
}

const secretKey = process.env.JWT_SECRETKEY || 'Y21R14S28';

export const generateToken = (phoneNumber: string, userId?: number) => {
    console.log("<<<<<<<Token_Generation_Start>>>>>>>>>>>")
    const payload = {
        userId
    }

    const token = jwt.sign(payload, secretKey, {
        expiresIn: 60 * 60 * 24 * 30 * 5,
        algorithm: 'HS512'
    });
    console.log(token, `<= token for ${userId}`);
    return token;
}


// Middleware function to verify JWT token
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("<<<<<<<Token_Verification_Start>>>>>>>>>>>")

        const authHeader = req.headers.authorization;

        // Check if Authorization header is present
        if (!authHeader) {
            return res.status(401).json({ error: 'Authorization header is missing' });
        }

        // Check if token is in Bearer format
        const tokenParts = authHeader.split(' ');
        if (tokenParts[0] !== 'Bearer' || tokenParts.length !== 2) {
            return res.status(400).json({ error: 'Malformed token' });
        }

        const token: any = tokenParts[1];

        // Verify the token using the secret key
        jwt.verify(token, secretKey, (err: any, decoded: any) => {
            if (err) {
                // Handle different types of JWT errors
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token has expired' });
                } else if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({ error: 'Invalid token' });
                } else {
                    return res.status(401).json({ error: 'Unauthorized access' });
                }
            }

            // Attach decoded token data to the request object for future middleware/controllers
            req.user = decoded as string | JwtPayload;
            next(); // Continue to the next middleware or route handler
        });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred while verifying the token' });
    }
};
