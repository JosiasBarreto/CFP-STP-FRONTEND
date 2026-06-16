import os
from docx import Document
from docxcompose.composer import Composer

pasta = r"C:\Users\josia\Documents\GitHub\CFP-STP\static\dossier\2026\Qualificacao_Para_Emprego\Acao_No32026\CONTRATOS"

arquivos = [f for f in os.listdir(pasta) if f.endswith(".docx")]
arquivos.sort()

primeiro_doc = Document(os.path.join(pasta, arquivos[0]))
composer = Composer(primeiro_doc)

for arquivo in arquivos[1:]:
    caminho = os.path.join(pasta, arquivo)
    doc = Document(caminho)
    composer.append(doc)

saida = os.path.join(pasta, "documento_final.docx")
composer.save(saida)

print("Documento criado:", saida)