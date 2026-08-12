import * as XLSX from 'xlsx';
import { validateRow } from './Validation';
export const getExcelColumns = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = e.target?.result;
                const workbook = XLSX.read(data, { type: 'binary' });
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                // Convert to json
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
                let columns = [];
                if (jsonData.length > 0) {
                    columns = Object.keys(jsonData[0]);
                }
                resolve({ columns, data: jsonData });
            }
            catch (error) {
                reject(error);
            }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsBinaryString(file);
    });
};
export const mapAndValidateExcelData = async (jsonData, mapping) => {
    const processedRows = [];
    for (const row of jsonData) {
        // Check if row is completely empty based on mapping values
        const hasAnyValue = Object.values(mapping).some(colName => {
            return colName && row[colName] && String(row[colName]).trim() !== '';
        });
        if (hasAnyValue) {
            // Normalização de Telefone (Separar por / ou , ou -)
            let rawTelefone = String(mapping.telefone && row[mapping.telefone] ? row[mapping.telefone] : '').trim();
            let rawTelefone2 = String(mapping.telefone2 && row[mapping.telefone2] ? row[mapping.telefone2] : '').trim();
            const splitPhoneMatch = rawTelefone.match(/[\/,]/);
            if (splitPhoneMatch) {
                const parts = rawTelefone.split(splitPhoneMatch[0]);
                rawTelefone = parts[0].trim();
                if (!rawTelefone2 && parts.length > 1) {
                    rawTelefone2 = parts[1].trim();
                }
            }
            // Normalização Sexo (M -> Masculino, F -> Feminino)
            let rawSexo = String(mapping.sexo && row[mapping.sexo] ? row[mapping.sexo] : '').trim();
            const sLower = rawSexo.toLowerCase();
            if (sLower === 'm' || sLower === 'masc' || sLower === 'masculino')
                rawSexo = 'Masculino';
            else if (sLower === 'f' || sLower === 'fem' || sLower === 'feminino')
                rawSexo = 'Feminino';
            // Normalização Estado Civil
            let rawEstadoCivil = String(mapping.estado_civil && row[mapping.estado_civil] ? row[mapping.estado_civil] : '').trim();
            const ecLower = rawEstadoCivil.toLowerCase();
            if (ecLower.includes('solteir'))
                rawEstadoCivil = 'Solteiro(a)';
            else if (ecLower.includes('casad'))
                rawEstadoCivil = 'Casado(a)';
            else if (ecLower.includes('divorciad'))
                rawEstadoCivil = 'Divorciado(a)';
            else if (ecLower.includes('viúv') || ecLower.includes('viuv'))
                rawEstadoCivil = 'Viúvo(a)';
            // Normalização Distrito
            let rawDistrito = String(mapping.distrito && row[mapping.distrito] ? row[mapping.distrito] : '').trim();
            const dLower = rawDistrito.toLowerCase();
            if (dLower.includes('água grande') || dLower.includes('agua grande'))
                rawDistrito = 'Água Grande';
            else if (dLower.includes('mé-zóchi') || dLower.includes('me-zochi') || dLower.includes('me zochi'))
                rawDistrito = 'Mé-Zóchi';
            else if (dLower.includes('cantagalo'))
                rawDistrito = 'Cantagalo';
            else if (dLower.includes('caué') || dLower.includes('caue'))
                rawDistrito = 'Caué';
            else if (dLower.includes('lobata'))
                rawDistrito = 'Lobata';
            else if (dLower.includes('lembá') || dLower.includes('lemba'))
                rawDistrito = 'Lembá';
            else if (dLower.includes('pagué') || dLower.includes('pague'))
                rawDistrito = 'Pagué';
            // Normalização Data Nascimento (Tratar serial numérico do Excel)
            let rawDataNasc = String(mapping.datanascimento && row[mapping.datanascimento] ? row[mapping.datanascimento] : '').trim();
            if (!isNaN(Number(rawDataNasc)) && rawDataNasc !== '') {
                const date = new Date(Math.round((Number(rawDataNasc) - 25569) * 86400 * 1000));
                if (!isNaN(date.getTime()))
                    rawDataNasc = date.toISOString().split('T')[0];
            }
            // Normalização Nacionalidade
            let rawNacionalidade = String(mapping.nacionalidade && row[mapping.nacionalidade] ? row[mapping.nacionalidade] : '').trim();
            if (!rawNacionalidade)
                rawNacionalidade = 'Santomense';
            // Pre-processing
            const processedRow = {
                id: crypto.randomUUID(),
                nome: String(mapping.nome && row[mapping.nome] ? row[mapping.nome] : '').trim(),
                sexo: rawSexo,
                datanascimento: rawDataNasc,
                telefone: rawTelefone,
                telefone2: rawTelefone2,
                bi: String(mapping.bi && row[mapping.bi] ? row[mapping.bi] : '').trim(),
                nif: String(mapping.nif && row[mapping.nif] ? row[mapping.nif] : '').trim(),
                email: String(mapping.email && row[mapping.email] ? row[mapping.email] : '').trim(),
                distrito: rawDistrito,
                morada: String(mapping.morada && row[mapping.morada] ? row[mapping.morada] : '').trim(),
                nacionalidade: rawNacionalidade,
                naturalidade: String(mapping.naturalidade && row[mapping.naturalidade] ? row[mapping.naturalidade] : '').trim(),
                estado_civil: String(mapping.estado_civil && row[mapping.estado_civil] ? row[mapping.estado_civil] : '').trim(),
                nome_pai: String(mapping.nome_pai && row[mapping.nome_pai] ? row[mapping.nome_pai] : '').trim(),
                nome_mae: String(mapping.nome_mae && row[mapping.nome_mae] ? row[mapping.nome_mae] : '').trim(),
                habilitacao: String(mapping.habilitacao && row[mapping.habilitacao] ? row[mapping.habilitacao] : '').trim(),
                idade: String(mapping.idade && row[mapping.idade] ? row[mapping.idade] : '').trim(),
                observacao: String(mapping.observacao && row[mapping.observacao] ? row[mapping.observacao] : '').trim(),
            };
            const { isValid, errors } = await validateRow(processedRow);
            processedRow.isValid = isValid;
            processedRow.errors = errors;
            processedRows.push(processedRow);
        }
    }
    return processedRows;
};
