export class User {
  id!: string | undefined;
  githubId!: string;
  username!:string;
  following!: number;
  followers!: number;
  avatar!: string;
  bio!: string;
  publicRepos!: number;
  token!: string;
  lastProfileUpdate!: Date
}
