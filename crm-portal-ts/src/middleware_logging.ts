import { Request } from 'express'; // Importing express request object for middleware use and type safety
// TypeORM-like pattern is not used in this case as we are using NodeJS environment with Express routers, which already have builtin support of types (Request) by default. 

interface UserState {   // Define an interface to get user info from state if available when making a request for logging purpose only and avoid any type errors at runtime due to 'any' keyword in TypeScript language itself does not allow dynamic typing, so we define it as such here with the assumption that portal_user is always present.
    username: string;  // Assuming all users have usernames of a certain format (string) for simplicity and type safety purpose only due to 'any' keyword in TypeScript language itself does not allow dynamic typing, so we define it as such here with the assumption that portal_user is always present.
}
