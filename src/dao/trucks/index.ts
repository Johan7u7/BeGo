import * as insert from './insert.js';
import * as update from './update.js';
import * as select from './select.js';
import * as borrar from './delete.js';

export const dao = {
    insert: { ...insert },
    update: { ...update },
    select: { ...select },
    delete: { ...borrar }
};

export default dao;