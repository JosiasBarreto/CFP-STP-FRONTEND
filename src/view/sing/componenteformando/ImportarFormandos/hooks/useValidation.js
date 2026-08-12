import { useCallback } from 'react';
import { validateRow } from '../Validation';
export const useValidation = () => {
    const revalidateRow = useCallback(async (row) => {
        const { isValid, errors } = await validateRow(row);
        return { ...row, isValid, errors };
    }, []);
    const findDuplicates = useCallback((rows) => {
        const biSet = new Set();
        const emailSet = new Set();
        const telefoneSet = new Set();
        return rows.map((row) => {
            let isDuplicate = false;
            // Basic check: only check if field has value to avoid empty matches
            if (row.bi) {
                if (biSet.has(row.bi))
                    isDuplicate = true;
                biSet.add(row.bi);
            }
            if (row.email) {
                if (emailSet.has(row.email))
                    isDuplicate = true;
                emailSet.add(row.email);
            }
            if (row.telefone) {
                if (telefoneSet.has(row.telefone))
                    isDuplicate = true;
                telefoneSet.add(row.telefone);
            }
            return { ...row, isDuplicate };
        });
    }, []);
    return { revalidateRow, findDuplicates };
};
