import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Container, Divider, Icon, Table, Modal, Header } from 'semantic-ui-react';
import axios from 'axios';
import MenuSistema from '../../MenuSistema';

export default function ListEnderecoCliente() {
    const [lista, setLista] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();
    const { clienteId } = useParams(); // Extrai o clienteId da URL

    useEffect(() => {
        if (clienteId) {
            carregarLista();
        }
    }, [clienteId]);

    function carregarLista() {
        axios.get(`http://localhost:8080/api/cliente/${clienteId}/enderecos`)
            .then((response) => {
                setLista(response.data);
            })
            .catch((error) => {
                console.log('Erro ao carregar a lista de endereços do cliente:', error);
            });
    }

    function confirmaRemover(id) {
        setOpenModal(true);
        setIdRemover(id);
    }

    async function remover() {
        await axios.delete(`http://localhost:8080/api/cliente/endereco/${idRemover}`)
            .then((response) => {
                console.log('Endereço removido com sucesso.');
                carregarLista(); // Recarrega a lista de endereços após a remoção
            })
            .catch((error) => {
                console.log('Erro ao remover o endereço:', error);
            });
        setOpenModal(false);
    }

    return (
        <div>
            <MenuSistema tela={'enderecocliente'} />
            <div style={{ marginTop: '3%' }}>
                <Container textAlign='justified'>
                    <h2> Endereços do Cliente </h2>
                    <Divider />

                    <div style={{ marginTop: '4%' }}>
                        <Button
                            label='Novo'
                            circular
                            color='orange'
                            icon='clipboard outline'
                            floated='right'
                            as={Link}
                            to={`/form-enderecocliente/${clienteId}/0`} // Passando o ID do cliente e 0 para um novo endereço
                        />

                        <br /><br /><br />

                        <Table color='orange' sortable celled>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Rua</Table.HeaderCell>
                                    <Table.HeaderCell>Número</Table.HeaderCell>
                                    <Table.HeaderCell>Bairro</Table.HeaderCell>
                                    <Table.HeaderCell>Cidade</Table.HeaderCell>
                                    <Table.HeaderCell>Estado</Table.HeaderCell>
                                    <Table.HeaderCell>CEP</Table.HeaderCell>
                                    <Table.HeaderCell>Complemento</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Ações</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {lista.map(endereco => (
                                    <Table.Row key={endereco.id}>
                                        <Table.Cell>{endereco.rua}</Table.Cell>
                                        <Table.Cell>{endereco.numero}</Table.Cell>
                                        <Table.Cell>{endereco.bairro}</Table.Cell>
                                        <Table.Cell>{endereco.cidade}</Table.Cell>
                                        <Table.Cell>{endereco.estado}</Table.Cell>
                                        <Table.Cell>{endereco.cep}</Table.Cell>
                                        <Table.Cell>{endereco.complemento}</Table.Cell>
                                        <Table.Cell textAlign='center'>
                                            <Button
                                                inverted
                                                circular
                                                color='green'
                                                title='Clique aqui para editar os dados deste endereço'
                                                icon>
                                                <Link to={`/form-enderecocliente/${clienteId}/${endereco.id}`} style={{ color: 'green' }}>
                                                    <Icon name='edit' />
                                                </Link>
                                            </Button> &nbsp;
                                            <Button
                                                inverted
                                                circular
                                                color='red'
                                                title='Clique aqui para remover este endereço'
                                                icon
                                                onClick={e => confirmaRemover(endereco.id)}>
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
    );
}
