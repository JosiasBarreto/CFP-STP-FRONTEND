//componente de perfil do utilizador, onde o mesmo pode ver suas informações e editar
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


import { Card, Modal, Row } from 'react-bootstrap';
export default function Index_perfil() {
    const [userData, setUserData] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const data = 0
            setUserData(data);
        };
        fetchUserData();
    }, []);

    const handleEdit = () => {
        navigate('/edit-profile');
    };
return (
    <Row className="justify-content-center mt-5 bg-light p-4 rounded">
        <Card className="mb-4 w-100">
            <Card.Body className="d-flex align-items-center">
                <Card.Img variant="top" src={userData.profilePicture} className="rounded-circle me-3" />
                <div>
                    <Card.Title className="mb-0">{userData.name}</Card.Title>   
                    <Card.Text className="text-muted">{userData.email}</Card.Text>
                </div>
            </Card.Body>
        </Card>
        <div className="d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleEdit}>Editar Perfil</button>
        </div>
    </Row>
);
}