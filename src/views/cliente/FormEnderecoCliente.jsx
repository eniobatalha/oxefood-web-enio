import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import { Button, Container, Divider, Form, Header, Icon } from 'semantic-ui-react';
import InputMask from 'react-input-mask';
import MenuSistema from '../../MenuSistema';
import { notify, notifyInfo, notifyWarn, notifyError, notifySuccess,  } from "../util/Util";

export default function FormEnderecoCliente() {
    const { clienteId, enderecoId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const [endereco, setEndereco] = useState({
        rua: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        cep: '',
        complemento: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [originUrl, setOriginUrl] = useState('');

    useEffect(() => {
        // Captura a URL de origem corretamente
        setOriginUrl(location.state?.from || `/list-enderecocliente/${clienteId}`);

        if (enderecoId !== '0') {
            // Se não for um novo endereço, buscar os dados do endereço
            axios.get(`http://localhost:8080/api/cliente/endereco/${enderecoId}`)
                .then(response => {
                    setEndereco(response.data);
                    setIsEditing(true);
                })
                .catch(error => {
                    //console.log('Erro ao buscar o endereço:', error);
                    if (error.response) {
                        notifyError(error.response.data.message)
                    } else {
                        notifyError("Erro ao buscar o endereço.")
                    }
                });
        }
    }, [enderecoId, clienteId, location.state]);

    function handleChange(event) {
        const { name, value } = event.target;
        setEndereco(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (isEditing) {
            // Atualizar o endereço existente
            axios.put(`http://localhost:8080/api/cliente/endereco/${enderecoId}`, endereco)
                .then(response => {
                    //console.log('Endereço atualizado com sucesso.');
                    notifySuccess('Endereço atualizado com sucesso.')
                    navigate(`/list-enderecocliente/${clienteId}`);
                })
                .catch(error => {
                    //console.log('Erro ao atualizar o endereço:', error);
                    if (error.response) {
                        notifyError(error.response.data.message)
                    } else {
                        notifyError("Erro ao atualizar o endereço.")
                    }
                });
        } else {
            // Criar um novo endereço
            axios.post(`http://localhost:8080/api/cliente/${clienteId}/enderecos`, endereco)
                .then(response => {
                    //console.log('Endereço criado com sucesso.');
                    notifySuccess('Endereço criado com sucesso.')
                    navigate(`/list-enderecocliente/${clienteId}`);
                })
                .catch(error => {
                    //console.log('Erro ao criar o endereço:', error);
                    if (error.response) {
                        notifyError(error.response.data.message)
                    } else {
                        notifyError("Erro ao criar o endereço.")
                    }
                });
        }
    }

    function handleGoBack() {
        // Redireciona para a URL de origem armazenada
        navigate(originUrl);
    }

    return (
        <div>
            <MenuSistema tela={'enderecocliente'} />
            <div style={{ marginTop: '3%' }}>
                <Container textAlign='justified'>
                    <Header as='h2'>{isEditing ? 'Editar Endereço' : 'Novo Endereço'}</Header>
                    <Divider />
                    <Form onSubmit={handleSubmit}>
                        <Form.Group widths='equal'>
                            <Form.Input
                                required
                                label='Rua'
                                name='rua'
                                value={endereco.rua}
                                onChange={handleChange}
                            />
                            <Form.Input
                                required
                                label='Número'
                                name='numero'
                                value={endereco.numero}
                                onChange={handleChange}
                            />

                            <Form.Input
                                required
                                label='Bairro'
                                name='bairro'
                                value={endereco.bairro}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Form.Group widths='equal'>
                            <Form.Input
                                required
                                label='Cidade'
                                name='cidade'
                                value={endereco.cidade}
                                onChange={handleChange}
                            />
                            <Form.Input
                                required
                                label='Estado'
                                name='estado'
                                value={endereco.estado}
                                onChange={handleChange}
                            />
                            <Form.Input
                                required
                                fluid
                                label='CEP'>
                                <InputMask
                                    required
                                    mask="99999-999"
                                    value={endereco.cep}
                                    onChange={(e) => setEndereco(prevState => ({
                                        ...prevState,
                                        cep: e.target.value
                                    }))}
                                />
                            </Form.Input>
                            <Form.Input
                                label='Complemento'
                                name='complemento'
                                value={endereco.complemento}
                                onChange={handleChange}
                            />
                        </Form.Group>
                        <Button
                            type="button"
                            inverted
                            circular
                            icon
                            labelPosition='left'
                            color='orange'
                            onClick={handleGoBack}
                            floated='left'
                        >
                            <Icon name='reply' />
                            Voltar
                        </Button>
                        <Button
                            type='submit'
                            inverted
                            circular
                            icon
                            labelPosition='left'
                            color='blue'
                            floated='right'
                            onClick={handleSubmit}
                        >
                            <Icon name='save' />
                            {isEditing ? 'Atualizar Endereço' : 'Cadastrar Endereço'}
                        </Button>
                    </Form>

                </Container>
            </div>
        </div>
    );
}
