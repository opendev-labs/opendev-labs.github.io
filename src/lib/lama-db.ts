export type User = {
    id: string;
    email: string;
    username: string;
    createdAt: number;
}

export type Document = {
    id: string;
    [key: string]: any;
}

class LamaDB {
    private dbName: string;

    constructor(dbName: string = "lama_db_core") {
        this.dbName = dbName;
    }

    private getStorageKey(collection: string) {
        return `${this.dbName}_${collection}`;
    }

    // --- Collections ---

    collection(name: string) {
        return {
            add: async (data: any) => this.add(name, data),
            get: async () => this.get(name),
            query: async (field: string, value: any) => this.query(name, field, value)
        };
    }

    private async add(collection: string, data: any): Promise<Document> {
        const key = this.getStorageKey(collection);
        const existing = JSON.parse(localStorage.getItem(key) || "[]");
        const newDoc = { id: crypto.randomUUID(), createdAt: Date.now(), ...data };
        existing.push(newDoc);
        localStorage.setItem(key, JSON.stringify(existing));
        return newDoc;
    }

    private async get(collection: string): Promise<Document[]> {
        const key = this.getStorageKey(collection);
        return JSON.parse(localStorage.getItem(key) || "[]");
    }

    private async query(collection: string, field: string, value: any): Promise<Document[]> {
        const all = await this.get(collection);
        return all.filter(doc => doc[field] === value);
    }

    // --- Auth ---

    auth = {
        signUp: async (email: string, username: string): Promise<User> => {
            const users = await this.collection('users').get();
            if (users.find(u => u.email === email)) throw new Error("User already exists");

            const user = await this.collection('users').add({ email, username });
            localStorage.setItem(`${this.dbName}_session`, JSON.stringify(user));
            return user as User;
        },

        signIn: async (email: string): Promise<User> => {
            const users = await this.collection('users').get();
            const user = users.find(u => u.email === email);
            if (!user) throw new Error("User not found");

            localStorage.setItem(`${this.dbName}_session`, JSON.stringify(user));
            return user as User;
        },

        signOut: async () => {
            localStorage.removeItem(`${this.dbName}_session`);
        },

        getCurrentUser: (): User | null => {
            const session = localStorage.getItem(`${this.dbName}_session`);
            return session ? JSON.parse(session) : null;
        }
    }
}

export const db = new LamaDB();
