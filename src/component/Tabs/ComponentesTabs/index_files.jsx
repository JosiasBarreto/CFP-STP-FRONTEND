import React, { useMemo, useRef, useState, useEffect, use } from "react";
import { AgGridReact } from "ag-grid-react";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import "./Gerarcontrato.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

ModuleRegistry.registerModules([AllCommunityModule]);
const styles = {
    card: {
      
      borderRadius: "12px",
      
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
    },
  
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      
    },
  
    title: {
      margin: 0,
      fontSize: "18px",
      fontWeight: "600",
    },
  
    subtitle: {
      fontSize: "12px",
      color: "#6b7280",
    },
  
    search: {
      padding: "8px 12px",
      borderRadius: "8px",
      border: "1px solid #e5e7eb",
      outline: "none",
      fontSize: "13px",
      width: "220px",
    },
  
    grid: {
      height: "550px",
      width: "100%",
      fontSize: "13px",
    },
  };

export default function FormandosTable({ formandos = [] }) {
  const gridRef = useRef();
  const [quickFilter, setQuickFilter] = useState("");

  const calcularIdade = (dataNascimento) => {
    if (!dataNascimento) return "";
    const nascimento = new Date(dataNascimento);
    const hoje = new Date();
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const mes = hoje.getMonth() - nascimento.getMonth();
    if (mes < 0 || (mes === 0 && hoje.getDate() < nascimento.getDate())) {
      idade--;
    }
    return idade;
  };
  useEffect(() => {
    console.log("Formandos atualizados:", formandos);
  }, [formandos]);
//se tiver um contacto deve mostra somente o conctacto sem a barra, se tiver os dois contactos deve mostrar os dois separados por barra, se ou ser igual a 0 não tiver nenhum contacto deve mostrar vazio
  const columnDefs = useMemo(() => [
    {
      headerName: "",
      field: "foto_url",
      cellRenderer: (params) => (
        <img
          src={params.value || "https://tse2.mm.bing.net/th/id/OIP.ZnWcaa3QttHXFa7xjap_vAHaHa?cb=iwp2&rs=1&pid=ImgDetMain"}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            objectFit: "cover",
            border: "2px solid #e5e7eb"
          }}
          alt=""
        />
      ),
      width: 20,

      
      filter: false,
    },
    { headerName: "Nome", field: "nome", flex: 1, minWidth: 300,},
    { headerName: "BI", field: "bi", width: 120, center: true },
    {
      headerName: "Sexo",
      field: "sexo",
      valueFormatter: (p) =>
        p.value === "Feminino" ? "F" :
        p.value === "Masculino" ? "M" : "",
      width: 80,
      center:true
    },
    {
      headerName: "Idade",
      valueGetter: (p) => p.data ? calcularIdade(p.data.data_nascimento) : "",
      width: 80,
      center:true
    },
    { headerName: "Residência", field: "zona" },
    { headerName: "Distrito", field: "distrito" },
    {
      headerName: "Contactos",
      valueGetter: (p) =>
        p.data && p.data.contacto && p.data.contacto_opcional ? `${p.data.contacto} / ${p.data.contacto_opcional}` :
        p.data ? `${p.data.contacto || ""}` : "",
    },
    { headerName: "NIF", field: "nif" },
  ], []);

  const defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    floatingFilter: true,
    minWidth: 100,
  };

  return (
    <div style={{ width: "100%" }}>

      {/* 🔷 CARD HEADER */}
      <div style={styles.card}>

        <div style={styles.header}>
          <div>
            <h3 style={styles.title}>Formandos</h3>
            <span style={styles.subtitle}>
              {formandos.length} registos
            </span>
          </div>

          {/* 🔎 Pesquisa */}
          <input
            type="text"
            placeholder="Pesquisar formando..."
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
            style={styles.search}
          />
        </div>

        {/* 📊 GRID 
        na paginação deve ser 25 por pagina, e deve ter a opção de mostrar 50 ou 100 por pagina
        
        */}

        <div className="ag-theme-alpine custom-grid" style={styles.grid}>
          <AgGridReact
            ref={gridRef}
            rowData={formandos}
            columnDefs={columnDefs}
            
            defaultColDef={defaultColDef}
            pagination={true}
            paginationPageSize={25}
            animateRows={true}
            quickFilterText={quickFilter}
            rowSelection="multiple"
            rowHeight={35}
            rowStyle={{ fontSize: 16 , fontFamily: "times new roman" }}
            colResizeDefault="shift"
            onGridReady={(params) => {
              setTimeout(() => {
                params.api.sizeColumnsToFit();
              }, 100);
            }}
          />
        </div>
      </div>
    </div>
  );
}