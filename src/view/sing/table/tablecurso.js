import React, { useState, useEffect } from "react";
import { BsPencilSquare, BsTrash } from "react-icons/bs";
import {
  Table,
  Button,
  Form,
  Card,
  Col,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./index.css";
import {
  faSortAlphaDown,
  faArrowDownZA,
  faList,
} from "@fortawesome/free-solid-svg-icons";

import { PaginatedList } from "../../../component/Panilist";
import { formatarData } from "../configureData";

function TableCurso({
  carregarCurso,
  formik,
  deletarCurso,
  datas,
  isLoading,
  isFetching,
}) {
  const [users, setUsers] = useState([]);
  const [order, setOrder] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(15);
  const [currentPage, setCurrentPage] = useState(1);

  // Atualiza o estado users quando datas for alterado
  useEffect(() => {
    if (datas && datas.length > 0) {
      setUsers(datas);
    }
  }, [datas]);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const handlePageChange = (page) => setCurrentPage(page);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = users.slice(startIndex, endIndex);

  const OrderName = () => {
    if (order === "asc") {
      setUsers([...users].sort((a, b) => a.nome.localeCompare(b.nome)));
      setOrder("desc");
    } else {
      setUsers([...users].sort((a, b) => b.nome.localeCompare(a.nome)));
      setOrder("asc");
    }
  };
  const OrderPrograma = () => {
    if (order === "asc") {
      setUsers(
        [...users].sort((a, b) =>
          a.programa_nome.localeCompare(b.programa_nome)
        )
      );
      setOrder("desc");
    } else {
      setUsers(
        [...users].sort((a, b) =>
          b.programa_nome.localeCompare(a.programa_nome)
        )
      );
      setOrder("asc");
    }
  };
  const OrderAcao = () => {
    if (order === "asc") {
      setUsers([...users].sort((a, b) => a.acao.localeCompare(b.acao)));
      setOrder("desc");
    } else {
      setUsers([...users].sort((a, b) => b.acao.localeCompare(a.acao)));
      setOrder("asc");
    }
  };
  const ListAll = () => {
    setUsers(datas);
  };

  const handleItemsPerPageChange = (selectedValue) => {
    const newItemsPerPage = parseInt(selectedValue, 10);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  if (isLoading) return <div>Carregando...</div>;

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const filteredUsers = datas.filter((user) =>
      user.nome.toLowerCase().includes(searchTerm)
    );
    setUsers(filteredUsers);
  };

  return (
    <Card className="card-glass shadow rounded p-2 mb-2 bg-white">
      <div className="d-flex hstack gap-3 p-1">
        <Dropdown onSelect={(eventKey) => handleItemsPerPageChange(eventKey)}>
          <Dropdown.Toggle variant="outline-success" id="dropdown-basic">
            Itens
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item eventKey="15">15</Dropdown.Item>
            <Dropdown.Item eventKey="30">30</Dropdown.Item>
            <Dropdown.Item eventKey="40">40</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Button variant="outline-success" onClick={ListAll}>
          <FontAwesomeIcon icon={faList} /> Todos
        </Button>
        <Button variant="outline-success" onClick={OrderName}>
          <FontAwesomeIcon
            icon={order === "asc" ? faSortAlphaDown : faArrowDownZA}
          />{" "}
          Curso
        </Button>
        <Button variant="outline-success" onClick={OrderPrograma}>
          <FontAwesomeIcon icon={faSortAlphaDown} /> Programa
        </Button>
        <Button variant="outline-success" onClick={OrderAcao}>
          <FontAwesomeIcon icon={faArrowDownZA} /> Acção
        </Button>
        {isFetching && <p className="text-success">Carregando...</p>}
        <Col>
          <Form>
            <Form.Control
              type="text"
              placeholder="Pesquisar por nome do curso"
              className="me-3"
              aria-label="Search"
              onChange={handleSearch}
            />
          </Form>
        </Col>
      </div>

      <Table
        responsive
        hover
        table-bordered
        bordered
        className=" table table-sm table-striped table-hover text-center "
        style={{ fontSize: "0.9rem" }}
        striped
        size="sm"
      >
        <thead className="bg-success text-light ">
          <tr>
            <th>
              Acção{" "}
              <Badge bg="light" className="text-success" onClick={OrderAcao}>
                <FontAwesomeIcon icon={faArrowDownZA} />
              </Badge>
            </th>
            <th>
              Nome
              <Badge bg="light" className="text-success" onClick={OrderName}>
                <FontAwesomeIcon
                  icon={order === "asc" ? faSortAlphaDown : faArrowDownZA}
                />
              </Badge>
            </th>
            <th>
              Programa{" "}
              <Badge
                bg="light"
                className="text-success"
                onClick={OrderPrograma}
              >
                <FontAwesomeIcon
                  icon={order === "asc" ? faSortAlphaDown : faArrowDownZA}
                />
              </Badge>
            </th>
            <th>Horario</th>
            <th>Carga Hor.</th>
            <th>Data Inicio</th>
            <th>Data Término</th>
            <th>Ano</th>
            

            <th>Acção</th>
          </tr>
        </thead>
        <tbody className="text-size-sm text-start">
          {currentItems.length > 0 ? (
            currentItems.map((user, index) => (
              <tr key={index}>
                <td>{user.acao} </td>
                <td>{user.nome}</td>
                <td>{user.programa_nome}</td>
                <td>
                  {user.horario} - {user.horario_termino}
                </td>
                <td>{user.duracao} Horas</td>
                <td>{formatarData(user.data_inicio)}</td>
                <td>{formatarData(user.data_termino)}</td>
                <td>{user.ano_execucao}</td>
                
                <td className="d-flex gap-2 justify-content-center">
                  <Button
                    variant="outline-success"
                    onClick={() => carregarCurso(formik, user)}
                  >
                    <BsPencilSquare />
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={() => deletarCurso(user.id)}
                  >
                    <BsTrash />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center text-warning">
                <FontAwesomeIcon icon={faList} />{" "}
                <strong>Nenhum curso encontrado</strong>
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      <Col>
        <PaginatedList
          totalPages={totalPages}
          currentPage={currentPage}
          handlePageChange={handlePageChange}
        />
      </Col>
    </Card>
  );
}

export default TableCurso;
