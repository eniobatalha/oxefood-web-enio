import axios from "axios";
import { React, useEffect, useState } from "react";
import InputMask from 'react-input-mask';
import { Button, Container, Divider, Form, Icon } from 'semantic-ui-react';
import MenuSistema from '../../MenuSistema';
import { Link, useLocation } from "react-router-dom";


export default function FormFornecedor() {

    const [razaoSocial, setRazaoSocial] = useState();
    const [nomeFantasia, setNomeFantasia] = useState();
    const [cnpj, setCnpj] = useState();
    const [endereco, setEndereco] = useState();
    const [email, setEmail] = useState();
    const [telefoneCelular, setTelefoneCelular] = useState();
    const [telefoneFixo, setTelefoneFixo] = useState();
    const { state } = useLocation();
    const [idFornecedor, setIdFornecedor] = useState();

    useEffect(() => {
        if (state != null && state.id != null) {
            axios.get("http://localhost:8080/api/fornecedor/" + state.id)
                .then((response) => {
                    setIdFornecedor(response.data.id)
                    setRazaoSocial(response.data.razaoSocial)
                    setNomeFantasia(response.data.nomeFantasia)
                    setCnpj(response.data.cnpj)
                    setEndereco(response.data.endereco)
                    setEmail(response.data.email)
                    setTelefoneCelular(response.data.telefoneCelular)
                    setTelefoneFixo(response.data.telefoneFixo)
                })
        }
    }, [state])

    function salvar() {

        let fornecedorRequest = {
            razaoSocial: razaoSocial,
            nomeFantasia: nomeFantasia,
            cnpj: cnpj,
            endereco: endereco,
            email: email,
            telefoneCelular: telefoneCelular,
            telefoneFixo: telefoneFixo
        }

        if (idFornecedor != null) { //Alteração:
            axios.put("http://localhost:8080/api/fornecedor/" + idFornecedor, fornecedorRequest)
                .then((response) => { console.log('Fornecedor alterado com sucesso.') })
                .catch((error) => { console.log('Erro ao alterar um fornecedor.') })
        } else { //Cadastro:
            axios.post("http://localhost:8080/api/fornecedor", fornecedorRequest)
                .then((response) => { console.log('Fornecedor cadastrado com sucesso.') })
                .catch((error) => { console.log('Erro ao incluir o fornecedor.') })
        }
    }



    return (

        <div>

            <MenuSistema tela={'fornecedor'} />

            <div style={{ marginTop: '3%' }}>

                <Container textAlign='justified' >

                    {idFornecedor === undefined &&
                        <h2> <span style={{ color: 'darkgray' }}> Fornecedor &nbsp;<Icon name='angle double right' size="small" /> </span> Cadastro</h2>
                    }
                    {idFornecedor !== undefined &&
                        <h2> <span style={{ color: 'darkgray' }}> Fornecedor &nbsp;<Icon name='angle double right' size="small" /> </span> Alteração</h2>
                    }

                    <Divider />

                    <div style={{ marginTop: '4%' }}>

                        <Form>
                            <Form.Group widths='equal'>

                                <Form.Input
                                    required
                                    fluid
                                    label='Razão Social'
                                    maxLength="100"
                                    value={razaoSocial}
                                    onChange={(e) => setRazaoSocial(e.target.value)}
                                />

                                <Form.Input
                                    required
                                    fluid
                                    label='Nome Fantasia'
                                    maxLength="100"
                                    value={nomeFantasia}
                                    onChange={(e) => setNomeFantasia(e.target.value)}
                                />

                                <Form.Input
                                    required
                                    fluid
                                    label='CNPJ'
                                    width={6}>                                    
                                    <InputMask
                                        required
                                        mask="99.999.999/9999-99"
                                        value={cnpj}
                                        onChange={(e) => setCnpj(e.target.value)}
                                    />
                                </Form.Input>

                            </Form.Group>

                            <Form.Group widths='equal'>

                                <Form.Input
                                    required
                                    fluid
                                    label='Endereço'
                                    value={endereco}
                                    onChange={(e) => setEndereco(e.target.value)}
                                />

                            </Form.Group>

                            <Form.Group>

                                <Form.Input
                                    required
                                    fluid
                                    label='Email'
                                    width={10}
                                    maxLength="100"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />

                                <Form.Input
                                    fluid
                                    label='Fone Celular'
                                    width={6}>
                                    <InputMask
                                        mask="(99) 99999.9999"
                                        value={telefoneCelular}
                                        onChange={(e) => setTelefoneCelular(e.target.value)}
                                    />
                                </Form.Input>

                                <Form.Input
                                    fluid
                                    label='Fone Fixo'
                                    width={6}>
                                    <InputMask
                                        mask="(99) 9999.9999"
                                        value={telefoneFixo}
                                        onChange={(e) => setTelefoneFixo(e.target.value)}
                                    />
                                </Form.Input>

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
                                to='/list-fornecedor'
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
