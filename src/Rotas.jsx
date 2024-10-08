import React from 'react';
import { Route, Routes } from "react-router-dom";

import FormCliente from './views/cliente/FormCliente';
import FormProduto from './views/produto/FormProduto';
import FormEntregador from './views/entregador/FormEntregador';
import FormFornecedor from './views/fornecedor/FormFornecedor';
import FormPromocao from './views/promocao/FormPromocao';
import Home from './views/home/Home';
import ListProduto from './views/produto/ListProduto';
import ListCliente from './views/cliente/ListClient';
import ListEntregador from './views/entregador/ListEntregador';
import ListFornecedor from './views/fornecedor/ListFornecedor';
import ListPromocao from './views/promocao/ListPromocao';
import FormEnderecoCliente from './views/cliente/FormEnderecoCliente';
import ListEnderecoCliente from './views/cliente/ListEnderecoCliente';
import FormCategoriaProduto from './views/categoriaproduto/FormCategoriaProduto.jsx';
import ListCategoriaProduto from './views/categoriaproduto/ListCategoriaProduto.jsx';

function Rotas() {
    return (
        <>
            <Routes>
                <Route path="/" element={ <Home/> } />
                <Route path="form-cliente" element={ <FormCliente/> } />
                <Route path="list-cliente" element={ <ListCliente/> } />
                <Route path="form-enderecocliente/:clienteId/:enderecoId" element={ <FormEnderecoCliente/> } />
                <Route path="list-enderecocliente/:clienteId" element={ <ListEnderecoCliente/> } />
                <Route path="form-enderecocliente/:clienteId/:enderecoId" element={ <FormEnderecoCliente/> } />
                <Route path="form-categoriaproduto" element={ <FormCategoriaProduto/> } />
                <Route path="list-categoriaproduto" element={ <ListCategoriaProduto/> } />
                <Route path="form-produto" element={ <FormProduto/> } />
                <Route path="list-produto" element={ <ListProduto/> } />
                <Route path="form-entregador" element={ <FormEntregador/> } />
                <Route path="list-entregador" element={ <ListEntregador/> } />
                <Route path="form-fornecedor" element={ <FormFornecedor/> } />
                <Route path="list-fornecedor" element={ <ListFornecedor/> } />
                <Route path="form-promocao" element={ <FormPromocao/> } />
                <Route path="list-promocao" element={ <ListPromocao/> } />
            </Routes>
        </>
    )
}

export default Rotas;
