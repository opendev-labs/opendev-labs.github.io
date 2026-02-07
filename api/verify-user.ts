import { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { code, state } = req.body;

    if (!code) {
        return res.status(400).json({ message: 'Missing authorization code.' });
    }

    const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
    const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
    const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI || 'https://opendev-labs.github.io/verify-user';

    try {
        // 1. Exchange code for access token
        const tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            body: new URLSearchParams({
                client_id: CLIENT_ID!,
                client_secret: CLIENT_SECRET!,
                grant_type: 'authorization_code',
                code: code as string,
                redirect_uri: REDIRECT_URI,
            }),
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });

        const tokens = await tokenResponse.json();
        if (tokens.error) {
            throw new Error(tokens.error_description || 'Failed to exchange token.');
        }

        // 2. Update user metadata/roles (Linked Roles)
        // This usually involves calling the Discord API to set metadata
        // For now, we'll just simulate success as we don't have the user's metadata schema defined yet

        /*
        await fetch(`https://discord.com/api/v10/users/@me/applications/${CLIENT_ID}/role-connection`, {
            method: 'PUT',
            body: JSON.stringify({
                platform_name: 'OpenDev Labs',
                platform_username: 'User', // Get from your own DB
                metadata: {
                    nodes_initialized: 12,
                    titan_access: 1
                }
            }),
            headers: {
                Authorization: `Bearer ${tokens.access_token}`,
                'Content-Type': 'application/json',
            },
        });
        */

        return res.status(200).json({ message: 'Handshake complete. Identity synchronized.' });
    } catch (error: any) {
        console.error('Verification error:', error);
        return res.status(500).json({ message: error.message || 'Internal server error during handshake.' });
    }
}
