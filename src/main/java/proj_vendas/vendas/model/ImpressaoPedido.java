package proj_vendas.vendas.model;

import lombok.Data;

@Data
public class ImpressaoPedido {
	private String comanda;
	private String nome;
	private String nomeEstabelecimento;
	private String cnpj;
	private String enderecoEmpresa;
	
	private String envio;
	private String celular;
	private String endereco;
	private String obs;
	
	private PizzaImpressao[] pizzas;
	private ProdutoImpressao[] produtos;
	
	private double total;
	private double taxa;
	private double troco;
	
	private String texto1;
	private String texto2;
	private String promocao;
	
	private String data;
	private String hora;
	private String setor;
}
