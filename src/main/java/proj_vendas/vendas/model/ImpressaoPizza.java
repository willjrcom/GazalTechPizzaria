package proj_vendas.vendas.model;

import javax.persistence.Column;

import lombok.Data;

@Data
public class ImpressaoPizza {
	
	@Column(nullable = false)
	private String borda;
	
	@Column(nullable = false)
	private String sabor;
	
	@Column(nullable = false)
	private String qtd;
	
	@Column(nullable = false)
	private String preco;
	
	@Column(nullable = false)
	private String obs;
}
