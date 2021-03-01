package proj_vendas.vendas.model;

import lombok.Data;

@Data
public class ImpressaoPedido {
	private Long comanda;
	private Long celular;
	
	private String nome;
	private String endereco;
	private String referencia;
	
	private ImpressaoPizza[] pizzas;
	private ImpressaoProduto[] produtos;
	
	private String motoboy;
	private String ac;
	private String garcon;

	private String envio;
	private String obs;
	private String horaPedido;
	private String cupom;
	private String modoPagamento;
	private boolean pago;
	
	private float taxa = 0;
	private float total = 0;
	private float troco = 0;
	private float servico = 0;
	
	//empresa
	private String nomeEstabelecimento;
	private String cnpj;
	private String enderecoEmpresa;
	
	private String texto1;
	private String texto2;
	private String promocao;
	
	//impressao
	private String setor;
}
