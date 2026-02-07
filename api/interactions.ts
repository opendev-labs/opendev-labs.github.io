import { Request, Response } from 'express';
import crypto from 'crypto';

// Discord Interaction Types
const PING = 1;
const APPLICATION_COMMAND = 2;

// Verification Logic
async function verifyDiscordRequest(req: Request, publicKey: string) {
    const signature = req.headers['x-signature-ed25519'] as string;
    const timestamp = req.headers['x-signature-timestamp'] as string;
    const body = JSON.stringify(req.body);

    if (!signature || !timestamp) return false;

    // In a real environment, you'd use a library like 'discord-interactions' or 'tweetnacl'
    // This is a simplified Node.js crypto implementation for Ed25519
    try {
        const isValid = crypto.verify(
            null,
            Buffer.from(timestamp + body),
            {
                key: Buffer.from(publicKey, 'hex'),
                format: 'der',
                type: 'public',
            },
            Buffer.from(signature, 'hex')
        );
        return isValid;
    } catch (e) {
        // Fallback or detailed logging might go here
        console.error('Signature verification failed', e);
        return false;
    }
}

export default async function handler(req: Request, res: Response) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const PUBLIC_KEY = process.env.DISCORD_PUBLIC_KEY;
    if (!PUBLIC_KEY) {
        return res.status(500).json({ error: 'DISCORD_PUBLIC_KEY not configured' });
    }

    // Discord requires pings to be handled even without full verification in some dev stages,
    // but production bots MUST verify every request.
    const isValid = await verifyDiscordRequest(req, PUBLIC_KEY);
    if (!isValid) {
        return res.status(401).send('invalid request signature');
    }

    const { type, data } = req.body;

    if (type === PING) {
        return res.status(200).json({ type: 1 });
    }

    if (type === APPLICATION_COMMAND) {
        const { name } = data;

        if (name === 'status') {
            return res.status(200).json({
                type: 4,
                data: {
                    content: 'opendev-bots // SYSTEM ONLINE. Mesh connectivity optimized.',
                },
            });
        }
    }

    return res.status(200).json({
        type: 4,
        data: {
            content: 'Command acknowledged by the Mesh.',
        },
    });
}
