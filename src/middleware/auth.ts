import {Request, Response, NextFunction} from 'express';
import * as jwt from 'jsonwebtoken';
import * as fs from 'fs';
import * as path from 'path';

import User from '../models/user';

const publicKey = fs.readFileSync(path.resolve(__dirname, './public.pem')); // Public Key path

const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.split(' ')[1]
    ) {
      throw jwt.JsonWebTokenError;
    }

    const token = req.headers.authorization.split(' ')[1];

    const decoded: any = await jwt.verify(token, publicKey, {
      algorithms: ['RS256'],
    });

    //! Create a user by this email does not exist.
    const user = await User.findOne({email: decoded.user.email});

    if (user) {
      req.payload.id = user.id;
      return next();
    }

    // all went well, proceed;
    // req.payload = decoded.user;

    const name = decoded.user.firstname + ' ' + decoded.user.lastname;

    //! Create a user.
    const newUser = await new User({name: name, email: decoded.user.email});

    req.payload.id = newUser.id;

    return next();
  } catch (error) {
    return res.status(401).json({
      msg: 'Not Authorized as not logged in...',
    });
  }
};

export default auth;

// const newUser = await new User({name, email, password: hashedPassword});
// await newUser.save();

// "user":{
//   "id": <uid>,
//   "firstname": <First Name>
//   "lastname": <Last Name>
//   "email": <Registered Email>
//   "roles": [<list of role strings> ]
// "is_verified" : A boolean specifying whether the user is verified
// }
