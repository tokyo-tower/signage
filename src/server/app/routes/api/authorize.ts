/**
 * 認証API
 */
import axios from 'axios';
import * as debug from 'debug';
import * as express from 'express';
import { errorProsess } from '../../functions/base';
import { AuthModel } from '../../models/auth/auth.model';
const router = express.Router();
const log = debug('application: /api/authorize');

/**
 * 認証情報取得
 * @deprecated
 */
router.post('/getCredentials', async (_req, res) => {
    log('getCredentials');
    try {
        let authModel;
        const endpoint = <string>process.env.API_ENDPOINT;
        authModel = new AuthModel();
        const options = {
            endpoint,
            auth: authModel.create()
        };
        const accessToken = await options.auth.getAccessToken();
        const expiryDate = options.auth.credentials.expiry_date;
        const clientId = options.auth.options.clientId;
        res.json({ accessToken, expiryDate, clientId, endpoint, });
    } catch (error) {
        errorProsess(res, error);
    }
});

/**
 * 認証情報取得
 */
 router.post('/getToken', async (req, res) => {
    log('getToken', req.body.member);
    try {
        const clientCredentials = {
            domain: <string>process.env.CLIENT_CREDENTIALS_DOMAIN,
            clientId: <string>process.env.CLIENT_CREDENTIALS_CLIENT_ID,
            clientSecret: <string>process.env.CLIENT_CREDENTIALS_CLIENT_SECRET,
        };
        const url = `https://${clientCredentials.domain}/oauth2/token`;
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        const response = await axios.post<{ access_token: string; token_type: string; expires_in: number }>(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${clientCredentials.clientId}:${clientCredentials.clientSecret}`, 'utf-8').toString('base64')}`,
            },
        });

        const accessToken = response.data.access_token;
        const expiryDate = ((new Date()).getTime() + (response.data.expires_in * 1000));
        res.json({ accessToken, expiryDate });
    } catch (error) {
        errorProsess(res, error);
    }
});

export const authorizeRouter = router;
