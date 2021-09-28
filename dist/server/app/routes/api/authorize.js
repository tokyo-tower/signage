"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRouter = void 0;
/**
 * 認証API
 */
const axios_1 = require("axios");
const debug = require("debug");
const express = require("express");
const base_1 = require("../../functions/base");
const auth_model_1 = require("../../models/auth/auth.model");
const router = express.Router();
const log = debug('application: /api/authorize');
/**
 * 認証情報取得
 * @deprecated
 */
router.post('/getCredentials', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    log('getCredentials');
    try {
        let authModel;
        const endpoint = process.env.API_ENDPOINT;
        authModel = new auth_model_1.AuthModel();
        const options = {
            endpoint,
            auth: authModel.create()
        };
        const accessToken = yield options.auth.getAccessToken();
        const expiryDate = options.auth.credentials.expiry_date;
        const clientId = options.auth.options.clientId;
        res.json({ accessToken, expiryDate, clientId, endpoint, });
    }
    catch (error) {
        base_1.errorProsess(res, error);
    }
}));
/**
 * 認証情報取得
 */
router.post('/getToken', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    log('getToken', req.body.member);
    try {
        const clientCredentials = {
            domain: process.env.CLIENT_CREDENTIALS_DOMAIN,
            clientId: process.env.CLIENT_CREDENTIALS_CLIENT_ID,
            clientSecret: process.env.CLIENT_CREDENTIALS_CLIENT_SECRET,
        };
        const url = `https://${clientCredentials.domain}/oauth2/token`;
        const params = new URLSearchParams();
        params.append('grant_type', 'client_credentials');
        const response = yield axios_1.default.post(url, params, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Basic ${Buffer.from(`${clientCredentials.clientId}:${clientCredentials.clientSecret}`, 'utf-8').toString('base64')}`,
            },
        });
        const accessToken = response.data.access_token;
        const expiryDate = ((new Date()).getTime() + (response.data.expires_in * 1000));
        res.json({ accessToken, expiryDate });
    }
    catch (error) {
        base_1.errorProsess(res, error);
    }
}));
exports.authorizeRouter = router;
