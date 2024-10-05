// file: ~/server/api/auth/[...].ts
import { NuxtAuthHandler } from '#auth'
import Auth0Provider from 'next-auth/providers/auth0'

const config = useRuntimeConfig();

export default NuxtAuthHandler({
    secret: config.authSecret,
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        Auth0Provider.default({
            clientId: config.auth0ClientId,
            clientSecret: config.auth0ClientSecret,
            issuer: config.auth0Issuer
        })
    ]
})
