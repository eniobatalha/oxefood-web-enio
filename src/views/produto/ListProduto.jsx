import axios from 'axios';
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button, Container, Divider, Form, Header, Icon, Menu, Modal, Segment, Table } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';
import { notifyError, notifySuccess } from '../util/Util';

export default function ListProduto() {

    const [listaProdutos, setListaProdutos] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [idRemover, setIdRemover] = useState();
    const [menuFiltro, setMenuFiltro] = useState();
    const [codigo, setCodigo] = useState();
    const [titulo, setTitulo] = useState();
    const [idCategoria, setIdCategoria] = useState();
    const [listaCategoriaProduto, setListaCategoriaProduto] = useState([]);

    useEffect(() => {
        carregarLista();
    }, [])

    function carregarLista() {

        axios.get("http://localhost:8080/api/produto")
            .then((response) => {
                setListaProdutos(response.data);
            })

        axios.get("http://localhost:8080/api/categoriaproduto")
            .then((response) => {

                const dropDownCategorias = [];
                dropDownCategorias.push({ text: '', value: '' });
                response.data.map(c => (
                    dropDownCategorias.push({ text: c.descricao, value: c.id })
                ))

                setListaCategoriaProduto(dropDownCategorias)

            })

    }

    function confirmaRemover(id) {
        setOpenModal(true)
        setIdRemover(id)
    }

    async function remover() {

        await axios.delete('http://localhost:8080/api/produto/' + idRemover)
            .then((response) => {

                //console.log('Produto removido com sucesso.')
                notifySuccess('Produto removido com sucesso.')

                axios.get("http://localhost:8080/api/produto")
                    .then((response) => {
                        setListaProdutos(response.data)
                    })
            })
            .catch((error) => {
                //console.log('Erro ao remover um produto.')
                if (error.response) {
                    notifyError(error.response.data.message)
                } else {
                    notifyError("Erro ao alterar um cliente.")
                }
            })
        setOpenModal(false)
    }

    function handleMenuFiltro() {

        if (menuFiltro === true) {
            setMenuFiltro(false);
        } else {
            setMenuFiltro(true);
        }
    }

    function handleChangeCodigo(value) {

        filtrarProdutos(value, titulo, idCategoria);
    }

    function handleChangeTitulo(value) {

        filtrarProdutos(codigo, value, idCategoria);
    }

    function handleChangeCategoriaProduto(value) {

        filtrarProdutos(codigo, titulo, value);
    }

    async function filtrarProdutos(codigoParam, tituloParam, idCategoriaParam) {

        let formData = new FormData();

        if (codigoParam !== undefined) {
            setCodigo(codigoParam)
            formData.append('codigo', codigoParam);
        }
        if (tituloParam !== undefined) {
            setTitulo(tituloParam)
            formData.append('titulo', tituloParam);
        }
        if (idCategoriaParam !== undefined) {
            setIdCategoria(idCategoriaParam)
            formData.append('idCategoria', idCategoriaParam);
        }

        await axios.post("http://localhost:8080/api/produto/filtrar", formData)
            .then((response) => {
                setListaProdutos(response.data)
            })
    }

    return (

        <div>

            <MenuSistema />

            <div style={{ marginTop: '3%' }}>

                <Container textAlign='justified' >

                    <h2> Produto </h2>

                    <Divider />

                    <div style={{ marginTop: '4%' }}>

                        <Menu compact>
                            <Menu.Item
                                name='menuFiltro'
                                active={menuFiltro === true}
                                onClick={() => handleMenuFiltro()}
                            >
                                <Icon name='filter' />
                                Filtrar
                            </Menu.Item>
                        </Menu>

                        <Button
                            label='Novo'
                            circular
                            color='orange'
                            icon='clipboard outline'
                            floated='right'
                            as={Link}
                            to='/form-produto'
                        />

                        {menuFiltro ?

                            <Segment>
                                <Form className="form-filtros">

                                    <Form.Input
                                        icon="search"
                                        value={codigo}
                                        onChange={e => handleChangeCodigo(e.target.value)}
                                        label='Código do Produto'
                                        placeholder='Filtrar por Código do Produto'
                                        labelPosition='left'
                                        width={4}
                                    />


                                    <Form.Group widths='equal'>

                                        <Form.Input
                                            icon="search"
                                            value={titulo}
                                            onChange={e => handleChangeTitulo(e.target.value)}
                                            label='Título'
                                            placeholder='Filtrar por título'
                                            labelPosition='left'
                                        />

                                        <Form.Select
                                            placeholder='Filtrar por Categoria'
                                            label='Categoria'
                                            options={listaCategoriaProduto}
                                            value={idCategoria}
                                            onChange={(e, { value }) => { handleChangeCategoriaProduto(value) }}
                                        />

                                    </Form.Group>
                                </Form>
                            </Segment> : ""
                        }

                        <br /><br />

                        <Table color='orange' sortable celled>

                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Código</Table.HeaderCell>
                                    <Table.HeaderCell>Categoria</Table.HeaderCell>
                                    <Table.HeaderCell>Título</Table.HeaderCell>
                                    <Table.HeaderCell>Descrição</Table.HeaderCell>
                                    <Table.HeaderCell>Valor Unitário</Table.HeaderCell>
                                    <Table.HeaderCell>Tempo Mínimo de Entrega</Table.HeaderCell>
                                    <Table.HeaderCell>Tempo Máximo de Entrega</Table.HeaderCell>
                                    <Table.HeaderCell textAlign='center' width={2}>Ações</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>

                                {listaProdutos.map(p => (

                                    <Table.Row key={p.id}>
                                        <Table.Cell>{p.codigo}</Table.Cell>
                                        <Table.Cell>{p.categoria.descricao}</Table.Cell>
                                        <Table.Cell>{p.titulo}</Table.Cell>
                                        <Table.Cell>{p.descricao}</Table.Cell>
                                        <Table.Cell>{p.valorUnitario}</Table.Cell>
                                        <Table.Cell>{p.tempoEntregaMinimo}</Table.Cell>
                                        <Table.Cell>{p.tempoEntregaMaximo}</Table.Cell>
                                        <Table.Cell textAlign='center'>

                                            <Button
                                                inverted
                                                circular
                                                color='green'
                                                title='Clique aqui para editar os dados deste cliente'
                                                icon>
                                                <Link to="/form-produto" state={{ id: p.id }} style={{ color: 'green' }}> <Icon name='edit' /> </Link>
                                            </Button> &nbsp;

                                            <Button
                                                inverted
                                                circular
                                                icon='trash'
                                                color='red'
                                                title='Clique aqui para remover este cliente'
                                                onClick={() => confirmaRemover(p.id)} />

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

