import React, { useState, useEffect } from 'react';
import { BsPencilSquare, BsTrash } from 'react-icons/bs';
import { Table, Button, Form, Card, Col, Dropdown } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortAlphaDown, faArrowDownZA, faList } from '@fortawesome/free-solid-svg-icons';

import { PaginatedList } from '../../../component/Panilist';

function TableUser({ carregarUsuario, formik, deletarUsuario, datas, isLoading, isFetching }) {
    const [users, setUsers] = useState([]);
    const [order, setOrder] = useState(null);
    const [itemsPerPage, setItemsPerPage] = useState(5);
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
        if (order === 'asc') {
            setUsers([...users].sort((a, b) => a.nome.localeCompare(b.nome)));
            setOrder('desc');
        } else {
            setUsers([...users].sort((a, b) => b.nome.localeCompare(a.nome)));
            setOrder('asc');
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
        <Card className='shadow rounded p-2 mb-2'>
            <div className='d-flex hstack gap-3 p-1'>
                <Dropdown onSelect={(eventKey) => handleItemsPerPageChange(eventKey)}>
                    <Dropdown.Toggle variant='outline-success' id='dropdown-basic'>
                        Itens
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                        <Dropdown.Item eventKey='5'>5</Dropdown.Item>
                        <Dropdown.Item eventKey='10'>10</Dropdown.Item>
                        <Dropdown.Item eventKey='15'>15</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <Button variant='outline-success' onClick={ListAll}>
                    <FontAwesomeIcon icon={faList} /> Todos
                </Button>
                <Button variant='outline-success' onClick={OrderName}>
                    <FontAwesomeIcon icon={order === 'asc' ? faSortAlphaDown : faArrowDownZA} /> Nome
                </Button>
                {isFetching && <p className='text-success'>Carregando...</p>}
                <Col>
                    <Form>
                        <Form.Control
                            type='text'
                            placeholder='Pesquisar Utilizador'
                            className='me-3'
                            aria-label='Search'
                            onChange={handleSearch}
                        />
                    </Form>
                </Col>
            </div>

            <Table responsive hover table-bordered className='text-center table table-sm'>
                <thead className='bg-success text-light'>
                    <tr>
                        <th>Nome</th>
                        <th>Email</th>
                        <th>Estado</th>
                        <th>Nível</th>
                        <th>Data Criação</th>
                        <th>Editar</th>
                        <th>Eliminar</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.length > 0 ? (
                        currentItems.map((user, index) => (
                            <tr key={index}>
                                <td>{user.nome}</td>
                                <td>{user.email}</td>
                                <td>{user.status}</td>
                                <td>{user.fknivelacesso}</td>
                                <td>{user.datacriacao}</td>
                                <td>
                                    <Button
                                        variant='outline-success'
                                        onClick={() => carregarUsuario(formik, user.id, user.nome, user.email, user.fknivelacesso)}
                                    >
                                        <BsPencilSquare /> Editar
                                    </Button>
                                </td>
                                <td>
                                    <Button variant='outline-danger' onClick={() => deletarUsuario(user.id)}>
                                        <BsTrash /> Eliminar
                                    </Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="6">Nenhum utilizador encontrado.</td>
                        </tr>
                    )}
                </tbody>
            </Table>

            <Col>
                <PaginatedList totalPages={totalPages} currentPage={currentPage} handlePageChange={handlePageChange} />
            </Col>
        </Card>
    );
}

export default TableUser;
