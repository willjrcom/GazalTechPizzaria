package proj_vendas.vendas.model.impressora;

import javax.persistence.Column;

import lombok.Data;

@Data
public class ImpressaoProduto {
	
	@Column(nullable = false)
	private String sabor;
	
	@Column(nullable = false)
	private String qtd;
	
	@Column(nullable = false)
	private String obs;
	
	@Column(nullable = false)
	private String preco;
}
