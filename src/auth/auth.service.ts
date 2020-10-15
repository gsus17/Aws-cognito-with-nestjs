import { Injectable } from '@nestjs/common';
var AmazonCognitoIdentity = require('amazon-cognito-identity-js');
let AWS = require("aws-sdk");
const config = require('../../config.json');

@Injectable()
export class AuthService {

    /** Pool config. */
    private poolConfig = {
        UserPoolId: config.cognito.userPoolId,
        ClientId: config.cognito.clientId
    }

    /** Aws Config. */
    private awsConfig = {
        accessKeyId: config.cognito.accessKeyId,
        secretAccessKey: config.cognito.secretAccessKey,
        region: config.cognito.region
    }

    /** User pool reference */
    private userPool;

    /** Cognito CLientreference */
    private cognitoClient;
    constructor() {
        AWS.config.update(this.awsConfig);
        this.userPool = new AmazonCognitoIdentity.CognitoUserPool(this.poolConfig);
        this.cognitoClient = new AWS.CognitoIdentityServiceProvider({ region: config.cognito.region });
    }

    /**
     * Create a aws cognito user.
     */
    public createUser(credentials): Promise<string> {
        const promise: Promise<string> = new Promise((resolve, reject) => {

            var poolData = {
                UserPoolId: config.cognito.userPoolId,
                Username: credentials.email,
                DesiredDeliveryMediums: ["EMAIL"],
                TemporaryPassword: credentials.temporaryPass,
                UserAttributes: [
                    {
                        Name: "email",
                        Value: credentials.email
                    },
                    {
                        Name: "email_verified",
                        Value: "true"
                    }
                ]
            };
            this.cognitoClient.adminCreateUser(poolData, (error, data) => {

                if (error) {
                    reject(JSON.stringify(error))
                } else {
                    resolve(JSON.stringify(data))
                }
            });
        });

        return promise;
    }

    /**
     * Login a user on aws cognito.
     */
    public login(credentials): Promise<void> {
        const promise: Promise<void> = new Promise((resolve, reject) => {
            const emailData = {
                Name: 'email',
                Value: credentials.name
            }
            const emailAttribute = new AmazonCognitoIdentity.CognitoUserAttribute(emailData);
            const { email, password } = credentials;
            this.userPool.signUp(email, password, [emailAttribute], null, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.user);
                }
            })

        });

        return promise;
    }
    /**
     * Update Password on aws cognito.
     */
    public changePassword(credentials): Promise<void> {
        const promise: Promise<void> = new Promise((resolve, reject) => {

            const { email, confirmPassword } = credentials;
            var params = {
                ChallengeName: 'NEW_PASSWORD_REQUIRED',
                ClientId: config.cognito.clientId,
                ChallengeResponses: {
                    USERNAME: email,
                    NEW_PASSWORD: confirmPassword
                }
            };

            this.cognitoClient.respondToAuthChallenge(params, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.user);
                }
            });
        });

        return promise;
    }
}
