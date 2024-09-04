import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Divider, Header, Icon, Modal, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';
import { notifyError, notifySuccess } from "../util/Util";

export default function ListPromocao() {

    const [lista, setLista] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();


    useEffect(() => {
        carregarLista();
    }, [])

    function carregarLista() {

        axios.get("http://localhost:8080/api/promocao")
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

        await axios.delete('http://localhost:8080/api/promocao/' + idRemover)
            .then((response) => {

                //console.log('Promoção removida com sucesso.')
                notifySuccess('Promoção removida com sucesso.')

                axios.get("http://localhost:8080/api/promocao")
                    .then((response) => {
                        setLista(response.data)
                    })
            })
            .catch((error) => {
                //console.log('Erro ao remover uma promocao.')
                if (error.response) {
                    notifyError(error.response.data.message)
                } else {
                    notifyError("Erro ao remover uma promocao.")
                }
            })
        setOpenModal(false)
    }

    return (
        <div>
            <MenuSistema tela={'promocao'} />
            <div style={{ marginTop: '3%' }}>

                <Container textAlign='justified' >

                    <h2> Promoção </h2>
                    <Divider />

                    <div style={{ marginTop: '4%' }}>
                        <Button
                            label='Novo'
                            circular
                            color='orange'
                            icon='clipboard outline'
                            floated='right'
                            as={Link}
                            to='/form-promocao'
                        />

                        <br /><br /><br />

                        <Table color='orange' sortable celled>

                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Título</Table.HeaderCell>
                                    <Table.HeaderCell>Data Início</Table.HeaderCell>
                                    <Table.HeaderCell>Data Fim</Table.HeaderCell>
                                    <Table.HeaderCell>Regra</Table.HeaderCell>
                                    <Table.HeaderCell>Valor Desconto</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center'>Ações</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>

                                {lista.map(promocao => (

                                    <Table.Row key={promocao.id}>
                                        <Table.Cell>{promocao.titulo}</Table.Cell>
                                        <Table.Cell>{formatarData(promocao.dataInicio)}</Table.Cell>
                                        <Table.Cell>{formatarData(promocao.dataFim)}</Table.Cell>
                                        <Table.Cell>{promocao.regra}</Table.Cell>
                                        <Table.Cell>{promocao.valorDesconto}</Table.Cell>
                                        <Table.Cell textAlign='center'>

                                            <Button
                                                inverted
                                                circular
                                                color='green'
                                                title='Clique aqui para editar os dados desta promoção'
                                                icon>
                                                <Link to="/form-promocao" state={{ id: promocao.id }} style={{ color: 'green' }}>
                                                    <Icon name='edit' />
                                                </Link>
                                            </Button> &nbsp;

                                            <Button
                                                inverted
                                                circular
                                                color='red'
                                                title='Clique aqui para remover esta promoção'
                                                icon
                                                onClick={e => confirmaRemover(promocao.id)}>
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

