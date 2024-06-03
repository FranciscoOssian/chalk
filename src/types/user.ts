export default interface UserType {
  id: string;
  profilePicture?: string;
  name?: string;
  age?: number;
  bio?: string;
  authenticated?: boolean;
  gender?: string;
  matchingConfig: {
    from: number;
    to: number;
    lang: string;
    genders: string[];
  };
}
