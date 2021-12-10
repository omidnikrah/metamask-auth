import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { bufferToHex } from 'ethereumjs-util';
import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import UserModel from '../models/User';
import config from '../config';
import generateSignMessage from "../utils/generateSignMessage";

interface AuthRequest extends Request {
  body: {
    signature: string;
    publicAddress: string;
  }
}

class UserController {
  private user = UserModel;

  public auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { signature, publicAddress } = req.body;

    if (!signature || !publicAddress) {
      return res.status(400).json({
        message: 'signature and publicAddress needed!'
      });
    }

    const user = await this.user.findOne({ publicAddress });

    if (user) {
      const signMessage = generateSignMessage(publicAddress, user.nonce as number);
      const signMsgBufferHex = bufferToHex(Buffer.from(signMessage, "utf8"));
      const recoveredAddress = recoverPersonalSignature({
        data: signMsgBufferHex,
        signature
      });

      if (recoveredAddress === publicAddress) {
        user.nonce = Math.floor(100000 + Math.random() * 999999);
        await user.save();
        jwt.sign({
            id: user.id,
            publicAddress
          },
          config.JWT_KEY, {
            expiresIn: '100d'
          },
          (err, token) => {
            if (err) throw err;
            return res.status(200).json({
              data: {
                token
              }
            })
          }
        )
      } else {
        return res.status(400).json({
          message: 'Oops! Signature verification failed'
        });
      }
    }
  };

  public getSignMessage = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { publicAddress } = req.body;

    const user = await this.user.findOne({ publicAddress });
    let nonce;

    if (user) {
      nonce = user.nonce;
    } else {
      const newUser = new this.user({
        publicAddress,
      });
      await newUser.save();
      nonce = newUser.nonce;
    }

    const signMessage = generateSignMessage(publicAddress, nonce as number);

    return res.status(200).json({
      data: {
        signMessage
      }
    })
  }
}

export default UserController;
