import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { persist } from 'zustand/middleware'
import { AppwriteException, ID, Models } from 'appwrite'
import { account } from '@/models/client/config'

export interface UserPref {
    reputation: number
}

interface IAuthStore {
    hydrated: boolean,
    session: Models.Session | null,
    jwt: string | null,
    user: Models.User<UserPref> | null;

    setHydrated(): void
    verifySession(): Promise<void>
    login(
        email: string,
        password: string
    ): Promise<{ success: boolean; error?: AppwriteException | null }>

    createAccount(
        email: string,
        password: string,
        name: string
    ): Promise<{ success: boolean; error?: AppwriteException | null }>

    logout(): Promise<void>
}

export const useAuthStore = create<IAuthStore>()(
    persist(
        immer((set) => ({
            session: null,
            jwt: null,
            user: null,
            hydrated: false,

            setHydrated() {
                set({ hydrated: true })
            },

            async verifySession() {
                try {
                    const session = await account.getSession('current')
                    set({ session })
                } catch (error) {
                    console.error(error)
                }
            },

            async login(email, password) {
                try {
                    const session = await account.createEmailPasswordSession(email, password)
                    const [user, { jwt }] = await Promise.all([
                        account.get<UserPref>(),
                        account.createJWT(),
                    ])

                    if (!user.prefs?.reputation) {
                        await account.updatePrefs<UserPref>({ reputation: 0 })
                    }

                    set({
                        jwt,
                        session,
                        user,
                    })
                    return { success: true }
                } catch (error) {
                    console.error(error)
                    return { success: false, error: error instanceof AppwriteException ? error : null }
                }
            },

            async createAccount(email, password, name) {
                try {
                    await account.create(ID.unique(), email, password, name)
                    return { success: true }
                } catch (error) {
                    console.error(error)
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error : null,
                    }
                }
            },

            async logout() {
                try {
                    await account.deleteSessions()
                    set({ session: null, jwt: null, user: null })
                } catch (error) {
                    console.error(error)
                }
            },
        })),
        {
            name: 'auth',
            onRehydrateStorage() {
                return (state, error) => {
                    if (!error) {
                        state?.setHydrated()
                    }
                }
            },
        }
    )
)
