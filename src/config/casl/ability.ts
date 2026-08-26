import { createMongoAbility, MongoAbility } from '@casl/ability';

export type Actions =
    | 'CREATE'
    | 'READ'
    | 'READ_OWN'
    | 'READ_ALL'
    | 'UPDATE'
    | 'UPDATE_OWN'
    | 'UPDATE_ALL'
    | 'DELETE'
    | 'DELETE_OWN'
    | 'DELETE_ALL'
    | 'EXPORT'
    | 'ASSIGN'
    | 'APPROVE';

export type Features = string;

export type AppAbility = MongoAbility<[Actions, Features]>;

export const ability = createMongoAbility<AppAbility>();
