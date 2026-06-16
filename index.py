import os
from docx2pdf import convert
from pypdf import PdfReader, PdfWriter

pasta = r"C:\Users\josia\Documents\GitHub\CFP-STP\static\dossier\2026\Qualificacao_Para_Emprego\Acao_No32026\CONTRATOS"

pdfs = []

# Converter DOCX para PDF
for arquivo in os.listdir(pasta):
    if arquivo.endswith(".docx"):

        caminho_docx = os.path.join(pasta, arquivo)
        caminho_pdf = caminho_docx.replace(".docx", ".pdf")

        print(f"Convertendo: {arquivo}")

        convert(caminho_docx, caminho_pdf)

        pdfs.append(caminho_pdf)

# Criar writer
writer = PdfWriter()

# Juntar todos os PDFs
for pdf in pdfs:

    print(f"Adicionando: {pdf}")

    reader = PdfReader(pdf)

    for page in reader.pages:
        writer.add_page(page)

# Salvar PDF final
saida = os.path.join(pasta, "documento_final.pdf")

with open(saida, "wb") as f:
    writer.write(f)

print("PDF final criado em:", saida)