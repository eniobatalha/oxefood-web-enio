import axios from "axios";
import { React, useEffect, useState } from "react";
import { Button, Container, Divider, Form, Icon } from 'semantic-ui-react';
import MenuSistema from "../../MenuSistema";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { notify, notifyInfo, notifyWarn, notifyError, notifySuccess,  } from "../util/Util";


export default function FormProduto() {

    const { state } = useLocation();

    const [idProduto, setIdProduto] = useState();
    const [codigo, setCodigo] = useState();
    const [titulo, setTitulo] = useState();
    const [descricao, setDescricao] = useState();
    const [valorUnitario, setValorUnitario] = useState();
    const [tempoEntregaMinimo, setTempoEntregaMinimo] = useState();
    const [tempoEntregaMaximo, setTempoEntregaMaximo] = useState();
    const [listaCategoria, setListaCategoria] = useState([]);
    const [idCategoria, setIdCategoria] = useState();

    const navigate = useNavigate();


    useEffect(() => {
        if (state != null && state.id != null) {
            axios.get("http://localhost:8080/api/produto/" + state.id)
                .then((response) => {
                    setIdProduto(response.data.id)
                    setCodigo(response.data.codigo)
                    setTitulo(response.data.titulo)
                    setDescricao(response.data.descricao)
                    setValorUnitario(response.data.valorUnitario)
                    setTempoEntregaMinimo(response.data.tempoEntregaMinimo)
                    setTempoEntregaMaximo(response.data.tempoEntregaMaximo)
                    setIdCategoria(response.data.categoria.id)
                })
        }

        axios.get("http://localhost:8080/api/categoriaproduto")
            .then((response) => {
                const dropDownCategorias = response.data.map(c => ({ text: c.descricao, value: c.id }));
                setListaCategoria(dropDownCategorias);
            })


    }, [state])

    function salvar() {

        let produtoRequest = {
            idCategoria: idCategoria,
            codigo: codigo,
            titulo: titulo,
            descricao: descricao,
            valorUnitario: valorUnitario,
            tempoEntregaMinimo: tempoEntregaMinimo,
            tempoEntregaMaximo: tempoEntregaMaximo,
        }

        if (idProduto != null) { //Alteração:
            axios.put("http://localhost:8080/api/produto/" + idProduto, produtoRequest)
                .then((response) => {
                    //console.log('Produto alterado com sucesso.')
                    notifySuccess('Produto alterado com sucesso.')
                    navigate(`/list-produto`);
                })
                .catch((error) => {
                    //console.log('Erro ao alterar um produto.')
                    if (error.response) {
                        notifyError(error.response.data.message)
                    } else {
                        notifyError("Erro ao alterar um produto.")
                    }
                })
        } else { //Cadastro:
            axios.post("http://localhost:8080/api/produto", produtoRequest)
                .then((response) => {
                    //console.log('Produto cadastrado com sucesso.') 
                    notifySuccess('Produto cadastrado com sucesso.')
                    navigate(`/list-produto`);
                })
                .catch((error) => {
                    //console.log('Erro ao incluir o produto.') 
                    if (error.response) {
                        notifyError(error.response.data.message)
                    } else {
                        notifyError("Erro ao incluir o produto.")
                    }
                })
        }
    }



    return (

        <div>

            <MenuSistema tela={'produto'} />

            <div style={{ marginTop: '3%' }}>

                <Container textAlign='justified' >

                    {idProduto === undefined &&
                        <h2> <span style={{ color: 'darkgray' }}> Produto &nbsp;<Icon name='angle double right' size="small" /> </span> Cadastro</h2>
                    }
                    {idProduto !== undefined &&
                        <h2> <span style={{ color: 'darkgray' }}> Produto &nbsp;<Icon name='angle double right' size="small" /> </span> Alteração</h2>
                    }

                    <Divider />

                    <div style={{ marginTop: '4%' }}>

                        <Form>

                            <Form.Group widths='equal'>

                                <Form.Input
                                    required
                                    fluid
                                    label='Código'
                                    maxLength="100"
                                    value={codigo}
                                    onChange={(e) => setCodigo(e.target.value)}
                                />

                                <Form.Input
                                    required
                                    fluid
                                    label='Título'
                                    maxLength="100"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                />

                            </Form.Group>

                            <Form.Group widhts='equal'>
                                <Form.Select
                                    required
                                    fluid
                                    tabIndex='3'
                                    width={16}
                                    placeholder='Selecione'
                                    label='Categoria'
                                    options={listaCategoria}
                                    value={idCategoria}
                                    onChange={(e, { value }) => {
                                        setIdCategoria(value)
                                    }}
                                />

                            </Form.Group>

                            <Form.Group>

                                <Form.Input
                                    required
                                    fluid
                                    label='Descrição'
                                    maxLength="500"
                                    width={16}
                                    value={descricao}
                                    onChange={(e) => setDescricao(e.target.value)}
                                />

                            </Form.Group>

                            <Form.Group>

                                <Form.Input
                                    required
                                    fluid
                                    label='Valor Unitário'
                                    width={6}
                                    value={valorUnitario}
                                    onChange={(e) => setValorUnitario(e.target.value)}
                                />

                                <Form.Input
                                    required
                                    fluid
                                    label='Tempo Entrega Mínimo'
                                    width={6}
                                    value={tempoEntregaMinimo}
                                    onChange={(e) => setTempoEntregaMinimo(e.target.value)}
                                />

                                <Form.Input
                                    required
                                    fluid
                                    label='Tempo Entrega Máximo'
                                    width={6}
                                    value={tempoEntregaMaximo}
                                    onChange={(e) => setTempoEntregaMaximo(e.target.value)}
                                />
                            </Form.Group>

                        </Form>

                        <div style={{ marginTop: '4%' }}>

                            <Button
                                type="button"
                                inverted
                                circular
                                icon
                                labelPosition='left'
                                color='orange'
                                as={Link}
                                to='/list-produto'
                            >
                                <Icon name='reply' />
                                Voltar
                            </Button>

                            <Button
                                inverted
                                circular
                                icon
                                labelPosition='left'
                                color='blue'
                                floated='right'
                                onClick={() => salvar()}
                            >
                                <Icon name='save' />
                                Salvar
                            </Button>

                        </div>

                    </div>

                </Container>
            </div>
        </div>

    );

}
