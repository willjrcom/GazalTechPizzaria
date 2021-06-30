package proj_vendas.vendas.model;

import java.util.List;

import javax.persistence.Column;

import lombok.Data;

@Data
public class ImpressaoPedido {
	
	@Column(nullable = false)
	private Long comanda;
	
	@Column(nullable = false)
	private Long celular;
	
	
	@Column(nullable = false)
	private String nome;
	
	@Column(nullable = false)
	private String endereco;
	
	@Column(nullable = false)
	private String referencia;
	
	
	@Column(nullable = false)
	private List<ImpressaoPizza> pizzas;
	
	@Column(nullable = false)
	private List<ImpressaoProduto> produtos;
	
	
	@Column(nullable = false)
	private String motoboy;
	
	@Column(nullable = false)
	private String ac;
	
	@Column(nullable = false)
	private String garcon;

	
	@Column(nullable = false)
	private String envio;
	
	@Column(nullable = false)
	private String obs;
	
	@Column(nullable = false)
	private String horaPedido;
	
	@Column(nullable = false)
	private String cupom;
	
	@Column(nullable = false)
	private String modoPagamento;
	
	@Column(nullable = false)
	private boolean pago;
	
	
	@Column(nullable = false)
	private float taxa = 0;
	
	@Column(nullable = false)
	private float total = 0;
	
	@Column(nullable = false)
	private float troco = 0;
	
	@Column(nullable = false)
	private float servico = 0;
	
	//empresa
	
	@Column(nullable = false)
	private String nomeEstabelecimento;
	
	@Column(nullable = false)
	private String cnpj;
	
	@Column(nullable = false)
	private String enderecoEmpresa;
	
	@Column(nullable = false)
	private String texto1;
	
	@Column(nullable = false)
	private String texto2;
	
	@Column(nullable = false)
	private String promocao;
	
	//impressao
	@Column(nullable = false)
	private String setor;
}
