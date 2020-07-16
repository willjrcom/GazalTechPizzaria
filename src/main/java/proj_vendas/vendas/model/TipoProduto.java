package proj_vendas.vendas.model;

public enum TipoProduto {
	PIZZA("Pizza"),
	REFRIGERANTE("Refrigerante"),
	INGREDIENTE("Ingrediente"),
	PASTEL("Pstel"),
	PANQUECA("Panqueca"),
	OUTROS("Outros");
	
	private String descricao;
	
	TipoProduto(String descricao){
		this.descricao = descricao;
	}
	
	public String getDescricao() {
		return descricao;
	}
}
