import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Divider, Header, Icon, Modal, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';

export default function ListCliente() {

    const [lista, setLista] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();


    useEffect(() => {
        carregarLista();
    }, [])

    function carregarLista() {

        axios.get("http://localhost:8080/api/cliente")
            .then((response) => {
                setLista(response.data)
            })
    }

    function formatarData(dataParam) {

        if (dataParam === null || dataParam === '' || dataParam === undefined) {
            return ''
        }

        let arrayData = dataParam.split('-');
        return arrayData[2] + '/' + arrayData[1] + '/' + arrayData[0];
    }

    function confirmaRemover(id) {
        setOpenModal(true)
        setIdRemover(id)
    }

    async function remover() {

        await axios.delete('http://localhost:8080/api/cliente/' + idRemover)
            .then((response) => {

                console.log('Cliente removido com sucesso.')

                axios.get("http://localhost:8080/api/cliente")
                    .then((response) => {
                        setLista(response.data)
                    })
            })
            .catch((error) => {
                console.log('Erro ao remover um cliente.')
            })
        setOpenModal(false)
    }

    return (
        <div>
            <MenuSistema tela={'cliente'} />
            <div style={{ marginTop: '3%' }}>

                <Container textAlign='justified' >

                    <h2> Cliente </h2>
                    <Divider />

                    <div style={{ marginTop: '4%' }}>
                        <Button
                            label='Novo'
                            circular
                            color='orange'
                            icon='clipboard outline'
                            floated='right'
                            as={Link}
                            to='/form-cliente'
                        />

                        <br /><br /><br />

                        <Table color='orange' sortable celled>

                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Nome</Table.HeaderCell>
                                    <Table.HeaderCell>CPF</Table.HeaderCell>
                                    <Table.HeaderCell>Data de Nascimento</Table.HeaderCell>
                                    <Table.HeaderCell>Fone Celular</Table.HeaderCell>
                                    <Table.HeaderCell>Fone Fixo</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Ações</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>

                                {lista.map(cliente => (

                                    <Table.Row key={cliente.id}>
                                        <Table.Cell>{cliente.nome}</Table.Cell>
                                        <Table.Cell>{cliente.cpf}</Table.Cell>
                                        <Table.Cell>{formatarData(cliente.dataNascimento)}</Table.Cell>
                                        <Table.Cell>{cliente.foneCelular}</Table.Cell>
                                        <Table.Cell>{cliente.foneFixo}</Table.Cell>
                                        <Table.Cell textAlign='center'>

                                            <Button
                                                inverted
                                                circular
                                                color='blue'
                                                title='Clique aqui para exibir os endereços deste cliente'
                                                icon
                                            >
                                                <Link to={`/list-enderecocliente/${cliente.id}`} style={{ color: 'blue' }}>
                                                    <Icon name='list' />
                                                </Link>
                                            </Button> &nbsp;



                                            <Button
                                                inverted
                                                circular
                                                color='green'
                                                title='Clique aqui para editar os dados deste cliente'
                                                icon>
                                                <Link to="/form-cliente" state={{ id: cliente.id }} style={{ color: 'green' }}>
                                                    <Icon name='edit' />
                                                </Link>
                                            </Button> &nbsp;

                                            <Button
                                                inverted
                                                circular
                                                color='red'
                                                title='Clique aqui para remover este cliente'
                                                icon
                                                onClick={e => confirmaRemover(cliente.id)}>
                                                <Icon name='trash' />
                                            </Button>

                                        </Table.Cell>
                                    </Table.Row>
                                ))}

                            </Table.Body>
                        </Table>
                    </div>
                </Container>
            </div>
            <Modal
                basic
                onClose={() => setOpenModal(false)}
                onOpen={() => setOpenModal(true)}
                open={openModal}
            >
                <Header icon>
                    <Icon name='trash' />
                    <div style={{ marginTop: '5%' }}> Tem certeza que deseja remover esse registro? </div>
                </Header>
                <Modal.Actions>
                    <Button basic color='red' inverted onClick={() => setOpenModal(false)}>
                        <Icon name='remove' /> Não
                    </Button>
                    <Button color='green' inverted onClick={() => remover()}>
                        <Icon name='checkmark' /> Sim
                    </Button>
                </Modal.Actions>
            </Modal>

        </div>
    )
}

