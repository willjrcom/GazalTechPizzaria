# SpringMVC_project1
Este projeto é um programa de vendas utilizando diversas linguagens sendo: html, css, javascript, java.

O objetivo desse sistema é gerenciar uma pizzaria e otimizar os processos que antes levavam mais tempo para serem concluídos.

Nome do projeto: Gazal Tech

Sistema web: Foi desenvido em Java, sendo utilizado para criar requisições CRUD ao banco de dados com repositórios em Jpa, criação de classes com ORM, acesso as páginas html com thymeleaf, segurança por nivel de acesso com Spring Security, envio de email automático, DWR, conexão com o aplicativo desktop para impressão.

Sistema desktop para impressão: Requisita no sistema pedidos pendentes para impressão em impressora térmica.
Gerenciamento Mobile (Em desenvolvimento): Será desenvolvido um aplicativo mobile para o dono da empresa ter acesso aos dados gerados no sistema como gráficos de crescimento a longo prazo e calcular a ficha tecnica de seus produtos.
Tablet Mobile (Em desenvolvimento): Será desenvolvido um aplicativo mobile para o cliente da empresa utilizar no tablet fixo em cada mesa e fazer compras ao entrar no comercio utilizando um QRcode que será distribuído para cada pessoa ao entrar no estabelecimento, facilitando todo o processo de pedidos.

-------------------------------------------------------------------------------------
Tabelas de cadastros:
  - Cliente,
  - Funcionário,
  - Endereço,
  - Usuário (Login e Senha),
  - Empresa e
  - Produto.
  
Tabelas de salvar pedidos:
  - Pedido e
  - PedidoTemp (salvar dados temporários).
  
 Tabelas de Impressão:
  - ImpressaoMatricial (salva os modelos),
  - ImpressaoPedido (modelo para criar  pedido completo),
  - PizzaImpressao (modelo para criar  pedido de pizza) e
  - ProdutoImpressao (modelo para criar  pedido de produto).
  
 Tabelas de registro log:
  - LogMesa (registrar qual mesa teve mais venda),
  - LogUsuario (registrar as alterações do usuarios) e
  - Salario (calcula as alterações nos gastos e vales de um funcionário).
  
  Tabela de registro estatístico diário:
    - Dado (resultado das vendas diárias) e
    - Dia (salva o valor do dia atual).
    
   -------------------------------------------------------------------------------------
   
  As classes trabalham com o mínimo de relação possivel, essas relações são criadas atraves do sistema web,
  fazendo que se torne mais flexivel e mais facil de lançar atualizações/alterações.
   
   -------------------------------------------------------------------------------------
