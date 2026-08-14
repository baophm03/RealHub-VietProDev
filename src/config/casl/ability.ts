import { createMongoAbility, MongoAbility } from '@casl/ability';

export type Actions =
    | 'CREATE'
    | 'READ'
    | 'UPDATE'
    | 'DELETE'
    | 'EXPORT'
    | 'ASSIGN'
    | 'APPROVE';

export type Features = string;

export type AppAbility = MongoAbility<[Actions, Features]>;

export const ability = createMongoAbility<AppAbility>();
